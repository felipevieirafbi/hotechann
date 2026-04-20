/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Server, 
  Database,
  FileCode,
  FolderTree,
  TerminalSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const files = [
  { id: 'schema', name: 'schema.prisma', path: '/schema.prisma', icon: Database, bg: 'bg-emerald-500/10', color: 'text-emerald-400' },
  { id: 'docker', name: 'docker-compose.yml', path: '/docker-compose.yml', icon: Server, bg: 'bg-blue-500/10', color: 'text-blue-400' },
  { id: 'env', name: '.env.example', path: '/.env.example', icon: TerminalSquare, bg: 'bg-yellow-500/10', color: 'text-yellow-400' },
];

export default function App() {
  const [activeFile, setActiveFile] = useState(files[0]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#00FF00] selection:text-black">
      {/* Navbar / Header */}
      <header className="border-b border-[#2A2A2A] bg-[#0A0A0A] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#00FF00] flex items-center justify-center">
            <FolderTree className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Hotechann<span className="text-[#00FF00] font-bold">FAZ</span> Repository</h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#7A7A7A]">
          Monorepo Skeleton Generator
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto flex flex-col md:flex-row h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-72 border-r border-[#2A2A2A] overflow-y-auto bg-[#141414] p-4">
          <div className="pb-4 pt-2 border-b border-[#222] mb-4">
            <span className="text-[10px] font-mono text-[#777] uppercase tracking-wider ml-1">Project Root</span>
            <div className="mt-2 text-xs font-bold font-mono text-[#DDD]">github.com/felipevieirafbi/hotechann</div>
          </div>
          
          <nav className="space-y-1">
            {files.map((file) => {
              const Icon = file.icon;
              const isActive = activeFile.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFile(file)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium border ${
                    isActive 
                      ? 'bg-[#1F1F1F] text-white border-[#333] shadow-sm' 
                      : 'text-[#A0A0A0] border-transparent hover:bg-[#1A1A1A] hover:text-[#E0E0E0]'
                  }`}
                >
                  <div className={`p-1.5 rounded ${isActive ? file.bg : ''}`}>
                     <Icon className={`w-4 h-4 ${isActive ? file.color : 'text-[#666]'}`} />
                  </div>
                  {file.name}
                </button>
              );
            })}
          </nav>
          
          <div className="mt-8 bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
             <h4 className="text-xs font-bold text-[#00FF00] uppercase font-mono tracking-wider mb-2">Export to GitHub</h4>
             <p className="text-xs text-[#888] leading-relaxed">
               Use the platform's settings menu to export these generated files directly as a ZIP or to your GitHub Applet Branch.
             </p>
          </div>
        </aside>

        {/* Content Area - Code Viewer */}
        <section className="flex-1 overflow-hidden flex flex-col bg-[#0E0E0E]">
           <div className="h-10 bg-[#141414] border-b border-[#2A2A2A] flex items-center px-4 gap-2 text-xs font-mono text-[#888]">
              <FileCode className="w-4 h-4" />
              {activeFile.path}
           </div>
           
           <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#0E0E0E]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFile.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <CodeBlock fileId={activeFile.id} />
                </motion.div>
              </AnimatePresence>
           </div>
        </section>
      </main>
    </div>
  );
}

function CodeBlock({ fileId }: { fileId: string }) {
  const content = getCodeContent(fileId);
  return (
    <pre className="font-mono text-sm leading-relaxed text-[#D4D4D4] p-4 bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-x-auto">
      <code>{content}</code>
    </pre>
  );
}

function getCodeContent(id: string) {
  if (id === 'schema') return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -----------------------------------------
// 1. Catálogo e Produtos
// -----------------------------------------

enum ProductType {
  FINISHED_GOOD // Produto Acabado (PA)
  RAW_MATERIAL  // Matéria-Prima (MP)
  PACKAGING     // Embalagem
}

model Product {
  id          String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  sku         String      @unique
  name        String
  description String?
  type        ProductType
  unit        String      @default("L") // L, KG, UN
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relacionamentos
  formulasAsOutput    BomFormula[]      @relation("FinishedGood")
  itemsAsComponent    BomItem[]         @relation("RawMaterial")
  substitutes         BomSubstitution[] @relation("SubstituteMaterial")
  stockMovements      StockMovement[]
}

// -----------------------------------------
// 2. Engenharia: Bill of Materials (BOM)
// -----------------------------------------

model BomFormula {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  productId      String   @db.Uuid
  baseYieldQty   Decimal  @db.Decimal(10, 2) // Ex: Rende 1000 Litros
  version        String   @default("1.0")
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())

  // Relacionamentos
  product        Product           @relation("FinishedGood", fields: [productId], references: [id])
  items          BomItem[]
  orders         ProductionOrder[]
}

model BomItem {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  bomId          String   @db.Uuid
  rawMaterialId  String   @db.Uuid
  requiredQty    Decimal  @db.Decimal(10, 4) // Quantidade base

  // Relacionamentos
  bomFormula     BomFormula        @relation(fields: [bomId], references: [id])
  rawMaterial    Product           @relation("RawMaterial", fields: [rawMaterialId], references: [id])
  substitutions  BomSubstitution[]
}

model BomSubstitution {
  id                   String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  bomItemId            String   @db.Uuid
  substituteMaterialId String   @db.Uuid
  conversionFactor     Decimal  @default(1.0) @db.Decimal(10, 4)
  aiPreferenceScore    Int      @default(50)

  // Relacionamentos
  bomItem              BomItem  @relation(fields: [bomItemId], references: [id])
  substituteMaterial   Product  @relation("SubstituteMaterial", fields: [substituteMaterialId], references: [id])
}

// -----------------------------------------
// 3. Estoque e Movimentação
// -----------------------------------------

enum MovementType {
  IN_PURCHASE
  IN_PRODUCTION
  OUT_PRODUCTION
  OUT_SALE
  ADJUSTMENT
}

model StockMovement {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  productId      String       @db.Uuid
  warehouseId    String       
  type           MovementType
  quantity       Decimal      @db.Decimal(10, 4)
  lotCode        String?      
  documentRef    String?      

  createdAt      DateTime     @default(now())
  
  product        Product      @relation(fields: [productId], references: [id])
}

// -----------------------------------------
// 4. Produção (MRP), Traceabilidade e QA
// -----------------------------------------

enum OrderStatus {
  PLANNED
  IN_PROGRESS
  AWAITING_QA
  COMPLETED
  CANCELED
}

model ProductionOrder {
  id             String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  bomId          String      @db.Uuid
  status         OrderStatus @default(PLANNED)
  plannedQty     Decimal     @db.Decimal(10, 2)
  actualQty      Decimal?    @db.Decimal(10, 2)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  bomFormula     BomFormula  @relation(fields: [bomId], references: [id])
  lots           ProductionLot[]
}

model ProductionLot {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  productionOrderId   String   @db.Uuid
  finalLotCode        String   @unique
  consumedLots        Json     
  manufacturedDate    DateTime @default(now())

  order               ProductionOrder     @relation(fields: [productionOrderId], references: [id])
  qaLogs              QualityControlLog[]
}

enum QaStatus {
  QUARANTINE
  APPROVED
  REJECTED
}

model QualityControlLog {
  id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  productionLotId     String   @db.Uuid
  status              QaStatus @default(QUARANTINE)
  resultsData         Json?    
  analyzedByRef       String?  
  createdAt           DateTime @default(now())

  lot                 ProductionLot @relation(fields: [productionLotId], references: [id])
}
`;

  if (id === 'docker') return `version: '3.8'

services:
  # -----------------------------------
  # 1. Banco de Dados Base (PostgreSQL)
  # -----------------------------------
  postgres:
    image: postgres:15-alpine
    container_name: hotechann-db
    restart: always
    environment:
      POSTGRES_USER: \${DB_USER:-hotechann}
      POSTGRES_PASSWORD: \${DB_PASS:-secret123}
      POSTGRES_DB: \${DB_NAME:-hotechann_prod}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hotechann -d hotechann_prod"]
      interval: 10s
      timeout: 5s
      retries: 5

  # -----------------------------------
  # 2. API Backend (NestJS)
  # -----------------------------------
  api:
    build:
      context: .
      dockerfile: ./apps/api/Dockerfile
    container_name: hotechann-api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://\${DB_USER:-hotechann}:\${DB_PASS:-secret123}@postgres:5432/\${DB_NAME:-hotechann_prod}?schema=public
      PORT: 3001
    ports:
      - "3001:3001"

  # -----------------------------------
  # 3. Painel Admin / ERP (Next.js)
  # -----------------------------------
  admin:
    build:
      context: .
      dockerfile: ./apps/admin/Dockerfile
    container_name: hotechann-admin
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      PORT: 3000
    ports:
      - "3000:3000"

  # -----------------------------------
  # 4. Middleware & ETL (N8N)
  # -----------------------------------
  n8n:
    image: n8nio/n8n:latest
    container_name: hotechann-n8n
    restart: always
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=\${DB_NAME:-hotechann_prod}
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=\${DB_USER:-hotechann}
      - DB_POSTGRESDB_PASSWORD=\${DB_PASS:-secret123}
      - N8N_DIAGNOSTICS_ENABLED=false
      - WEBHOOK_URL=https://n8n.seusistema.com.br/
    ports:
      - "5678:5678"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  n8n_data:
`;

  if (id === 'env') return `# -------------------------------------------------------------
# ARQUIVO DE CONFIGURAÇÃO DE AMBIENTE (.ENV.EXAMPLE)
# -------------------------------------------------------------

# --- Configurações Cloud Run / AI Studio (Padrão) ---
GEMINI_API_KEY="seu-token-gemini-aqui"
APP_URL="http://localhost:3000"

# --- Configurações de Banco de Dados ---
DB_USER="hotechann"
DB_PASS="secretR00tP4ssw0rd!"
DB_NAME="hotechann_prod"
# Prisma URL que será consumida pelo NestJS e N8N
DATABASE_URL="postgresql://\${DB_USER}:\${DB_PASS}@localhost:5432/\${DB_NAME}?schema=public"

# --- Configurações Web / Next.js ---
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_COMPANY_NAME="Hotechann Faz"

# --- Integrações Internas ---
# Chaves usadas para autorizar o N8N a chamar rotas do NestJS de forma privada
INTERNAL_API_SECRET="gerar_um_hash_aleatorio_seguro"
N8N_BASIC_AUTH_USER="admin"
N8N_BASIC_AUTH_PASSWORD="n8n_password_forte"

# --- Chaves Futuras (Apenas placeholders) ---
# TECNICON_ODBC_DSN=""
# WHATSAPP_EVOLUTION_API_KEY=""
`;
  return '';
}-1.5 flex-shrink-0"></div>
               {item}
             </li>
           ))}
         </ul>
      </div>
    </div>
  );
}

