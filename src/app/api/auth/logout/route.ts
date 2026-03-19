import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ ok: true });

    if (process.env.VERCEL_ENV === "production") {
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
      await supabase.auth.signOut();
    } else {
      response.cookies.set("mosque-session", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }

    return response;
  } catch (err) {
    logger.error("logout", "Failed to process logout", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
