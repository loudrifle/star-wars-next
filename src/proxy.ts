import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/profile")) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg$).*)"],
};
