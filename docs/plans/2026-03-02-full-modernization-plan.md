# Beer Cellar Full Modernization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite beercellar.io as a consolidated full-stack app on TanStack Start, migrating from React 16 + Express + MongoDB to React 19 + TanStack Start + PostgreSQL.

**Architecture:** TanStack Start full-stack framework with file-based routing, server functions replacing the Express API, Drizzle ORM over PostgreSQL (Neon), built-in session management via httpOnly cookies, and shadcn/ui components styled with Tailwind CSS v4. The frontend and backend are consolidated into a single repo deployed to Vercel.

**Tech Stack:** TanStack Start, TanStack Router, TanStack Query, Zustand, shadcn/ui, Tailwind CSS v4, PostgreSQL (Neon), Drizzle ORM, Zod, Vitest, Playwright, Vercel, pnpm

**Design Doc:** `docs/plans/2026-03-02-full-modernization-design.md`

**Existing Backend Reference:** `/Users/brandon/projects/cellarapi/` (Mongoose models, Express controllers, Untappd OAuth flow)

---

## Phase 1: Project Scaffolding & Local Dev

### Task 1: Initialize TanStack Start project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/router.tsx`
- Create: `src/routes/__root.tsx`
- Create: `src/routes/index.tsx`
- Create: `src/styles/globals.css`

**Step 1: Create a fresh project directory and initialize pnpm**

Since this is a greenfield rewrite in the same repo, we need to remove the old source files first. The old code is preserved in git history.

```bash
# From /Users/brandon/projects/cellarapp
# Remove old source and config (preserved in git history)
rm -rf src/ __mocks__/ .circleci/ .babelrc
rm -f webpack.config.js jest.config.js Procfile app.json

# Initialize pnpm
pnpm init
```

**Step 2: Install TanStack Start and core dependencies**

```bash
pnpm add @tanstack/react-router @tanstack/react-start @tanstack/react-query react react-dom
pnpm add -D vite @vitejs/plugin-react vite-tsconfig-paths typescript @types/react @types/react-dom
```

**Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": "./src",
    "paths": {
      "~/*": ["./*"]
    },
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: Create `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    viteReact(),
  ],
})
```

**Step 5: Create `src/router.tsx`**

```tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

**Step 6: Create `src/routes/__root.tsx`**

```tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Beer Cellar' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

**Step 7: Create `src/routes/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div>
      <h1>Beer Cellar</h1>
      <p>Your beer inventory and trading platform.</p>
    </div>
  )
}
```

**Step 8: Verify the dev server starts**

```bash
pnpm exec vinxi dev
```

Expected: Dev server starts on http://localhost:3000, shows "Beer Cellar" heading.

**Step 9: Commit**

```bash
git add -A
git commit -m "Initialize TanStack Start project with Vite and file-based routing"
```

---

### Task 2: Add Tailwind CSS v4 and shadcn/ui

**Files:**
- Modify: `package.json` (new deps)
- Modify: `vite.config.ts` (tailwind plugin)
- Create: `src/styles/globals.css`
- Create: `src/lib/utils.ts`
- Create: `components.json`

**Step 1: Install Tailwind CSS v4 and shadcn/ui deps**

```bash
pnpm add tailwindcss @tailwindcss/vite
pnpm add class-variance-authority clsx tailwind-merge lucide-react
```

**Step 2: Add Tailwind plugin to `vite.config.ts`**

Add the import and plugin entry. The full file should be:

```typescript
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})
```

**Step 3: Create `src/styles/globals.css`**

```css
@import 'tailwindcss';

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0.002 247.858);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0.002 247.858);
  --card: oklch(0.141 0.005 285.823);
  --card-foreground: oklch(0.985 0.002 247.858);
  --popover: oklch(0.141 0.005 285.823);
  --popover-foreground: oklch(0.985 0.002 247.858);
  --primary: oklch(0.985 0.002 247.858);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0.002 247.858);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0.002 247.858);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.985 0.002 247.858);
  --border: oklch(0.274 0.006 286.033);
  --input: oklch(0.274 0.006 286.033);
  --ring: oklch(0.442 0.017 285.786);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Step 4: Create `src/lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 5: Create `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils",
    "ui": "~/components/ui",
    "lib": "~/lib",
    "hooks": "~/hooks"
  }
}
```

**Step 6: Import the global CSS in `src/routes/__root.tsx`**

Add the stylesheet link to the root route's `head`:

```tsx
import appCss from '~/styles/globals.css?url'

// Inside the head() function, add to the links array:
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Beer Cellar' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
})
```

**Step 7: Install a few shadcn/ui components to verify setup**

```bash
pnpm dlx shadcn@latest add button card
```

**Step 8: Update `src/routes/index.tsx` to use a shadcn Button**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Beer Cellar</h1>
      <p className="text-muted-foreground">Your beer inventory and trading platform.</p>
      <Button>Get Started</Button>
    </div>
  )
}
```

**Step 9: Verify styles render correctly**

```bash
pnpm exec vinxi dev
```

Expected: Page shows styled heading and a shadcn Button component at http://localhost:3000.

**Step 10: Commit**

```bash
git add -A
git commit -m "Add Tailwind CSS v4 and shadcn/ui with button and card components"
```

---

### Task 3: Set up Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/utils.test.ts`
- Modify: `package.json` (test script)

**Step 1: Install Vitest and testing deps**

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

**Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

**Step 3: Create `src/test-setup.ts`**

```typescript
import '@testing-library/jest-dom/vitest'
```

**Step 4: Add test script to `package.json`**

Add to scripts section:

```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

**Step 5: Write a test for `src/lib/utils.ts`**

Create `src/lib/utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conditional classes', () => {
    expect(cn('px-2', false && 'py-1')).toBe('px-2')
  })

  it('resolves tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
```

**Step 6: Run tests to verify they pass**

```bash
pnpm test
```

Expected: 3 tests pass.

**Step 7: Commit**

```bash
git add -A
git commit -m "Add Vitest with testing-library and initial utils tests"
```

---

### Task 4: Set up local PostgreSQL and Drizzle ORM

**Files:**
- Create: `src/server/db/schema.ts`
- Create: `src/server/db/index.ts`
- Create: `drizzle.config.ts`
- Create: `.env`
- Create: `.env.example`
- Modify: `.gitignore`

**Step 1: Install Drizzle and PostgreSQL deps**

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

**Step 2: Set up local PostgreSQL**

Ensure PostgreSQL is running locally. Create the dev database:

```bash
createdb beercellar_dev
```

**Step 3: Create `.env.example`**

```
DATABASE_URL=postgresql://localhost:5432/beercellar_dev
SESSION_SECRET=at-least-32-characters-long-secret-key-here
UNTAPPD_CLIENT_ID=your_untappd_client_id
UNTAPPD_CLIENT_SECRET=your_untappd_client_secret
UNTAPPD_CALLBACK_URL=http://localhost:3000/auth/oauth/untappd
```

**Step 4: Create `.env`** (copy from example, fill in real values)

```
DATABASE_URL=postgresql://localhost:5432/beercellar_dev
SESSION_SECRET=dev-secret-key-at-least-32-characters-long
UNTAPPD_CLIENT_ID=
UNTAPPD_CLIENT_SECRET=
UNTAPPD_CALLBACK_URL=http://localhost:3000/auth/oauth/untappd
```

**Step 5: Add `.env` to `.gitignore`**

```
node_modules
dist
.output
.vinxi
.env
*.local
```

**Step 6: Create `src/server/db/schema.ts`**

This translates the MongoDB models (from cellarapi) to a relational schema. Reference: `cellarapi/src/models/user.model.ts`, `beer.model.ts`, `brewery.model.ts`, `quantity.model.ts`.

```typescript
import { pgTable, uuid, varchar, integer, decimal, text, timestamp, uniqueIndex, check } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  role: varchar('role', { length: 20 }).default('user').notNull(),
  authProvider: varchar('auth_provider', { length: 50 }).notNull(),
  authProviderId: varchar('auth_provider_id', { length: 255 }).notNull(),
  untappdApiKey: varchar('untappd_api_key', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('users_auth_provider_idx').on(table.authProvider, table.authProviderId),
])

