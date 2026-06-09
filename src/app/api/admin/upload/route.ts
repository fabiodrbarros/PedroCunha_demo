import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { guardApi, badRequest } from "@/lib/api";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// POST /api/admin/upload — multipart form-data, field "files" (one or more)
export async function POST(req: NextRequest) {
  const denied = await guardApi();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return badRequest("Expected multipart/form-data");
  }

  const files = [
    ...form.getAll("files"),
    ...form.getAll("file"),
  ].filter((f): f is File => f instanceof File);

  if (files.length === 0) return badRequest("No files provided");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const urls: string[] = [];

  for (const file of files) {
    if (!ACCEPTED.includes(file.type)) {
      return badRequest(`Unsupported file type: ${file.type}`);
    }
    if (file.size > MAX_BYTES) {
      return badRequest(`File too large: ${file.name}`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = crypto.randomBytes(8).toString("hex");
    const filename = `${Date.now()}-${id}.webp`;

    // Normalise: cap width at 2000px, re-encode to webp for performance.
    const optimized = await sharp(buffer)
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    await writeFile(path.join(UPLOAD_DIR, filename), optimized);
    urls.push(`/uploads/${filename}`);
  }

  return NextResponse.json({ urls }, { status: 201 });
}
