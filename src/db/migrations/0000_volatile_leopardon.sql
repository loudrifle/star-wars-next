CREATE TABLE `accounts` (
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_species` (
	`character_id` integer NOT NULL,
	`species_id` integer NOT NULL,
	PRIMARY KEY(`character_id`, `species_id`),
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`species_id`) REFERENCES `species`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_starships` (
	`character_id` integer NOT NULL,
	`starship_id` integer NOT NULL,
	PRIMARY KEY(`character_id`, `starship_id`),
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`starship_id`) REFERENCES `starships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `character_vehicles` (
	`character_id` integer NOT NULL,
	`vehicle_id` integer NOT NULL,
	PRIMARY KEY(`character_id`, `vehicle_id`),
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`birth_year` text NOT NULL,
	`eye_color` text NOT NULL,
	`gender` text NOT NULL,
	`hair_color` text NOT NULL,
	`height` text NOT NULL,
	`mass` text NOT NULL,
	`skin_color` text NOT NULL,
	`homeworld_id` integer,
	`image_url` text,
	`swapi_url` text NOT NULL,
	`cached_at` integer NOT NULL,
	FOREIGN KEY (`homeworld_id`) REFERENCES `planets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `characters_swapi_url_unique` ON `characters` (`swapi_url`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `film_characters` (
	`film_id` integer NOT NULL,
	`character_id` integer NOT NULL,
	PRIMARY KEY(`film_id`, `character_id`),
	FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `film_planets` (
	`film_id` integer NOT NULL,
	`planet_id` integer NOT NULL,
	PRIMARY KEY(`film_id`, `planet_id`),
	FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`planet_id`) REFERENCES `planets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `film_species` (
	`film_id` integer NOT NULL,
	`species_id` integer NOT NULL,
	PRIMARY KEY(`film_id`, `species_id`),
	FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`species_id`) REFERENCES `species`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `film_starships` (
	`film_id` integer NOT NULL,
	`starship_id` integer NOT NULL,
	PRIMARY KEY(`film_id`, `starship_id`),
	FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`starship_id`) REFERENCES `starships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `film_vehicles` (
	`film_id` integer NOT NULL,
	`vehicle_id` integer NOT NULL,
	PRIMARY KEY(`film_id`, `vehicle_id`),
	FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `films` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`episode_id` integer NOT NULL,
	`opening_crawl` text NOT NULL,
	`director` text NOT NULL,
	`producer` text NOT NULL,
	`release_date` text NOT NULL,
	`swapi_url` text NOT NULL,
	`cached_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `films_swapi_url_unique` ON `films` (`swapi_url`);--> statement-breakpoint
CREATE TABLE `planets` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`diameter` text NOT NULL,
	`climate` text NOT NULL,
	`gravity` text NOT NULL,
	`terrain` text NOT NULL,
	`surface_water` text NOT NULL,
	`population` text NOT NULL,
	`swapi_url` text NOT NULL,
	`cached_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `planets_swapi_url_unique` ON `planets` (`swapi_url`);--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` integer NOT NULL,
	`score` integer NOT NULL,
	`review` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `species` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`classification` text NOT NULL,
	`designation` text NOT NULL,
	`average_height` text NOT NULL,
	`skin_colors` text NOT NULL,
	`hair_colors` text NOT NULL,
	`eye_colors` text NOT NULL,
	`average_lifespan` text NOT NULL,
	`language` text NOT NULL,
	`homeworld_id` integer,
	`swapi_url` text NOT NULL,
	`cached_at` integer NOT NULL,
	FOREIGN KEY (`homeworld_id`) REFERENCES `planets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `species_swapi_url_unique` ON `species` (`swapi_url`);--> statement-breakpoint
CREATE TABLE `starships` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`model` text NOT NULL,
	`manufacturer` text NOT NULL,
	`cost_in_credits` text NOT NULL,
	`length` text NOT NULL,
	`max_atmosphering_speed` text NOT NULL,
	`crew` text NOT NULL,
	`passengers` text NOT NULL,
	`cargo_capacity` text NOT NULL,
	`consumables` text NOT NULL,
	`hyperdrive_rating` text NOT NULL,
	`mglt` text NOT NULL,
	`starship_class` text NOT NULL,
	`swapi_url` text NOT NULL,
	`cached_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `starships_swapi_url_unique` ON `starships` (`swapi_url`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`email_verified` integer,
	`image` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`model` text NOT NULL,
	`manufacturer` text NOT NULL,
	`cost_in_credits` text NOT NULL,
	`length` text NOT NULL,
	`max_atmosphering_speed` text NOT NULL,
	`crew` text NOT NULL,
	`passengers` text NOT NULL,
	`cargo_capacity` text NOT NULL,
	`consumables` text NOT NULL,
	`vehicle_class` text NOT NULL,
	`swapi_url` text NOT NULL,
	`cached_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_swapi_url_unique` ON `vehicles` (`swapi_url`);--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
