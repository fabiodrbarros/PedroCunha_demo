# ─────────────────────────────────────────────────────────────
#  Pedro Cunha Carpintaria — production image (Next.js standalone)
# ─────────────────────────────────────────────────────────────

# 1. Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
# Prisma schema is needed because `npm ci` runs the `prisma generate`
# postinstall hook, which looks for prisma/schema.prisma.
COPY prisma ./prisma
RUN npm ci

# 2. Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public site URL is inlined into the client bundle at build time.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

# An empty throwaway DB so generateStaticParams/sitemap can run during build.
# (Real data lives in the runtime volume; detail pages render on demand.)
ENV DATABASE_URL="file:/tmp/build.db"
RUN npx prisma generate \
  && npx prisma migrate deploy \
  && npm run build

# 3. Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server + assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Full node_modules so the Prisma CLI (`migrate deploy` at startup) has all of
# its dependencies — the slim copy missed transitive deps such as `effect`
# (pulled in by @prisma/config). Plus the schema + migrations.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Entrypoint runs migrations, then launches the server
COPY --from=builder /app/scripts/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Writable dirs for SQLite db + uploads
RUN mkdir -p /data /app/public/uploads \
  && chown -R nextjs:nodejs /data /app/public/uploads /app/prisma

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
