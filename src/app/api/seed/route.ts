// Disable TLS verification for SWAPI (self-signed cert workaround)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  characters,
  characterSpecies,
  characterStarships,
  characterVehicles,
  filmCharacters,
  filmPlanets,
  films,
  filmSpecies,
  filmStarships,
  filmVehicles,
  planets,
  species,
  starships,
  vehicles,
} from "@/db/schema";
import { extractSwapiId } from "@/lib/utils";
import type {
  AkababCharacter,
  SwapiFilm,
  SwapiPage,
  SwapiPerson,
  SwapiPlanet,
  SwapiSpecies,
  SwapiStarship,
  SwapiVehicle,
} from "@/types";

// Allow up to 5 minutes for the seed to complete
export const maxDuration = 300;

const BASE = "https://swapi.dev/api";

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  const results: T[] = [];
  let url: string | null = `${BASE}/${endpoint}/`;
  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = (await res.json()) as SwapiPage<T>;
    results.push(...data.results);
    url = data.next;
  }
  return results;
}

// SWAPI name → akabab name overrides (typos / slight differences between APIs)
const NAME_OVERRIDES: Record<string, string> = {
  "ratts tyerel": "ratts tyerell",
};

async function fetchAkababImages(): Promise<Map<string, string>> {
  const res = await fetch(
    "https://akabab.github.io/starwars-api/api/all.json"
  );
  if (!res.ok) return new Map();
  const data = (await res.json()) as AkababCharacter[];
  const map = new Map<string, string>();
  for (const c of data) {
    map.set(c.name.toLowerCase().trim(), c.image);
  }
  return map;
}

