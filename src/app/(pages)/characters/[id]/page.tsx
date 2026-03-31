import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CharacterImage } from "@/components/character-image";
import { FavoriteButton } from "@/components/favorite-button";
import { RatingWidget } from "@/components/rating-widget";
import { StatItem } from "@/components/stat-item";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { getEntityRatingStats, getUserRating, isFavorited } from "@/lib/queries";
import { getCharacterById } from "@/lib/queries";
import { toRoman } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacterById(parseInt(id));
  const name = character?.name ?? "Character";
  const description = character
    ? `${name} — born ${character.birthYear}, ${character.gender} character from the Star Wars universe.`
    : "Star Wars character profile on Galaxy Explorer.";
  return {
    title: name,
    description,
    openGraph: { title: `${name} | Galaxy Explorer`, description, type: "article" },
    twitter: { card: "summary", title: `${name} | Galaxy Explorer`, description },
  };
}

export default async function CharacterDetailPage({ params }: Props) {
  const { id } = await params;
  const charId = parseInt(id);
  const character = await getCharacterById(charId);
  if (!character) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const [favorited, ratingStats, userRating] = await Promise.all([
    userId ? isFavorited(userId, "character", charId) : false,
    getEntityRatingStats("character", charId),
    userId ? getUserRating(userId, "character", charId) : null,
  ]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-base text-[var(--color-sw-muted)] mb-6">
        <Link href="/characters" className="hover:text-[var(--color-sw-gold)] transition-colors">
          Characters
        </Link>
        <span>/</span>
        <span className="text-[var(--color-sw-text)]">{character.name}</span>
      </nav>

      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Portrait */}
        <div className="shrink-0 w-64 mx-auto md:mx-0 self-stretch">
          <div className="h-full min-h-[16rem] rounded-lg overflow-hidden bg-[var(--color-sw-card)] border border-[var(--color-sw-border)]">
            {character.imageUrl ? (
              <CharacterImage src={character.imageUrl} alt={character.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span
                  style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "4rem", color: "var(--color-sw-border)" }}
                >
                  ?
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1
            className="text-[var(--color-sw-gold)] mb-4 leading-none"
            style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "4.5rem", letterSpacing: "0.08em" }}
          >
            {character.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <FavoriteButton entityType="character" entityId={charId} initialFavorited={favorited} />
            <RatingWidget
              entityType="character"
              entityId={charId}
              initialScore={userRating?.score ?? null}
              average={ratingStats.average}
              count={ratingStats.count}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <StatItem label="Birth Year" value={character.birthYear} />
            <StatItem label="Gender" value={character.gender} />
            <StatItem label="Height" value={character.height !== "unknown" ? `${character.height} cm` : "unknown"} />
            <StatItem label="Mass" value={character.mass !== "unknown" ? `${character.mass} kg` : "unknown"} />
            <StatItem label="Hair Color" value={character.hairColor} />
            <StatItem label="Eye Color" value={character.eyeColor} />
            <StatItem label="Skin Color" value={character.skinColor} />
            {character.homeworld && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-[var(--font-bebas)] tracking-[0.15em] text-[var(--color-sw-muted)] uppercase">
                  Homeworld
                </span>
                <Link
                  href={`/planets/${character.homeworld.id}`}
                  className="text-sm text-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-colors"
                >
                  {character.homeworld.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {character.films.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Films</SectionTitle>
            <div className="flex flex-col gap-1.5">
              {character.films.map((film) => (
                <Link key={film.id} href={`/films/${film.id}`} className="flex items-center gap-2 text-base text-[var(--color-sw-muted)] hover:text-[var(--color-sw-gold)] transition-colors">
                  <span className="text-[var(--color-sw-gold-dim)] font-mono text-sm">
                    {toRoman(film.episodeId)}
                  </span>
                  {film.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {character.species.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Species</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {character.species.map((s) => (
                <Link key={s.id} href={`/species/${s.id}`}>
                  <Badge variant="gold">{s.name}</Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {character.starships.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Starships</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {character.starships.map((s) => (
                <Link key={s.id} href={`/starships/${s.id}`}>
                  <Badge>{s.name}</Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {character.vehicles.length > 0 && (
          <section className="p-6 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
            <SectionTitle>Vehicles</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {character.vehicles.map((v) => (
                <Link key={v.id} href={`/vehicles/${v.id}`}>
                  <Badge>{v.name}</Badge>
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
    <h3
      className="text-[var(--color-sw-gold-dim)] mb-3"
      style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.15em", fontSize: "1.1rem" }}
    >
      {children}
    </h3>
  );
}
