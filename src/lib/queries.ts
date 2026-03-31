import { and, asc, avg, count, desc, eq, inArray, like, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  characters,
  characterSpecies,
  characterStarships,
  characterVehicles,
  favorites,
  filmCharacters,
  filmPlanets,
  films,
  filmSpecies,
  filmStarships,
  filmVehicles,
  planets,
  ratings,
  species,
  starships,
  user,
  vehicles,
} from "@/db/schema";
import type { EntityType } from "@/types";

import { DEFAULT_PAGE_SIZE } from "./constants";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Films ─────────────────────────────────────────────────────────────────────

export async function getAllFilms() {
  return db.select().from(films).orderBy(asc(films.episodeId)).all();
}

export async function getFilmById(id: number) {
  const film = await db.select().from(films).where(eq(films.id, id)).get();
  if (!film) return null;

  const [filmChars, filmPlanetsData, filmSpeciesData, filmShips, filmVehiclesData] =
    await Promise.all([
      db
        .select({ character: characters })
        .from(filmCharacters)
        .innerJoin(characters, eq(filmCharacters.characterId, characters.id))
        .where(eq(filmCharacters.filmId, id))
        .orderBy(asc(characters.name))
        .all(),
      db
        .select({ planet: planets })
        .from(filmPlanets)
        .innerJoin(planets, eq(filmPlanets.planetId, planets.id))
        .where(eq(filmPlanets.filmId, id))
        .orderBy(asc(planets.name))
        .all(),
      db
        .select({ species: species })
        .from(filmSpecies)
        .innerJoin(species, eq(filmSpecies.speciesId, species.id))
        .where(eq(filmSpecies.filmId, id))
        .orderBy(asc(species.name))
        .all(),
      db
        .select({ starship: starships })
        .from(filmStarships)
        .innerJoin(starships, eq(filmStarships.starshipId, starships.id))
        .where(eq(filmStarships.filmId, id))
        .orderBy(asc(starships.name))
        .all(),
      db
        .select({ vehicle: vehicles })
        .from(filmVehicles)
        .innerJoin(vehicles, eq(filmVehicles.vehicleId, vehicles.id))
        .where(eq(filmVehicles.filmId, id))
        .orderBy(asc(vehicles.name))
        .all(),
    ]);

  return {
    ...film,
    characters: filmChars.map((r) => r.character),
    planets: filmPlanetsData.map((r) => r.planet),
    species: filmSpeciesData.map((r) => r.species),
    starships: filmShips.map((r) => r.starship),
    vehicles: filmVehiclesData.map((r) => r.vehicle),
  };
}

// ── Characters ────────────────────────────────────────────────────────────────

export async function getAllCharacters(
  search?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<typeof characters.$inferSelect>> {
  const where = search ? like(characters.name, `%${search}%`) : undefined;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    db.select().from(characters).where(where).orderBy(asc(characters.name)).limit(pageSize).offset(offset).all(),
    db.select({ total: count() }).from(characters).where(where).get(),
  ]);

  const total = countResult?.total ?? 0;
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getCharacterById(id: number) {
  const character = await db
    .select()
    .from(characters)
    .where(eq(characters.id, id))
    .get();
  if (!character) return null;

  const [homeworld, charSpecies, charVehicles, charStarships, charFilms] =
    await Promise.all([
      character.homeworldId
        ? db
            .select()
            .from(planets)
            .where(eq(planets.id, character.homeworldId))
            .get()
        : null,
      db
        .select({ species: species })
        .from(characterSpecies)
        .innerJoin(species, eq(characterSpecies.speciesId, species.id))
        .where(eq(characterSpecies.characterId, id))
        .all(),
      db
        .select({ vehicle: vehicles })
        .from(characterVehicles)
        .innerJoin(vehicles, eq(characterVehicles.vehicleId, vehicles.id))
        .where(eq(characterVehicles.characterId, id))
        .all(),
      db
        .select({ starship: starships })
        .from(characterStarships)
        .innerJoin(starships, eq(characterStarships.starshipId, starships.id))
        .where(eq(characterStarships.characterId, id))
        .all(),
      db
        .select({ film: films })
        .from(filmCharacters)
        .innerJoin(films, eq(filmCharacters.filmId, films.id))
        .where(eq(filmCharacters.characterId, id))
        .orderBy(asc(films.episodeId))
        .all(),
    ]);

  return {
    ...character,
    homeworld,
    species: charSpecies.map((r) => r.species),
    vehicles: charVehicles.map((r) => r.vehicle),
    starships: charStarships.map((r) => r.starship),
    films: charFilms.map((r) => r.film),
  };
}