function lookupImage(name: string, map: Map<string, string>): string | null {
  const key = name.toLowerCase().trim();
  return map.get(NAME_OVERRIDES[key] ?? key) ?? null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  try {
    // ── 1. Fetch everything from SWAPI + akabab in parallel ──────────────────
    const [
      rawFilms,
      rawPeople,
      rawPlanets,
      rawSpecies,
      rawStarships,
      rawVehicles,
      imageMap,
    ] = await Promise.all([
      fetchAll<SwapiFilm>("films"),
      fetchAll<SwapiPerson>("people"),
      fetchAll<SwapiPlanet>("planets"),
      fetchAll<SwapiSpecies>("species"),
      fetchAll<SwapiStarship>("starships"),
      fetchAll<SwapiVehicle>("vehicles"),
      fetchAkababImages(),
    ]);

    // ── 2. Upsert planets ────────────────────────────────────────────────────
    for (const p of rawPlanets) {
      await db
        .insert(planets)
        .values({
          id: extractSwapiId(p.url),
          name: p.name,
          diameter: p.diameter,
          climate: p.climate,
          gravity: p.gravity,
          terrain: p.terrain,
          surfaceWater: p.surface_water,
          population: p.population,
          swapiUrl: p.url,
          cachedAt: now,
        })
        .onConflictDoUpdate({
          target: planets.id,
          set: { name: p.name, cachedAt: now },
        });
    }

    // ── 3. Upsert species ────────────────────────────────────────────────────
    for (const s of rawSpecies) {
      await db
        .insert(species)
        .values({
          id: extractSwapiId(s.url),
          name: s.name,
          classification: s.classification,
          designation: s.designation,
          averageHeight: s.average_height,
          skinColors: s.skin_colors,
          hairColors: s.hair_colors,
          eyeColors: s.eye_colors,
          averageLifespan: s.average_lifespan,
          language: s.language,
          homeworldId: s.homeworld ? extractSwapiId(s.homeworld) : null,
          swapiUrl: s.url,
          cachedAt: now,
        })
        .onConflictDoUpdate({
          target: species.id,
          set: { name: s.name, cachedAt: now },
        });
    }

    // ── 4. Upsert starships ──────────────────────────────────────────────────
    for (const s of rawStarships) {
      await db
        .insert(starships)
        .values({
          id: extractSwapiId(s.url),
          name: s.name,
          model: s.model,
          manufacturer: s.manufacturer,
          costInCredits: s.cost_in_credits,
          length: s.length,
          maxAtmospheringSpeed: s.max_atmosphering_speed,
          crew: s.crew,
          passengers: s.passengers,
          cargoCapacity: s.cargo_capacity,
          consumables: s.consumables,
          hyperdriveRating: s.hyperdrive_rating,
          mglt: s.MGLT,
          starshipClass: s.starship_class,
          swapiUrl: s.url,
          cachedAt: now,
        })
        .onConflictDoUpdate({
          target: starships.id,
          set: { name: s.name, cachedAt: now },
        });
    }

    // ── 5. Upsert vehicles ───────────────────────────────────────────────────
    for (const v of rawVehicles) {
      await db
        .insert(vehicles)
        .values({
          id: extractSwapiId(v.url),
          name: v.name,
          model: v.model,
          manufacturer: v.manufacturer,
          costInCredits: v.cost_in_credits,
          length: v.length,
          maxAtmospheringSpeed: v.max_atmosphering_speed,
          crew: v.crew,
          passengers: v.passengers,
          cargoCapacity: v.cargo_capacity,
          consumables: v.consumables,
          vehicleClass: v.vehicle_class,
          swapiUrl: v.url,
          cachedAt: now,
        })
        .onConflictDoUpdate({
          target: vehicles.id,
          set: { name: v.name, cachedAt: now },
        });
    }

    // ── 6. Upsert characters (with image matching) ───────────────────────────
    for (const p of rawPeople) {
      const imageUrl = lookupImage(p.name, imageMap);
      await db
        .insert(characters)
        .values({
          id: extractSwapiId(p.url),
          name: p.name,
          birthYear: p.birth_year,
          eyeColor: p.eye_color,
          gender: p.gender,
          hairColor: p.hair_color,
          height: p.height,
          mass: p.mass,
          skinColor: p.skin_color,
          homeworldId: p.homeworld ? extractSwapiId(p.homeworld) : null,
          imageUrl,
          swapiUrl: p.url,
          cachedAt: now,
        })
        .onConflictDoUpdate({
          target: characters.id,
          set: { name: p.name, imageUrl, cachedAt: now },
        });

      // character ↔ species
      for (const sUrl of p.species) {
        await db
          .insert(characterSpecies)
          .values({
            characterId: extractSwapiId(p.url),
            speciesId: extractSwapiId(sUrl),
          })
          .onConflictDoNothing();
      }

      // character ↔ vehicles
      for (const vUrl of p.vehicles) {
        await db
          .insert(characterVehicles)
          .values({
            characterId: extractSwapiId(p.url),
            vehicleId: extractSwapiId(vUrl),
          })
          .onConflictDoNothing();
      }

      // character ↔ starships
      for (const sUrl of p.starships) {
        await db
          .insert(characterStarships)
          .values({
            characterId: extractSwapiId(p.url),
            starshipId: extractSwapiId(sUrl),
          })
          .onConflictDoNothing();
      }
    }

    // ── 7. Upsert films + all junction tables ────────────────────────────────
    for (const f of rawFilms) {
      const filmId = extractSwapiId(f.url);
      await db
        .insert(films)
        .values({
          id: filmId,
          title: f.title,
          episodeId: f.episode_id,
          openingCrawl: f.opening_crawl,
          director: f.director,
          producer: f.producer,
          releaseDate: f.release_date,
          swapiUrl: f.url,
          cachedAt: now,
        })
        .onConflictDoUpdate({
          target: films.id,
          set: { title: f.title, cachedAt: now },
        });

      for (const cUrl of f.characters) {
        await db
          .insert(filmCharacters)
          .values({ filmId, characterId: extractSwapiId(cUrl) })
          .onConflictDoNothing();
      }
      for (const pUrl of f.planets) {
        await db
          .insert(filmPlanets)
          .values({ filmId, planetId: extractSwapiId(pUrl) })
          .onConflictDoNothing();
      }
      for (const sUrl of f.species) {
        await db
          .insert(filmSpecies)
          .values({ filmId, speciesId: extractSwapiId(sUrl) })
          .onConflictDoNothing();
      }
      for (const sUrl of f.starships) {
        await db
          .insert(filmStarships)
          .values({ filmId, starshipId: extractSwapiId(sUrl) })
          .onConflictDoNothing();
      }
      for (const vUrl of f.vehicles) {
        await db
          .insert(filmVehicles)
          .values({ filmId, vehicleId: extractSwapiId(vUrl) })
          .onConflictDoNothing();
      }
    }

    return NextResponse.json({
      ok: true,
      counts: {
        films: rawFilms.length,
        characters: rawPeople.length,
        planets: rawPlanets.length,
        species: rawSpecies.length,
        starships: rawStarships.length,
        vehicles: rawVehicles.length,
      },
    });
  } catch (err) {
    console.error("[seed]", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
