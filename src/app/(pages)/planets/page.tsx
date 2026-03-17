import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/search-bar";
import { getAllPlanets } from "@/lib/queries";
import { fmt } from "@/lib/utils";

export const metadata: Metadata = { title: "Planets" };

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function PlanetsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const allPlanets = await getAllPlanets(q);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader title="Planets" subtitle="Worlds of the Star Wars galaxy" count={allPlanets.length} />
      <div className="mb-6">
        <Suspense><SearchBar placeholder="Search planets..." /></Suspense>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {allPlanets.map((planet) => (
          <Link key={planet.id} href={`/planets/${planet.id}`}>
            <article className="entity-card p-5 h-full flex flex-col gap-3 cursor-pointer group">
              <h2
                className="text-[var(--color-sw-gold)] group-hover:text-[var(--color-sw-gold-dim)] transition-colors"
                style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "1.7rem", letterSpacing: "0.08em" }}
              >
                {planet.name}
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
                <Stat label="Climate" value={fmt(planet.climate)} />
                <Stat label="Terrain" value={fmt(planet.terrain)} />
                <Stat label="Population" value={fmt(planet.population)} />
                <Stat label="Diameter" value={fmt(planet.diameter)} />
              </div>
            </article>
          </Link>
        ))}
        {allPlanets.length === 0 && (
          <p className="col-span-full text-center text-[var(--color-sw-muted)] py-12">No planets found{q ? ` for "${q}"` : ""}.</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-sw-muted)] uppercase tracking-widest" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>{label}</p>
      <p className="text-sm text-[var(--color-sw-text)] truncate">{value}</p>
    </div>
  );
}