// ── Planets ───────────────────────────────────────────────────────────────────

export async function getAllPlanets(
  search?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<typeof planets.$inferSelect>> {
  const where = search ? like(planets.name, `%${search}%`) : undefined;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    db.select().from(planets).where(where).orderBy(asc(planets.name)).limit(pageSize).offset(offset).all(),
    db.select({ total: count() }).from(planets).where(where).get(),
  ]);

  const total = countResult?.total ?? 0;
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getPlanetById(id: number) {
  const planet = await db
    .select()
    .from(planets)
    .where(eq(planets.id, id))
    .get();
  if (!planet) return null;

  const [residents, planetFilms, planetSpecies] = await Promise.all([
    db
      .select()
      .from(characters)
      .where(eq(characters.homeworldId, id))
      .orderBy(asc(characters.name))
      .all(),
    db
      .select({ film: films })
      .from(filmPlanets)
      .innerJoin(films, eq(filmPlanets.filmId, films.id))
      .where(eq(filmPlanets.planetId, id))
      .orderBy(asc(films.episodeId))
      .all(),
    db
      .select()
      .from(species)
      .where(eq(species.homeworldId, id))
      .all(),
  ]);

  return {
    ...planet,
    residents,
    films: planetFilms.map((r) => r.film),
    species: planetSpecies,
  };
}

// ── Species ───────────────────────────────────────────────────────────────────

export async function getAllSpecies(
  search?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<typeof species.$inferSelect>> {
  const where = search ? like(species.name, `%${search}%`) : undefined;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    db.select().from(species).where(where).orderBy(asc(species.name)).limit(pageSize).offset(offset).all(),
    db.select({ total: count() }).from(species).where(where).get(),
  ]);

  const total = countResult?.total ?? 0;
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getSpeciesById(id: number) {
  const spec = await db
    .select()
    .from(species)
    .where(eq(species.id, id))
    .get();
  if (!spec) return null;

  const [homeworld, members, specFilms] = await Promise.all([
    spec.homeworldId
      ? db.select().from(planets).where(eq(planets.id, spec.homeworldId)).get()
      : null,
    db
      .select({ character: characters })
      .from(characterSpecies)
      .innerJoin(characters, eq(characterSpecies.characterId, characters.id))
      .where(eq(characterSpecies.speciesId, id))
      .orderBy(asc(characters.name))
      .all(),
    db
      .select({ film: films })
      .from(filmSpecies)
      .innerJoin(films, eq(filmSpecies.filmId, films.id))
      .where(eq(filmSpecies.speciesId, id))
      .orderBy(asc(films.episodeId))
      .all(),
  ]);

  return {
    ...spec,
    homeworld,
    members: members.map((r) => r.character),
    films: specFilms.map((r) => r.film),
  };
}

// ── Starships ─────────────────────────────────────────────────────────────────

export async function getAllStarships(
  search?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<typeof starships.$inferSelect>> {
  const where = search ? like(starships.name, `%${search}%`) : undefined;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    db.select().from(starships).where(where).orderBy(asc(starships.name)).limit(pageSize).offset(offset).all(),
    db.select({ total: count() }).from(starships).where(where).get(),
  ]);

  const total = countResult?.total ?? 0;
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getStarshipById(id: number) {
  const ship = await db
    .select()
    .from(starships)
    .where(eq(starships.id, id))
    .get();
  if (!ship) return null;

  const [pilots, shipFilms] = await Promise.all([
    db
      .select({ character: characters })
      .from(characterStarships)
      .innerJoin(characters, eq(characterStarships.characterId, characters.id))
      .where(eq(characterStarships.starshipId, id))
      .orderBy(asc(characters.name))
      .all(),
    db
      .select({ film: films })
      .from(filmStarships)
      .innerJoin(films, eq(filmStarships.filmId, films.id))
      .where(eq(filmStarships.starshipId, id))
      .orderBy(asc(films.episodeId))
      .all(),
  ]);

  return {
    ...ship,
    pilots: pilots.map((r) => r.character),
    films: shipFilms.map((r) => r.film),
  };
}

// ── Vehicles ──────────────────────────────────────────────────────────────────

