import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  let email: string;
  let password: string;
  try {
    const body = await request.json();
    email = body.email;
    password = body.password;
  } catch (err) {
    logger.error("login", "Failed to parse request body", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Dev mode: cookie-based auth ───────────────────────────────────────────
  if (process.env.VERCEL_ENV !== "production") {
    if (email !== "admin@yopmail.com") {
      logger.warn("login", "Invalid credentials attempt", { email });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const session = Buffer.from(
      JSON.stringify({ mosqueId: 1 })
    ).toString("base64");
    const response = NextResponse.json({ ok: true });
    response.cookies.set("mosque-session", session, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    logger.info("login", "Successful dev login", { email });
    return response;
  }

  // ── Production: Supabase auth ─────────────────────────────────────────────
  const response = NextResponse.json({ ok: true });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    logger.warn("login", "Supabase auth failed", { email, message: error.message });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  logger.info("login", "Successful prod login", { email });
  return response;
}
