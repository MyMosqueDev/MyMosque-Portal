export default function Page4() {
  return (
    <div className="min-h-screen font-sans text-[#4A4A4A] bg-white overflow-x-hidden">

      {/* ── NAV with tri-color accent ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
        {/* 3-color top stripe */}
        <div className="flex h-1">
          <div className="flex-1 bg-[#699A51]" />
          <div className="flex-1 bg-[#516D9A]" />
          <div className="flex-1 bg-[#67519A]" />
        </div>
        <div className="px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MyMosque" className="h-9 w-9 rounded-lg" />
            <span className="text-xl font-bold text-[#4A4A4A]">MyMosque</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#4A4A4A]/70">
            <a href="#features" className="hover:text-[#699A51] transition-colors">Features</a>
            <a href="#community" className="hover:text-[#699A51] transition-colors">Community</a>
            <a href="#download" className="hover:text-[#699A51] transition-colors">Download</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="text-sm text-[#4A4A4A]/60 hover:text-[#4A4A4A] transition-colors font-medium">Sign In</a>
            <a
              href="#download"
              className="bg-[#699A51] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#5c8846] transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-16">
        {/* Colorful gradient mesh background */}
        <div className="absolute inset-0 opacity-8 pointer-events-none" aria-hidden>
          <div
            className="absolute top-0 right-0 w-[70%] h-[70%] rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, #699A51, transparent)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[50%] h-[60%] rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, #516D9A, transparent)" }}
          />
          <div
            className="absolute top-[40%] right-[20%] w-[40%] h-[50%] rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #67519A, transparent)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#699A51", "#516D9A", "#67519A"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: c, zIndex: 3 - i }}
                  >
                    {["M", "C", "A"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">Join 50,000+ community members</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-[#4A4A4A] leading-[1.05]">
              Your Mosque,<br />
              Your{" "}
              <span
                className="relative inline-block"
                style={{
                  backgroundImage: "linear-gradient(135deg, #699A51, #516D9A, #67519A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Community.
              </span>
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
              MyMosque brings prayer times, events, and announcements together in one app — keeping your mosque's community engaged, informed, and connected.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#download"
                className="flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #699A51, #5c8846)",
                  boxShadow: "0 8px 30px rgba(105,154,81,0.3)",
                }}
              >
                Download Free
              </a>
              <a
                href="#features"
                className="flex items-center gap-2 bg-gray-100 text-[#4A4A4A] font-bold px-8 py-4 rounded-2xl text-lg hover:bg-gray-200 transition-colors"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Right — mosque image in a blob shape */}
          <div className="relative flex justify-center">
            {/* Outer decorative ring */}
            <div
              className="absolute inset-0 m-4 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-20"
              style={{ background: "linear-gradient(135deg, #699A51, #516D9A, #67519A)" }}
            />
            {/* Image in blob clip */}
            <div
              className="relative w-full max-w-[520px] aspect-square overflow-hidden shadow-2xl"
              style={{
                borderRadius: "60% 40% 50% 50% / 50% 40% 60% 50%",
                border: "4px solid transparent",
                backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #699A51, #516D9A, #67519A)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              <img
                src="/nueces.jpg"
                alt="Nueces Mosque"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div
                className="absolute inset-0 opacity-20"
                style={{ background: "linear-gradient(to bottom right, #699A51, transparent)" }}
              />
            </div>

            {/* Floating stat cards */}
            <div className="absolute top-4 -left-4 lg:-left-8 bg-white rounded-2xl shadow-xl p-4 text-center animate-float">
              <div className="text-2xl font-extrabold text-[#699A51]">500+</div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Mosques</div>
            </div>
            <div className="absolute bottom-8 -right-4 lg:-right-8 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Daily Active</div>
              <div className="text-2xl font-extrabold text-[#516D9A]">12K+</div>
              <div className="text-xs text-gray-400">community members</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLOR-BLOCKED FEATURES ── */}
      <section id="features">
        {/* Feature 1 — green */}
        <div className="bg-[#699A51] py-20 px-6 lg:px-0">
          <div className="max-w-7xl mx-auto lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <div className="text-xs uppercase tracking-[0.25em] font-bold text-white/60 mb-4">Prayer & Worship</div>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">Never miss a prayer time again</h2>
              <p className="text-white/75 text-lg leading-relaxed mb-8">
                Accurate, mosque-specific prayer schedules that auto-adjust for location and season. Beautiful Adhan reminders for every salah, delivered right to your phone.
              </p>
              <ul className="space-y-3">
                {["Auto-updated schedules", "Adhan notifications", "Qibla compass", "Prayer tracking"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/85 font-medium">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 w-full max-w-sm">
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Today&apos;s Prayer Times</div>
                {[
                  { name: "Fajr", time: "5:47 AM", done: true },
                  { name: "Dhuhr", time: "1:12 PM", done: true },
                  { name: "Asr", time: "4:18 PM", active: true },
                  { name: "Maghrib", time: "7:34 PM", done: false },
                  { name: "Isha", time: "9:02 PM", done: false },
                ].map((p) => (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between py-3 border-b last:border-0 ${
                      p.active ? "border-white/30" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          p.done ? "bg-white/30" : p.active ? "bg-white animate-pulse" : "bg-white/10"
                        }`}
                      />
                      <span className={`font-semibold ${p.active ? "text-white text-lg" : "text-white/60"}`}>
                        {p.name}
                      </span>
                    </div>
                    <span className={`font-bold ${p.active ? "text-white" : "text-white/50"}`}>{p.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 — white */}
        <div className="bg-white py-20 px-6 lg:px-0">
          <div className="max-w-7xl mx-auto lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 flex items-center justify-center">
              <div className="w-full max-w-sm space-y-4">
                {[
                  { title: "Friday Jumu'ah", date: "Fri, Mar 21 · 1:30 PM", count: 124, color: "#699A51" },
                  { title: "Eid al-Adha Celebration", date: "Sun, Jun 7 · 9:00 AM", count: 312, color: "#516D9A" },
                  { title: "Quran Study Circle", date: "Wed, Mar 19 · 7:00 PM", count: 45, color: "#67519A" },
                ].map((e) => (
                  <div key={e.title} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: e.color + "20" }}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: e.color }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#4A4A4A] truncate">{e.title}</div>
                      <div className="text-xs text-gray-400">{e.date}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold" style={{ color: e.color }}>{e.count}</div>
                      <div className="text-xs text-gray-400">attending</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-xs uppercase tracking-[0.25em] font-bold text-[#699A51] mb-4">Events & Gatherings</div>
              <h2 className="text-4xl font-extrabold text-[#4A4A4A] mb-6 leading-tight">
                Events that actually get attended
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Publish mosque events with built-in RSVP tracking. From weekly Jumu'ah to Eid celebrations — reach your community where they already are.
              </p>
              <ul className="space-y-3">
                {["Rich event pages", "RSVP & attendance tracking", "Automated reminders", "Recurring events"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#4A4A4A]/80">
                    <div className="w-5 h-5 rounded-full bg-[#699A51]/15 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#699A51]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Feature 3 — blue */}
        <div className="py-20 px-6 lg:px-0" style={{ backgroundColor: "#516D9A" }}>
          <div className="max-w-7xl mx-auto lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <div className="text-xs uppercase tracking-[0.25em] font-bold text-white/60 mb-4">Announcements</div>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">The right message, at the right time</h2>
              <p className="text-white/75 text-lg leading-relaxed mb-8">
                Replace scattered WhatsApp groups with direct, reliable announcements. Push urgent updates instantly — your community sees them first.
              </p>
              <ul className="space-y-3">
                {["Instant push notifications", "Segmented announcements", "Read receipts", "Scheduled posts"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/85 font-medium">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm space-y-3">
                {[
                  { title: "New Jumu'ah khutbah posted", time: "2 min ago", icon: "📢" },
                  { title: "Ramadan schedule now available", time: "1 hr ago", icon: "🌙" },
                  { title: "Fundraiser goal reached — JazakAllah!", time: "3 hr ago", icon: "🤲" },
                ].map((n) => (
                  <div key={n.title} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-start gap-3">
                    <span className="text-2xl">{n.icon}</span>
                    <div>
                      <div className="text-white font-semibold text-sm">{n.title}</div>
                      <div className="text-white/50 text-xs mt-0.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS — purple ── */}
      <section id="community" className="py-24 px-6 lg:px-12" style={{ background: "linear-gradient(135deg, #67519A, #516D9A)" }}>
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">Growing every day</h2>
          <p className="text-white/60 text-lg mb-16">Thousands of Muslims around the world use MyMosque to stay connected to their mosque.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { n: "500+", l: "Mosques", color: "#699A51" },
              { n: "50K+", l: "Members", color: "#87c96a" },
              { n: "1M+", l: "Prayers", color: "#7da3cc" },
              { n: "12", l: "Countries", color: "#9b7fd4" },
            ].map((s) => (
              <div key={s.l} className="p-6 bg-white/10 rounded-3xl border border-white/15">
                <div className="text-4xl font-extrabold mb-2" style={{ color: s.color }}>{s.n}</div>
                <div className="text-white/60 text-sm uppercase tracking-widest font-semibold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN THE UMMAH ── */}
      <section className="py-24 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#4A4A4A]">For mosques of every size</h2>
            <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">Whether you serve 50 families or 5,000 — MyMosque grows with you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Small Community", desc: "Perfect for neighborhood mosques getting started with digital outreach.", color: "#699A51", bg: "#f2f8ef" },
              { title: "Growing Mosque", desc: "Tools to scale events, announcements, and member management as you grow.", color: "#516D9A", bg: "#eef2f8" },
              { title: "Islamic Center", desc: "Enterprise features for large centers with multiple programs and administrators.", color: "#67519A", bg: "#f3f0f8" },
            ].map((t) => (
              <div key={t.title} className="rounded-3xl p-8 border-2 hover:shadow-lg transition-all" style={{ backgroundColor: t.bg, borderColor: t.color + "30" }}>
                <div className="w-3 h-3 rounded-full mb-6" style={{ backgroundColor: t.color }} />
                <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">{t.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{t.desc}</p>
                <a href="#" className="text-sm font-bold flex items-center gap-1 hover:gap-3 transition-all" style={{ color: t.color }}>
                  Get started free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD ── */}
          <section id="download" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <img src="/logo.png" alt="MyMosque" className="w-16 h-16 mx-auto mb-6 rounded-lg" />
          <h2 className="text-4xl font-extrabold text-[#4A4A4A] mb-5">Download MyMosque — it&apos;s free</h2>
          <p className="text-gray-500 text-lg mb-10">Available on iPhone and Android. The mosque admin portal is accessible from any browser.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-[#699A51] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-[#5c8846] hover:scale-105 transition-all shadow-lg shadow-[#699A51]/25">
              App Store
            </button>
            <button className="bg-[#516D9A] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-[#445d85] hover:scale-105 transition-all shadow-lg shadow-[#516D9A]/25">
              Google Play
            </button>
            <button className="border-2 border-[#67519A] text-[#67519A] font-bold px-8 py-4 rounded-2xl text-lg hover:bg-[#67519A] hover:text-white transition-all">
              Admin Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#4A4A4A] text-white py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="MyMosque" className="h-8 w-8 opacity-80 rounded-lg" />
              <span className="font-bold text-lg">MyMosque</span>
            </div>
            <div className="flex gap-8 text-white/50 text-sm">
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">For Mosques</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="flex h-0.5 mb-6">
            <div className="flex-1 bg-[#699A51]/50" />
            <div className="flex-1 bg-[#516D9A]/50" />
            <div className="flex-1 bg-[#67519A]/50" />
          </div>
          <p className="text-white/30 text-sm text-center">© 2025 MyMosque · Your Mosque, Your Community</p>
        </div>
      </footer>
    </div>
  );
}