export const breweries = pgTable('breweries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  untappdId: integer('untappd_id').unique(),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 255 }),
  country: varchar('country', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const beers = pgTable('beers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  untappdId: integer('untappd_id').unique(),
  breweryId: uuid('brewery_id').references(() => breweries.id),
  style: varchar('style', { length: 255 }),
  abv: decimal('abv', { precision: 5, scale: 2 }),
  ibu: integer('ibu'),
  description: text('description'),
  labelUrl: varchar('label_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const inventory = pgTable('inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  beerId: uuid('beer_id').references(() => beers.id, { onDelete: 'cascade' }).notNull(),
  amount: integer('amount').default(1).notNull(),
  forTrade: integer('for_trade').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('inventory_user_beer_idx').on(table.userId, table.beerId),
  check('amount_non_negative', sql`${table.amount} >= 0`),
  check('for_trade_non_negative', sql`${table.forTrade} >= 0`),
  check('for_trade_lte_amount', sql`${table.forTrade} <= ${table.amount}`),
])
```

**Step 7: Create `src/server/db/index.ts`**

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'
import * as schema from './schema'

function createDb() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  return drizzle(pool, { schema })
}

let db: ReturnType<typeof createDb>

export function getDb() {
  if (!db) {
    db = createDb()
  }
  return db
}

export type Database = ReturnType<typeof getDb>
```

**Step 8: Create `drizzle.config.ts`**

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

**Step 9: Generate and run the initial migration**

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

Expected: Migration files created in `src/server/db/migrations/`, tables created in local Postgres.

**Step 10: Verify tables exist**

```bash
psql beercellar_dev -c "\dt"
```

Expected: Tables `users`, `breweries`, `beers`, `inventory` listed.

**Step 11: Commit**

```bash
git add -A
git commit -m "Add Drizzle ORM schema and PostgreSQL migration for all tables"
```

---

### Task 5: Write schema tests

**Files:**
- Create: `src/server/db/schema.test.ts`

**Step 1: Install pg for local dev testing**

For local dev, we need the `pg` driver (Neon's serverless driver also works locally but `pg` is more straightforward for tests):

```bash
pnpm add pg
pnpm add -D @types/pg
```

**Step 2: Write schema integration tests**

Create `src/server/db/schema.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { eq } from 'drizzle-orm'
import * as schema from './schema'

let pool: Pool
let db: ReturnType<typeof drizzle<typeof schema>>

beforeAll(async () => {
  pool = new Pool({ connectionString: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/beercellar_dev' })
  db = drizzle(pool, { schema })
})

afterAll(async () => {
  await pool.end()
})

afterEach(async () => {
  await db.delete(schema.inventory)
  await db.delete(schema.beers)
  await db.delete(schema.breweries)
  await db.delete(schema.users)
})

describe('users table', () => {
  it('creates a user', async () => {
    const [user] = await db.insert(schema.users).values({
      username: 'testbrewer',
      email: 'test@example.com',
      authProvider: 'untappd',
      authProviderId: '12345',
    }).returning()

    expect(user.username).toBe('testbrewer')
    expect(user.role).toBe('user')
    expect(user.id).toBeDefined()
  })

  it('enforces unique username', async () => {
    await db.insert(schema.users).values({
      username: 'dupe',
      authProvider: 'untappd',
      authProviderId: '1',
    })

    await expect(
      db.insert(schema.users).values({
        username: 'dupe',
        authProvider: 'untappd',
        authProviderId: '2',
      })
    ).rejects.toThrow()
  })
})

describe('inventory table', () => {
  it('enforces for_trade <= amount', async () => {
    const [user] = await db.insert(schema.users).values({
      username: 'invuser',
      authProvider: 'untappd',
      authProviderId: '99',
    }).returning()

    const [brewery] = await db.insert(schema.breweries).values({
      name: 'Test Brewery',
      slug: 'test-brewery',
    }).returning()

    const [beer] = await db.insert(schema.beers).values({
      name: 'Test IPA',
      slug: 'test-ipa',
      breweryId: brewery.id,
    }).returning()

    await expect(
      db.insert(schema.inventory).values({
        userId: user.id,
        beerId: beer.id,
        amount: 2,
        forTrade: 5,
      })
    ).rejects.toThrow()
  })

  it('enforces unique user+beer combination', async () => {
    const [user] = await db.insert(schema.users).values({
      username: 'uniqtest',
      authProvider: 'untappd',
      authProviderId: '100',
    }).returning()

    const [brewery] = await db.insert(schema.breweries).values({
      name: 'Unique Brewery',
      slug: 'unique-brewery',
    }).returning()

    const [beer] = await db.insert(schema.beers).values({
      name: 'Unique Beer',
      slug: 'unique-beer',
      breweryId: brewery.id,
    }).returning()

    await db.insert(schema.inventory).values({
      userId: user.id,
      beerId: beer.id,
      amount: 3,
      forTrade: 1,
    })

    await expect(
      db.insert(schema.inventory).values({
        userId: user.id,
        beerId: beer.id,
        amount: 1,
        forTrade: 0,
      })
    ).rejects.toThrow()
  })
})
```

**Step 3: Run tests**

```bash
pnpm test
```

Expected: All schema tests pass (plus the existing utils test).

**Step 4: Commit**

```bash
git add -A
git commit -m "Add database schema integration tests"
```

---

### Task 6: Add seed script for local development

**Files:**
- Create: `src/server/db/seed.ts`
- Modify: `package.json` (add seed script)

**Step 1: Create `src/server/db/seed.ts`**

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/beercellar_dev',
  })
  const db = drizzle(pool, { schema })

  console.log('Seeding database...')

  // Clear existing data
  await db.delete(schema.inventory)
  await db.delete(schema.beers)
  await db.delete(schema.breweries)
  await db.delete(schema.users)

  // Create users
  const [user1] = await db.insert(schema.users).values({
    username: 'beercellardev',
    email: 'dev@beercellar.io',
    avatarUrl: 'https://placekitten.com/200/200',
    authProvider: 'untappd',
    authProviderId: 'dev-1',
    firstName: 'Dev',
    lastName: 'User',
    role: 'admin',
  }).returning()

  const [user2] = await db.insert(schema.users).values({
    username: 'hophead',
    email: 'hophead@example.com',
    authProvider: 'untappd',
    authProviderId: 'dev-2',
    firstName: 'Hop',
    lastName: 'Head',
  }).returning()

  // Create breweries
  const [treeHouse] = await db.insert(schema.breweries).values({
    name: 'Tree House Brewing Company',
    slug: 'tree-house-brewing-company',
    untappdId: 29621,
    city: 'Charlton',
    state: 'MA',
    country: 'United States',
  }).returning()

  const [otherHalf] = await db.insert(schema.breweries).values({
    name: 'Other Half Brewing Co.',
    slug: 'other-half-brewing-co',
    untappdId: 128441,
    city: 'Brooklyn',
    state: 'NY',
    country: 'United States',
  }).returning()

  const [hillFarmstead] = await db.insert(schema.breweries).values({
    name: 'Hill Farmstead Brewery',
    slug: 'hill-farmstead-brewery',
    untappdId: 8483,
    city: 'Greensboro Bend',
    state: 'VT',
    country: 'United States',
  }).returning()

  // Create beers
  const [julius] = await db.insert(schema.beers).values({
    name: 'Julius',
    slug: 'julius',
    untappdId: 648434,
    breweryId: treeHouse.id,
    style: 'IPA - New England / Hazy',
    abv: '6.80',
    description: 'Our flagship New England IPA.',
  }).returning()

  const [greenMachine] = await db.insert(schema.beers).values({
    name: 'Green Machine',
    slug: 'green-machine',
    untappdId: 2563887,
    breweryId: otherHalf.id,
    style: 'IPA - Imperial / Double New England / Hazy',
    abv: '8.00',
  }).returning()

  const [edward] = await db.insert(schema.beers).values({
    name: 'Edward',
    slug: 'edward',
    untappdId: 4577,
    breweryId: hillFarmstead.id,
    style: 'Pale Ale - American',
    abv: '5.20',
  }).returning()

  const [haze] = await db.insert(schema.beers).values({
    name: 'Haze',
    slug: 'haze',
    untappdId: 530754,
    breweryId: treeHouse.id,
    style: 'IPA - New England / Hazy',
    abv: '8.20',
  }).returning()

  // Create inventory
  await db.insert(schema.inventory).values([
    { userId: user1.id, beerId: julius.id, amount: 4, forTrade: 2 },
    { userId: user1.id, beerId: greenMachine.id, amount: 2, forTrade: 1 },
    { userId: user1.id, beerId: edward.id, amount: 1, forTrade: 0 },
    { userId: user2.id, beerId: haze.id, amount: 6, forTrade: 3 },
    { userId: user2.id, beerId: julius.id, amount: 2, forTrade: 2 },
  ])

  console.log('Seed complete.')
  console.log(`  Users: ${user1.username}, ${user2.username}`)
  console.log(`  Breweries: 3`)
  console.log(`  Beers: 4`)
  console.log(`  Inventory entries: 5`)

  await pool.end()
}

