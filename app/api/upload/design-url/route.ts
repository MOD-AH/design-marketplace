import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const DESIGN_BUCKET = "designs";

const ALLOWED_EXTENSIONS = new Set([
  "svg", "ai", "pdf", "png", "zip", "eps", "psd", "sketch", "fig", "xd",
]);

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

// GET /api/upload/design-url?filename=&size=&type=
// Returns a Supabase signed upload URL so the client can PUT the file
// directly to Storage without routing 50 MB through the server.
export async function GET(request: Request) {
  const uid = cookies().get("firebase-session")?.value;
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") ?? "";
  const size = Number(searchParams.get("size") ?? "0");
  const mimeType = searchParams.get("type") ?? "application/octet-stream";

  // ── Validate ──────────────────────────────────────────────────────────────
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `File type .${ext} is not allowed. Accepted: ${Array.from(ALLOWED_EXTENSIONS).join(", ")}` },
      { status: 400 }
    );
  }

  if (size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `File too large. Maximum size is 50 MB.` },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // ── Verify seller exists ──────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_seller")
    .eq("firebase_uid", uid)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 403 });
  }

  // ── Generate upload path ──────────────────────────────────────────────────
  const randomId = crypto.randomUUID();
  const path = `${profile.id}/${randomId}.${ext}`;

  const { data, error } = await supabase.storage
    .from(DESIGN_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data) {
    console.error("createSignedUploadUrl error:", error);
    return NextResponse.json({ error: "Could not create upload URL" }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    mimeType,
  });
}
