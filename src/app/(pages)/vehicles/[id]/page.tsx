import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/favorite-button";
import { RatingWidget } from "@/components/rating-widget";
import { StatItem } from "@/components/stat-item";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { getEntityRatingStats, getUserRating, isFavorited } from "@/lib/queries";
import { getVehicleById } from "@/lib/queries";
import { toRoman } from "@/lib/utils";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const v = await getVehicleById(parseInt(id));
  const name = v?.name ?? "Vehicle";
  const description = v
    ? `${name} — ${v.vehicleClass} class vehicle. Max speed: ${v.maxAtmospheringSpeed}, crew: ${v.crew}.`
    : "Star Wars vehicle on Galaxy Explorer.";
  return {
    title: name,
    description,
    openGraph: { title: `${name} | Galaxy Explorer`, description, type: "article" },
    twitter: { card: "summary", title: `${name} | Galaxy Explorer`, description },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;
  const vehicleId = parseInt(id);
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const [favorited, ratingStats, userRating] = await Promise.all([
    userId ? isFavorited(userId, "vehicle", vehicleId) : false,
    getEntityRatingStats("vehicle", vehicleId),
    userId ? getUserRating(userId, "vehicle", vehicleId) : null,
  ]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-base text-[var(--color-sw-muted)] mb-6">
        <Link href="/vehicles" className="hover:text-[var(--color-sw-gold)] transition-colors">Vehicles</Link>
        <span>/</span>
        <span className="text-[var(--color-sw-text)]">{vehicle.name}</span>
      </nav>

      <h1 className="text-[var(--color-sw-gold)] mb-1 leading-none" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "4.5rem", letterSpacing: "0.08em" }}>
        {vehicle.name}
      </h1>
      <p className="text-[var(--color-sw-muted)] italic text-base mb-4">{vehicle.model}</p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FavoriteButton entityType="vehicle" entityId={vehicleId} initialFavorited={favorited} />
        <RatingWidget entityType="vehicle" entityId={vehicleId} initialScore={userRating?.score ?? null} average={ratingStats.average} count={ratingStats.count} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded mb-8">
        <StatItem label="Manufacturer" value={vehicle.manufacturer} />
        <StatItem label="Class" value={vehicle.vehicleClass} />
        <StatItem label="Length" value={vehicle.length !== "unknown" ? `${vehicle.length} m` : "unknown"} />
        <StatItem label="Max Speed" value={vehicle.maxAtmospheringSpeed} />
        <StatItem label="Crew" value={vehicle.crew} />
        <StatItem label="Passengers" value={vehicle.passengers} />
        <StatItem label="Cargo Capacity" value={vehicle.cargoCapacity} />
        <StatItem label="Cost" value={vehicle.costInCredits !== "unknown" ? `${vehicle.costInCredits} credits` : "unknown"} />
        <StatItem label="Consumables" value={vehicle.consumables} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {vehicle.pilots.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Known Pilots</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {vehicle.pilots.map((c) => (
                <Link key={c.id} href={`/characters/${c.id}`}>
                  <Badge className="hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-colors cursor-pointer">{c.name}</Badge>
                </Link>
              ))}
            </div>
          </section>
        )}
        {vehicle.films.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Films</SectionTitle>
            <div className="flex flex-col gap-1.5">
              {vehicle.films.map((f) => (
                <Link key={f.id} href={`/films/${f.id}`} className="flex items-center gap-2 text-base text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)] transition-colors">
                  <span className="text-[var(--color-sw-gold-dim)] font-mono text-sm">{toRoman(f.episodeId)}</span>
                  {f.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[var(--color-sw-gold-dim)] mb-3" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.15em", fontSize: "1.1rem" }}>
      {children}
    </h3>
  );
}