seed().catch(console.error)
```

**Step 2: Add seed script to `package.json`**

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "npx tsx src/server/db/seed.ts",
    "db:reset": "pnpm db:migrate && pnpm db:seed"
  }
}
```

**Step 3: Run the seed**

```bash
pnpm db:seed
```

Expected: Output shows seeded counts. Verify with:

```bash
psql beercellar_dev -c "SELECT username FROM users;"
```

**Step 4: Commit**

```bash
git add -A
git commit -m "Add database seed script with sample breweries, beers, and inventory"
```

---

## Phase 2: Authentication

### Task 7: Session management and auth utilities

**Files:**
- Create: `src/server/auth/session.ts`
- Create: `src/server/auth/untappd.ts`
- Create: `src/server/auth/index.ts`

**Step 1: Create `src/server/auth/session.ts`**

Uses TanStack Start's built-in `useSession` for httpOnly cookie-based sessions:

```typescript
import { useSession } from '@tanstack/react-start/server'

export type SessionData = {
  userId?: string
  username?: string
  role?: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: 'beercellar-session',
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  })
}
```

**Step 2: Create `src/server/auth/untappd.ts`**

Migrated from `cellarapi/src/utils/untappd.ts`. Fixes: proper error handling, typed responses, no `any`, no unsafe casts.

```typescript
import { z } from 'zod'

const UntappdUserSchema = z.object({
  response: z.object({
    user: z.object({
      uid: z.number(),
      user_name: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      settings: z.object({
        email_address: z.string(),
      }),
      user_avatar: z.string().optional(),
    }),
  }),
})

const UntappdOAuthSchema = z.object({
  response: z.object({
    access_token: z.string(),
  }),
})

const UntappdBeerSearchSchema = z.object({
  response: z.object({
    beers: z.object({
      items: z.array(z.object({
        beer: z.object({
          bid: z.number(),
          beer_name: z.string(),
          beer_abv: z.number(),
          beer_style: z.string(),
          beer_slug: z.string(),
          beer_description: z.string().optional(),
          beer_label: z.string().optional(),
        }),
        brewery: z.object({
          brewery_id: z.number(),
          brewery_name: z.string(),
          brewery_slug: z.string(),
          location: z.object({
            brewery_city: z.string(),
            brewery_state: z.string(),
          }),
          country_name: z.string(),
        }),
      })),
    }),
  }),
})

export type UntappdBeerResult = {
  name: string
  slug: string
  untappdId: number
  abv: number
  style: string
  description: string
  labelUrl: string
  brewery: {
    name: string
    slug: string
    untappdId: number
    city: string
    state: string
    country: string
  }
}

export type UntappdUserResult = {
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string
  untappdId: string
  accessToken: string
}

export async function exchangeUntappdCode(code: string): Promise<string> {
  const url = new URL('https://untappd.com/oauth/authorize/')
  url.searchParams.set('code', code)
  url.searchParams.set('client_id', process.env.UNTAPPD_CLIENT_ID!)
  url.searchParams.set('client_secret', process.env.UNTAPPD_CLIENT_SECRET!)
  url.searchParams.set('redirect_url', process.env.UNTAPPD_CALLBACK_URL!)
  url.searchParams.set('response_type', 'code')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Untappd OAuth failed: ${response.status}`)
  }

  const data = UntappdOAuthSchema.parse(await response.json())
  return data.response.access_token
}

export async function getUntappdUser(accessToken: string): Promise<UntappdUserResult> {
  const response = await fetch(
    `https://api.untappd.com/v4/user/info?access_token=${accessToken}`
  )
  if (!response.ok) {
    throw new Error(`Untappd user info failed: ${response.status}`)
  }

  const data = UntappdUserSchema.parse(await response.json())
  const user = data.response.user

  return {
    username: user.user_name,
    email: user.settings.email_address,
    firstName: user.first_name,
    lastName: user.last_name,
    avatarUrl: user.user_avatar ?? '',
    untappdId: String(user.uid),
    accessToken,
  }
}

export async function searchUntappdBeers(
  query: string,
  accessToken: string
): Promise<UntappdBeerResult[]> {
  const response = await fetch(
    `https://api.untappd.com/v4/search/beer?q=${encodeURIComponent(query)}&access_token=${accessToken}`
  )
  if (!response.ok) {
    throw new Error(`Untappd search failed: ${response.status}`)
  }

  const data = UntappdBeerSearchSchema.parse(await response.json())

  return data.response.beers.items.map((item) => ({
    name: item.beer.beer_name,
    slug: item.beer.beer_slug,
    untappdId: item.beer.bid,
    abv: item.beer.beer_abv,
    style: item.beer.beer_style,
    description: item.beer.beer_description ?? '',
    labelUrl: item.beer.beer_label ?? '',
    brewery: {
      name: item.brewery.brewery_name,
      slug: item.brewery.brewery_slug,
      untappdId: item.brewery.brewery_id,
      city: item.brewery.location.brewery_city,
      state: item.brewery.location.brewery_state,
      country: item.brewery.country_name,
    },
  }))
}
```

**Step 3: Create `src/server/auth/index.ts`**

```typescript
export { useAppSession, type SessionData } from './session'
export {
  exchangeUntappdCode,
  getUntappdUser,
  searchUntappdBeers,
  type UntappdBeerResult,
  type UntappdUserResult,
} from './untappd'
```

**Step 4: Install Zod**

```bash
pnpm add zod
```

**Step 5: Commit**

```bash
git add -A
git commit -m "Add session management and Untappd OAuth utilities with Zod validation"
```

---

### Task 8: Auth server functions

**Files:**
- Create: `src/server/functions/auth.ts`

**Step 1: Create `src/server/functions/auth.ts`**

```typescript
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { users } from '~/server/db/schema'
import { useAppSession, exchangeUntappdCode, getUntappdUser } from '~/server/auth'

