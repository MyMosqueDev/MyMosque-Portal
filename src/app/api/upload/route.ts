import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("mosque-session");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    logger.error("upload", "Failed to parse form data", err);
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const maxBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
  } catch (err) {
    logger.error("upload", "Failed to write file", { filename, err });
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }

  return NextResponse.json({ url: `/uploads/${filename}` });
}
