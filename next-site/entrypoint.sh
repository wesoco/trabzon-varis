#!/bin/sh
set -e

# Prisma şemasını SQLite veritabanına uygula (migrations yoksa db push kullanır)
cd /app && npx prisma db push --accept-data-loss 2>/dev/null || true

exec "$@"
