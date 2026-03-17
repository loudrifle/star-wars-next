import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isFavorited } from "@/actions/favorites";
import { getEntityRatingStats, getUserRating } from "@/actions/ratings";
import { FavoriteButton } from "@/components/favorite-button";
import { RatingWidget } from "@/components/rating-widget";
import { StatItem } from "@/components/stat-item";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { getPlanetById } from "@/lib/queries";
import { toRoman } from "@/lib/utils";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const planet = await getPlanetById(parseInt(id));
  return { title: planet?.name ?? "Planet" };
}

export default async function PlanetDetailPage({ params }: Props) {
  const { id } = await params;
  const planetId = parseInt(id);
  const planet = await getPlanetById(planetId);
  if (!planet) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const [favorited, ratingStats, userRating] = await Promise.all([
    userId ? isFavorited(userId, "planet", planetId) : false,
    getEntityRatingStats("planet", planetId),
    userId ? getUserRating(userId, "planet", planetId) : null,
  ]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-base text-[var(--color-sw-muted)] mb-6">
        <Link href="/planets" className="hover:text-[var(--color-sw-gold)] transition-colors">Planets</Link>
        <span>/</span>
        <span className="text-[var(--color-sw-text)]">{planet.name}</span>
      </nav>

      <h1 className="text-[var(--color-sw-gold)] mb-4 leading-none" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "4.5rem", letterSpacing: "0.08em" }}>
        {planet.name}
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FavoriteButton entityType="planet" entityId={planetId} initialFavorited={favorited} />
        <RatingWidget entityType="planet" entityId={planetId} initialScore={userRating?.score ?? null} average={ratingStats.average} count={ratingStats.count} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded mb-8">
        <StatItem label="Climate" value={planet.climate} />
        <StatItem label="Terrain" value={planet.terrain} />
        <StatItem label="Diameter" value={planet.diameter !== "unknown" ? `${planet.diameter} km` : "unknown"} />
        <StatItem label="Gravity" value={planet.gravity} />
        <StatItem label="Surface Water" value={planet.surfaceWater !== "unknown" ? `${planet.surfaceWater}%` : "unknown"} />
        <StatItem label="Population" value={planet.population} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {planet.residents.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Residents ({planet.residents.length})</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {planet.residents.map((c) => (
                <Link key={c.id} href={`/characters/${c.id}`}>
                  <Badge className="hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-colors cursor-pointer">{c.name}</Badge>
                </Link>
              ))}
            </div>
          </section>
        )}
        {planet.films.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Films</SectionTitle>
            <div className="flex flex-col gap-1.5">
              {planet.films.map((f) => (
                <Link key={f.id} href={`/films/${f.id}`} className="flex items-center gap-2 text-base text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)] transition-colors">
                  <span className="text-[var(--color-sw-gold-dim)] font-mono text-sm">{toRoman(f.episodeId)}</span>
                  {f.title}
                </Link>
              ))}
            </div>
          </section>
        )}
        {planet.species.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Native Species</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {planet.species.map((s) => (
                <Link key={s.id} href={`/species/${s.id}`}>
                  <Badge variant="gold">{s.name}</Badge>
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
