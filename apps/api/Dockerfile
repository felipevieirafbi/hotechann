FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS builder
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY packages/database/package.json packages/database/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile=false
COPY packages/database packages/database
COPY apps/api apps/api
RUN pnpm --filter @hotechann/database db:generate
RUN pnpm --filter @hotechann/api build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/api/dist ./apps/api/dist
COPY --from=builder /repo/apps/api/package.json ./apps/api/
COPY --from=builder /repo/packages/database ./packages/database
EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
