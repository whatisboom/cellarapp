# Implementation Plan: boom-ui Redesign

Reference: [Design Doc](./2026-03-16-boom-ui-redesign-design.md)

## Phase 1: Foundation — Swap Dependencies & Theme

### Step 1: Install boom-ui, remove shadcn dependencies
- `pnpm add @whatisboom/boom-ui react-hook-form @hookform/resolvers framer-motion`
- `pnpm remove radix-ui sonner next-themes class-variance-authority clsx tailwind-merge`
- Verify build still compiles (it won't yet — imports will break, that's expected)
- Commit: dependency swap

### Step 2: Configure boom-ui theme
- Replace `src/styles/` content with boom-ui style import (`@import '@whatisboom/boom-ui/styles'`) plus custom CSS variables for amber/gold taproom theme
- Wrap app root (`src/routes/__root.tsx`) with `ThemeProvider` and `ToastProvider` from boom-ui
- Remove `next-themes` ThemeProvider usage
- Remove zustand theme store (`src/lib/stores/theme.ts`) — boom-ui's `useTheme()` replaces it
- Update settings page to use boom-ui `useTheme()` hook
- Verify dark/light toggle works
- Commit: boom-ui theme integration

### Step 3: Delete shadcn components
- Delete entire `src/components/ui/` directory
- Delete `src/lib/utils.ts` (the `cn()` helper)
- Delete `src/components/notifications/toast-container.tsx` (replaced by boom-ui ToastProvider)
- Commit: remove shadcn components

## Phase 2: Layout — AppShell, Navigation

### Step 4: Implement AppShell layout
- Replace root layout in `__root.tsx` with boom-ui `AppShell` + `Header` + `Sidebar`
- Migrate `SiteHeader` navigation items to `Sidebar` with `Sidebar.Nav` + `Sidebar.Item`
- Move user dropdown menu + theme toggle to `Header`
- Delete `src/components/nav/site-header.tsx` and `src/components/nav/mobile-nav.tsx`
- Delete zustand nav store (`src/lib/stores/nav.ts`) — boom-ui AppShell handles mobile menu state
- Verify navigation works on desktop and mobile
- Commit: boom-ui AppShell layout

## Phase 3: Page-by-Page Component Migration

Migrate each page from shadcn imports to boom-ui imports. For each page: update imports, adjust component API differences, verify page renders correctly.

### Step 5: Landing page (`src/routes/index.tsx`)
- Swap Card, Button imports to boom-ui
- Add beer-themed hero section using boom-ui Hero component
- Commit

### Step 6: Auth pages (`src/routes/auth/index.tsx`, `src/routes/auth/oauth.untappd.tsx`)
- Swap Card, Button, Alert imports to boom-ui
- Commit

### Step 7: Dashboard (`src/routes/dashboard.tsx`)
- Swap Card, Avatar imports to boom-ui
- Add beer label images to inventory display
- Commit

### Step 8: Inventory components (`src/components/inventory/`)
- Swap Table, Button, Slider, Badge, TableCell/TableRow imports to boom-ui
- Add delete confirmation using boom-ui Popover or Dialog
- Add list/grid view toggle (boom-ui Button group for switching)
- Commit

### Step 9: Beer pages (`src/routes/beers/index.tsx`, `src/routes/beers/$slug.tsx`)
- Swap Card, Badge, Button imports to boom-ui
- Display beer label images prominently on cards and detail page
- Add list/grid toggle on index page
- Add loading skeleton + empty state
- Commit

### Step 10: Brewery pages (`src/routes/breweries/index.tsx`, `src/routes/breweries/$slug.tsx`)
- Swap Card, Table, Button imports to boom-ui
- Add loading skeleton + empty state
- Commit

### Step 11: User pages (`src/routes/users/index.tsx`, `src/routes/users/$username.tsx`)
- Swap Card, Avatar, Button, Input imports to boom-ui
- Add loading skeleton + empty state
- Commit

### Step 12: Settings page (`src/routes/settings.tsx`)
- Swap Card, Button, Label imports to boom-ui
- Wire theme toggle to boom-ui's `useTheme()`
- Commit

## Phase 4: Search Page — New Functionality

### Step 13: Add `addBeerFromUntappd` server function
- New server function in `src/server/functions/inventory.ts` (or new file)
- Accepts full Untappd beer result data
- Upserts brewery (by untappdId) → upserts beer (by untappdId) → adds to inventory
- Returns the created inventory item
- Add tests
- Commit

### Step 14: Redesign search page
- Move query state to URL search params (`validateSearch` + `loaderDeps`)
- Move search to loader (server-side fetch)
- Display results as cards with beer label images
- Each card has inline "Add to Cellar" expand: quantity slider + forTrade slider + add button
- Show success/error via boom-ui Toast
- Handle "already in cellar" state (show badge instead of add button)
- Add list/grid toggle
- Commit

## Phase 5: Error Handling & Polish

### Step 15: Error boundaries and 404 handling
- Add `errorComponent` to dynamic routes (`/beers/$slug`, `/breweries/$slug`, `/users/$username`)
- Add `notFoundComponent` to root route
- Use boom-ui Alert or EmptyState for error display
- Commit

### Step 16: Pagination component
- Extract shared pagination UI into a reusable component (used by beers, breweries, users)
- Show "Page X of Y" consistently
- Commit

### Step 17: Final cleanup
- Remove any unused imports, dead code, or orphaned files
- Run full test suite, fix any failures from component swap
- Verify all pages render correctly in dark and light mode
- Verify mobile responsiveness
- Commit

## Verification Checklist
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] All pages render in dark mode
- [ ] All pages render in light mode
- [ ] Theme toggle persists across page reloads
- [ ] Search page query is in the URL (shareable, back/forward works)
- [ ] Add to cellar works from search results
- [ ] Inventory edit/delete works on dashboard
- [ ] Mobile navigation works (AppShell sidebar)
- [ ] No shadcn/radix-ui/sonner/next-themes imports remain
- [ ] No `src/components/ui/` directory remains
