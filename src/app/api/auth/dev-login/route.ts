import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  let email: string;
  try {
    const body = await request.json();
    email = body.email;
  } catch (err) {
    logger.error("dev-login", "Failed to parse request body", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (email !== "admin@yopmail.com") {
    logger.warn("dev-login", "Invalid credentials attempt", { email });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const session = Buffer.from(
    JSON.stringify({ mosqueId: "seed-mosque-1" })
  ).toString("base64");

  const response = NextResponse.json({ ok: true });
  response.cookies.set("mosque-session", session, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  logger.info("dev-login", "Successful login", { email });
  return response;
}
