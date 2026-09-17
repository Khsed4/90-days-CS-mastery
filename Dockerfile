# ─────────────────────────────────────────────────────────────
# Root Multi-Stage Dockerfile for 90-Days CS Mastery Monorepo
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# Install native compilation tools and OpenSSL for Prisma & bcrypt
RUN apk add --no-cache python3 make g++ openssl libc6-compat

# Install all monorepo dependencies once
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# Copy monorepo source code
COPY . .

# ─────────────────────────────────────────────
# Target: api (NestJS on port 4000)
# ─────────────────────────────────────────────
FROM base AS api
ENV PORT=4000
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npx nx serve api"]

# ─────────────────────────────────────────────
# Target: web (Next.js on port 3000)
# ─────────────────────────────────────────────
FROM base AS web
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "npx nx serve web"]

# ─────────────────────────────────────────────
# Target: all (Runs both in a single container)
# ─────────────────────────────────────────────
FROM base AS all
EXPOSE 3000 4000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npx nx run-many --target=serve --projects=api,web --parallel=2"]
