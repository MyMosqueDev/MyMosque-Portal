import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const { email } = await request.json();

  if (email !== "admin@yopmail.com") {
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

  return response;
}
