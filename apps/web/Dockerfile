FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS builder
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile=false
COPY apps/web apps/web
RUN pnpm --filter @hotechann/web build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./apps/web/.next/static
EXPOSE 3001
CMD ["node", "apps/web/server.js"]