export const loginWithUntappd = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ code: z.string().min(1) }).parse)
  .handler(async ({ data }) => {
    const accessToken = await exchangeUntappdCode(data.code)
    const untappdUser = await getUntappdUser(accessToken)
    const db = getDb()

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.authProviderId, untappdUser.untappdId))
      .limit(1)

    if (!user) {
      ;[user] = await db.insert(users).values({
        username: untappdUser.username,
        email: untappdUser.email,
        avatarUrl: untappdUser.avatarUrl,
        firstName: untappdUser.firstName,
        lastName: untappdUser.lastName,
        authProvider: 'untappd',
        authProviderId: untappdUser.untappdId,
        untappdApiKey: accessToken,
      }).returning()
    } else {
      // Update access token on login
      ;[user] = await db.update(users)
        .set({ untappdApiKey: accessToken, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .returning()
    }

    // Create session
    const session = await useAppSession()
    await session.update({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    return { user: { id: user.id, username: user.username, role: user.role } }
  })

export const getMe = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useAppSession()

  if (!session.data.userId) {
    return null
  }

  const db = getDb()
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      avatarUrl: users.avatarUrl,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
      location: users.location,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.data.userId))
    .limit(1)

  return user ?? null
})

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  throw redirect({ to: '/' })
})
```

**Step 2: Commit**

```bash
git add -A
git commit -m "Add auth server functions: login, getMe, logout"
```

---

### Task 9: Auth routes (login page + OAuth callback)

**Files:**
- Create: `src/routes/auth/index.tsx`
- Create: `src/routes/auth/oauth.untappd.tsx`

**Step 1: Install shadcn/ui components needed for auth**

```bash
pnpm dlx shadcn@latest add alert
```

**Step 2: Create `src/routes/auth/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const Route = createFileRoute('/auth/')({
  component: AuthPage,
})

function AuthPage() {
  const untappdUrl = `https://untappd.com/oauth/authenticate/?client_id=${
    import.meta.env.VITE_UNTAPPD_CLIENT_ID
  }&redirect_url=${encodeURIComponent(
    import.meta.env.VITE_UNTAPPD_CALLBACK_URL
  )}&response_type=code`

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in to Beer Cellar</CardTitle>
          <CardDescription>
            Connect your Untappd account to manage your beer inventory.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild size="lg">
            <a href={untappdUrl}>Sign in with Untappd</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 3: Create `src/routes/auth/oauth.untappd.tsx`**

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { loginWithUntappd } from '~/server/functions/auth'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'

const searchSchema = z.object({
  code: z.string().optional(),
})

export const Route = createFileRoute('/auth/oauth/untappd')({
  validateSearch: searchSchema.parse,
  component: OAuthCallback,
})

function OAuthCallback() {
  const { code } = Route.useSearch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      setError('No authorization code received from Untappd.')
      return
    }

    loginWithUntappd({ data: { code } })
      .then(() => {
        navigate({ to: '/dashboard' })
      })
      .catch((err: Error) => {
        setError(err.message || 'Authentication failed. Please try again.')
      })
  }, [code, navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Authenticating with Untappd...</p>
    </div>
  )
}
```

**Step 4: Add public env vars to `.env`**

Append to `.env`:

```
VITE_UNTAPPD_CLIENT_ID=your_untappd_client_id
VITE_UNTAPPD_CALLBACK_URL=http://localhost:3000/auth/oauth/untappd
```

And to `.env.example`:

```
VITE_UNTAPPD_CLIENT_ID=your_untappd_client_id
VITE_UNTAPPD_CALLBACK_URL=http://localhost:3000/auth/oauth/untappd
```

**Step 5: Verify the auth page renders**

```bash
pnpm exec vinxi dev
```

Navigate to http://localhost:3000/auth — should see the sign-in card with Untappd button.

**Step 6: Commit**

```bash
git add -A
git commit -m "Add auth routes: login page and Untappd OAuth callback"
```

---

## Phase 3: Server Functions (Data Layer)

### Task 10: Beers server functions

**Files:**
- Create: `src/server/functions/beers.ts`
- Create: `src/server/functions/beers.test.ts`

**Step 1: Create `src/server/functions/beers.ts`**

```typescript
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { beers, breweries } from '~/server/db/schema'

export const listBeers = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    }).parse
  )
  .handler(async ({ data }) => {
    const db = getDb()
    const offset = (data.page - 1) * data.limit

    const [items, [countResult]] = await Promise.all([
      db
        .select({
          id: beers.id,
          name: beers.name,
          slug: beers.slug,
          style: beers.style,
          abv: beers.abv,
          labelUrl: beers.labelUrl,
          breweryName: breweries.name,
          brewerySlug: breweries.slug,
        })
        .from(beers)
        .leftJoin(breweries, eq(beers.breweryId, breweries.id))
        .limit(data.limit)
        .offset(offset)
        .orderBy(beers.name),
      db.select({ count: sql<number>`count(*)` }).from(beers),
    ])

    return {
      beers: items,
      total: Number(countResult.count),
      page: data.page,
      totalPages: Math.ceil(Number(countResult.count) / data.limit),
    }
  })

export const getBeer = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ slug: z.string().min(1) }).parse)
  .handler(async ({ data }) => {
    const db = getDb()

    const [beer] = await db
      .select({
        id: beers.id,
        name: beers.name,
        slug: beers.slug,
        style: beers.style,
        abv: beers.abv,
        ibu: beers.ibu,
        description: beers.description,
        labelUrl: beers.labelUrl,
        brewery: {
          id: breweries.id,
          name: breweries.name,
          slug: breweries.slug,
          city: breweries.city,
          state: breweries.state,
          country: breweries.country,
        },
      })
      .from(beers)
      .leftJoin(breweries, eq(beers.breweryId, breweries.id))
      .where(eq(beers.slug, data.slug))
      .limit(1)

    if (!beer) {
      throw new Error('Beer not found')
    }

    return beer
  })
```

**Step 2: Commit**

```bash
git add -A
git commit -m "Add beers server functions with pagination"
```

---

### Task 11: Breweries server functions

**Files:**
- Create: `src/server/functions/breweries.ts`

**Step 1: Create `src/server/functions/breweries.ts`**

```typescript
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { beers, breweries } from '~/server/db/schema'

export const listBreweries = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    }).parse
  )
  .handler(async ({ data }) => {
    const db = getDb()
    const offset = (data.page - 1) * data.limit

    const [items, [countResult]] = await Promise.all([
      db
        .select()
        .from(breweries)
        .limit(data.limit)
        .offset(offset)
        .orderBy(breweries.name),
      db.select({ count: sql<number>`count(*)` }).from(breweries),
    ])

    return {
      breweries: items,
      total: Number(countResult.count),
      page: data.page,
      totalPages: Math.ceil(Number(countResult.count) / data.limit),
    }
  })

