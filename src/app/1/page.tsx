export default function Page1() {
  const pattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23699A51' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 18h8v4H0v-4zm32 0h8v4h-8v-4zM18 0v8h4V0h-4zm0 32v8h4v-8h-4z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen font-sans text-[#4A4A4A] bg-white overflow-x-hidden">
      {/* Subtle pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{ backgroundImage: pattern }}
      />

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="MyMosque" className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight text-[#699A51]">MyMosque</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#4A4A4A]/80">
          <a href="#features" className="hover:text-[#699A51] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#699A51] transition-colors">How It Works</a>
          <a href="#community" className="hover:text-[#699A51] transition-colors">Community</a>
          <a href="#download" className="hover:text-[#699A51] transition-colors">Download</a>
        </div>
        <a
          href="#download"
          className="bg-[#699A51] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#5c8846] transition-all shadow-md shadow-[#699A51]/30"
        >
          Get the App
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16">
          {/* Left */}
          <div className="space-y-7 animate-fade-up">
            <div className="inline-flex items-center gap-2.5 bg-[#699A51]/10 text-[#699A51] px-4 py-2 rounded-full text-sm font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#699A51] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#699A51]" />
              </span>
              Now available on iOS & Android
            </div>

            <h1 className="text-5xl lg:text-[3.75rem] font-extrabold text-[#4A4A4A] leading-[1.1] tracking-tight">
              Connecting{" "}
              <span className="text-[#699A51] relative">
                Mosques
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5 Q50 1 100 5 Q150 9 200 5" stroke="#699A51" strokeWidth="2.5" fill="none" strokeOpacity="0.5" />
                </svg>
              </span>{" "}
              with Their Communities
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              MyMosque bridges the gap between mosques and their communities. Prayer times, events, announcements — beautifully organized, always in reach.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#download"
                className="bg-[#699A51] text-white px-7 py-3.5 rounded-2xl font-semibold hover:bg-[#5c8846] transition-all hover:scale-[1.03] shadow-xl shadow-[#699A51]/25 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download the App
              </a>
              <a
                href="#features"
                className="border-2 border-[#516D9A] text-[#516D9A] px-7 py-3.5 rounded-2xl font-semibold hover:bg-[#516D9A] hover:text-white transition-all flex items-center gap-2"
              >
                For Mosques
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 pt-2">
              <div>
                <div className="text-3xl font-extrabold text-[#699A51]">500+</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">Mosques</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="text-3xl font-extrabold text-[#516D9A]">50K+</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">Members</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="text-3xl font-extrabold text-[#67519A]">12</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">Countries</div>
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Background accent */}
            <div className="absolute right-0 top-4 w-[85%] h-[90%] bg-gradient-to-br from-[#699A51]/10 to-[#516D9A]/10 rounded-3xl" />

            {/* Main image */}
            <div className="relative z-10 w-[90%] lg:w-full rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="/nueces.jpg" alt="Nueces Mosque" className="w-full object-cover h-80 lg:h-[480px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating badge — prayer time */}
            <div className="absolute -left-4 bottom-12 z-20 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#67519A20' }}>
                <svg className="w-6 h-6 text-[#67519A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Next Prayer</div>
                <div className="text-base font-bold text-[#4A4A4A]">Asr · 4:12 PM</div>
              </div>
            </div>

            {/* Floating badge — event */}
            <div className="absolute -right-2 lg:-right-6 top-8 z-20 bg-white rounded-2xl shadow-2xl p-4 max-w-[180px]" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#699A51]" />
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Upcoming</span>
              </div>
              <div className="text-sm font-bold text-[#699A51]">Friday Jumu&apos;ah</div>
              <div className="text-xs text-gray-500 mt-0.5">1:30 PM · 124 attending</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 bg-gray-50 py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-[#699A51] font-bold mb-3">Everything You Need</p>
            <h2 className="text-4xl font-extrabold text-[#4A4A4A]">Built for the Modern Mosque</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">A complete platform covering every touchpoint between mosque administration and the community.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                color: "#67519A",
                bg: "#67519A15",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Prayer Times",
                desc: "Accurate, location-aware prayer schedules synced automatically with your mosque.",
              },
              {
                color: "#699A51",
                bg: "#699A5115",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Events",
                desc: "Create, publish, and manage mosque events with RSVP tracking in real-time.",
              },
              {
                color: "#516D9A",
                bg: "#516D9A15",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                title: "Announcements",
                desc: "Push important updates instantly to every community member's phone.",
              },
              {
                color: "#699A51",
                bg: "#699A5115",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Community",
                desc: "Foster connection with a dedicated community hub for your congregation.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#4A4A4A] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative z-10 bg-[#699A51] py-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center text-white">
          {[
            { num: "500+", label: "Mosques Onboarded" },
            { num: "50,000+", label: "Active Community Members" },
            { num: "1M+", label: "Prayers Tracked" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-5xl font-extrabold mb-2">{s.num}</div>
              <div className="text-white/70 text-sm uppercase tracking-widest font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-[#516D9A] font-bold mb-3">Simple Setup</p>
            <h2 className="text-4xl font-extrabold text-[#4A4A4A]">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[17%] right-[17%] h-px bg-gradient-to-r from-[#699A51] via-[#516D9A] to-[#67519A]" />
            {[
              { step: "01", color: "#699A51", title: "Register Your Mosque", desc: "Sign up through the admin portal and create your mosque's profile in under 5 minutes." },
              { step: "02", color: "#516D9A", title: "Invite Your Community", desc: "Share a unique link or QR code so members can download the app and join your mosque." },
              { step: "03", color: "#67519A", title: "Start Communicating", desc: "Post prayer times, events, and announcements — your community gets notified instantly." },
            ].map((s) => (
              <div key={s.step} className="text-center relative">
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-extrabold shadow-xl relative z-10"
                  style={{ backgroundColor: s.color }}
                >
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ── */}
      <section id="download" className="relative z-10 py-24 px-6 lg:px-12 overflow-hidden">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #699A51 0%, #516D9A 50%, #67519A 100%)" }}
        >
          {/* decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="relative z-10">
            <img src="/logo.png" alt="MyMosque" className="w-20 h-20 mx-auto mb-6 drop-shadow-xl" />
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              Ready to bring your mosque closer together?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
              Download MyMosque and experience the future of mosque-community communication.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-[#699A51] px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-3 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </button>
              <button className="bg-white/10 text-white border-2 border-white/40 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 hover:scale-105 transition-all flex items-center gap-3 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.18 23.76c.2.11.44.14.69.08l12.09-6.97-2.62-2.62-10.16 9.51zM.5 1.1C.19 1.42 0 1.94 0 2.62v18.76c0 .68.19 1.2.5 1.52l.08.07 10.51-10.51v-.25L.58 1.03.5 1.1zM20.24 10.26l-2.85-1.64-2.94 2.94 2.94 2.94 2.88-1.66c.82-.47.82-1.24-.03-1.58zM3.18.24l10.62 6.14-2.62 2.62L1.18.57c.25-.06.49-.03.69.08l1.31-.41z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 bg-[#2d2d2d] text-white py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MyMosque" className="h-8 w-8 opacity-80" />
            <span className="font-bold text-lg">MyMosque</span>
          </div>
          <p className="text-white/40 text-sm text-center">
            © 2025 MyMosque. Connecting mosques with their communities.
          </p>
          <div className="flex gap-6 text-white/50 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
