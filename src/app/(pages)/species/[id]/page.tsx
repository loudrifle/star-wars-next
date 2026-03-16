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
import { getSpeciesById } from "@/lib/queries";
import { toRoman } from "@/lib/utils";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = await getSpeciesById(parseInt(id));
  return { title: s?.name ?? "Species" };
}

export default async function SpeciesDetailPage({ params }: Props) {
  const { id } = await params;
  const speciesId = parseInt(id);
  const spec = await getSpeciesById(speciesId);
  if (!spec) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const [favorited, ratingStats, userRating] = await Promise.all([
    userId ? isFavorited(userId, "species", speciesId) : false,
    getEntityRatingStats("species", speciesId),
    userId ? getUserRating(userId, "species", speciesId) : null,
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="flex items-center gap-2 text-xs text-[var(--color-sw-muted)] mb-6">
        <Link href="/species" className="hover:text-[var(--color-sw-gold)] transition-colors">Species</Link>
        <span>/</span>
        <span className="text-[var(--color-sw-text)]">{spec.name}</span>
      </nav>

      <h1 className="text-[var(--color-sw-gold)] mb-4 leading-none" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "3.5rem", letterSpacing: "0.08em" }}>
        {spec.name}
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FavoriteButton entityType="species" entityId={speciesId} initialFavorited={favorited} />
        <RatingWidget entityType="species" entityId={speciesId} initialScore={userRating?.score ?? null} average={ratingStats.average} count={ratingStats.count} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded mb-8">
        <StatItem label="Classification" value={spec.classification} />
        <StatItem label="Designation" value={spec.designation} />
        <StatItem label="Avg. Height" value={spec.averageHeight !== "unknown" ? `${spec.averageHeight} cm` : "unknown"} />
        <StatItem label="Avg. Lifespan" value={spec.averageLifespan !== "unknown" ? `${spec.averageLifespan} yrs` : "unknown"} />
        <StatItem label="Language" value={spec.language} />
        <StatItem label="Eye Colors" value={spec.eyeColors} />
        <StatItem label="Hair Colors" value={spec.hairColors} />
        <StatItem label="Skin Colors" value={spec.skinColors} />
        {spec.homeworld && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-[var(--font-bebas)] tracking-[0.15em] text-[var(--color-sw-muted)] uppercase">Homeworld</span>
            <Link href={`/planets/${spec.homeworld.id}`} className="text-sm text-[var(--color-sw-blue)] hover:text-[var(--color-sw-gold)] transition-colors">
              {spec.homeworld.name}
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {spec.members.length > 0 && (
          <section className="p-4 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Known Members ({spec.members.length})</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {spec.members.map((c) => (
                <Link key={c.id} href={`/characters/${c.id}`}>
                  <Badge className="hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-colors cursor-pointer">{c.name}</Badge>
                </Link>
              ))}
            </div>
          </section>
        )}
        {spec.films.length > 0 && (
          <section className="p-4 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Films</SectionTitle>
            <div className="flex flex-col gap-1.5">
              {spec.films.map((f) => (
                <Link key={f.id} href={`/films/${f.id}`} className="flex items-center gap-2 text-sm text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)] transition-colors">
                  <span className="text-[var(--color-sw-border)] font-mono text-xs">{toRoman(f.episodeId)}</span>
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
    <h3 className="text-[var(--color-sw-gold-dim)] mb-3" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.15em", fontSize: "0.85rem" }}>
      {children}
    </h3>
  );
}
