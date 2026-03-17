"use client";

import Link from "next/link";

const prayerTimes = [
  { name: "Fajr",    time: "5:23 AM",  isNext: false },
  { name: "Dhuhr",   time: "1:15 PM",  isNext: false },
  { name: "Asr",     time: "4:38 PM",  isNext: true  },
  { name: "Maghrib", time: "7:12 PM",  isNext: false },
  { name: "Isha",    time: "8:45 PM",  isNext: false },
];

const announcements = [
  { title: "Ramadan Schedule Now Available",                date: "Mar 15", preview: "Full Tarawih and prayer schedule posted." },
  { title: "Jumu'ah Khutbah: The Importance of Gratitude", date: "Mar 13", preview: "This week's khutbah on shukr in daily life." },
  { title: "Zakat Calculation Workshop",                    date: "Mar 10", preview: "Free workshop on calculating your annual Zakat." },
];

// IDs correspond to MOCK_EVENTS in `lib/events-data.ts`
const events = [
  { id: 2, name: "Tarawih Prayers",       date: "Mar 17", time: "9:00 PM",  location: "Main Hall"    },
  { id: 1, name: "Ramadan Iftar Night",   date: "Mar 20", time: "6:30 PM",  location: "Banquet Hall" },
  { id: 3, name: "Youth Halaqa",          date: "Mar 22", time: "3:00 PM",  location: "Room 4"       },
  { id: 4, name: "Sisters' Quran Circle", date: "Mar 24", time: "7:00 PM",  location: "Room 2"       },
];

// Section colors pulled from CSS variables — no hex codes here
const stats = [
  { value: "342", label: "Community Members",  sub: "+12 this month", color: "var(--mosque-purple)" },
  { value: "4",   label: "Upcoming Events",    sub: "Next: Mar 17",   color: "var(--mosque-blue)"   },
  { value: "5",   label: "Announcements",      sub: "Latest: Mar 15", color: "var(--mosque-green)"  },
];

export default function DashboardHome() {
  return (
    <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 lg:gap-8">

        {/* ── GREETING ROW (desktop only) ── */}
        <div className="hidden lg:flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-mosque-text">Welcome back, Imam Abdullah</h1>
            <p className="text-sm text-gray-400 mt-1">Monday, March 16, 2026</p>
          </div>
          <div className="flex items-center gap-2 bg-mosque-purple text-white px-4 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-bold">Asr · 4:38 PM</span>
          </div>
        </div>

        {/* ── MOBILE GREETING ── */}
        <div className="lg:hidden">
          <h1 className="text-lg font-extrabold text-mosque-text">Welcome back, Imam Abdullah</h1>
          <p className="text-xs text-gray-400 mt-0.5">Monday, March 16, 2026</p>
        </div>

        {/* ── STAT TILES ── */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 lg:p-5 text-white flex flex-col gap-0.5"
              style={{ backgroundColor: s.color }}
            >
              <span className="text-2xl lg:text-3xl font-extrabold leading-none">{s.value}</span>
              <span className="text-xs lg:text-sm font-semibold opacity-90 mt-1 leading-tight">{s.label}</span>
              <span className="text-[10px] lg:text-xs opacity-70 hidden sm:block">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* ── PRAYER CARD ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {/* Purple header — prayer section color */}
          <div className="bg-mosque-purple px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Today&apos;s Prayers</p>
            <div className="flex items-center gap-1.5 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold">Next · Asr · 4:38 PM</span>
            </div>
          </div>
          {/* Prayer row */}
          <div className="flex divide-x divide-gray-100">
            {prayerTimes.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col items-center gap-1 flex-1 py-4 lg:py-5 relative ${
                  p.isNext ? "bg-mosque-purple/5" : ""
                }`}
              >
                <span className={`text-[10px] lg:text-[11px] font-semibold uppercase tracking-wide ${p.isNext ? "text-mosque-purple" : "text-gray-400"}`}>
                  {p.name}
                </span>
                <span className={`text-xs lg:text-sm font-extrabold ${p.isNext ? "text-mosque-purple" : "text-mosque-text"}`}>
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

          {/* Events card — blue */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Upcoming Events</h2>
              <span className="text-xs font-semibold text-mosque-blue bg-mosque-blue/10 px-2.5 py-1 rounded-full">4 total</span>
            </div>
            {/* Desktop: vertical list */}
            <div className="hidden sm:flex flex-col gap-2">
              {events.map((e) => (
                <Link
                  key={e.name}
                  href={`/events/${e.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 hover:bg-mosque-blue/5 rounded-xl px-3 py-3 cursor-pointer transition-colors group"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-mosque-blue/10 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-bold text-mosque-blue uppercase leading-none">{e.date.split(" ")[0]}</span>
                    <span className="text-base font-extrabold text-mosque-blue leading-none">{e.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-mosque-text group-hover:text-mosque-blue transition-colors">{e.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.time} · {e.location}</p>
                  </div>
                </Link>
              ))}
            </div>
            {/* Mobile: 2-column grid */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {events.map((e) => (
                <Link
                  key={e.name}
                  href={`/events/${e.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-mosque-blue/5 rounded-xl p-3 cursor-pointer hover:bg-mosque-blue/10 transition-colors"
                >
                  <p className="text-xs font-bold text-mosque-blue">{e.date}</p>
                  <p className="text-sm font-semibold text-mosque-text mt-1 leading-tight">{e.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{e.time}</p>
                  <p className="text-[10px] text-gray-400">{e.location}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements card — green */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Announcements</h2>
              <span className="text-xs font-semibold text-mosque-green bg-mosque-green/10 px-2.5 py-1 rounded-full">5 total</span>
            </div>
            {/* Desktop: stacked with left accent */}
            <div className="hidden sm:flex flex-col gap-3">
              {announcements.map((a, i) => (
                <div key={a.title}>
                  <div className="flex gap-3 cursor-pointer group">
                    <div className="w-0.5 rounded-full bg-mosque-green/30 shrink-0 group-hover:bg-mosque-green transition-colors" />
                    <div>
                      <p className="text-sm font-semibold text-mosque-text group-hover:text-mosque-green transition-colors leading-snug">
                        {a.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{a.preview}</p>
                      <p className="text-[10px] text-gray-300 mt-1 font-medium">{a.date}</p>
                    </div>
                  </div>
                  {i < announcements.length - 1 && <div className="border-t border-gray-100 mt-3" />}
                </div>
              ))}
            </div>
            {/* Mobile: list */}
            <div className="flex flex-col gap-0 sm:hidden">
              {announcements.map((a, i) => (
                <div key={a.title}>
                  <div className="flex items-start gap-2.5 py-3 cursor-pointer group">
                    <div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-mosque-green/40" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-mosque-text leading-snug">{a.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.date}</p>
                    </div>
                  </div>
                  {i < announcements.length - 1 && <div className="border-t border-gray-100" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
