"use client";

import { LogIn, LogOut, User } from "lucide-react";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function AuthButton({ session }: { session: Session | null }) {
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
              alt={session.user.name ?? "User"}
              width={24}
              height={24}
              className="rounded-full border border-[var(--color-sw-border)]"
            />
          ) : (
            <User size={16} />
          )}
          <span className="hidden md:inline">{session.user.name}</span>
        </Link>
        <button
          onClick={() => void signOut()}
          className="flex items-center gap-1 text-xs text-[var(--color-sw-muted)] hover:text-[var(--color-sw-red)] transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut size={14} />
          <span className="hidden md:inline">Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => void signIn("github")}
      className="flex items-center gap-1.5 border border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-all px-3 py-1.5 rounded text-sm font-[var(--font-bebas)] tracking-wider cursor-pointer"
    >
      <LogIn size={14} />
      Sign in
    </button>
  );
}