export const getBrewery = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ slug: z.string().min(1) }).parse)
  .handler(async ({ data }) => {
    const db = getDb()

    const [brewery] = await db
      .select()
      .from(breweries)
      .where(eq(breweries.slug, data.slug))
      .limit(1)

    if (!brewery) {
      throw new Error('Brewery not found')
    }

    const breweryBeers = await db
      .select({
        id: beers.id,
        name: beers.name,
        slug: beers.slug,
        style: beers.style,
        abv: beers.abv,
        labelUrl: beers.labelUrl,
      })
      .from(beers)
      .where(eq(beers.breweryId, brewery.id))
      .orderBy(beers.name)

    return { ...brewery, beers: breweryBeers }
  })
```

**Step 2: Commit**

```bash
git add -A
git commit -m "Add breweries server functions with pagination and beer listing"
```

---

### Task 12: Inventory server functions

**Files:**
- Create: `src/server/functions/inventory.ts`

**Step 1: Create `src/server/functions/inventory.ts`**

Migrated from `cellarapi/src/controllers/inventory.ctrl.ts`. Fixes: proper auth checks, typed errors, no string comparison for IDs, DB-level constraint for forTrade <= amount.

```typescript
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { inventory, beers, breweries } from '~/server/db/schema'
import { useAppSession } from '~/server/auth'

export const getUserInventory = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    const db = getDb()

    const items = await db
      .select({
        id: inventory.id,
        amount: inventory.amount,
        forTrade: inventory.forTrade,
        beer: {
          id: beers.id,
          name: beers.name,
          slug: beers.slug,
          style: beers.style,
          abv: beers.abv,
          labelUrl: beers.labelUrl,
        },
        brewery: {
          id: breweries.id,
          name: breweries.name,
          slug: breweries.slug,
        },
      })
      .from(inventory)
      .innerJoin(beers, eq(inventory.beerId, beers.id))
      .leftJoin(breweries, eq(beers.breweryId, breweries.id))
      .where(eq(inventory.userId, data.userId))
      .orderBy(beers.name)

    return items
  })

export const addToInventory = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      beerId: z.string().uuid(),
      amount: z.number().int().min(1).max(1000).default(1),
      forTrade: z.number().int().min(0).max(1000).default(0),
    }).parse
  )
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()

    // Check for duplicates
    const [existing] = await db
      .select({ id: inventory.id })
      .from(inventory)
      .where(
        and(
          eq(inventory.userId, session.data.userId),
          eq(inventory.beerId, data.beerId)
        )
      )
      .limit(1)

    if (existing) {
      throw new Error('Beer already in inventory')
    }

    const [item] = await db.insert(inventory).values({
      userId: session.data.userId,
      beerId: data.beerId,
      amount: data.amount,
      forTrade: data.forTrade,
    }).returning()

    return item
  })

export const updateInventory = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      amount: z.number().int().min(0).max(1000),
      forTrade: z.number().int().min(0).max(1000),
    }).parse
  )
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()

    // Verify ownership
    const [item] = await db
      .select()
      .from(inventory)
      .where(
        and(eq(inventory.id, data.id), eq(inventory.userId, session.data.userId))
      )
      .limit(1)

    if (!item) {
      throw new Error('Inventory item not found or not owned by you')
    }

    const [updated] = await db
      .update(inventory)
      .set({
        amount: data.amount,
        forTrade: data.forTrade,
        updatedAt: new Date(),
      })
      .where(eq(inventory.id, data.id))
      .returning()

    return updated
  })

export const removeFromInventory = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()

    // Verify ownership
    const [item] = await db
      .select()
      .from(inventory)
      .where(
        and(eq(inventory.id, data.id), eq(inventory.userId, session.data.userId))
      )
      .limit(1)

    if (!item) {
      throw new Error('Inventory item not found or not owned by you')
    }

    await db.delete(inventory).where(eq(inventory.id, data.id))

    return { deleted: true }
  })
```

**Step 2: Commit**

```bash
git add -A
git commit -m "Add inventory server functions with auth checks and ownership validation"
```

---

### Task 13: Users and Search server functions

**Files:**
- Create: `src/server/functions/users.ts`
- Create: `src/server/functions/search.ts`

**Step 1: Create `src/server/functions/users.ts`**

Fixes from original: parameterized search (no RegExp injection), proper pagination.

```typescript
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, ilike, sql } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { users } from '~/server/db/schema'

export const listUsers = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      search: z.string().optional(),
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    }).parse
  )
  .handler(async ({ data }) => {
    const db = getDb()
    const offset = (data.page - 1) * data.limit

    const whereClause = data.search
      ? ilike(users.username, `%${data.search}%`)
      : undefined

    const [items, [countResult]] = await Promise.all([
      db
        .select({
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(whereClause)
        .limit(data.limit)
        .offset(offset)
        .orderBy(users.username),
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(whereClause),
    ])

    return {
      users: items,
      total: Number(countResult.count),
      page: data.page,
      totalPages: Math.ceil(Number(countResult.count) / data.limit),
    }
  })

export const getUser = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ username: z.string().min(1) }).parse)
  .handler(async ({ data }) => {
    const db = getDb()

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        firstName: users.firstName,
        lastName: users.lastName,
        location: users.location,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  })
```

**Step 2: Create `src/server/functions/search.ts`**

```typescript
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getDb } from '~/server/db'
import { users } from '~/server/db/schema'
import { useAppSession, searchUntappdBeers } from '~/server/auth'

export const searchBeers = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      query: z.string().min(1).max(200),
    }).parse
  )
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      throw new Error('Unauthorized')
    }

    const db = getDb()
    const [user] = await db
      .select({ untappdApiKey: users.untappdApiKey })
      .from(users)
      .where(eq(users.id, session.data.userId))
      .limit(1)

    if (!user?.untappdApiKey) {
      throw new Error('Untappd API key not found. Please re-authenticate.')
    }

    return searchUntappdBeers(data.query, user.untappdApiKey)
  })
```

**Step 3: Commit**

```bash
git add -A
git commit -m "Add users and search server functions with parameterized queries"
```

---

## Phase 4: Client State & Layout

### Task 14: Zustand stores

**Files:**
- Create: `src/lib/stores/theme.ts`
- Create: `src/lib/stores/nav.ts`
- Create: `src/lib/stores/notifications.ts`
- Create: `src/lib/stores/notifications.test.ts`

**Step 1: Install Zustand**

```bash
pnpm add zustand
```

**Step 2: Create `src/lib/stores/theme.ts`**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark'

interface ThemeStore {
  mode: ThemeMode
  toggle: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      toggle: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
    }),
    { name: 'beercellar-theme' }
  )
)
```

**Step 3: Create `src/lib/stores/nav.ts`**

```typescript
import { create } from 'zustand'

interface NavStore {
  open: boolean
  toggle: () => void
  close: () => void
}

export const useNavStore = create<NavStore>()((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
}))
```

**Step 4: Create `src/lib/stores/notifications.ts`**

Fixes the original Redux reducer bug (missing return on ERROR_NOTIFICATION).

```typescript
import { create } from 'zustand'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface NotificationStore {
  notifications: Notification[]
  add: (message: string, type: Notification['type']) => void
  dismiss: (id: string) => void
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  notifications: [],
  add: (message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: `${Date.now()}-${Math.random()}`, message, type },
      ],
    })),
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
```

**Step 5: Write notification store tests**

