# Beer Cellar — boom-ui Redesign

## Context

The app is functional but visually generic — white pages, black text, default shadcn components. The goal is a dark-first craft-beer aesthetic (warm amber/gold accents, taproom feel) with a togglable light theme, using `@whatisboom/boom-ui` as the component library.

This also addresses the search page's missing "add to cellar" functionality and URL state.

## Design Decisions

### Visual Direction
- **Dark mode default**: Deep warm charcoal backgrounds, amber/gold (`--boom-hue-accent: 35`) primary color
- **Light mode**: Warm cream/off-white backgrounds, same amber accent
- **Beer labels front-and-center**: Cards show label images as hero elements
- **List/grid toggle**: Users can switch between card grid (browsing) and table list (managing)

### Theme Configuration
```css
:root {
  --boom-hue-accent: 35;    /* amber/gold */
  --boom-hue-base: 30;      /* warm neutrals */
  --boom-sat-accent: 85;    /* rich but not neon */
  --boom-sat-base: 8;       /* subtle warmth in neutrals */
}
```

### Component Library Swap
Replace all `src/components/ui/` shadcn components and supporting libraries with boom-ui equivalents.

**Remove dependencies:**
- `radix-ui` (boom-ui wraps Radix internally)
- `sonner` (boom-ui has Toast/Toaster)
- `next-themes` (boom-ui has ThemeProvider + useTheme)
- `class-variance-authority` (boom-ui handles variants internally)
- `clsx` (boom-ui handles classnames internally)
- `tailwind-merge` (no longer needed without shadcn cn() pattern)

**Keep dependencies:**
- `lucide-react` (boom-ui doesn't bundle icons)
- `tailwindcss` (still used for layout utilities in route pages)
- `zustand` (app state — nav store can potentially be replaced by boom-ui's AppShell)

**Add dependencies:**
- `@whatisboom/boom-ui` (component library)
- `react-hook-form` (peer dep of boom-ui)
- `@hookform/resolvers` (peer dep of boom-ui)
- `framer-motion` (peer dep of boom-ui)

Note: `zod` and `react`/`react-dom` are already present.

### Component Mapping

| Current (shadcn) | boom-ui Replacement | Notes |
|---|---|---|
| Button | Button | Variants map directly |
| Card, CardHeader, CardTitle, etc. | Card + sub-components | Same API pattern |
| Badge | Badge | Direct swap |
| Dialog + sub-components | Dialog + sub-components | Direct swap |
| DropdownMenu + sub-components | DropdownMenu + sub-components | Direct swap |
| Input | Input | Direct swap |
| Label | Label | Direct swap |
| Sheet + sub-components | Drawer | boom-ui Drawer = side panel |
| Slider | Slider | boom-ui supports single + range |
| Alert, AlertTitle, AlertDescription | Alert + sub-components | Direct swap |
| Avatar, AvatarImage, AvatarFallback | Avatar | boom-ui Avatar handles fallback internally |
| Table + sub-components | Table + sub-components | Direct swap |
| Separator | Divider | Name change |
| Skeleton | Skeleton | Direct swap |
| Toaster (sonner wrapper) | Toast + ToastProvider | Provider wraps app root |

### Layout
Replace the current manual layout with boom-ui's `AppShell`:
- `AppShell` wraps the app with `Header` + `Sidebar` (collapsible on mobile)
- Replaces custom `SiteHeader` and `MobileNav` components
- Sidebar holds navigation, header holds user menu + theme toggle

### Search Page Redesign
1. **URL state**: Move query to search params via `validateSearch` + `loaderDeps` (same pattern as `/users` and `/beers`)
2. **Server-side search**: Move from client-side `useState` to loader-based data fetching
3. **Add to cellar**: Each search result card gets an inline expand with quantity picker + "Add to Cellar" button
4. **Server function**: New `addBeerFromUntappd` function that upserts the beer + brewery into the local DB, then adds to inventory — single server call

### Functional Fixes (bundled in)
- Error boundaries on dynamic routes (`/beers/$slug`, `/breweries/$slug`, `/users/$username`)
- Loading states via boom-ui Skeleton on all list pages
- Empty states on all list pages
- Confirmation dialog on inventory delete
- Consistent pagination component with page indicator

## Out of Scope
- Sorting/filtering on list pages
- Infinite scroll
- Beer description markdown rendering
- Social features beyond current functionality
