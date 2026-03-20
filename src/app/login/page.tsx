"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-sans text-[#4A4A4A] bg-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 lg:px-16 py-6 border-b border-gray-100">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="MyMosque" className="h-9 w-9 rounded-lg" />
          <span className="text-xl font-bold text-[#4A4A4A]">MyMosque</span>
        </a>
        {/* <a
          href="#"
          className="text-sm text-gray-400 hover:text-[#4A4A4A] transition-colors"
        >
          Don&apos;t have an account?{" "}
          <span className="text-[#699A51] font-semibold">Sign up</span>
        </a> */}
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

          {/* Dev mode hint */}
          {(process.env.VERCEL_ENV !== "production") && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
              <span className="font-semibold">Dev mode:</span> Use{" "}
              <code className="font-mono">admin@yopmail.com</code> with any password.
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold text-[#4A4A4A]"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="imam@mosque.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#fafafa] text-[#4A4A4A] placeholder-gray-300 text-sm focus:outline-none focus:border-[#699A51] focus:ring-2 focus:ring-[#699A51]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-semibold text-[#4A4A4A]"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-[#699A51] font-semibold hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#fafafa] text-[#4A4A4A] placeholder-gray-300 text-sm focus:outline-none focus:border-[#699A51] focus:ring-2 focus:ring-[#699A51]/20 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#699A51] text-white font-bold py-3.5 rounded-full text-sm hover:bg-[#5c8846] hover:scale-[1.02] transition-all shadow-lg shadow-[#699A51]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-300 mt-8">
            © 2025 MyMosque · Where Faith Meets Community
          </p>
        </div>
      </main>
    </div>
  );
}
