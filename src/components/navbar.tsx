import Link from "next/link";

import { auth } from "@/lib/auth";

import { AuthButton } from "./auth-button";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/home"
          className="font-[var(--font-bebas)] text-2xl tracking-[0.15em] text-[var(--color-sw-gold)] hover:opacity-80 transition-opacity shrink-0"
        >
          ★ GALAXY EXPLORER
        </Link>

        {/* Desktop nav */}
        <NavLinks links={NAV_LINKS} />

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <AuthButton session={session} />
          </div>
          <MobileNav links={NAV_LINKS} session={session} />
        </div>
      </div>
    </header>
  );
}
