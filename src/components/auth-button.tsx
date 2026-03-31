"use client";

import { LogIn, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { serverSignOut } from "@/actions/auth";
import { SignOutButton } from "@/components/sign-out-button";
import type { Session } from "@/lib/auth";

export function AuthButton({ session }: { session: Session | null }) {
  const pathname = usePathname();

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-sm text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)] transition-colors"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={24}
              height={24}
              className="rounded-full border border-[var(--color-sw-border)]"
            />
          ) : (
            <User size={16} />
          )}
          <span className="hidden md:inline">{session.user.name}</span>
        </Link>
        <form action={serverSignOut}>
          <SignOutButton
            iconSize={14}
            className="flex items-center gap-1 text-xs text-[var(--color-sw-muted)] hover:text-[var(--color-sw-red)] transition-colors"
            labelClassName="hidden md:inline"
          />
        </form>
      </div>
    );
  }

  const callbackUrl =
    pathname !== "/sign-in" ? `?callbackUrl=${encodeURIComponent(pathname)}` : "";

  return (
    <Link
      href={`/sign-in${callbackUrl}`}
      className="flex items-center gap-1.5 border border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-all px-3 py-1.5 rounded text-sm font-[var(--font-bebas)] tracking-wider"
    >
      <LogIn size={14} />
      Sign In
    </Link>
  );
}
