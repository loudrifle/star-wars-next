import { NextRequest, NextResponse } from "next/server";

// Cookie names used by Better Auth (dev vs prod/HTTPS)
const SESSION_COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"];

const PROTECTED_PATHS = ["/profile", "/admin"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));
    if (!hasSession) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg$).*)"],
};
