import { integer,primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ==================== AUTH TABLES ====================

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const sessions = sqliteTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// ==================== SWAPI CACHE TABLES ====================

export const films = sqliteTable("films", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  episodeId: integer("episode_id").notNull(),
  openingCrawl: text("opening_crawl").notNull(),
  director: text("director").notNull(),
  producer: text("producer").notNull(),
  releaseDate: text("release_date").notNull(),
  swapiUrl: text("swapi_url").notNull().unique(),
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});

export const planets = sqliteTable("planets", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  diameter: text("diameter").notNull(),
  climate: text("climate").notNull(),
  gravity: text("gravity").notNull(),
  terrain: text("terrain").notNull(),
  surfaceWater: text("surface_water").notNull(),
  population: text("population").notNull(),
  swapiUrl: text("swapi_url").notNull().unique(),
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});

export const species = sqliteTable("species", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  classification: text("classification").notNull(),
  designation: text("designation").notNull(),
  averageHeight: text("average_height").notNull(),
  skinColors: text("skin_colors").notNull(),
  hairColors: text("hair_colors").notNull(),
  eyeColors: text("eye_colors").notNull(),
  averageLifespan: text("average_lifespan").notNull(),
  language: text("language").notNull(),
  homeworldId: integer("homeworld_id").references(() => planets.id),
  swapiUrl: text("swapi_url").notNull().unique(),
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});

export const characters = sqliteTable("characters", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  birthYear: text("birth_year").notNull(),
  eyeColor: text("eye_color").notNull(),
  gender: text("gender").notNull(),
  hairColor: text("hair_color").notNull(),
  height: text("height").notNull(),
  mass: text("mass").notNull(),
  skinColor: text("skin_color").notNull(),
  homeworldId: integer("homeworld_id").references(() => planets.id),
  imageUrl: text("image_url"),
  swapiUrl: text("swapi_url").notNull().unique(),
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});

export const starships = sqliteTable("starships", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  manufacturer: text("manufacturer").notNull(),
  costInCredits: text("cost_in_credits").notNull(),
  length: text("length").notNull(),
  maxAtmospheringSpeed: text("max_atmosphering_speed").notNull(),
  crew: text("crew").notNull(),
  passengers: text("passengers").notNull(),
  cargoCapacity: text("cargo_capacity").notNull(),
  consumables: text("consumables").notNull(),
  hyperdriveRating: text("hyperdrive_rating").notNull(),
  mglt: text("mglt").notNull(),
  starshipClass: text("starship_class").notNull(),
  swapiUrl: text("swapi_url").notNull().unique(),
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});

export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  manufacturer: text("manufacturer").notNull(),
  costInCredits: text("cost_in_credits").notNull(),
  length: text("length").notNull(),
  maxAtmospheringSpeed: text("max_atmosphering_speed").notNull(),
  crew: text("crew").notNull(),
  passengers: text("passengers").notNull(),
  cargoCapacity: text("cargo_capacity").notNull(),
  consumables: text("consumables").notNull(),
  vehicleClass: text("vehicle_class").notNull(),
  swapiUrl: text("swapi_url").notNull().unique(),
  cachedAt: integer("cached_at", { mode: "timestamp" }).notNull(),
});

// ==================== JUNCTION TABLES ====================

export const filmCharacters = sqliteTable(
  "film_characters",
  {
    filmId: integer("film_id")
      .notNull()
      .references(() => films.id, { onDelete: "cascade" }),
    characterId: integer("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.filmId, t.characterId] })]
);

export const filmPlanets = sqliteTable(
  "film_planets",
  {
    filmId: integer("film_id")
      .notNull()
      .references(() => films.id, { onDelete: "cascade" }),
    planetId: integer("planet_id")
      .notNull()
      .references(() => planets.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.filmId, t.planetId] })]
);

export const filmSpecies = sqliteTable(
  "film_species",
  {
    filmId: integer("film_id")
      .notNull()
      .references(() => films.id, { onDelete: "cascade" }),
    speciesId: integer("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.filmId, t.speciesId] })]
);

export const filmVehicles = sqliteTable(
  "film_vehicles",
  {
    filmId: integer("film_id")
      .notNull()
      .references(() => films.id, { onDelete: "cascade" }),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.filmId, t.vehicleId] })]
);

export const filmStarships = sqliteTable(
  "film_starships",
  {
    filmId: integer("film_id")
      .notNull()
      .references(() => films.id, { onDelete: "cascade" }),
    starshipId: integer("starship_id")
      .notNull()
      .references(() => starships.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.filmId, t.starshipId] })]
);

export const characterSpecies = sqliteTable(
  "character_species",
  {
    characterId: integer("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    speciesId: integer("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.characterId, t.speciesId] })]
);

export const characterVehicles = sqliteTable(
  "character_vehicles",
  {
    characterId: integer("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.characterId, t.vehicleId] })]
);

export const characterStarships = sqliteTable(
  "character_starships",
  {
    characterId: integer("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    starshipId: integer("starship_id")
      .notNull()
      .references(() => starships.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.characterId, t.starshipId] })]
);

// ==================== USER DATA ====================

export type EntityType =
  | "character"
  | "film"
  | "planet"
  | "species"
  | "starship"
  | "vehicle";

export const favorites = sqliteTable("favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  entityType: text("entity_type").$type<EntityType>().notNull(),
  entityId: integer("entity_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const ratings = sqliteTable("ratings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  entityType: text("entity_type").$type<EntityType>().notNull(),
  entityId: integer("entity_id").notNull(),
  score: integer("score").notNull(), // 1–5
  review: text("review"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});
