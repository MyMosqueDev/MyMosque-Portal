"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trpc } from "@/trpc/react";
import { getCache, setCache } from "@/lib/mosque-cache";

// ── Types ──────────────────────────────────────────────────────────────────

interface PrayerEntry {
  day: string;
  times: {
    fajr: { adhan: string; iqama: string };
    sunrise: string;
    dhuhr: { adhan: string; iqama: string };
    asr: { adhan: string; iqama: string };
    maghrib: { adhan: string; iqama: string };
    isha: { adhan: string; iqama: string };
    sunset: string;
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getCurrentMonthYear() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `${mm}-${yy}`;
}

function timeToMinutes(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return -1;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

function formatEventDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatEventTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Avoid "type instantiation is excessively deep" from Prisma's JsonValue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asPrayerEntries(record: any): PrayerEntry[] | null | undefined {
  return record?.prayerTimes as PrayerEntry[] | null | undefined;
}

// ── Component ──────────────────────────────────────────────────────────────

type View = "dashboard" | "announcements" | "events" | "prayer-times";

export default function DashboardHome({ onNavigate }: { onNavigate: (view: View, opts?: { create?: boolean }) => void }) {
  const monthYear = getCurrentMonthYear();
  const cached = getCache();

  const mosque = trpc.mosque.getMe.useQuery(undefined, {
    initialData: cached?.mosque ?? undefined,
    initialDataUpdatedAt: cached?.fetchedAt,
  });
  const announcements = trpc.mosque.listAnnouncements.useQuery(undefined, {
    initialData: cached?.announcements?.length ? cached.announcements : undefined,
    initialDataUpdatedAt: cached?.fetchedAt,
  });
  const events = trpc.mosque.listEvents.useQuery(undefined, {
    initialData: cached?.events?.length ? cached.events : undefined,
    initialDataUpdatedAt: cached?.fetchedAt,
  });
  const prayerTimesRecord = trpc.mosque.getPrayerTimes.useQuery(
    { monthYear },
    {
      initialData: cached?.prayerTimes?.[monthYear] ?? undefined,
      initialDataUpdatedAt: cached?.fetchedAt,
    }
  );

  // Write fresh server data back to localStorage cache
  useEffect(() => {
    if (mosque.data) setCache({ mosque: mosque.data });
  }, [mosque.data]);
  useEffect(() => {
    if (announcements.data) setCache({ announcements: announcements.data });
  }, [announcements.data]);
  useEffect(() => {
    if (events.data) setCache({ events: events.data });
  }, [events.data]);
  useEffect(() => {
    if (prayerTimesRecord.data) {
      const existing = getCache()?.prayerTimes ?? {};
      setCache({ prayerTimes: { ...existing, [monthYear]: prayerTimesRecord.data } });
    }
  }, [prayerTimesRecord.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading =
    mosque.isLoading ||
    announcements.isLoading ||
    events.isLoading ||
    prayerTimesRecord.isLoading;

  // ── Today's prayers ──────────────────────────────────────────────────────
  const todayDay = String(new Date().getDate()).padStart(2, "0");
  const prayerEntries = asPrayerEntries(prayerTimesRecord.data);
  const todayEntry = prayerEntries?.find((e) => e.day === todayDay);

  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
  const prayerKeys = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const prayerTimes = prayerKeys.map((key, i) => {
    const time = todayEntry?.times[key]?.iqama ?? "—";
    const mins = timeToMinutes(time);
    return { name: prayerNames[i], time, isNext: false, mins };
  });

  // Mark the first upcoming prayer as "next"
  let markedNext = false;
  const prayerTimesWithNext = prayerTimes.map((p) => {
    if (!markedNext && p.mins > nowMinutes) {
      markedNext = true;
      return { ...p, isNext: true };
    }
    return p;
  });

  const nextPrayer = prayerTimesWithNext.find((p) => p.isNext);

  // ── Stats ────────────────────────────────────────────────────────────────
  const announcementCount = announcements.data?.length ?? 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents =
    events.data?.filter((e) => new Date(e.date) >= today) ?? [];
  const nextEvent = upcomingEvents[0];

  const stats = [
    {
      value: String(upcomingEvents.length),
      label: "Upcoming Events",
      sub: nextEvent
        ? `Next: ${formatEventDate(nextEvent.date)}`
        : "No upcoming events",
      color: "var(--mosque-blue)",
    },
    {
      value: String(announcementCount),
      label: "Announcements",
      sub:
        announcements.data?.[0]
          ? `Latest: ${formatEventDate(announcements.data[0].createdAt)}`
          : "No announcements",
      color: "var(--mosque-green)",
    },
  ];

  const recentAnnouncements = announcements.data?.slice(0, 3) ?? [];
  const upcomingDisplay = upcomingEvents.slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-3" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const mosqueName = mosque.data?.name ?? "Your Mosque";

  return (
    <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 lg:gap-8">

        {/* ── GREETING ROW (desktop) ── */}
        <div className="hidden lg:flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-mosque-text">
              Welcome back, {mosqueName}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {nextPrayer && (
            <div className="flex items-center gap-2 bg-mosque-purple text-white px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-bold">
                {nextPrayer.name} · {nextPrayer.time}
              </span>
            </div>
          )}
        </div>

        {/* ── MOBILE GREETING ── */}
        <div className="lg:hidden flex items-start justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-mosque-text">
              Welcome back, {mosqueName}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {nextPrayer && (
            <div className="flex items-center gap-1.5 bg-mosque-purple text-white px-3 py-1.5 rounded-full shrink-0 ml-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold">{nextPrayer.name} · {nextPrayer.time}</span>
            </div>
          )}
        </div>

        {/* ── STAT TILES ── */}
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 lg:p-5 text-white flex flex-col gap-0.5"
              style={{ backgroundColor: s.color }}
            >
              <span className="text-2xl lg:text-3xl font-extrabold leading-none">
                {s.value}
              </span>
              <span className="text-xs lg:text-sm font-semibold opacity-90 mt-1 leading-tight">
                {s.label}
              </span>
              <span className="text-[10px] lg:text-xs opacity-70 hidden sm:block">
                {s.sub}
              </span>
            </div>
          ))}
        </div>

        {/* ── PRAYER CARD ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-mosque-purple px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">
              Today&apos;s Prayers
            </p>
            {nextPrayer && (
              <div className="flex items-center gap-1.5 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-semibold">
                  Next · {nextPrayer.name} · {nextPrayer.time}
                </span>
              </div>
            )}
          </div>
          <div className="flex divide-x divide-gray-100">
            {prayerTimesWithNext.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col items-center gap-1 flex-1 py-4 lg:py-5 relative ${
                  p.isNext ? "bg-mosque-purple/5" : ""
                }`}
              >
                <span
                  className={`text-[10px] lg:text-[11px] font-semibold uppercase tracking-wide ${
                    p.isNext ? "text-mosque-purple" : "text-gray-400"
                  }`}
                >
                  {p.name}
                </span>
                <span
                  className={`text-xs lg:text-sm font-extrabold ${
                    p.isNext ? "text-mosque-purple" : "text-mosque-text"
                  }`}
                >
                  {p.time}
                </span>
                {p.isNext && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-mosque-purple rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-4 lg:gap-6">

          {/* Events card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-mosque-blue px-5 py-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                Upcoming Events
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigate("events")}
                  className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
                >
                  View All
                </button>
                <div className="w-px h-3 bg-white/30" />
                <button
                  onClick={() => onNavigate("events", { create: true })}
                  className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  New
                </button>
              </div>
            </div>

            <div className="p-5">
              {upcomingDisplay.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No upcoming events.
                </p>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden sm:flex flex-col gap-2">
                    {upcomingDisplay.map((e) => (
                      <Link
                        key={e.id}
                        href={`/events/${e.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 hover:bg-mosque-blue/5 rounded-xl px-3 py-3 cursor-pointer transition-colors group"
                      >
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-mosque-blue/10 flex flex-col items-center justify-center">
                          <span className="text-[9px] font-bold text-mosque-blue uppercase leading-none">
                            {formatEventDate(e.date).split(" ")[0]}
                          </span>
                          <span className="text-base font-extrabold text-mosque-blue leading-none">
                            {formatEventDate(e.date).split(" ")[1]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-mosque-text group-hover:text-mosque-blue transition-colors">
                            {e.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatEventTime(e.date)} · {e.location}
                          </p>
                        </div>
                        <svg
                          className="w-3.5 h-3.5 text-gray-300 group-hover:text-mosque-blue transition-colors shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                  {/* Mobile */}
                  <div className="grid grid-cols-2 gap-2 sm:hidden">
                    {upcomingDisplay.map((e) => (
                      <Link
                        key={e.id}
                        href={`/events/${e.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-mosque-blue/5 rounded-xl p-3 cursor-pointer hover:bg-mosque-blue/10 transition-colors relative"
                      >
                        <svg
                          className="absolute top-2.5 right-2.5 w-3 h-3 text-mosque-blue/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <p className="text-xs font-bold text-mosque-blue">
                          {formatEventDate(e.date)}
                        </p>
                        <p className="text-sm font-semibold text-mosque-text mt-1 leading-tight pr-4">
                          {e.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {formatEventTime(e.date)}
                        </p>
                        <p className="text-[10px] text-gray-400">{e.location}</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Announcements card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-mosque-green px-5 py-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                Announcements
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigate("announcements")}
                  className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
                >
                  View All
                </button>
                <div className="w-px h-3 bg-white/30" />
                <button
                  onClick={() => onNavigate("announcements", { create: true })}
                  className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  New
                </button>
              </div>
            </div>

            <div className="p-5">
            {recentAnnouncements.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                No announcements.
              </p>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden sm:flex flex-col gap-3">
                  {recentAnnouncements.map((a, i) => (
                    <div key={a.id}>
                      <div className="flex gap-3 cursor-pointer group">
                        <div className="w-0.5 rounded-full bg-mosque-green/30 shrink-0 group-hover:bg-mosque-green transition-colors" />
                        <div>
                          <p className="text-sm font-semibold text-mosque-text group-hover:text-mosque-green transition-colors leading-snug">
                            {a.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {a.description}
                          </p>
                          <p className="text-[10px] text-gray-300 mt-1 font-medium">
                            {formatEventDate(a.createdAt)}
                          </p>
                        </div>
                      </div>
                      {i < recentAnnouncements.length - 1 && (
                        <div className="border-t border-gray-100 mt-3" />
                      )}
                    </div>
                  ))}
                </div>
                {/* Mobile */}
                <div className="flex flex-col gap-0 sm:hidden">
                  {recentAnnouncements.map((a, i) => (
                    <div key={a.id}>
                      <div className="flex items-start gap-2.5 py-3 cursor-pointer group">
                        <div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-mosque-green/40" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-mosque-text leading-snug">
                            {a.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {formatEventDate(a.createdAt)}
                          </p>
                        </div>
                      </div>
                      {i < recentAnnouncements.length - 1 && (
                        <div className="border-t border-gray-100" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
