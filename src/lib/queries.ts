import { and, asc, avg, count, eq, like } from "drizzle-orm";

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
  vehicles,
} from "@/db/schema";
import type { EntityType } from "@/types";

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

export async function getAllCharacters(search?: string) {
  if (search) {
    return db
      .select()
      .from(characters)
      .where(like(characters.name, `%${search}%`))
      .orderBy(asc(characters.name))
      .all();
  }
  return db.select().from(characters).orderBy(asc(characters.name)).all();
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

export async function getAllPlanets(search?: string) {
  if (search) {
    return db
      .select()
      .from(planets)
      .where(like(planets.name, `%${search}%`))
      .orderBy(asc(planets.name))
      .all();
  }
  return db.select().from(planets).orderBy(asc(planets.name)).all();
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

export async function getAllSpecies(search?: string) {
  if (search) {
    return db
      .select()
      .from(species)
      .where(like(species.name, `%${search}%`))
      .orderBy(asc(species.name))
      .all();
  }
  return db.select().from(species).orderBy(asc(species.name)).all();
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

export async function getAllStarships(search?: string) {
  if (search) {
    return db
      .select()
      .from(starships)
      .where(like(starships.name, `%${search}%`))
      .orderBy(asc(starships.name))
      .all();
  }
  return db.select().from(starships).orderBy(asc(starships.name)).all();
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

export async function getAllVehicles(search?: string) {
  if (search) {
    return db
      .select()
      .from(vehicles)
      .where(like(vehicles.name, `%${search}%`))
      .orderBy(asc(vehicles.name))
      .all();
  }
  return db.select().from(vehicles).orderBy(asc(vehicles.name)).all();
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
