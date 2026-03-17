"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

export function NavLinks({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-5">
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`relative text-sm font-[var(--font-bebas)] tracking-[0.15em] transition-colors ${
              active
                ? "text-[var(--color-sw-gold)]"
                : "text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)]"
            }`}
          >
            {label}
            {active && (
              <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-[var(--color-sw-gold)] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
