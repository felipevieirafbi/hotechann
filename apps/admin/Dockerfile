FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS builder
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY apps/admin/package.json apps/admin/
RUN pnpm install --frozen-lockfile=false
COPY apps/admin apps/admin
RUN pnpm --filter @hotechann/admin build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /repo/apps/admin/.next/standalone ./
COPY --from=builder /repo/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /repo/apps/admin/public ./apps/admin/public 2>/dev/null || true
EXPOSE 3000
CMD ["node", "apps/admin/server.js"]
