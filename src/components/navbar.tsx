import { Menu } from "lucide-react";
import Link from "next/link";

import { auth } from "@/lib/auth";

import { AuthButton } from "./auth-button";
import { MobileNav } from "./mobile-nav";

const NAV_LINKS = [
  { href: "/films", label: "Films" },
  { href: "/characters", label: "Characters" },
  { href: "/planets", label: "Planets" },
  { href: "/species", label: "Species" },
  { href: "/starships", label: "Starships" },
  { href: "/vehicles", label: "Vehicles" },
] as const;

export async function Navbar() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-sw-border)] bg-[var(--color-sw-black)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-[var(--font-bebas)] text-xl tracking-[0.15em] text-[var(--color-sw-gold)] hover:opacity-80 transition-opacity shrink-0"
        >
          ★ GALAXY EXPLORER
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-[var(--font-bebas)] tracking-[0.15em] text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <AuthButton session={session} />
          {/* Mobile hamburger */}
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
