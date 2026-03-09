# ========== Stage 1: Dependencies ==========
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# package*.json = package.json + package-lock.json (lock sunucuda yoksa sadece package.json kopyalanır)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ========== Stage 2: Builder ==========
FROM node:20-alpine AS builder
WORKDIR /app

# better-sqlite3 için build dependency
RUN apk add --no-cache python3 make g++

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./prisma/dev.db"

RUN npx prisma generate
RUN npm run build

# ========== Stage 3: Runner ==========
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Veritabanı için kalıcı dizin
RUN mkdir -p /app/data /app/prisma && chown -R nextjs:nodejs /app/data /app/prisma

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/entrypoint.sh ./
RUN chmod +x /app/entrypoint.sh

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/dev.db"

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
