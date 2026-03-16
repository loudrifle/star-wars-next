# Star Wars Galaxy Explorer

A full-stack Next.js application to explore the Star Wars universe — characters, films, planets, species, starships and vehicles from the entire saga.

Built as a portfolio project to showcase modern full-stack development with the Next.js App Router.

## Tech Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **TypeScript** — strict mode
- **Turso** — serverless SQLite database (free tier)
- **Drizzle ORM** — type-safe queries and migrations
- **Auth.js v5** — GitHub/Google OAuth authentication
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible component primitives
- **@tanstack/react-query** — client-side data fetching
- **Sonner** — toast notifications

## Features

- 🎬 Browse all 6 Star Wars films with full details
- 👤 Explore 80+ characters with photos, stats and relationships
- 🪐 Discover planets, species, starships and vehicles
- 🔗 Fully cross-linked — every entity connects to related ones
- 🔍 Real-time search on every list page
- ❤️ Save favorites (requires login)
- ⭐ Rate any entity 1–5 stars (requires login)
- 👤 Personal profile page with your favorites and ratings
- 🚀 Opening crawl cinematic homepage

## Project Structure

```
src/
├── actions/          # Server Actions (favorites, ratings)
├── app/
│   ├── (pages)/      # Route group with navbar
│   │   ├── characters/[id]/
│   │   ├── films/[id]/
│   │   ├── planets/[id]/
│   │   ├── species/[id]/
│   │   ├── starships/[id]/
│   │   ├── vehicles/[id]/
│   │   └── profile/
│   ├── api/
│   │   ├── auth/     # Auth.js handler
│   │   └── seed/     # One-time DB seed from SWAPI
│   └── page.tsx      # Homepage (opening crawl)
├── components/
│   └── ui/           # Button, Badge, Skeleton, Input
├── db/
│   ├── schema.ts     # Drizzle schema (all tables)
│   └── migrations/   # SQL migrations
├── lib/
│   ├── auth.ts       # Auth.js config
│   ├── queries.ts    # DB read functions
│   └── utils.ts      # Helpers
└── types/            # TypeScript types
```

## Getting Started

### Requirements

- Node.js 22+
- [Turso CLI](https://docs.turso.tech/cli/introduction)
- A GitHub OAuth App (for authentication)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `TURSO_DATABASE_URL` | Your Turso database URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Your Turso auth token |
| `AUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `SEED_SECRET` | Any string — used to protect the seed endpoint |

**GitHub OAuth App** — create one at github.com/settings/developers:
- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/api/auth/callback/github`

**Turso database:**
```bash
turso auth login
turso db create star-wars-db
turso db show star-wars-db --url      # → TURSO_DATABASE_URL
turso db tokens create star-wars-db   # → TURSO_AUTH_TOKEN
```

### 3. Run migrations

```bash
npm run db:generate
npm run db:migrate
```

### 4. Start the dev server

```bash
npm run dev
```

### 5. Seed the database

Visit once to populate all SWAPI data:

```
http://localhost:3000/api/seed?secret=YOUR_SEED_SECRET
```

This fetches ~300 entities from [SWAPI](https://swapi.dev) and character images from [akabab's Star Wars API](https://akabab.github.io/starwars-api/).

## Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply migrations
npm run db:studio    # Open Drizzle Studio (DB GUI)
```
