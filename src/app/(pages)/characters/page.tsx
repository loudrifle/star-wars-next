import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CharacterImage } from "@/components/character-image";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { getAllCharacters } from "@/lib/queries";
import { fmt } from "@/lib/utils";

export const metadata: Metadata = { title: "Characters" };

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function CharactersPage({ searchParams }: Props) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1") || 1);
  const { data: allCharacters, total, totalPages } = await getAllCharacters(q, page);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        title="Characters"
        subtitle="Every person in the Star Wars saga"
        count={total}
      />

      <div className="mb-6">
        <Suspense>
          <SearchBar placeholder="Search characters..." />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {allCharacters.map((character) => (
          <Link key={character.id} href={`/characters/${character.id}`}>
            <article className="entity-card p-3 flex flex-col gap-2 cursor-pointer group h-full">
              {/* Image */}
              <div className="aspect-square rounded overflow-hidden bg-[var(--color-sw-dark)] border border-[var(--color-sw-border)] mb-1">
                {character.imageUrl ? (
                  <CharacterImage src={character.imageUrl} alt={character.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--color-sw-muted)]">
                    <span
                      style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "2rem", opacity: 0.3 }}
                    >
                      ?
                    </span>
                  </div>
                )}
              </div>

              {/* Name */}
              <h2
                className="text-[var(--color-sw-text)] text-base leading-tight group-hover:text-[var(--color-sw-gold)] transition-colors"
                style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.05em" }}
              >
                {character.name}
              </h2>

              {/* Birth year */}
              <p className="text-xs text-[var(--color-sw-muted)] mt-auto">
                {fmt(character.birthYear)}
              </p>
            </article>
          </Link>
        ))}

        {allCharacters.length === 0 && (
          <p className="col-span-full text-center text-[var(--color-sw-muted)] py-12">
            No characters found{q ? ` for "${q}"` : ""}.
          </p>
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} searchParams={{ q }} />
    </div>
  );
}
