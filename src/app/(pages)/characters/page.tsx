import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCharacters } from "@/lib/queries";
import { fmt } from "@/lib/utils";

export const metadata: Metadata = { title: "Characters" };

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function CharactersPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const allCharacters = await getAllCharacters(q);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <PageHeader
        title="Characters"
        subtitle="Every person in the Star Wars saga"
        count={allCharacters.length}
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
                  <Image
                    src={character.imageUrl}
                    alt={character.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
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
                className="text-[var(--color-sw-text)] text-sm leading-tight group-hover:text-[var(--color-sw-gold)] transition-colors"
                style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.05em" }}
              >
                {character.name}
              </h2>

              {/* Birth year */}
              <p className="text-[10px] text-[var(--color-sw-muted)] mt-auto">
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
    </div>
  );
}
