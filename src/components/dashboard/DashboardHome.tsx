"use client";

import Link from "next/link";
import { trpc } from "@/trpc/react";

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

export default function DashboardHome() {
  const mosque = trpc.mosque.getMe.useQuery();
  const announcements = trpc.mosque.listAnnouncements.useQuery();
  const events = trpc.mosque.listEvents.useQuery();
  const prayerTimesRecord = trpc.mosque.getPrayerTimes.useQuery({
    monthYear: getCurrentMonthYear(),
  });


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
        <div className="lg:hidden">
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
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Upcoming Events
              </h2>
              <span className="text-xs font-semibold text-mosque-blue bg-mosque-blue/10 px-2.5 py-1 rounded-full">
                {upcomingEvents.length} total
              </span>
            </div>

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
                      className="bg-mosque-blue/5 rounded-xl p-3 cursor-pointer hover:bg-mosque-blue/10 transition-colors"
                    >
                      <p className="text-xs font-bold text-mosque-blue">
                        {formatEventDate(e.date)}
                      </p>
                      <p className="text-sm font-semibold text-mosque-text mt-1 leading-tight">
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

          {/* Announcements card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Announcements
              </h2>
              <span className="text-xs font-semibold text-mosque-green bg-mosque-green/10 px-2.5 py-1 rounded-full">
                {announcementCount} total
              </span>
            </div>

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
  );
}
