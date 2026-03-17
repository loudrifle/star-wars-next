import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/search-bar";
import { getAllVehicles } from "@/lib/queries";
import { fmt } from "@/lib/utils";

export const metadata: Metadata = { title: "Vehicles" };

interface Props { searchParams: Promise<{ q?: string }> }

export default async function VehiclesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const allVehicles = await getAllVehicles(q);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader title="Vehicles" subtitle="Ground and atmospheric craft of the saga" count={allVehicles.length} />
      <div className="mb-6">
        <Suspense><SearchBar placeholder="Search vehicles..." /></Suspense>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allVehicles.map((v) => (
          <Link key={v.id} href={`/vehicles/${v.id}`}>
            <article className="entity-card p-4 h-full flex flex-col gap-2 cursor-pointer group">
              <h2 className="text-[var(--color-sw-gold)] group-hover:text-[var(--color-sw-gold-dim)] transition-colors" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "1.3rem", letterSpacing: "0.08em" }}>
                {v.name}
              </h2>
              <p className="text-xs text-[var(--color-sw-muted)] italic">{v.model}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-auto pt-2 border-t border-[var(--color-sw-border)]">
                <Stat label="Class" value={fmt(v.vehicleClass)} />
                <Stat label="Max Speed" value={fmt(v.maxAtmospheringSpeed)} />
                <Stat label="Crew" value={fmt(v.crew)} />
                <Stat label="Passengers" value={fmt(v.passengers)} />
              </div>
            </article>
          </Link>
        ))}
        {allVehicles.length === 0 && (
          <p className="col-span-full text-center text-[var(--color-sw-muted)] py-12">No vehicles found{q ? ` for "${q}"` : ""}.</p>
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