export async function getAllVehicles(
  search?: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<typeof vehicles.$inferSelect>> {
  const where = search ? like(vehicles.name, `%${search}%`) : undefined;
  const offset = (page - 1) * pageSize;

  const [data, countResult] = await Promise.all([
    db.select().from(vehicles).where(where).orderBy(asc(vehicles.name)).limit(pageSize).offset(offset).all(),
    db.select({ total: count() }).from(vehicles).where(where).get(),
  ]);

  const total = countResult?.total ?? 0;
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getVehicleById(id: number) {
  const vehicle = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))
    .get();
  if (!vehicle) return null;

  const [pilots, vehicleFilms] = await Promise.all([
    db
      .select({ character: characters })
      .from(characterVehicles)
      .innerJoin(characters, eq(characterVehicles.characterId, characters.id))
      .where(eq(characterVehicles.vehicleId, id))
      .orderBy(asc(characters.name))
      .all(),
    db
      .select({ film: films })
      .from(filmVehicles)
      .innerJoin(films, eq(filmVehicles.filmId, films.id))
      .where(eq(filmVehicles.vehicleId, id))
      .orderBy(asc(films.episodeId))
      .all(),
  ]);

  return {
    ...vehicle,
    pilots: pilots.map((r) => r.character),
    films: vehicleFilms.map((r) => r.film),
  };
}

// ── Favorites ─────────────────────────────────────────────────────────────────

export async function getUserFavorites(userId: string) {
  return db.select().from(favorites).where(eq(favorites.userId, userId)).all();
}

export async function isFavorited(
  userId: string,
  entityType: EntityType,
  entityId: number
): Promise<boolean> {
  const result = await db
    .select()
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.entityType, entityType),
        eq(favorites.entityId, entityId)
      )
    )
    .get();
  return !!result;
}

// ── Ratings ───────────────────────────────────────────────────────────────────

export async function getEntityRatingStats(
  entityType: EntityType,
  entityId: number
) {
  const result = await db
    .select({
      avg: avg(ratings.score),
      count: count(ratings.id),
    })
    .from(ratings)
    .where(
      and(
        eq(ratings.entityType, entityType),
        eq(ratings.entityId, entityId)
      )
    )
    .get();

  return {
    average: result?.avg ? parseFloat(result.avg) : null,
    count: result?.count ?? 0,
  };
}

export async function getUserRating(
  userId: string,
  entityType: EntityType,
  entityId: number
) {
  return db
    .select()
    .from(ratings)
    .where(
      and(
        eq(ratings.userId, userId),
        eq(ratings.entityType, entityType),
        eq(ratings.entityId, entityId)
      )
    )
    .get();
}

// ── Community ratings (public leaderboard) ────────────────────────────────────

export interface RatedEntity {
  entityType: string;
  entityId: number;
  avgScore: number;
  ratingCount: number;
  name: string;
}

export async function getTopRatedEntities(limit = 5): Promise<RatedEntity[]> {
  const entityTypes: EntityType[] = ["character", "film", "planet", "species", "starship", "vehicle"];

  const perTypeResults = await Promise.all(
    entityTypes.map((entityType) =>
      db
        .select({
          entityType: ratings.entityType,
          entityId: ratings.entityId,
          avgScore: avg(ratings.score),
          ratingCount: count(ratings.id),
        })
        .from(ratings)
        .where(eq(ratings.entityType, entityType))
        .groupBy(ratings.entityId)
        .having(sql`count(${ratings.id}) >= 1`)
        .orderBy(desc(avg(ratings.score)), desc(count(ratings.id)))
        .limit(limit)
        .all()
    )
  );

  const charIds = perTypeResults[0].map((r) => r.entityId);
  const filmIds = perTypeResults[1].map((r) => r.entityId);
  const planetIds = perTypeResults[2].map((r) => r.entityId);
  const speciesIds = perTypeResults[3].map((r) => r.entityId);
  const starshipIds = perTypeResults[4].map((r) => r.entityId);
  const vehicleIds = perTypeResults[5].map((r) => r.entityId);

  const [charNames, filmNames, planetNames, speciesNames, starshipNames, vehicleNames] =
    await Promise.all([
      charIds.length ? db.select({ id: characters.id, name: characters.name }).from(characters).where(inArray(characters.id, charIds)).all() : [],
      filmIds.length ? db.select({ id: films.id, name: films.title }).from(films).where(inArray(films.id, filmIds)).all() : [],
      planetIds.length ? db.select({ id: planets.id, name: planets.name }).from(planets).where(inArray(planets.id, planetIds)).all() : [],
      speciesIds.length ? db.select({ id: species.id, name: species.name }).from(species).where(inArray(species.id, speciesIds)).all() : [],
      starshipIds.length ? db.select({ id: starships.id, name: starships.name }).from(starships).where(inArray(starships.id, starshipIds)).all() : [],
      vehicleIds.length ? db.select({ id: vehicles.id, name: vehicles.name }).from(vehicles).where(inArray(vehicles.id, vehicleIds)).all() : [],
    ]);

  const nameMaps = [
    new Map(charNames.map((r) => [r.id, r.name])),
    new Map(filmNames.map((r) => [r.id, r.name])),
    new Map(planetNames.map((r) => [r.id, r.name])),
    new Map(speciesNames.map((r) => [r.id, r.name])),
    new Map(starshipNames.map((r) => [r.id, r.name])),
    new Map(vehicleNames.map((r) => [r.id, r.name])),
  ];

  return entityTypes.flatMap((entityType, i) =>
    perTypeResults[i].map((entry) => ({
      entityType,
      entityId: entry.entityId,
      avgScore: entry.avgScore ? parseFloat(entry.avgScore) : 0,
      ratingCount: entry.ratingCount,
      name: nameMaps[i].get(entry.entityId) ?? `#${entry.entityId}`,
    }))
  );
}

