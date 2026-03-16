"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

export function MobileNav({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)] transition-colors p-1"
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 bg-[var(--color-sw-dark)] border-b border-[var(--color-sw-border)] py-4 px-6 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`font-[var(--font-bebas)] tracking-wider text-sm transition-colors ${
                pathname.startsWith(href)
                  ? "text-[var(--color-sw-gold)]"
                  : "text-[var(--color-sw-muted)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
