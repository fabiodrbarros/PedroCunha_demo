#!/bin/sh
set -e

echo "→ Applying database migrations…"
# Works for SQLite and PostgreSQL alike. Invoked via node so it doesn't depend
# on the .bin symlink keeping its executable bit through the image COPY.
node node_modules/prisma/build/index.js migrate deploy

# Seed only when explicitly requested (SEED_ON_START=true) — safe for first boot.
if [ "$SEED_ON_START" = "true" ]; then
  echo "→ Seeding database…"
  node node_modules/prisma/build/index.js db seed || echo "seed skipped/failed"
fi

echo "→ Starting Pedro Cunha Carpintaria on :${PORT:-3000}"
exec "$@"
