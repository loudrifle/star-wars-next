import {
  Car,
  Clapperboard,
  Dna,
  Globe,
  Heart,
  Rocket,
  Search,
  Star,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Home — Galaxy Explorer" };

const SECTIONS = [
  {
    href: "/films",
    icon: Clapperboard,
    label: "Films",
    description: "The complete saga from Episode I to VI. Cast, directors, opening crawls and all connected entities.",
  },
  {
    href: "/characters",
    icon: Users,
    label: "Characters",
    description: "Over 80 characters with photos, stats and relationships. From Skywalker to Jabba the Hutt.",
  },
  {
    href: "/planets",
    icon: Globe,
    label: "Planets",
    description: "Every world in the galaxy — terrain, climate, population and the films they appear in.",
  },
  {
    href: "/species",
    icon: Dna,
    label: "Species",
    description: "Human, Wookiee, Hutt and beyond. Discover the classification, language and homeworld of each species.",
  },
  {
    href: "/starships",
    icon: Rocket,
    label: "Starships",
    description: "From the Millennium Falcon to Star Destroyers — speed, crew, hyperdrive rating and more.",
  },
  {
    href: "/vehicles",
    icon: Car,
    label: "Vehicles",
    description: "AT-AT, Speeder Bikes, X-wings on land — every ground and atmospheric vehicle catalogued.",
  },
];

const FEATURES = [
  {
    icon: Search,
    label: "Real-time search",
    description: "Every list page has instant search — just start typing.",
  },
  {
    icon: Heart,
    label: "Favorites",
    description: "Save your favourite characters, ships and more. Requires login.",
  },
  {
    icon: Star,
    label: "Ratings",
    description: "Rate any entity 1–5 stars and leave a review. Requires login.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Hero */}
      <div className="mb-16 text-center">
        <p
          className="text-[var(--color-sw-muted)] tracking-[0.3em] text-xl mb-4"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}
        >
          WELCOME TO
        </p>
        <h1
          className="text-[var(--color-sw-gold)] mb-6"
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue')",
            fontSize: "clamp(4rem, 10vw, 7rem)",
            letterSpacing: "0.1em",
            lineHeight: 1,
          }}
        >
          GALAXY EXPLORER
        </h1>
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, #c8a84b, transparent)",
            marginBottom: "1.5rem",
          }}
        />
        <p className="text-[var(--color-sw-text)] text-lg max-w-2xl mx-auto leading-relaxed opacity-80">
          A complete encyclopaedia of the Star Wars universe. Browse every film,
          character, planet, species, starship and vehicle from the saga —
          all interconnected and searchable.
        </p>
      </div>

      {/* Categories */}
      <div className="mb-16">
        <p
          className="text-[var(--color-sw-muted)] tracking-[0.25em] text-xl mb-6"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}
        >
          EXPLORE THE UNIVERSE
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS.map(({ href, icon: Icon, label, description }) => (
            <Link key={href} href={href}>
              <article className="entity-card p-7 h-full flex flex-col gap-4 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <Icon
                    size={22}
                    className="text-[var(--color-sw-gold-dim)] group-hover:text-[var(--color-sw-gold)] transition-colors shrink-0"
                  />
                  <h2
                    className="text-[var(--color-sw-gold)] group-hover:text-[var(--color-sw-gold-dim)] transition-colors"
                    style={{
                      fontFamily: "var(--font-bebas, 'Bebas Neue')",
                      fontSize: "1.8rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {label}
                  </h2>
                </div>
                <p className="text-[var(--color-sw-muted)] text-base leading-relaxed">
                  {description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <p
          className="text-[var(--color-sw-muted)] tracking-[0.25em] text-xl mb-6"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}
        >
          FEATURES
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, label, description }) => (
            <div
              key={label}
              className="border border-[var(--color-sw-border)] rounded-lg p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-[var(--color-sw-gold-dim)]" />
                <span
                  className="text-[var(--color-sw-text)] text-base"
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue')",
                    letterSpacing: "0.1em",
                  }}
                >
                  {label}
                </span>
              </div>
              <p className="text-[var(--color-sw-muted)] text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
