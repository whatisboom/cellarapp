# ============================================
# Base image — shared across all stages
# ============================================
FROM node:24-alpine AS base

# Enable pnpm via corepack (built into Node 24+)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set up non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

WORKDIR /app

# ============================================
# Install dependencies (cached layer)
# ============================================
FROM base AS deps

# Copy only lockfile + package.json for layer caching
# This layer rebuilds only when dependencies change
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ============================================
# Production dependencies only (smaller)
# ============================================
FROM base AS deps-prod

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ============================================
# Build stage — compile the application
# ============================================
FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TanStack Start app
# Output goes to dist/server/server.js (entry) + dist/client/ (static assets)
RUN pnpm build

# ============================================
# Production image — minimal, secure
# ============================================
FROM base AS production

ENV NODE_ENV=production
ENV PORT=3000

# Use production-only node_modules (no devDeps)
COPY --from=deps-prod /app/node_modules ./node_modules

# Copy build output
# dist/server/server.js — Node.js server entry point
# dist/client/ — static assets served by the server
COPY --from=build /app/dist ./dist

# Copy package.json for any runtime needs
COPY package.json ./

# Copy Drizzle migrations so we can run them from inside the container
COPY src/server/db/migrations ./src/server/db/migrations
COPY drizzle.config.ts ./

# Switch to non-root user
USER appuser

EXPOSE ${PORT}

# Health check — wget is available in Alpine, no need for curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

CMD ["node", "dist/server/server.js"]

# ============================================
# Development image — for docker compose dev
# Used only if running the app in Docker (optional)
# ============================================
FROM base AS development

ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Source code is bind-mounted at runtime via docker-compose volumes
# This COPY is a fallback if not using volumes
COPY . .

EXPOSE 3000

# --host 0.0.0.0 required so the dev server is accessible outside the container
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
