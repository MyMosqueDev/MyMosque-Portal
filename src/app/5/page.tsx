export default function Page5() {
  return (
    <div className="min-h-screen font-sans text-[#4A4A4A] bg-white overflow-x-hidden">

      {/* ── NAV — minimal ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="MyMosque" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-bold text-[#4A4A4A] tracking-tight">MyMosque</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-400">Available on iOS & Android</span>
          <span className="mx-3 text-gray-200">|</span>
          <a href="#download" className="text-sm font-bold text-[#699A51] hover:text-[#5c8846] transition-colors">Download →</a>
        </div>
        <a
          href="#download"
          className="bg-[#4A4A4A] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-colors"
        >
          Get the App
        </a>
      </nav>

      {/* ── TITLE BLOCK ── */}
      <section className="pt-20 pb-12 px-6 lg:px-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#699A51]/10 text-[#699A51] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#699A51] animate-pulse" />
          Mosque · Community · Connection
        </div>
        <h1 className="text-6xl lg:text-8xl font-extrabold text-[#4A4A4A] leading-[1.0] tracking-tight mb-6 max-w-5xl mx-auto">
          Everything your<br />mosque needs.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Prayer times, events, announcements, and a complete admin portal — beautifully designed and effortlessly simple.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#download"
            className="bg-[#699A51] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform shadow-xl shadow-[#699A51]/25"
          >
            Download Free
          </a>
          <a
            href="#bento"
            className="bg-gray-100 text-[#4A4A4A] font-bold px-8 py-4 rounded-2xl text-lg hover:bg-gray-200 transition-colors"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* ── BENTO GRID ── */}
      <section id="bento" className="px-6 lg:px-16 pb-16">
        <div
          className="max-w-7xl mx-auto grid gap-4"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "auto",
          }}
        >
          {/* ── Card 1: Prayer Times — large, spans 5 cols, 2 rows ── */}
          <div
            className="col-span-12 lg:col-span-5 row-span-2 rounded-3xl p-8 flex flex-col"
            style={{ backgroundColor: "#67519A", minHeight: 420 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Prayer Times</div>
                <div className="text-white text-2xl font-extrabold">Today</div>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white/50 text-sm">Austin, TX · Nueces Mosque</span>
            </div>

            {/* Prayer list */}
            <div className="flex-1 space-y-1">
              {[
                { name: "Fajr", time: "5:47 AM", status: "done" },
                { name: "Sunrise", time: "7:14 AM", status: "done" },
                { name: "Dhuhr", time: "1:12 PM", status: "done" },
                { name: "Asr", time: "4:18 PM", status: "active" },
                { name: "Maghrib", time: "7:34 PM", status: "upcoming" },
                { name: "Isha", time: "9:02 PM", status: "upcoming" },
              ].map((p) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl ${
                    p.status === "active"
                      ? "bg-white"
                      : p.status === "done"
                      ? "bg-transparent"
                      : "bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        p.status === "active"
                          ? "bg-[#699A51]"
                          : p.status === "done"
                          ? "bg-white/25"
                          : "bg-white/15"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        p.status === "active"
                          ? "text-[#4A4A4A] text-base"
                          : p.status === "done"
                          ? "text-white/40"
                          : "text-white/70"
                      }`}
                    >
                      {p.name}
                    </span>
                    {p.status === "active" && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#699A51] bg-[#699A51]/10 px-2 py-0.5 rounded-full">
                        Next
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-bold ${
                      p.status === "active"
                        ? "text-[#67519A] text-base"
                        : p.status === "done"
                        ? "text-white/30"
                        : "text-white/60"
                    }`}
                  >
                    {p.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Card 2: Events — medium, 4 cols ── */}
          <div
            className="col-span-12 md:col-span-6 lg:col-span-4 rounded-3xl p-7 flex flex-col"
            style={{ backgroundColor: "#699A51" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-white/70 text-xs font-bold uppercase tracking-widest">Upcoming Events</div>
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { title: "Friday Jumu'ah", date: "Today · 1:30 PM", attending: 124 },
                { title: "Quran Study Circle", date: "Wed · 7:00 PM", attending: 45 },
                { title: "Eid al-Adha Celebration", date: "Jun 7 · 9:00 AM", attending: 312 },
              ].map((e) => (
                <div key={e.title} className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <div className="text-white font-bold text-sm mb-1">{e.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">{e.date}</span>
                    <span className="text-white/80 text-xs font-bold">{e.attending} attending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Card 3: Notifications — 3 cols ── */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 rounded-3xl p-7 bg-[#516D9A] flex flex-col">
            <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-5">Live Notifications</div>
            <div className="space-y-3 flex-1">
              {[
                { icon: "📢", msg: "New khutbah posted", time: "2m" },
                { icon: "🌙", msg: "Ramadan schedule live", time: "1h" },
                { icon: "🤲", msg: "Fundraiser goal reached!", time: "3h" },
                { icon: "🕌", msg: "Prayer time changed", time: "1d" },
              ].map((n) => (
                <div key={n.msg} className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
                  <span className="text-lg">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{n.msg}</div>
                    <div className="text-white/40 text-[10px] mt-0.5">{n.time} ago</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-white/40 text-xs">Push notifications · All platforms</span>
            </div>
          </div>

          {/* ── Card 4: Community Stats — 4 cols ── */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 rounded-3xl p-7 bg-gray-50 border border-gray-100 flex flex-col justify-between">
            <div className="text-[#4A4A4A]/50 text-xs font-bold uppercase tracking-widest mb-5">Community</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "500+", l: "Mosques", c: "#699A51" },
                { n: "50K+", l: "Members", c: "#516D9A" },
                { n: "12", l: "Countries", c: "#67519A" },
                { n: "1M+", l: "Prayers", c: "#699A51" },
              ].map((s) => (
                <div key={s.l} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="text-2xl font-extrabold mb-1" style={{ color: s.c }}>{s.n}</div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {["#699A51", "#516D9A", "#67519A", "#699A51"].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">+50,000 others joined this month</span>
            </div>
          </div>

          {/* ── Card 5: Admin Portal — large dark, 8 cols ── */}
          <div
            className="col-span-12 lg:col-span-8 rounded-3xl overflow-hidden"
            style={{ backgroundColor: "#1C1C1E", minHeight: 300 }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="flex-1 mx-4 h-6 bg-white/5 rounded-md flex items-center px-3">
                <span className="text-white/20 text-xs">admin.mymosque.app</span>
              </div>
            </div>

            {/* Dashboard layout */}
            <div className="p-6 grid grid-cols-12 gap-4 h-full">
              {/* Sidebar */}
              <div className="col-span-3 space-y-2">
                <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold px-2 mb-3">Admin Portal</div>
                {[
                  { label: "Dashboard", active: true, color: "#699A51" },
                  { label: "Prayer Times", active: false },
                  { label: "Events", active: false },
                  { label: "Announcements", active: false },
                  { label: "Members", active: false },
                  { label: "Analytics", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                      item.active ? "bg-[#699A51]/20 text-[#87c96a]" : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: item.active ? "#699A51" : "rgba(255,255,255,0.15)" }}
                    />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="col-span-9 space-y-4">
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Overview</div>
                {/* Mini stat cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { n: "847", l: "Members", c: "#699A51" },
                    { n: "12", l: "Events", c: "#516D9A" },
                    { n: "3", l: "Pending", c: "#67519A" },
                  ].map((s) => (
                    <div key={s.l} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-xl font-extrabold mb-0.5" style={{ color: s.c }}>{s.n}</div>
                      <div className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">{s.l}</div>
                    </div>
                  ))}
                </div>
                {/* Activity bars */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Weekly Activity</div>
                  <div className="flex items-end gap-2 h-16">
                    {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{
                        height: `${h}%`,
                        backgroundColor: ["#699A51", "#516D9A", "#67519A", "#699A51", "#516D9A", "#699A51", "#67519A"][i],
                        opacity: 0.6,
                      }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} className="flex-1 text-center text-[9px] text-white/20 font-bold">{d}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 6: Mosque Image — full width ── */}
          <div className="col-span-12 rounded-3xl overflow-hidden relative" style={{ minHeight: 300 }}>
            <img src="/nueces.jpg" alt="Nueces Mosque" className="w-full h-[300px] object-cover" />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ background: "linear-gradient(to right, rgba(105,154,81,0.85), rgba(81,109,154,0.85))" }}
            >
              <p className="text-white/70 text-sm uppercase tracking-widest font-bold mb-3">Proudly serving</p>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white">500+ mosques worldwide</h2>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD ── */}
      <section id="download" className="py-24 px-6 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-[#4A4A4A] p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
            <div className="text-white flex-1">
              <img src="/logo.png" alt="MyMosque" className="h-14 w-14 mb-6" />
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">Start connecting your community today.</h2>
              <p className="text-white/50 text-lg">Free for communities. Powerful for administrators.</p>
            </div>
            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <button className="bg-[#699A51] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-[#5c8846] hover:scale-105 transition-all shadow-lg shadow-black/30 flex items-center justify-center gap-2 min-w-[200px]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </button>
              <button className="bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2 min-w-[200px]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.18 23.76c.2.11.44.14.69.08l12.09-6.97-2.62-2.62-10.16 9.51zM.5 1.1C.19 1.42 0 1.94 0 2.62v18.76c0 .68.19 1.2.5 1.52l.08.07 10.51-10.51v-.25L.58 1.03.5 1.1zM20.24 10.26l-2.85-1.64-2.94 2.94 2.94 2.94 2.88-1.66c.82-.47.82-1.24-.03-1.58zM3.18.24l10.62 6.14-2.62 2.62L1.18.57c.25-.06.49-.03.69.08l1.31-.41z" />
                </svg>
                Google Play
              </button>
              <button className="bg-white/5 border border-white/10 text-white/60 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 min-w-[200px]">
                Admin Portal →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 py-10 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="MyMosque" className="h-7 w-7 opacity-50 rounded-lg" />
            <span className="text-gray-400 font-bold text-sm">MyMosque</span>
          </div>
          <p className="text-gray-300 text-sm">© 2025 MyMosque · Everything your mosque needs.</p>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-[#699A51] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#699A51] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#699A51] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
