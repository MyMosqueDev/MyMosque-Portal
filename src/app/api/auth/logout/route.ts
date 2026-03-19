import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("mosque-session", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (err) {
    logger.error("logout", "Failed to process logout", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
