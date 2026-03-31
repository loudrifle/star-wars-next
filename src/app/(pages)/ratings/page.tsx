import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { ENTITY_LABELS, ENTITY_PATHS } from "@/lib/constants";
import { getTopRatedEntities } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Community Ratings",
  description: "See which Star Wars characters, films, planets and more are rated highest by the Galaxy Explorer community.",
};

const STAR_COUNT = 5;

function Stars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: STAR_COUNT }).map((_, i) => {
        const filled = i < Math.round(score);
        return (
          <span
            key={i}
            className={filled ? "text-[var(--color-sw-gold)]" : "text-[var(--color-sw-border)]"}
            style={{ fontSize: "0.85rem" }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default async function RatingsPage() {
  const topEntities = await getTopRatedEntities(10);

  const grouped = topEntities.reduce<Record<string, typeof topEntities>>((acc, entity) => {
    if (!acc[entity.entityType]) acc[entity.entityType] = [];
    acc[entity.entityType].push(entity);
    return acc;
  }, {});

  const orderedTypes = ["character", "film", "planet", "species", "starship", "vehicle"] as const;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader
        title="Community Ratings"
        subtitle="Top-rated entries across the galaxy"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {orderedTypes.map((type) => {
          const entries = grouped[type];
          if (!entries?.length) return null;

          return (
            <section key={type}>
              <h2
                className="text-[var(--color-sw-gold)] mb-4"
                style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "1.5rem", letterSpacing: "0.1em" }}
              >
                {ENTITY_LABELS[type]}
              </h2>

              <ol className="flex flex-col gap-2">
                {entries.map((entry, rank) => (
                  <li key={entry.entityId}>
                    <Link href={`${ENTITY_PATHS[type]}/${entry.entityId}`}>
                      <div className="entity-card px-4 py-3 flex items-center gap-4 group cursor-pointer">
                        <span
                          className="text-[var(--color-sw-muted)] shrink-0 w-6 text-right"
                          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "1.1rem" }}
                        >
                          {rank + 1}
                        </span>

                        <span
                          className="flex-1 text-[var(--color-sw-text)] group-hover:text-[var(--color-sw-gold)] transition-colors truncate"
                          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "1.1rem", letterSpacing: "0.05em" }}
                        >
                          {entry.name}
                        </span>

                        <div className="flex items-center gap-3 shrink-0">
                          <Stars score={entry.avgScore} />
                          <span className="text-sm font-medium text-[var(--color-sw-gold)]">
                            {entry.avgScore.toFixed(1)}
                          </span>
                          <span className="text-xs text-[var(--color-sw-muted)]">
                            ({entry.ratingCount})
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      {Object.keys(grouped).length === 0 && (
        <p className="text-center text-[var(--color-sw-muted)] py-20">
          No ratings yet — explore the galaxy and leave your first review!
        </p>
      )}
    </div>
  );
}
