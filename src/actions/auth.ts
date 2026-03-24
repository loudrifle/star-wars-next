"use server";

import { headers } from "next/headers";

import { signOut } from "@/lib/auth";

/** Protected routes: after sign-out the user can't stay there. */
const PROTECTED_ROUTES = ["/profile"];

export async function serverSignOut() {
  const headersList = await headers();
  const referer = headersList.get("referer");

  let redirectTo = "/home";
  if (referer) {
    const { pathname } = new URL(referer);
    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    redirectTo = isProtected ? "/home" : pathname;
  }

  await signOut({ redirectTo });
}
