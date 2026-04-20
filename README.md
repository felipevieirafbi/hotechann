# Hotechann Satélite

Sistema operacional integrado ao ERP Tecnicon para a fábrica de produtos de
limpeza **Hotechann Faz**. Cobre cadastros, estoque, BOM/MRP com IA, produção
com QA bloqueante, e-commerce B2B, CRM Kanban e BI.

## Estrutura do monorepo

```
hotechann/
├── apps/
│   ├── api/       → NestJS (backend + Prisma)
│   ├── admin/     → Next.js (painel ERP/MRP/CRM interno)
│   ├── web/       → Next.js (e-commerce B2B público)
│   └── sad/       → Vite/React (Software Architecture Document interativo)
├── packages/
│   └── database/  → Prisma schema + client compartilhado
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Backend:** NestJS 10 + TypeScript
- **ORM:** Prisma + PostgreSQL 16
- **Frontend:** Next.js 15 (App Router) + TailwindCSS
- **Mensageria/ETL:** N8N (banco próprio isolado)
- **IA:** Google Gemini (Function Calling para MRP e substituições)

## Pré-requisitos

- Node.js ≥ 20
- pnpm ≥ 9 (`corepack enable && corepack use pnpm@latest`)
- Docker + Docker Compose (para o stack local)

## Setup inicial

```bash
# 1. Instalar dependências
pnpm install

# 2. Copiar e ajustar variáveis
cp .env.example .env

# 3. Subir o stack Docker (Postgres + API + Admin + Web + N8N)
docker compose up -d

# 4. Gerar o Prisma Client e rodar migrations
pnpm db:generate
pnpm db:migrate

# 5. Iniciar em modo dev (todos os apps em paralelo)
pnpm dev
```

## Portas padrão

| Serviço         | URL                       |
|-----------------|---------------------------|
| Admin (ERP)     | http://localhost:3000     |
| API (NestJS)    | http://localhost:3001/api |
| E-commerce Web  | http://localhost:3003     |
| SAD Dashboard   | http://localhost:3002     |
| N8N             | http://localhost:5678     |
| Postgres (app)  | localhost:5432            |

## Scripts úteis

```bash
pnpm dev              # todos os apps em watch
pnpm build            # build completo via turbo
pnpm typecheck        # type-check em todos os pacotes
pnpm db:studio        # abre o Prisma Studio
pnpm db:push          # aplica o schema (sem migrations)
pnpm db:migrate       # cria uma migration
```

## Branches

- `main` — produção
- `claude/*` — branches de análise/iteração com Claude
- `feature/*` — desenvolvimento de features