Create `src/lib/stores/notifications.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationStore } from './notifications'

describe('notification store', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] })
  })

  it('adds a notification', () => {
    useNotificationStore.getState().add('Beer added!', 'success')
    const { notifications } = useNotificationStore.getState()
    expect(notifications).toHaveLength(1)
    expect(notifications[0].message).toBe('Beer added!')
    expect(notifications[0].type).toBe('success')
  })

  it('dismisses a notification', () => {
    useNotificationStore.getState().add('Test', 'info')
    const { notifications } = useNotificationStore.getState()
    useNotificationStore.getState().dismiss(notifications[0].id)
    expect(useNotificationStore.getState().notifications).toHaveLength(0)
  })

  it('handles error notifications', () => {
    useNotificationStore.getState().add('Something failed', 'error')
    const { notifications } = useNotificationStore.getState()
    expect(notifications[0].type).toBe('error')
  })
})
```

**Step 6: Run tests**

```bash
pnpm test
```

Expected: All tests pass.

**Step 7: Commit**

```bash
git add -A
git commit -m "Add Zustand stores for theme, navigation, and notifications"
```

---

### Task 15: Root layout with navigation

**Files:**
- Modify: `src/routes/__root.tsx`
- Create: `src/components/nav/site-header.tsx`
- Create: `src/components/nav/mobile-nav.tsx`
- Create: `src/components/notifications/toast-container.tsx`

**Step 1: Install shadcn/ui components for layout**

```bash
pnpm dlx shadcn@latest add sheet dropdown-menu avatar separator sonner
```

**Step 2: Create `src/components/nav/site-header.tsx`**

```tsx
import { Link, useRouter } from '@tanstack/react-router'
import { Menu, Beer, LogOut, Settings, User } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useNavStore } from '~/lib/stores/nav'
import { logout } from '~/server/functions/auth'

interface SiteHeaderProps {
  user: {
    username: string
    avatarUrl: string | null
  } | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const { toggle } = useNavStore()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        {user && (
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggle}>
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <Link to="/" className="flex items-center gap-2 font-bold">
          <Beer className="h-5 w-5" />
          Beer Cellar
        </Link>

        {user && (
          <nav className="ml-6 hidden gap-4 md:flex">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Dashboard
            </Link>
            <Link to="/beers" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Beers
            </Link>
            <Link to="/breweries" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Breweries
            </Link>
            <Link to="/search/beers" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Search
            </Link>
            <Link to="/users" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: 'text-foreground font-medium' }}>
              Users
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/users/$username" params={{ username: user.username }}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout().then(() => router.invalidate())}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
```

**Step 3: Create `src/components/nav/mobile-nav.tsx`**

```tsx
import { Link } from '@tanstack/react-router'
import { Beer, Home, Search, Users, Warehouse } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { useNavStore } from '~/lib/stores/nav'

export function MobileNav() {
  const { open, close } = useNavStore()

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Beer className="h-5 w-5" />
            Beer Cellar
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          <Link to="/dashboard" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Home className="h-4 w-4" /> Dashboard
          </Link>
          <Link to="/beers" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Beer className="h-4 w-4" /> Beers
          </Link>
          <Link to="/breweries" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Warehouse className="h-4 w-4" /> Breweries
          </Link>
          <Link to="/search/beers" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Search className="h-4 w-4" /> Search
          </Link>
          <Link to="/users" onClick={close} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Users className="h-4 w-4" /> Users
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

**Step 4: Create `src/components/notifications/toast-container.tsx`**

```tsx
import { Toaster } from '~/components/ui/sonner'

export function ToastContainer() {
  return <Toaster position="bottom-right" />
}
```

**Step 5: Update `src/routes/__root.tsx`**

Wire up the layout with the header, mobile nav, theme, and auth loader:

```tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'
import appCss from '~/styles/globals.css?url'
import { SiteHeader } from '~/components/nav/site-header'
import { MobileNav } from '~/components/nav/mobile-nav'
import { ToastContainer } from '~/components/notifications/toast-container'
import { getMe } from '~/server/functions/auth'
import { useThemeStore } from '~/lib/stores/theme'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Beer Cellar' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  loader: async () => {
    const user = await getMe()
    return { user }
  },
  component: RootComponent,
})

function RootComponent() {
  const { user } = Route.useLoaderData()
  const { mode } = useThemeStore()

  return (
    <html lang="en" className={mode}>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SiteHeader user={user} />
        <MobileNav />
        <main className="container py-6">
          <Outlet />
        </main>
        <ToastContainer />
        <Scripts />
      </body>
    </html>
  )
}
```

**Step 6: Verify layout renders**

```bash
pnpm exec vinxi dev
```

Expected: Page shows header with "Beer Cellar" logo, "Sign In" button (when not authenticated), and styled content area.

**Step 7: Commit**

```bash
git add -A
git commit -m "Add root layout with navigation header, mobile drawer, and notifications"
```

---

## Phase 5: Pages

### Task 16: Home page

**Files:**
- Modify: `src/routes/index.tsx`

**Step 1: Update `src/routes/index.tsx`**

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Beer, Users, Search, ArrowRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const features = [
    {
      icon: Beer,
      title: 'Track Your Cellar',
      description: 'Keep an inventory of all the beers in your collection.',
    },
    {
      icon: Users,
      title: 'Trade with Others',
      description: 'Mark beers for trade and connect with other collectors.',
    },
    {
      icon: Search,
      title: 'Discover Beers',
      description: 'Search the Untappd database to find and add new beers.',
    },
  ]

  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Beer Cellar</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your beer inventory and trading platform.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/auth">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "Add home page with feature cards"
```

---

### Task 17: Dashboard page

**Files:**
- Create: `src/routes/dashboard.tsx`
- Create: `src/components/inventory/inventory-list.tsx`
- Create: `src/components/inventory/inventory-item.tsx`

**Step 1: Install additional shadcn/ui components**

```bash
pnpm dlx shadcn@latest add slider dialog badge table input label
```

**Step 2: Create `src/components/inventory/inventory-item.tsx`**

```tsx
import { useState } from 'react'
import { Trash2, Pencil, X, Check } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Slider } from '~/components/ui/slider'
import { Badge } from '~/components/ui/badge'
import { TableCell, TableRow } from '~/components/ui/table'
import { Link } from '@tanstack/react-router'

interface InventoryItemProps {
  item: {
    id: string
    amount: number
    forTrade: number
    beer: {
      id: string
      name: string
      slug: string
      style: string | null
      abv: string | null
    }
    brewery: {
      name: string
      slug: string
    } | null
  }
  isOwner: boolean
  onUpdate: (id: string, amount: number, forTrade: number) => void
  onRemove: (id: string) => void
}

export function InventoryItem({ item, isOwner, onUpdate, onRemove }: InventoryItemProps) {
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(item.amount)
  const [forTrade, setForTrade] = useState(item.forTrade)

  function handleSave() {
    onUpdate(item.id, amount, forTrade)
    setEditing(false)
  }

  function handleCancel() {
    setAmount(item.amount)
    setForTrade(item.forTrade)
    setEditing(false)
  }

  return (
    <TableRow>
      <TableCell>
        <Link to="/beers/$slug" params={{ slug: item.beer.slug }} className="font-medium hover:underline">
          {item.beer.name}
        </Link>
        {item.beer.style && (
          <span className="ml-2 text-xs text-muted-foreground">{item.beer.style}</span>
        )}
      </TableCell>
      <TableCell>
        {item.brewery ? (
          <Link to="/breweries/$slug" params={{ slug: item.brewery.slug }} className="text-sm hover:underline">
            {item.brewery.name}
          </Link>
        ) : '—'}
      </TableCell>
      <TableCell>
        {editing ? (
          <Slider value={[amount]} onValueChange={([v]) => setAmount(v)} min={0} max={100} step={1} className="w-24" />
        ) : (
          amount
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Slider value={[forTrade]} onValueChange={([v]) => setForTrade(Math.min(v, amount))} min={0} max={amount} step={1} className="w-24" />
        ) : (
          forTrade > 0 ? <Badge variant="secondary">{forTrade} FT</Badge> : '—'
        )}
      </TableCell>
      {isOwner && (
        <TableCell className="text-right">
          {editing ? (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" onClick={handleSave}><Check className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          )}
        </TableCell>
      )}
    </TableRow>
  )
}
```

