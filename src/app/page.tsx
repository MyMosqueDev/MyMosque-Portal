export default function Home() {
  return (
    <div className="min-h-screen font-sans text-[#4A4A4A] bg-white overflow-x-hidden">

      {/* ── HERO — full viewport mosque image ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/nueces.jpg')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#1a1a1a]/90" />

        {/* Decorative large arabic-style quote marks */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none select-none flex items-center justify-center opacity-5"
          aria-hidden
        >
          <span className="text-[40rem] leading-none text-white font-serif">&ldquo;</span>
        </div>

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 lg:px-16 py-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MyMosque" className="h-9 w-9 rounded-lg" />
            <span className="text-xl font-bold text-white">MyMosque</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-white/80 hover:text-white text-sm font-semibold transition-colors px-4 py-2.5"
            >
              Login
            </a>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/80 mb-5 sm:mb-8 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#699A51] animate-pulse" />
            Community Platform for Mosques
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.1] tracking-tight mb-4 sm:mb-6">
            Connecting{" "}
            <span className="text-[#699A51] relative inline-block">
              Mosques
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 5 Q50 1 100 5 Q150 9 200 5" stroke="#699A51" strokeWidth="2.5" fill="none" strokeOpacity="0.7" />
              </svg>
            </span>{" "}
            with Their Communities
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            MyMosque unifies prayer times, events, and announcements in a single beautiful app for mosques and their communities.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="#download" className="bg-[#699A51] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-[#5c8846] hover:scale-105 transition-all shadow-2xl shadow-[#699A51]/40">
              Download Free
            </a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors flex items-center gap-2 font-medium text-base sm:text-lg">
              Learn more
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50">
          <span className="text-white text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section id="about" className="py-10 bg-[#f9f9f7] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-2xl font-bold text-[#4A4A4A] max-w-xl">
            <span className="text-[#699A51]">500+ mosques</span> trust MyMosque to reach their communities every day.
          </p>
          <div className="flex gap-12">
            {[["50K+", "Members"], ["12", "Countries"], ["1M+", "Prayers"]].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-3xl font-extrabold text-[#4A4A4A]">{n}</div>
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — alternating editorial blocks ── */}
      <section id="features" className="py-16">
        {[
          {
            num: "01",
            color: "#67519A",
            bg: "#f5f3ff",
            title: "Prayer Times, Perfected",
            desc: "Never miss a prayer. MyMosque provides your mosque's exact prayer schedule, auto-updated for your location and timezone. Beautiful Adhan reminders keep your community connected to each salah.",
            reverse: false,
          },
          {
            num: "02",
            color: "#699A51",
            bg: "#f2f8ef",
            title: "Events That Actually Get Attended",
            desc: "Create and promote mosque events with ease. From Jumu'ah announcements to Eid celebrations — your events reach the right people at the right time with RSVP tracking built in.",
            reverse: true,
          },
          {
            num: "03",
            color: "#516D9A",
            bg: "#f0f4f9",
            title: "Announcements in Real Time",
            desc: "Critical updates shouldn't get lost in a WhatsApp group. Push announcements directly to every member's phone from the mosque admin portal — instantly, reliably.",
            reverse: false,
          },
        ].map((f) => (
          <div key={f.num} className={`flex flex-col ${f.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-stretch`}>
            {/* Text side */}
            <div className="flex-1 flex items-center px-10 lg:px-20 py-20">
              <div className="max-w-lg">
                <span
                  className="text-[10rem] font-extrabold leading-none block mb-4 opacity-10 select-none"
                  style={{ color: f.color }}
                >
                  {f.num}
                </span>
                <h2 className="text-4xl font-extrabold text-[#4A4A4A] mb-6 -mt-8">{f.title}</h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">{f.desc}</p>
                <a
                  href="#download"
                  className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all"
                  style={{ color: f.color }}
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
            {/* Color block side */}
            <div
              className="flex-1 min-h-[320px] flex items-center justify-center"
              style={{ backgroundColor: f.bg }}
            >
              <div
                className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: f.color }}
              >
                {f.num === "01" && (
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {f.num === "02" && (
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {f.num === "03" && (
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="py-24 px-6 lg:px-12" style={{ background: "linear-gradient(135deg, #516D9A, #67519A)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-7xl font-serif text-white/20 leading-none mb-4">&ldquo;</div>
          <blockquote className="text-3xl lg:text-4xl font-bold leading-tight mb-8">
            Technology should bring us closer to the masjid, not pull us away from it. MyMosque does exactly that.
          </blockquote>
          <div className="text-white/60 text-sm uppercase tracking-widest font-semibold">— Imam Abdullah Hassan, Nueces Mosque</div>
        </div>
      </section>

      {/* ── HOW IT WORKS — horizontal timeline ── */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-[#699A51] font-bold mb-3">Getting Started</p>
            <h2 className="text-4xl font-extrabold text-[#4A4A4A]">Three steps to launch</h2>
          </div>
          <div className="relative">
            {/* Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-[#699A51] via-[#516D9A] to-[#67519A]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { n: "1", color: "#699A51", t: "Create Your Mosque", d: "Register on the admin portal and set up your mosque's profile." },
                { n: "2", color: "#516D9A", t: "Invite Members", d: "Share a link or QR code. Members join in seconds." },
                { n: "3", color: "#67519A", t: "Go Live", d: "Start posting. Your community gets notified immediately." },
              ].map((s) => (
                <div key={s.n} className="text-center relative">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-xl font-extrabold relative z-10 shadow-lg"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.n}
                  </div>
                  <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">{s.t}</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ── */}
      <section id="download" className="py-24 px-6 lg:px-12 bg-[#699A51]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Start today — it&apos;s free.</h2>
          <p className="text-white/80 text-xl mb-12">Download for iOS or Android, or sign up for the mosque admin portal.</p>
          <div className="flex flex-wrap justify-center gap-5">
            <button className="bg-white text-[#699A51] font-bold px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform shadow-xl">
              App Store
            </button>
            <button className="bg-white text-[#699A51] font-bold px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform shadow-xl">
              Google Play
            </button>
            <button className="border-2 border-white/50 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-colors">
              Admin Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1a1a] text-white py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MyMosque" className="h-8 w-8 opacity-70 rounded-lg" />
            <span className="font-bold text-white/80">MyMosque</span>
          </div>
          <p className="text-white/30 text-sm">© 2025 MyMosque · Where Faith Meets Community</p>
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
