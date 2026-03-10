# Beer Cellar Full Modernization Design

**Date:** 2026-03-02
**Approach:** Greenfield rewrite — new TanStack Start project, migrate features incrementally, consolidate frontend + backend into one repo.

---

## Target Stack

| Layer | Technology | Replaces |
|-------|-----------|----------|
| Framework | TanStack Start (React 19) | React 16 SPA + Express API |
| Routing | TanStack Router (file-based, type-safe) | @reach/router |
| Data fetching | TanStack Query | Manual fetch + Redux caching |
| Client state | Zustand | Redux |
| UI | shadcn/ui + Tailwind CSS v4 | Material-UI v3 |
| Database | PostgreSQL in Docker + Drizzle ORM | MongoDB + Mongoose |
| Auth | JWT in httpOnly cookies, Untappd OAuth | JWT in localStorage |
| Testing | Vitest + Playwright | Jest (minimal coverage) |
| Deployment | Docker containers (self-hosted) | Heroku |
| Package manager | pnpm | npm |

---

## Project Structure

```
src/
├── app/                    # TanStack Router routes (file-based)
│   ├── __root.tsx          # Root layout (nav, theme, notifications)
│   ├── index.tsx           # Home page
│   ├── dashboard.tsx       # User dashboard
│   ├── settings.tsx        # User settings
│   ├── auth/
│   │   ├── index.tsx       # Login page
│   │   └── oauth.untappd.tsx
│   ├── beers/
│   │   ├── index.tsx       # Beer list
│   │   └── $slug.tsx       # Beer details
│   ├── breweries/
│   │   ├── index.tsx       # Brewery list
│   │   └── $slug.tsx       # Brewery details
│   ├── search/
│   │   └── beers.tsx       # Beer search
│   └── users/
│       ├── index.tsx       # User list
│       └── $username.tsx   # User profile
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── nav/                # Navigation
│   ├── inventory/          # Inventory list + edit
│   └── cards/              # Beer, brewery, user cards
├── server/
│   ├── functions/          # TanStack Start server functions
│   │   ├── auth.ts
│   │   ├── beers.ts
│   │   ├── breweries.ts
│   │   ├── inventory.ts
│   │   ├── search.ts
│   │   └── users.ts
│   ├── db/
│   │   ├── schema.ts       # Drizzle schema
│   │   ├── migrations/
│   │   └── index.ts        # DB connection
│   ├── auth/
│   │   ├── index.ts        # Auth interface
│   │   ├── untappd.ts      # Untappd OAuth provider
│   │   └── session.ts      # Cookie/JWT management
│   └── middleware/
├── lib/
│   ├── stores/             # Zustand stores
│   └── utils/
├── styles/
│   └── globals.css
└── tests/
    ├── unit/
    ├── component/
    └── e2e/
```

---

## Database Schema (PostgreSQL via Drizzle)

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| username | VARCHAR(50) | UNIQUE NOT NULL |
| email | VARCHAR(255) | UNIQUE |
| avatar_url | VARCHAR(500) | |
| role | VARCHAR(20) | DEFAULT 'user' |
| auth_provider | VARCHAR(50) | NOT NULL |
| auth_provider_id | VARCHAR(255) | NOT NULL |
| untappd_api_key | VARCHAR(255) | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

UNIQUE(auth_provider, auth_provider_id)

### breweries
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | UNIQUE NOT NULL |
| untappd_id | INTEGER | UNIQUE |
| location | VARCHAR(255) | |
| logo_url | VARCHAR(500) | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

### beers
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | UNIQUE NOT NULL |
| untappd_id | INTEGER | UNIQUE |
| brewery_id | UUID | REFERENCES breweries(id) |
| style | VARCHAR(255) | |
| abv | DECIMAL(4,2) | |
| ibu | INTEGER | |
| description | TEXT | |
| label_url | VARCHAR(500) | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

### inventory
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | REFERENCES users(id) ON DELETE CASCADE |
| beer_id | UUID | REFERENCES beers(id) ON DELETE CASCADE |
| amount | INTEGER | NOT NULL DEFAULT 1, CHECK >= 0 |
| for_trade | INTEGER | NOT NULL DEFAULT 0, CHECK >= 0 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

UNIQUE(user_id, beer_id), CHECK(for_trade <= amount)

---

## Auth Design

**JWT in httpOnly cookies** — fixes the XSS vulnerability from localStorage storage.

- `loginWithUntappd(code)` → exchange OAuth code, create/find user, set JWT + refresh cookies
- `refreshToken()` → read refresh cookie, issue new JWT cookie
- `logout()` → clear both cookies
- `getMe()` → read JWT cookie, return current user

Cookie settings: `httpOnly: true, secure: true, sameSite: 'lax'`

Auth is abstracted behind an interface (`server/auth/index.ts`) so the Untappd provider can be swapped for a managed service (Clerk, Auth.js) later without changing route code.

---

## Server Functions

### auth.ts
- `loginWithUntappd(code: string)` — OAuth flow, sets cookies
- `refreshToken()` — refresh JWT from cookie
- `logout()` — clear cookies
- `getMe()` — current user from JWT

### beers.ts
- `listBeers(page, limit)` — paginated
- `getBeer(slug)` — with brewery join

### breweries.ts
- `listBreweries(page, limit)` — paginated
- `getBrewery(slug)` — with beers join

### inventory.ts
- `addToInventory(beerId)` — auth required, creates inventory row
- `updateInventory(id, amount, forTrade)` — auth + ownership check
- `removeFromInventory(id)` — auth + ownership check

### search.ts
- `searchBeers(query)` — Untappd API with input validation

### users.ts
- `listUsers(search, page, limit)` — parameterized search (no RegExp)
- `getUser(username)` — profile with inventory

All functions validate input with Zod schemas and return typed results.

---

## Client State (Zustand)

| Store | State | Purpose |
|-------|-------|---------|
| useThemeStore | `mode: 'light' \| 'dark'`, `toggle()` | Persisted to localStorage |
| useNavStore | `open: boolean`, `toggle()` | Mobile nav drawer |
| useNotificationStore | `notifications[]`, `add()`, `dismiss()` | Toast notifications |

Server state (user, beers, inventory, etc.) managed entirely by TanStack Query — no Redux.

---

## Issues Fixed

### Bugs
- Notifications reducer missing return on ERROR_NOTIFICATION
- RegExp injection in user search → parameterized queries
- Silent `catch (e) {}` everywhere → proper error handling + UI states
- `for_trade > amount` possible → DB CHECK constraint
- No pagination on lists → all lists paginated
- `findIndex` not checked for -1 → proper null handling
- Deprecated `componentWillMount` → modern React patterns
- Deep clone in reducer (JSON.parse/stringify) → eliminated with Zustand

### Security
- JWT localStorage → httpOnly cookies (XSS fix)
- Open CORS → same-origin (server functions, no CORS needed)
- No input validation → Zod on all mutations
- RegExp injection → parameterized SQL queries
- No rate limiting → rate limiting middleware

### Dead Code Removed
- Unused form components: Email, Username, Password, Text, ButtonLink, BaseButton, SubmitButton
- Empty validation.ts
- Unused deps: parcel-bundler, ts-loader, validate.js
- Mixed Babel 6/7 configs
- Redundant barrel index files

### Missing Features Added
- Pagination on all list endpoints
- Loading skeletons and error states on every page
- Proper logout (cookie clearing)
- Input validation on all mutations
