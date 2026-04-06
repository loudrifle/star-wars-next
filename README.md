# Star Wars Galaxy Explorer

A full-stack Next.js application to explore the Star Wars universe — characters, films, planets, species, starships and vehicles from the entire saga.

Built as a portfolio project to showcase modern full-stack development with the Next.js App Router.

## Tech Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **TypeScript** — strict mode
- **Turso** — serverless SQLite database (free tier)
- **Drizzle ORM** — type-safe queries and migrations
- **Better Auth** — GitHub/Google OAuth authentication
- **Tailwind CSS v4** — utility-first styling
- **shadcn-style components** — hand-written accessible UI primitives (no shadcn package dependency)
- **Sonner** — toast notifications
- **Vitest** + **React Testing Library** — unit and component tests

## Features

- 🚀 Opening crawl cinematic homepage
- 🏠 Galaxy Explorer hub — project guide and category overview
- 🎬 Browse all 6 Star Wars films with full details
- 👤 Explore 80+ characters with photos, stats and relationships
- 🪐 Discover planets, species, starships and vehicles
- 🔗 Fully cross-linked — every entity connects to related ones
- 🔍 Real-time search on every list page
- ❤️ Save favorites (requires login)
- ⭐ Rate any entity 1–5 stars (requires login)
- 👤 Personal profile page with your favorites and ratings
- 🏆 Community ratings leaderboard — top-rated entities by category
- 🛡️ Admin dashboard — site-wide stats and top entities (email-gated)

## Project Structure

```
src/
├── actions/          # Server Actions (favorites, ratings, auth sign-out)
├── app/
│   ├── (pages)/      # Route group with shared navbar layout
│   │   ├── home/         # Galaxy Explorer hub
│   │   ├── sign-in/      # OAuth provider selection
│   │   ├── [entity]/     # Dynamic list pages (films, characters, planets…)
│   │   │   └── [id]/     # Dynamic detail pages
│   │   ├── profile/      # User favorites & ratings (auth-protected)
│   │   ├── ratings/      # Community ratings leaderboard
│   │   └── admin/        # Admin dashboard (ADMIN_EMAIL-gated)
│   ├── api/
│   │   ├── auth/     # Better Auth handler ([...all])
│   │   └── seed/     # One-time DB seed from SWAPI
│   └── page.tsx      # Homepage (opening crawl, no navbar)
├── components/
│   └── ui/           # Hand-written shadcn-style primitives (Button, Badge, Skeleton, Input)
├── db/
│   ├── schema.ts     # Drizzle schema (all tables)
│   └── migrations/   # SQL migrations
├── lib/
│   ├── auth.ts       # Better Auth server config
│   ├── auth-client.ts# Better Auth client (useSession, signIn, signOut)
│   ├── queries.ts    # DB read functions
│   └── utils.ts      # Helpers
├── proxy.ts          # Next.js middleware — redirects unauthenticated /profile to /sign-in
└── types/            # TypeScript types
```

## Getting Started

### Requirements

- Node.js 22+
- [Turso CLI](https://docs.turso.tech/cli/introduction)
- A GitHub OAuth App and/or a Google OAuth Client (for authentication)

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
| `BETTER_AUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Base URL of your app (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Same as above — exposed to the client |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID (optional) |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret (optional) |
| `SEED_SECRET` | Any string — used to protect the seed endpoint |
| `ADMIN_EMAIL` | Email address of the admin user (grants access to `/admin`) |

**GitHub OAuth App** — create one at github.com/settings/developers:
- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/api/auth/callback/github`

**Google OAuth Client** — create one at console.cloud.google.com → APIs & Services → Credentials:
- Authorised redirect URI: `http://localhost:3000/api/auth/callback/google`

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
npm run test         # Run test suite (Vitest)
npm run test:watch   # Run tests in watch mode
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply migrations
npm run db:studio    # Open Drizzle Studio (DB GUI)
```
