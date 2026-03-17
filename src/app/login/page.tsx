export default function LoginPage() {
  return (
    <div className="min-h-screen font-sans text-[#4A4A4A] bg-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 lg:px-16 py-6 border-b border-gray-100">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="MyMosque" className="h-9 w-9" />
          <span className="text-xl font-bold text-[#4A4A4A]">MyMosque</span>
        </a>
        <a
          href="#"
          className="text-sm text-gray-400 hover:text-[#4A4A4A] transition-colors"
        >
          Don&apos;t have an account? <span className="text-[#699A51] font-semibold">Sign up</span>
        </a>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 border border-[#699A51]/30 bg-[#f2f8ef] px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] text-[#699A51] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#699A51] animate-pulse" />
              Mosque Admin Portal
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-[#4A4A4A] text-center mb-2">
            Welcome back
          </h1>
          <p className="text-gray-400 text-center mb-10 text-sm">
            Sign in to manage your mosque&apos;s community.
          </p>

          <form className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#4A4A4A]" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="imam@mosque.org"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#fafafa] text-[#4A4A4A] placeholder-gray-300 text-sm focus:outline-none focus:border-[#699A51] focus:ring-2 focus:ring-[#699A51]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#4A4A4A]" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-[#699A51] font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#fafafa] text-[#4A4A4A] placeholder-gray-300 text-sm focus:outline-none focus:border-[#699A51] focus:ring-2 focus:ring-[#699A51]/20 transition-all"
              />
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-4 h-4 rounded border border-gray-300 bg-white peer-checked:bg-[#699A51] peer-checked:border-[#699A51] transition-all" />
                <svg
                  className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-400">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 w-full bg-[#699A51] text-white font-bold py-3.5 rounded-full text-sm hover:bg-[#5c8846] hover:scale-[1.02] transition-all shadow-lg shadow-[#699A51]/30"
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300 uppercase tracking-widest font-semibold">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* SSO placeholder */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-3.5 text-sm font-semibold text-[#4A4A4A] hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-gray-300 mt-8">
            © 2025 MyMosque · Where Faith Meets Community
          </p>
        </div>
      </main>
    </div>
  );
}
