"use client";

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

const events = [
  { name: "Tarawih Prayers",       date: "Mar 17", time: "9:00 PM",  location: "Main Hall"    },
  { name: "Ramadan Iftar Night",   date: "Mar 20", time: "6:30 PM",  location: "Banquet Hall" },
  { name: "Youth Halaqa",          date: "Mar 22", time: "3:00 PM",  location: "Room 4"       },
  { name: "Sisters' Quran Circle", date: "Mar 24", time: "7:00 PM",  location: "Room 2"       },
];

const stats = [
  { value: "342", label: "Community Members",  sub: "+12 this month", color: "#699A51" },
  { value: "4",   label: "Upcoming Events",    sub: "Next: Mar 17",   color: "#516D9A" },
  { value: "5",   label: "Announcements",      sub: "Latest: Mar 15", color: "#67519A" },
];

export default function DashboardHome() {
  return (
    <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 lg:gap-8">

        {/* ── GREETING ROW (desktop only) ── */}
        <div className="hidden lg:flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[#4A4A4A]">Welcome back, Imam Abdullah</h1>
            <p className="text-sm text-gray-400 mt-1">Monday, March 16, 2026</p>
          </div>
          <div className="flex items-center gap-2 bg-[#699A51] text-white px-4 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-bold">Asr · 4:38 PM</span>
          </div>
        </div>

        {/* ── MOBILE GREETING ── */}
        <div className="lg:hidden">
          <h1 className="text-lg font-extrabold text-[#4A4A4A]">Welcome back, Imam Abdullah</h1>
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
          <div className="bg-[#699A51] px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Today&apos;s Prayers</p>
            <div className="flex items-center gap-1.5 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold">Next · Asr · 4:38 PM</span>
            </div>
          </div>
          <div className="flex divide-x divide-gray-100">
            {prayerTimes.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col items-center gap-1 flex-1 py-4 lg:py-5 relative ${
                  p.isNext ? "bg-[#699A51]/5" : ""
                }`}
              >
                <span className={`text-[10px] lg:text-[11px] font-semibold uppercase tracking-wide ${p.isNext ? "text-[#699A51]" : "text-gray-400"}`}>
                  {p.name}
                </span>
                <span className={`text-xs lg:text-sm font-extrabold ${p.isNext ? "text-[#699A51]" : "text-[#4A4A4A]"}`}>
                  {p.time}
                </span>
                {p.isNext && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#699A51] rounded-full" />
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
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Upcoming Events</h2>
              <span className="text-xs font-semibold text-[#516D9A] bg-[#516D9A]/10 px-2.5 py-1 rounded-full">4 total</span>
            </div>
            <div className="hidden sm:flex flex-col gap-2">
              {events.map((e) => (
                <div
                  key={e.name}
                  className="flex items-center gap-4 hover:bg-[#516D9A]/5 rounded-xl px-3 py-3 cursor-pointer transition-colors group"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-[#516D9A]/10 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-bold text-[#516D9A] uppercase leading-none">{e.date.split(" ")[0]}</span>
                    <span className="text-base font-extrabold text-[#516D9A] leading-none">{e.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#4A4A4A] group-hover:text-[#516D9A] transition-colors">{e.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.time} · {e.location}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {events.map((e) => (
                <div
                  key={e.name}
                  className="bg-[#516D9A]/5 rounded-xl p-3 cursor-pointer hover:bg-[#516D9A]/10 transition-colors"
                >
                  <p className="text-xs font-bold text-[#516D9A]">{e.date}</p>
                  <p className="text-sm font-semibold text-[#4A4A4A] mt-1 leading-tight">{e.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{e.time}</p>
                  <p className="text-[10px] text-gray-400">{e.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Announcements</h2>
              <span className="text-xs font-semibold text-[#699A51] bg-[#699A51]/10 px-2.5 py-1 rounded-full">5 total</span>
            </div>
            <div className="hidden sm:flex flex-col gap-3">
              {announcements.map((a, i) => (
                <div key={a.title}>
                  <div className="flex gap-3 cursor-pointer group">
                    <div className="w-0.5 rounded-full bg-[#699A51]/30 shrink-0 group-hover:bg-[#699A51] transition-colors" />
                    <div>
                      <p className="text-sm font-semibold text-[#4A4A4A] group-hover:text-[#699A51] transition-colors leading-snug">
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
            <div className="flex flex-col gap-0 sm:hidden">
              {announcements.map((a, i) => (
                <div key={a.title}>
                  <div className="flex items-start gap-2.5 py-3 cursor-pointer group">
                    <div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-[#699A51]/40" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#4A4A4A] leading-snug">{a.title}</p>
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
