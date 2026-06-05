import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { createServerClient } from "@/lib/supabase";

const PREVIEW_BUCKET = "previews";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// POST /api/upload/preview
// Receives a raw image, composites a "PREVIEW" watermark with sharp,
// converts to WebP, and uploads to the public `previews` bucket.
export async function POST(request: Request) {
  const uid = cookies().get("firebase-session")?.value;
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // ── Validate ──────────────────────────────────────────────────────────────
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Preview too large. Maximum is 5 MB per image.` },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `Invalid file type. Accepted: JPEG, PNG, WebP, GIF.` },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // ── Verify seller ─────────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("firebase_uid", uid)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 403 });
  }

  // ── Watermark with sharp ───────────────────────────────────────────────────
  const buffer = Buffer.from(await file.arrayBuffer());

  let watermarked: Buffer;
  try {
    const image = sharp(buffer);
    const { width = 800, height = 600 } = await image.metadata();

    const fontSize = Math.max(24, Math.floor(Math.min(width, height) / 8));
    const diag = Math.sqrt(width * width + height * height);

    // SVG watermark: repeated diagonal "PREVIEW" text across the image
    const watermarkSvg = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            text {
              font-family: Arial, sans-serif;
              font-size: ${fontSize}px;
              font-weight: bold;
              fill: rgba(255,255,255,0.25);
              letter-spacing: 8px;
            }
          </style>
        </defs>
        <g transform="translate(${width / 2}, ${height / 2}) rotate(-35)">
          ${Array.from({ length: 7 }, (_, i) => {
            const offset = (i - 3) * Math.floor(fontSize * 3.5);
            return `<text x="-${Math.floor(diag / 2)}" y="${offset}" textLength="${Math.floor(diag)}" lengthAdjust="spacing">PREVIEW PREVIEW PREVIEW</text>`;
          }).join("\n")}
        </g>
      </svg>
    `);

    watermarked = await image
      .composite([{ input: watermarkSvg, blend: "over" }])
      .webp({ quality: 82 })
      .toBuffer();
  } catch (err) {
    console.error("sharp error:", err);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }

  // ── Upload to Supabase Storage ─────────────────────────────────────────────
  const randomId = crypto.randomUUID();
  const path = `${profile.id}/${randomId}.webp`;

  const { error: uploadError } = await supabase.storage
    .from(PREVIEW_BUCKET)
    .upload(path, watermarked, {
      contentType: "image/webp",
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json({ error: "Failed to upload preview" }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(PREVIEW_BUCKET).getPublicUrl(path);

  return NextResponse.json({ path, publicUrl: urlData.publicUrl });
}