// ── Admin stats ───────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [ratingsTotal, favoritesTotal, activeUsersResult, totalUsersResult, topEntitiesRaw] =
    await Promise.all([
      db.select({ total: count() }).from(ratings).get(),
      db.select({ total: count() }).from(favorites).get(),
      db.select({ total: sql<number>`count(distinct ${ratings.userId})` }).from(ratings).get(),
      db.select({ total: count() }).from(user).get(),
      db
        .select({
          entityType: ratings.entityType,
          entityId: ratings.entityId,
          avgScore: avg(ratings.score),
          ratingCount: count(ratings.id),
        })
        .from(ratings)
        .groupBy(ratings.entityType, ratings.entityId)
        .orderBy(desc(avg(ratings.score)), desc(count(ratings.id)))
        .limit(30)
        .all(),
    ]);

  // Batch name lookup
  const allIds = (type: string) => topEntitiesRaw.filter((r) => r.entityType === type).map((r) => r.entityId);
  const charIds = allIds("character");
  const filmIds = allIds("film");
  const planetIds = allIds("planet");
  const speciesIds = allIds("species");
  const starshipIds = allIds("starship");
  const vehicleIds = allIds("vehicle");

  const [charNames, filmNames, planetNames, speciesNames, starshipNames, vehicleNames] =
    await Promise.all([
      charIds.length ? db.select({ id: characters.id, name: characters.name }).from(characters).where(inArray(characters.id, charIds)).all() : [],
      filmIds.length ? db.select({ id: films.id, name: films.title }).from(films).where(inArray(films.id, filmIds)).all() : [],
      planetIds.length ? db.select({ id: planets.id, name: planets.name }).from(planets).where(inArray(planets.id, planetIds)).all() : [],
      speciesIds.length ? db.select({ id: species.id, name: species.name }).from(species).where(inArray(species.id, speciesIds)).all() : [],
      starshipIds.length ? db.select({ id: starships.id, name: starships.name }).from(starships).where(inArray(starships.id, starshipIds)).all() : [],
      vehicleIds.length ? db.select({ id: vehicles.id, name: vehicles.name }).from(vehicles).where(inArray(vehicles.id, vehicleIds)).all() : [],
    ]);

  const nameMap = new Map<string, Map<number, string>>([
    ["character", new Map(charNames.map((r) => [r.id, r.name]))],
    ["film", new Map(filmNames.map((r) => [r.id, r.name]))],
    ["planet", new Map(planetNames.map((r) => [r.id, r.name]))],
    ["species", new Map(speciesNames.map((r) => [r.id, r.name]))],
    ["starship", new Map(starshipNames.map((r) => [r.id, r.name]))],
    ["vehicle", new Map(vehicleNames.map((r) => [r.id, r.name]))],
  ]);

  const topEntities = topEntitiesRaw.map((entry) => ({
    entityType: entry.entityType,
    entityId: entry.entityId,
    avgScore: entry.avgScore ? parseFloat(entry.avgScore) : 0,
    ratingCount: entry.ratingCount,
    name: nameMap.get(entry.entityType)?.get(entry.entityId) ?? `#${entry.entityId}`,
  }));

  return {
    totalRatings: ratingsTotal?.total ?? 0,
    totalFavorites: favoritesTotal?.total ?? 0,
    activeUsers: Number(activeUsersResult?.total ?? 0),
    totalUsers: totalUsersResult?.total ?? 0,
    topEntities,
  };
}