**Step 3: Create `src/components/inventory/inventory-list.tsx`**

```tsx
import { Table, TableBody, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { InventoryItem } from './inventory-item'

interface InventoryListProps {
  items: Array<{
    id: string
    amount: number
    forTrade: number
    beer: { id: string; name: string; slug: string; style: string | null; abv: string | null }
    brewery: { name: string; slug: string } | null
  }>
  isOwner: boolean
  onUpdate: (id: string, amount: number, forTrade: number) => void
  onRemove: (id: string) => void
}

export function InventoryList({ items, isOwner, onUpdate, onRemove }: InventoryListProps) {
  if (items.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No beers in cellar yet.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Beer</TableHead>
          <TableHead>Brewery</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>For Trade</TableHead>
          {isOwner && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <InventoryItem
            key={item.id}
            item={item}
            isOwner={isOwner}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </TableBody>
    </Table>
  )
}
```

**Step 4: Create `src/routes/dashboard.tsx`**

```tsx
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { InventoryList } from '~/components/inventory/inventory-list'
import { getMe } from '~/server/functions/auth'
import { getUserInventory, updateInventory, removeFromInventory } from '~/server/functions/inventory'
import { useNotificationStore } from '~/lib/stores/notifications'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const user = await getMe()
    if (!user) {
      throw redirect({ to: '/auth' })
    }
    const inventory = await getUserInventory({ data: { userId: user.id } })
    return { user, inventory }
  },
  component: Dashboard,
})

function Dashboard() {
  const { user, inventory } = Route.useLoaderData()
  const router = useRouter()

  async function handleUpdate(id: string, amount: number, forTrade: number) {
    try {
      await updateInventory({ data: { id, amount, forTrade } })
      toast.success('Inventory updated')
      router.invalidate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeFromInventory({ data: { id } })
      toast.success('Beer removed from cellar')
      router.invalidate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-lg">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>
              {user.firstName} {user.lastName} &middot; {inventory.length} beers in cellar
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Cellar</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryList
            items={inventory}
            isOwner={true}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 5: Verify dashboard renders with seed data**

```bash
pnpm exec vinxi dev
```

This requires being authenticated. For manual testing, verify the route exists and redirects to /auth when not logged in.

**Step 6: Commit**

```bash
git add -A
git commit -m "Add dashboard page with inventory list, edit, and delete"
```

---

### Task 18: Beer list and detail pages

**Files:**
- Create: `src/routes/beers/index.tsx`
- Create: `src/routes/beers/$slug.tsx`

**Step 1: Create `src/routes/beers/index.tsx`**

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { listBeers } from '~/server/functions/beers'

export const Route = createFileRoute('/beers/')({
  validateSearch: z.object({ page: z.number().int().min(1).catch(1) }).parse,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps }) => listBeers({ data: { page: deps.page, limit: 20 } }),
  component: BeersList,
})

function BeersList() {
  const { beers, page, totalPages } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Beers</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beers.map((beer) => (
          <Card key={beer.id}>
            <CardHeader>
              <Link to="/beers/$slug" params={{ slug: beer.slug }}>
                <CardTitle className="hover:underline">{beer.name}</CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {beer.breweryName && <p>{beer.breweryName}</p>}
              {beer.style && <p>{beer.style}</p>}
              {beer.abv && <p>{beer.abv}% ABV</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link to="/beers" search={{ page: page - 1 }}>Previous</Link>
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link to="/beers" search={{ page: page + 1 }}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Create `src/routes/beers/$slug.tsx`**

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { getBeer } from '~/server/functions/beers'

export const Route = createFileRoute('/beers/$slug')({
  loader: async ({ params }) => getBeer({ data: { slug: params.slug } }),
  component: BeerDetails,
})

function BeerDetails() {
  const beer = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{beer.name}</h1>
        {beer.brewery && (
          <Link to="/breweries/$slug" params={{ slug: beer.brewery.slug }} className="text-muted-foreground hover:underline">
            {beer.brewery.name}
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-6">
          {beer.style && <Badge variant="secondary">{beer.style}</Badge>}
          {beer.abv && <Badge variant="outline">{beer.abv}% ABV</Badge>}
          {beer.ibu && <Badge variant="outline">{beer.ibu} IBU</Badge>}
        </CardContent>
      </Card>

      {beer.description && (
        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent><p>{beer.description}</p></CardContent>
        </Card>
      )}

      {beer.brewery && (
        <Card>
          <CardHeader><CardTitle>Brewery</CardTitle></CardHeader>
          <CardContent>
            <p className="font-medium">{beer.brewery.name}</p>
            <p className="text-sm text-muted-foreground">
              {[beer.brewery.city, beer.brewery.state, beer.brewery.country].filter(Boolean).join(', ')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "Add beer list and detail pages with pagination"
```

---

### Task 19: Brewery list and detail pages

**Files:**
- Create: `src/routes/breweries/index.tsx`
- Create: `src/routes/breweries/$slug.tsx`

**Step 1: Create `src/routes/breweries/index.tsx`**

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { listBreweries } from '~/server/functions/breweries'

export const Route = createFileRoute('/breweries/')({
  validateSearch: z.object({ page: z.number().int().min(1).catch(1) }).parse,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps }) => listBreweries({ data: { page: deps.page, limit: 20 } }),
  component: BreweriesList,
})

