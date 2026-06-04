import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The cookie is set by POST /api/auth/session after Firebase sign-in and
// cleared by DELETE /api/auth/session after sign-out (see AuthProvider.tsx).
const SESSION_COOKIE = "firebase-session";

// Redirect unauthenticated users to /login, preserving the intended destination
// in the `from` query param so the login page can redirect back after auth.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const uid = request.cookies.get(SESSION_COOKIE)?.value;

  if (!uid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on protected route segments.
  // Add more patterns here as the app grows (e.g. "/admin/:path*").
  matcher: ["/dashboard/:path*", "/seller/:path*"],
};
