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
import { getFilmById } from "@/lib/queries";
import { toRoman } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const film = await getFilmById(parseInt(id));
  return { title: film?.title ?? "Film" };
}

export default async function FilmDetailPage({ params }: Props) {
  const { id } = await params;
  const filmId = parseInt(id);
  const film = await getFilmById(filmId);
  if (!film) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const [favorited, ratingStats, userRating] = await Promise.all([
    userId ? isFavorited(userId, "film", filmId) : false,
    getEntityRatingStats("film", filmId),
    userId ? getUserRating(userId, "film", filmId) : null,
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--color-sw-muted)] mb-6">
        <Link href="/films" className="hover:text-[var(--color-sw-gold)] transition-colors">
          Films
        </Link>
        <span>/</span>
        <span className="text-[var(--color-sw-text)]">{film.title}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <p
          className="text-[var(--color-sw-muted)] mb-2"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.25em", fontSize: "0.8rem" }}
        >
          EPISODE {toRoman(film.episodeId)}
        </p>
        <h1
          className="text-[var(--color-sw-gold)] mb-4 leading-none"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "4rem", letterSpacing: "0.08em" }}
        >
          {film.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <FavoriteButton entityType="film" entityId={filmId} initialFavorited={favorited} />
          <RatingWidget
            entityType="film"
            entityId={filmId}
            initialScore={userRating?.score ?? null}
            average={ratingStats.average}
            count={ratingStats.count}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
          <StatItem label="Director" value={film.director} raw />
          <StatItem label="Producer" value={film.producer} raw />
          <StatItem label="Release Date" value={film.releaseDate} raw />
          <StatItem label="Episode" value={`Episode ${toRoman(film.episodeId)}`} raw />
        </div>
      </div>

      {/* Opening crawl */}
      <section className="mb-10 p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
        <h2
          className="text-[var(--color-sw-gold-dim)] mb-4"
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.2em", fontSize: "1rem" }}
        >
          OPENING CRAWL
        </h2>
        <p className="text-[var(--color-sw-muted)] text-sm leading-relaxed whitespace-pre-wrap">
          {film.openingCrawl}
        </p>
      </section>

      {/* Related entities grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RelatedSection title="Characters" items={film.characters} basePath="/characters" />
        <RelatedSection title="Planets" items={film.planets} basePath="/planets" />
        <RelatedSection title="Species" items={film.species} basePath="/species" />
        <RelatedSection title="Starships" items={film.starships} basePath="/starships" />
        <RelatedSection title="Vehicles" items={film.vehicles} basePath="/vehicles" />
      </div>
    </div>
  );
}

function RelatedSection({
  title,
  items,
  basePath,
}: {
  title: string;
  items: { id: number; name: string }[];
  basePath: string;
}) {
  if (!items.length) return null;
  return (
    <section className="p-4 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
      <h3
        className="text-[var(--color-sw-gold-dim)] mb-3"
        style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.15em", fontSize: "0.9rem" }}
      >
        {title} ({items.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link key={item.id} href={`${basePath}/${item.id}`}>
            <Badge variant="default" className="hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-colors cursor-pointer">
              {item.name}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
