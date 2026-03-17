import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/search-bar";
import { getAllSpecies } from "@/lib/queries";
import { fmt } from "@/lib/utils";

export const metadata: Metadata = { title: "Species" };

interface Props { searchParams: Promise<{ q?: string }> }

export default async function SpeciesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const allSpecies = await getAllSpecies(q);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader title="Species" subtitle="Lifeforms across the galaxy" count={allSpecies.length} />
      <div className="mb-6">
        <Suspense><SearchBar placeholder="Search species..." /></Suspense>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allSpecies.map((s) => (
          <Link key={s.id} href={`/species/${s.id}`}>
            <article className="entity-card p-4 h-full flex flex-col gap-2 cursor-pointer group">
              <h2 className="text-[var(--color-sw-gold)] group-hover:text-[var(--color-sw-gold-dim)] transition-colors" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "1.4rem", letterSpacing: "0.08em" }}>
                {s.name}
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <Stat label="Classification" value={fmt(s.classification)} />
                <Stat label="Designation" value={fmt(s.designation)} />
                <Stat label="Avg. Lifespan" value={fmt(s.averageLifespan)} />
                <Stat label="Language" value={fmt(s.language)} />
              </div>
            </article>
          </Link>
        ))}
        {allSpecies.length === 0 && (
          <p className="col-span-full text-center text-[var(--color-sw-muted)] py-12">No species found{q ? ` for "${q}"` : ""}.</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] text-[var(--color-sw-muted)] uppercase tracking-widest" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>{label}</p>
      <p className="text-xs text-[var(--color-sw-text)] truncate">{value}</p>
    </div>
  );
}
