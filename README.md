# Beer Cellar

A beer inventory and trading platform — [beercellar.io](https://beercellar.io)

## Tech Stack

- **Framework** — [TanStack Start](https://tanstack.com/start) (React 19, Vite)
- **Database** — PostgreSQL 16 via [Drizzle ORM](https://orm.drizzle.team/)
- **UI** — [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Auth** — Untappd OAuth
- **Testing** — [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)

## Prerequisites

- Node.js 24+
- [pnpm](https://pnpm.io/) (corepack-managed — `corepack enable`)
- [Docker](https://www.docker.com/) (for PostgreSQL)

## Getting Started

```sh
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Untappd OAuth credentials (optional for basic dev)

# 3. Start PostgreSQL
pnpm docker:up

# 4. Run migrations and seed the database
pnpm db:migrate && pnpm db:seed

# 5. Start the dev server
pnpm dev
```

The app is available at `http://localhost:3000`.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm docker:up` | Start PostgreSQL container |
| `pnpm docker:down` | Stop PostgreSQL container |
| `pnpm docker:dev` | Run Postgres + app in Docker |
| `pnpm docker:prod` | Build and run production Docker stack |
| `pnpm db:generate` | Generate Drizzle migration files |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:seed` | Seed the database |
| `pnpm db:reset` | Drop, recreate, migrate, and seed the DB |
| `pnpm db:shell` | Open a psql shell to the dev database |

## Project Structure

```
src/
  routes/          # File-based routing (TanStack Router)
    __root.tsx     # Root layout
    index.tsx      # Landing page
    dashboard.tsx  # User dashboard
    auth/          # OAuth callback routes
    beers/         # Beer detail/list pages
    breweries/     # Brewery pages
    search/        # Search pages
    users/         # User profile pages
    settings.tsx   # User settings
  server/
    auth/          # Untappd OAuth + session handling
    db/            # Drizzle schema, migrations, seed
    functions/     # Server functions (RPC-style)
  components/
    ui/            # Radix-based primitives (button, card, dialog, etc.)
    nav/           # Navigation components
    inventory/     # Inventory management components
    notifications/ # Toast/notification components
  lib/             # Shared utilities
  styles/          # Global Tailwind styles
```

## Environment Variables

See [`.env.example`](.env.example) for all variables. Key ones:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Server-side session encryption key |
| `UNTAPPD_CLIENT_ID` | Untappd OAuth app client ID |
| `UNTAPPD_CLIENT_SECRET` | Untappd OAuth app client secret |
| `UNTAPPD_CALLBACK_URL` | OAuth redirect URL |
| `VITE_UNTAPPD_CLIENT_ID` | Client-side Untappd client ID |
| `VITE_UNTAPPD_CALLBACK_URL` | Client-side OAuth redirect URL |

## Docker

**Development** — By default, Docker only runs PostgreSQL. The app runs natively via `pnpm dev`:

```sh
pnpm docker:up    # Postgres only
pnpm dev          # App on host
```

To run everything in Docker: `pnpm docker:dev`

**Production** — Uses a multi-stage Dockerfile with a separate compose file:

```sh
cp .env.production.example .env.production
# Edit with real credentials
pnpm docker:prod
```

## Testing

```sh
pnpm test         # Unit tests with Vitest
pnpm test:e2e     # E2E tests with Playwright (requires running app + DB)
```

Tests are co-located with source files as `*.test.ts(x)`.

## Auth

Authentication uses [Untappd OAuth](https://untappd.com/api/docs). To enable login locally:

1. Create an app at [untappd.com/api/register](https://untappd.com/api/register)
2. Set the callback URL to `http://localhost:3000/auth/oauth/untappd`
3. Add the client ID and secret to your `.env` file
