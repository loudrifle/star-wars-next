import { eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import {
  characters,
  favorites,
  films,
  planets,
  ratings,
  species,
  starships,
  vehicles,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Profile" };

const ENTITY_LABELS: Record<string, string> = {
  character: "Characters",
  film: "Films",
  planet: "Planets",
  species: "Species",
  starship: "Starships",
  vehicle: "Vehicles",
};

const ENTITY_PATHS: Record<string, string> = {
  character: "/characters",
  film: "/films",
  planet: "/planets",
  species: "/species",
  starship: "/starships",
  vehicle: "/vehicles",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;

  const [userFavorites, userRatings] = await Promise.all([
    db.select().from(favorites).where(eq(favorites.userId, userId)).all(),
    db
      .select()
      .from(ratings)
      .where(eq(ratings.userId, userId))
      .orderBy(ratings.score)
      .all(),
  ]);

  // Collect entity IDs by type for batch name lookup
  const allIds = (list: { entityType: string; entityId: number }[], type: string) =>
    list.filter((r) => r.entityType === type).map((r) => r.entityId);

  const combined = [...userFavorites, ...userRatings];
  const charIds = allIds(combined, "character");
  const filmIds = allIds(combined, "film");
  const planetIds = allIds(combined, "planet");
  const speciesIds = allIds(combined, "species");
  const starshipIds = allIds(combined, "starship");
  const vehicleIds = allIds(combined, "vehicle");

  const [charNames, filmNames, planetNames, speciesNames, starshipNames, vehicleNames] =
    await Promise.all([
      charIds.length ? db.select({ id: characters.id, name: characters.name }).from(characters).where(inArray(characters.id, charIds)).all() : [],
      filmIds.length ? db.select({ id: films.id, name: films.title }).from(films).where(inArray(films.id, filmIds)).all() : [],
      planetIds.length ? db.select({ id: planets.id, name: planets.name }).from(planets).where(inArray(planets.id, planetIds)).all() : [],
      speciesIds.length ? db.select({ id: species.id, name: species.name }).from(species).where(inArray(species.id, speciesIds)).all() : [],
      starshipIds.length ? db.select({ id: starships.id, name: starships.name }).from(starships).where(inArray(starships.id, starshipIds)).all() : [],
      vehicleIds.length ? db.select({ id: vehicles.id, name: vehicles.name }).from(vehicles).where(inArray(vehicles.id, vehicleIds)).all() : [],
    ]);

  const nameMap: Record<string, Map<number, string>> = {
    character: new Map(charNames.map((r) => [r.id, r.name])),
    film: new Map(filmNames.map((r) => [r.id, r.name])),
    planet: new Map(planetNames.map((r) => [r.id, r.name])),
    species: new Map(speciesNames.map((r) => [r.id, r.name])),
    starship: new Map(starshipNames.map((r) => [r.id, r.name])),
    vehicle: new Map(vehicleNames.map((r) => [r.id, r.name])),
  };

  function entityName(type: string, id: number) {
    return nameMap[type]?.get(id) ?? `#${id}`;
  }

  // Group favorites by entity type
  const favoritesByType = userFavorites.reduce<
    Record<string, { id: number }[]>
  >((acc, fav) => {
    if (!acc[fav.entityType]) acc[fav.entityType] = [];
    acc[fav.entityType].push({ id: fav.entityId });
    return acc;
  }, {});

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* User card */}
      <div className="flex items-center gap-4 mb-8 p-5 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
            width={56}
            height={56}
            className="rounded-full border-2 border-[var(--color-sw-border)]"
          />
        )}
        <div>
          <h2
            className="text-[var(--color-sw-gold)]"
            style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", fontSize: "1.75rem", letterSpacing: "0.08em" }}
          >
            {session.user.name}
          </h2>
          <p className="text-xs text-[var(--color-sw-muted)]">{session.user.email}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[var(--color-sw-gold)] text-2xl" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>
            {userFavorites.length}
          </p>
          <p className="text-[10px] text-[var(--color-sw-muted)] uppercase tracking-widest">Favorites</p>
        </div>
        <div className="text-right">
          <p className="text-[var(--color-sw-gold)] text-2xl" style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')" }}>
            {userRatings.length}
          </p>
          <p className="text-[10px] text-[var(--color-sw-muted)] uppercase tracking-widest">Ratings</p>
        </div>
      </div>

      {/* Favorites */}
      <section className="mb-10">
        <PageHeader title="Favorites" />
        {userFavorites.length === 0 ? (
          <p className="text-[var(--color-sw-muted)] text-sm">
            No favorites yet. Browse the galaxy and save what you love!
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(favoritesByType).map(([type, items]) => (
              <div key={type} className="p-4 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded">
                <h3
                  className="text-[var(--color-sw-gold-dim)] mb-3"
                  style={{ fontFamily: "var(--font-bebas, 'Bebas Neue')", letterSpacing: "0.15em", fontSize: "0.85rem" }}
                >
                  {ENTITY_LABELS[type] ?? type} ({items.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Link key={item.id} href={`${ENTITY_PATHS[type] ?? ""}/${item.id}`}>
                      <Badge variant="gold" className="cursor-pointer">
                        {entityName(type, item.id)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ratings */}
      <section>
        <PageHeader title="My Ratings" />
        {userRatings.length === 0 ? (
          <p className="text-[var(--color-sw-muted)] text-sm">
            No ratings yet. Visit any entity page to rate it!
          </p>
        ) : (
          <div className="space-y-2">
            {userRatings.map((r) => (
              <Link
                key={r.id}
                href={`${ENTITY_PATHS[r.entityType] ?? ""}/${r.entityId}`}
                className="flex items-center gap-3 p-3 bg-[var(--color-sw-card)] border border-[var(--color-sw-border)] rounded hover:border-[var(--color-sw-gold-dim)] transition-colors"
              >
                <Badge>{ENTITY_LABELS[r.entityType] ?? r.entityType}</Badge>
                <span className="text-sm text-[var(--color-sw-text)]">{entityName(r.entityType, r.entityId)}</span>
                <div className="ml-auto flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= r.score ? "text-[var(--color-sw-gold)]" : "text-[var(--color-sw-border)]"}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
