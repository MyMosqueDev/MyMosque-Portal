// Star SVG pattern encoded for CSS background
const starPatternSVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpolygon points='40,5 47,28 72,28 52,43 59,67 40,53 21,67 28,43 8,28 33,28' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.15'/%3E%3C/svg%3E")`;

export default function Page3() {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: "#0D1117", color: "#e6edf3" }}>

      {/* ── BACKGROUND — gradient mesh + star pattern ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        {/* Gradient blobs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #699A51, transparent)" }}
        />
        <div
          className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #516D9A, transparent)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #67519A, transparent)" }}
        />
        {/* Star pattern */}
        <div
          className="absolute inset-0 opacity-100"
          style={{ backgroundImage: starPatternSVG, backgroundSize: "80px 80px" }}
        />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-8 lg:px-16 py-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="MyMosque" className="h-9 w-9 rounded-lg" />
          <span className="text-xl font-bold text-white">MyMosque</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#portal" className="hover:text-white transition-colors">Admin Portal</a>
          <a href="#download" className="hover:text-white transition-colors">Download</a>
        </div>
        <a
          href="#download"
          className="text-sm font-semibold px-5 py-2.5 rounded-full border border-white/20 text-white/80 hover:border-[#699A51] hover:text-[#699A51] transition-all"
        >
          Get the App
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 min-h-[90vh]">
        {/* Glowing logo */}
        <div className="relative mb-10">
          <div
            className="absolute inset-0 w-24 h-24 rounded-full blur-2xl mx-auto opacity-60"
            style={{ background: "radial-gradient(circle, #699A51, #516D9A)" }}
          />
          <img
            src="/logo.png"
            alt="MyMosque"
            className="relative w-24 h-24 drop-shadow-[0_0_24px_rgba(105,154,81,0.6)]"
          />
        </div>

        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#699A51]" />
          The Future of Mosque Communication
        </div>

        <h1 className="text-6xl lg:text-8xl font-extrabold leading-[1.0] tracking-tight mb-8 max-w-5xl">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #699A51 0%, #87c96a 30%, #516D9A 70%, #67519A 100%)" }}
          >
            Reimagine
          </span>
          <br />
          <span className="text-white">Your Mosque.</span>
        </h1>

        <p className="text-lg lg:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
          A next-generation platform connecting mosques with their communities through prayer times, events, and real-time announcements — all beautifully designed.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href="#download"
            className="relative group px-8 py-4 rounded-2xl font-bold text-white text-lg overflow-hidden"
            style={{ background: "linear-gradient(135deg, #699A51, #516D9A)" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Download the App
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>
          <a
            href="#features"
            className="px-8 py-4 rounded-2xl font-bold text-white/70 text-lg border border-white/10 hover:border-white/30 hover:text-white transition-all"
          >
            See Features
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
      </section>

      {/* ── GLASS FEATURE CARDS ── */}
      <section id="features" className="relative z-10 py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">Everything your community needs</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">One platform. Infinite connection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                color: "#67519A",
                glow: "rgba(103,81,154,0.3)",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Prayer Times",
                desc: "Accurate, auto-updated prayer schedules for any location. Beautiful Adhan reminders keep salah central.",
                tag: "Community",
              },
              {
                color: "#699A51",
                glow: "rgba(105,154,81,0.3)",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Events",
                desc: "Publish mosque events with RSVP tracking. Jumu'ah, Eid, fundraisers — your congregation always in the loop.",
                tag: "Engagement",
              },
              {
                color: "#516D9A",
                glow: "rgba(81,109,154,0.3)",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                title: "Announcements",
                desc: "Push critical updates directly to your community's phones. No group chats, no noise — just clarity.",
                tag: "Communication",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-3xl p-8 border group hover:border-opacity-60 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  borderColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: f.color + "25", color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: f.color + "20", color: f.color }}
                  >
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Wide bottom card */}
          <div
            className="rounded-3xl p-8 lg:p-12 border flex flex-col lg:flex-row items-center gap-10"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#699A51]" />
                <span className="text-[#699A51] text-sm font-bold uppercase tracking-widest">Admin Portal</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-4">Powerful tools for mosque administrators</h3>
              <p className="text-white/45 leading-relaxed mb-6">
                Manage your entire mosque from one dashboard. Publish content, track attendance, engage your community — all from your computer or phone.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-[#699A51] font-bold hover:gap-4 transition-all text-sm uppercase tracking-widest">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            <div className="flex-1 flex items-center justify-center gap-4 flex-wrap">
              {["Dashboard", "Content", "Members", "Analytics", "Settings"].map((item, i) => (
                <div
                  key={item}
                  className="px-5 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    backgroundColor: ["#699A51", "#516D9A", "#67519A", "#699A51", "#516D9A"][i] + "25",
                    color: ["#87c96a", "#7da3cc", "#9b7fd4", "#87c96a", "#7da3cc"][i],
                    border: `1px solid ${["#699A51", "#516D9A", "#67519A", "#699A51", "#516D9A"][i]}40`,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MOSQUE IMAGE with dark overlay ── */}
      <section className="relative z-10 mx-6 lg:mx-12 mb-24 rounded-3xl overflow-hidden" style={{ minHeight: 400 }}>
        <img src="/nueces.jpg" alt="Nueces Mosque" className="w-full h-[400px] object-cover" />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ background: "linear-gradient(135deg, rgba(13,17,23,0.85), rgba(105,154,81,0.4), rgba(13,17,23,0.85))" }}
        >
          <p className="text-white/60 text-sm uppercase tracking-[0.3em] font-semibold mb-4">Trusted by</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white">Mosques worldwide</h2>
          <p className="text-white/50 mt-4 max-w-md mx-auto">From small community masjids to large Islamic centers — MyMosque serves them all.</p>
        </div>
      </section>

      {/* ── DOWNLOAD ── */}
      <section id="download" className="relative z-10 py-24 px-6 lg:px-12 text-center">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-12 lg:p-16 border"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #699A51, #516D9A)" }}
            >
            <img src="/logo.png" alt="MyMosque" className="w-14 h-14 rounded-lg" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5">Download MyMosque</h2>
          <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
            Free for communities. Powerful for administrators. Available on all platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="px-8 py-4 rounded-2xl font-bold text-white text-lg flex items-center gap-2 hover:scale-105 transition-transform"
              style={{
                background: "linear-gradient(135deg, #699A51, #5c8846)",
                boxShadow: "0 8px 32px rgba(105,154,81,0.35)",
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </button>
            <button
              className="px-8 py-4 rounded-2xl font-bold text-white text-lg flex items-center gap-2 hover:scale-105 transition-transform border border-white/15 hover:border-white/30"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.18 23.76c.2.11.44.14.69.08l12.09-6.97-2.62-2.62-10.16 9.51zM.5 1.1C.19 1.42 0 1.94 0 2.62v18.76c0 .68.19 1.2.5 1.52l.08.07 10.51-10.51v-.25L.58 1.03.5 1.1zM20.24 10.26l-2.85-1.64-2.94 2.94 2.94 2.94 2.88-1.66c.82-.47.82-1.24-.03-1.58zM3.18.24l10.62 6.14-2.62 2.62L1.18.57c.25-.06.49-.03.69.08l1.31-.41z" />
              </svg>
              Google Play
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MyMosque" className="h-7 w-7 opacity-50 rounded-lg" />
            <span className="text-white/40 font-bold">MyMosque</span>
          </div>
          <p className="text-white/20 text-sm">© 2025 MyMosque · Reimagine Your Mosque</p>
          <div className="flex gap-6 text-white/30 text-sm">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
