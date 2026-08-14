# =========================================================
# Phase 10 Production Hardened Dockerfile
# Monorepo Multi-Stage Container Build
# =========================================================

# Stage 1: Base & Dependencies
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm turbo

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Stage 3: Runner (Minimal Production Runtime)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security Hardening: Run as non-root user
USER node

COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages ./packages

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]