function BreweriesList() {
  const { breweries, page, totalPages } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Breweries</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {breweries.map((brewery) => (
          <Card key={brewery.id}>
            <CardHeader>
              <Link to="/breweries/$slug" params={{ slug: brewery.slug }}>
                <CardTitle className="hover:underline">{brewery.name}</CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{[brewery.city, brewery.state, brewery.country].filter(Boolean).join(', ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link to="/breweries" search={{ page: page - 1 }}>Previous</Link>
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link to="/breweries" search={{ page: page + 1 }}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Create `src/routes/breweries/$slug.tsx`**

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { getBrewery } from '~/server/functions/breweries'

export const Route = createFileRoute('/breweries/$slug')({
  loader: async ({ params }) => getBrewery({ data: { slug: params.slug } }),
  component: BreweryDetails,
})

function BreweryDetails() {
  const brewery = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{brewery.name}</h1>
        <p className="text-muted-foreground">
          {[brewery.city, brewery.state, brewery.country].filter(Boolean).join(', ')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beers ({brewery.beers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {brewery.beers.length === 0 ? (
            <p className="text-muted-foreground">No beers listed yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Style</TableHead>
                  <TableHead>ABV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brewery.beers.map((beer) => (
                  <TableRow key={beer.id}>
                    <TableCell>
                      <Link to="/beers/$slug" params={{ slug: beer.slug }} className="font-medium hover:underline">
                        {beer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{beer.style ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{beer.abv ? `${beer.abv}%` : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "Add brewery list and detail pages with beer listing"
```

---

### Task 20: Search page

**Files:**
- Create: `src/routes/search/beers.tsx`

**Step 1: Create `src/routes/search/beers.tsx`**

```tsx
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { getMe } from '~/server/functions/auth'
import { searchBeers } from '~/server/functions/search'
import { toast } from 'sonner'
import type { UntappdBeerResult } from '~/server/auth/untappd'

export const Route = createFileRoute('/search/beers')({
  loader: async () => {
    const user = await getMe()
    if (!user) throw redirect({ to: '/auth' })
    return { user }
  },
  component: BeerSearch,
})

function BeerSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UntappdBeerResult[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const data = await searchBeers({ data: { query: query.trim() } })
      setResults(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search Beers</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search for a beer..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit" disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((beer) => (
          <Card key={beer.untappdId}>
            <CardHeader>
              <CardTitle className="text-lg">{beer.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{beer.brewery.name}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {beer.style && <Badge variant="secondary">{beer.style}</Badge>}
                <Badge variant="outline">{beer.abv}% ABV</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && query && !loading && (
        <p className="text-center text-muted-foreground">No results found.</p>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "Add beer search page with Untappd API integration"
```

---

### Task 21: User list and profile pages

**Files:**
- Create: `src/routes/users/index.tsx`
- Create: `src/routes/users/$username.tsx`

**Step 1: Create `src/routes/users/index.tsx`**

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { Search } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { listUsers } from '~/server/functions/users'

export const Route = createFileRoute('/users/')({
  validateSearch: z.object({
    page: z.number().int().min(1).catch(1),
    search: z.string().optional(),
  }).parse,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) =>
    listUsers({ data: { page: deps.page, limit: 20, search: deps.search } }),
  component: UsersList,
})

function UsersList() {
  const { users, page, totalPages } = Route.useLoaderData()
  const search = Route.useSearch()
  const [query, setQuery] = useState(search.search ?? '')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <form className="flex gap-2" action="/users" method="get">
        <Input
          name="search"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Link key={user.id} to="/users/$username" params={{ username: user.username }}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatarUrl ?? undefined} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{user.username}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link to="/users" search={{ page: page - 1, search: search.search }}>Previous</Link>
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link to="/users" search={{ page: page + 1, search: search.search }}>Next</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Create `src/routes/users/$username.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { InventoryList } from '~/components/inventory/inventory-list'
import { getUser } from '~/server/functions/users'
import { getUserInventory } from '~/server/functions/inventory'

export const Route = createFileRoute('/users/$username')({
  loader: async ({ params }) => {
    const user = await getUser({ data: { username: params.username } })
    const inventory = await getUserInventory({ data: { userId: user.id } })
    return { user, inventory }
  },
  component: UserProfile,
})

function UserProfile() {
  const { user, inventory } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-lg">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>
              {user.firstName} {user.lastName}
              {user.location && ` \u00b7 ${user.location}`}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cellar ({inventory.length} beers)</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryList
            items={inventory}
            isOwner={false}
            onUpdate={() => {}}
            onRemove={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "Add user list and profile pages"
```

---

### Task 22: Settings page (theme switcher)

**Files:**
- Create: `src/routes/settings.tsx`

**Step 1: Install switch component**

```bash
pnpm dlx shadcn@latest add switch
```

**Step 2: Create `src/routes/settings.tsx`**

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { useThemeStore } from '~/lib/stores/theme'
import { getMe } from '~/server/functions/auth'

export const Route = createFileRoute('/settings')({
  loader: async () => {
    const user = await getMe()
    if (!user) throw redirect({ to: '/auth' })
    return {}
  },
  component: SettingsPage,
})

function SettingsPage() {
  const { mode, toggle } = useThemeStore()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Beer Cellar looks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mode === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <Label htmlFor="dark-mode">Dark mode</Label>
            </div>
            <Switch
              id="dark-mode"
              checked={mode === 'dark'}
              onCheckedChange={toggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "Add settings page with dark mode toggle"
```

---

## Phase 6: Deployment & Polish

### Task 23: Vercel deployment configuration

**Files:**
- Create: `vercel.json`
- Modify: `package.json` (engines)

**Step 1: Create `vercel.json`**

```json
{
  "framework": null,
  "buildCommand": "pnpm build",
  "outputDirectory": ".output",
  "installCommand": "pnpm install"
}
```

**Step 2: Add engines to `package.json`**

```json
{
  "engines": {
    "node": ">=20"
  }
}
```

**Step 3: Update `.env.example` with Neon production note**

Add a comment:

```
# Local dev: postgresql://localhost:5432/beercellar_dev
# Production: Use Neon connection string from dashboard
DATABASE_URL=postgresql://localhost:5432/beercellar_dev
```

**Step 4: Verify build works**

```bash
pnpm build
```

Expected: Builds successfully to `.output/` directory.

**Step 5: Commit**

```bash
git add -A
git commit -m "Add Vercel deployment configuration and build verification"
```

---

### Task 24: Playwright E2E setup

**Files:**
- Create: `playwright.config.ts`
- Create: `src/tests/e2e/home.test.ts`
- Modify: `package.json` (e2e script)

**Step 1: Install Playwright**

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

**Step 2: Create `playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm exec vinxi dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Step 3: Create `src/tests/e2e/home.test.ts`**

```typescript
import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Beer Cellar')
})

test('home page has sign in link', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('a[href="/auth"]')).toBeVisible()
})

test('navigation shows beer cellar brand', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('header')).toContainText('Beer Cellar')
})
```

**Step 4: Add E2E script to `package.json`**

```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

**Step 5: Run E2E tests**

```bash
pnpm test:e2e
```

Expected: 3 tests pass against the dev server.

**Step 6: Commit**

```bash
git add -A
git commit -m "Add Playwright E2E test setup with home page tests"
```

---

### Task 25: Final cleanup and README

**Files:**
- Modify: `package.json` (clean up old scripts, verify all new scripts)
- Create: `.nvmrc`

**Step 1: Create `.nvmrc`**

```
20
```

**Step 2: Verify all scripts in `package.json`**

Ensure the final scripts section includes:

```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "npx tsx src/server/db/seed.ts",
    "db:reset": "pnpm db:migrate && pnpm db:seed"
  }
}
```

**Step 3: Run full test suite**

```bash
pnpm test && pnpm test:e2e
```

Expected: All unit + integration + E2E tests pass.

**Step 4: Commit**

```bash
git add -A
git commit -m "Add .nvmrc and finalize package.json scripts"
```

---

## Summary of All Tasks

| # | Task | Phase |
|---|------|-------|
| 1 | Initialize TanStack Start project | Scaffolding |
| 2 | Add Tailwind CSS v4 and shadcn/ui | Scaffolding |
| 3 | Set up Vitest | Scaffolding |
| 4 | Set up local PostgreSQL and Drizzle ORM | Scaffolding |
| 5 | Write schema tests | Scaffolding |
| 6 | Add seed script for local development | Scaffolding |
| 7 | Session management and auth utilities | Auth |
| 8 | Auth server functions | Auth |
| 9 | Auth routes (login + OAuth callback) | Auth |
| 10 | Beers server functions | Server Functions |
| 11 | Breweries server functions | Server Functions |
| 12 | Inventory server functions | Server Functions |
| 13 | Users and Search server functions | Server Functions |
| 14 | Zustand stores | Client State |
| 15 | Root layout with navigation | Client State |
| 16 | Home page | Pages |
| 17 | Dashboard page | Pages |
| 18 | Beer list and detail pages | Pages |
| 19 | Brewery list and detail pages | Pages |
| 20 | Search page | Pages |
| 21 | User list and profile pages | Pages |
| 22 | Settings page (theme switcher) | Pages |
| 23 | Vercel deployment configuration | Deployment |
| 24 | Playwright E2E setup | Deployment |
| 25 | Final cleanup | Deployment |
