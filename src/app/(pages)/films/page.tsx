import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { getAllFilms } from "@/lib/queries";
import { toRoman } from "@/lib/utils";

export const metadata: Metadata = { title: "Films" };

export default async function FilmsPage() {
  const allFilms = await getAllFilms();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        title="Films"
        subtitle="The complete Star Wars saga"
        count={allFilms.length}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allFilms.map((film) => (
          <Link key={film.id} href={`/films/${film.id}`}>
            <article className="entity-card p-5 h-full flex flex-col gap-3 cursor-pointer group">
              {/* Episode */}
              <p
                className="text-[var(--color-sw-muted)] text-xs tracking-[0.2em]"
                style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}
              >
                EPISODE {toRoman(film.episodeId)}
              </p>

              {/* Title */}
              <h2
                className="text-[var(--color-sw-gold)] leading-tight group-hover:text-[var(--color-sw-gold-dim)] transition-colors"
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue')",
                  fontSize: "2rem",
                  letterSpacing: "0.08em",
                }}
              >
                {film.title}
              </h2>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-[var(--color-sw-muted)] mt-auto pt-3 border-t border-[var(--color-sw-border)]">
                <span>{film.director}</span>
                <span className="ml-auto">{film.releaseDate.slice(0, 4)}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
