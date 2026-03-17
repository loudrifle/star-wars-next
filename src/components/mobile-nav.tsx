"use client";

import { LogIn, LogOut, Menu, User, X } from "lucide-react";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: readonly NavLink[];
  session: Session | null;
}

export function MobileNav({ links, session }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)] transition-colors p-1 cursor-pointer"
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-18 left-0 right-0 bg-[var(--color-sw-dark)] border-b border-[var(--color-sw-border)] py-5 px-6 flex flex-col gap-4">
          {/* Nav links */}
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`font-[var(--font-bebas)] tracking-wider text-base transition-colors ${
                pathname.startsWith(href)
                  ? "text-[var(--color-sw-gold)]"
                  : "text-[var(--color-sw-muted)]"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-[var(--color-sw-border)]" />

          {/* Auth */}
          {session?.user ? (
            <div className="flex items-center justify-between">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
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
                <span>{session.user.name}</span>
              </Link>
              <button
                onClick={() => { void signOut(); setOpen(false); }}
                className="flex items-center gap-1 text-xs text-[var(--color-sw-muted)] hover:text-[var(--color-sw-red)] transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { void signIn("github"); setOpen(false); }}
              className="flex items-center gap-1.5 border border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-all px-3 py-2 rounded text-sm font-[var(--font-bebas)] tracking-wider cursor-pointer w-fit"
            >
              <LogIn size={14} />
              Sign in
            </button>
          )}
        </div>
      )}
    </div>
  );
}
