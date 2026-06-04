import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "firebase-session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Decodes a Firebase ID token payload WITHOUT verifying the signature.
// The cookie it produces is used only as a UI routing guard in middleware.ts.
// Real authorization is enforced at the data layer via Supabase RLS +
// Firebase token verification using the authenticated Supabase client.
//
// PRODUCTION UPGRADE: swap this for firebase-admin's verifyIdToken() to get
// cryptographic verification before issuing the session cookie.
function extractUid(idToken: string): string | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;
    const padded = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(padded, "base64").toString("utf-8");
    const payload = JSON.parse(json) as Record<string, unknown>;
    return (payload["sub"] as string) ?? (payload["user_id"] as string) ?? null;
  } catch {
    return null;
  }
}

// POST /api/auth/session — called by AuthProvider after Firebase sign-in.
// Sets an httpOnly cookie containing the Firebase UID.
export async function POST(request: Request) {
  const body = (await request.json()) as { idToken?: unknown };

  if (typeof body.idToken !== "string" || !body.idToken) {
    return NextResponse.json({ error: "idToken is required" }, { status: 400 });
  }

  const uid = extractUid(body.idToken);
  if (!uid) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/auth/session — called by AuthProvider after Firebase sign-out.
export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
