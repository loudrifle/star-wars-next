"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/** Protected routes: after sign-out the user can't stay there. */
const PROTECTED_ROUTES = ["/profile"];

export async function serverSignOut() {
  const h = await headers();
  const referer = h.get("referer");

  let redirectTo = "/home";
  if (referer) {
    const { pathname } = new URL(referer);
    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    redirectTo = isProtected ? "/home" : pathname;
  }

  await auth.api.signOut({ headers: h });
  redirect(redirectTo);
}
