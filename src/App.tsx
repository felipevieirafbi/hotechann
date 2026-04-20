/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Workflow, 
  Cpu, 
  GitBranch, 
  Layers, 
  Box, 
  Activity, 
  Network,
  Kanban,
  ShoppingCart,
  Bot,
  ShieldCheck,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const sections = [
  { id: 'overview', title: 'Visão Geral', icon: Activity },
  { id: 'stack', title: 'Stack Tecnológico', icon: Layers },
  { id: 'integration', title: 'Estratégia de Integração', icon: Workflow },
  { id: 'data', title: 'Modelagem MRP & BOM', icon: Database },
  { id: 'ai', title: 'Motor de IA (MRP)', icon: Bot },
  { id: 'roadmap', title: 'Roadmap de Fases', icon: GitBranch },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#EDEDED] font-sans selection:bg-[#00FF00] selection:text-black">
      {/* Navbar / Header */}
      <header className="border-b border-[#2A2A2A] bg-[#0A0A0A] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#00FF00] flex items-center justify-center">
            <Server className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Hotechann<span className="text-[#00FF00] font-bold">FAZ</span> Satélite</h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#7A7A7A]">
          Software Architecture Document (SAD)
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col md:flex-row h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-[#2A2A2A] overflow-y-auto bg-[#141414]">
          <nav className="p-4 space-y-1">
            <div className="pb-4 pt-2">
              <span className="text-[10px] font-mono text-[#555] uppercase tracking-wider ml-3">Índice do Documento</span>
            </div>
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${
                    isActive 
                      ? 'bg-[#1F1F1F] text-[#00FF00] shadow-[inset_2px_0_0_#00FF00]' 
                      : 'text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-[#E0E0E0]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {sec.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-8 relative bg-gradient-to-br from-[#0E0E0E] to-[#121212]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <ContentRouter id={activeSection} />
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function ContentRouter({ id }: { id: string }) {
  switch (id) {
    case 'overview': return <OverviewSection />;
    case 'stack': return <StackSection />;
    case 'integration': return <IntegrationSection />;
    case 'data': return <DataModelingSection />;
    case 'ai': return <AISection />;
    case 'roadmap': return <RoadmapSection />;
    default: return <OverviewSection />;
  }
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        01 / Arquitetura Macro & Ajustes
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">A Nova Fundação Satélite</h2>
      <p className="text-[#A0A0A0] text-lg leading-relaxed mb-8">
        Projeto de arquitetura mesclada para o "Satélite Inteligente" da fábrica Hotechann Faz. 
        Este sistema englobará Engenharia Dinâmica (MRP/BOM), Automação de Vendas (E-commerce Next.js) e Módulos de Qualidade Indústrial (QA/FISPQ), atuando paralelamente ao fiscal do Legado Tecnicon.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Kanban, title: 'CRM & Vendas', desc: 'Múltiplos funis Kanban para E-commerce, Representantes e Pregões.' },
          { icon: Box, title: 'Gestão Avançada de Estoque', desc: 'Inventário real vs. Produção, disparo de compras e múltiplos almoxarifados.' },
          { icon: ShieldCheck, title: 'Controle de Qualidade (QA)', desc: 'Nova exigência! Lotes finalizados entram em Quarentena e só vão para venda após aprovação laboratorial.' },
          { icon: Workflow, title: 'Integração Tecnicon via N8N', desc: 'Foco inicial em CSV/XML orquestrado pelo N8N, mitigando o risco de bloqueios de API antigas.' }
        ].map((feat, i) => (
          <div key={i} className="p-5 rounded-xl border border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A] transition">
             <div className="w-10 h-10 rounded bg-[#1F1F1F] flex items-center justify-center mb-4">
               <feat.icon className="w-5 h-5 text-[#00FF00]" />
             </div>
             <h3 className="text-white font-medium mb-2">{feat.title}</h3>
             <p className="text-sm text-[#8A8A8A]">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackSection() {
  return (
    <div className="space-y-6">
       <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        02 / Decisão Tecnológica
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Stack Realista e Definitivo</h2>
      
      <div className="space-y-4 mt-6">
        <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-5 h-5 text-[#00FF00]" />
            <h3 className="text-lg font-medium text-white">Infraestrutura VPS: Hetzner Cloud</h3>
          </div>
          <p className="text-[#A0A0A0] text-sm">
            Hostgator descartado para o backend (não tolera mensageria longa). Decisão por <strong>VPS na Hetzner</strong> (ex: CX31) utilizando <strong>Docker Compose</strong>. 
            Começaremos enxutos no MVP 1 com apenas 4 containers essenciais (Postgres, Nest API, Next Admin e N8N). Serviços extras (Redis, RabbitMQ, API WhatsApp) entram apenas no futuro sob dor real de escala.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-[#00FF00]" />
            <h3 className="text-lg font-medium text-white">Monorepo Turborepo (Node.js & Next.js)</h3>
          </div>
          <p className="text-[#A0A0A0] text-sm">
            Toda a base de código unificada para melhor engenharia web: <br/>
            - <code>apps/api:</code> <strong>NestJS</strong> (Regras pesadas, MRP e integrações). <br/>
            - <code>apps/admin:</code> <strong>Next.js</strong> (Painel do CRM, Estoque, Engenharia e QA do laboratório). <br/>
            - <code>apps/web:</code> <strong>Next.js</strong> (E-commerce B2B e Área do Representante, crucial ter SSR/SSG para melhor indexação e ranqueamento no Google).
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-[#00FF00]" />
            <h3 className="text-lg font-medium text-white">Banco Postgres + Prisma ORM</h3>
          </div>
          <p className="text-[#A0A0A0] text-sm">
            <strong>PostgreSQL</strong> suportando <code>JSONB</code> para as regras dinâmicas de engenharia. E usaremos essencialmente <strong>Prisma ORM</strong> para o handshake de Types com o TS. Trocar o banco depois é caro, esta fundação não pode ser postergada.
          </p>
        </div>
      </div>
    </div>
  );
}

function IntegrationSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        03 / ETL com N8N
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Tratando a Barreira "Tecnicon"</h2>
      <p className="text-[#A0A0A0] mb-6">
        ERPs brasileiros legados como Tecnicon costumam rodar no Firebird/Delphi e têm integração hostil ou muito cara. O Satélite deve nascer blindado e 100% resiliente as limitações dele.
      </p>

      <div className="grid gap-6">
        <div className="grid grid-cols-[1fr_80px_1fr] items-center gap-4 bg-[#141414] p-6 rounded-xl border border-[#2A2A2A]">
          <div className="text-center p-4 border border-dashed border-[#444] rounded bg-[#0A0A0A]">
            <h4 className="font-mono text-sm text-[#00FF00]">POSTGRES DB</h4>
            <span className="text-[10px] text-[#666]">Sistema Satélite</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2">
             <div className="flex flex-col items-center text-[#555]">
               <span className="text-[10px] uppercase font-bold text-yellow-500">N8N Middle</span>
               <div className="w-full h-px bg-yellow-500 my-1 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0E0E0E] px-1">
                    <Workflow className="w-4 h-4 text-yellow-500" />
                  </div>
               </div>
               <span className="text-[10px]">Agendamentos (CRON)</span>
             </div>
          </div>

          <div className="text-center p-4 border border-dashed border-[#444] rounded bg-[#0A0A0A]">
            <h4 className="font-mono text-sm text-blue-400">ERP TECNICON</h4>
            <span className="text-[10px] text-[#666]">Exportação Relatórios</span>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-lg border-l-2 border-[#00FF00]">
          <h4 className="text-white text-sm font-bold mb-2">Primeiro Passo (MVP 1): O jeito "Rústico que Funciona"</h4>
          <ul className="text-sm text-[#A0A0A0] list-disc list-inside space-y-1">
            <li>N8N é hospedado na malha do Docker Compose da VPS.</li>
            <li>Tecnicon faz um "dump" noturno em CSV de Itens, Cadastro ou Estoque Padrão num diretório seguro.</li>
            <li>N8N pega esse CSV, converte e joga pro banco do NestJS (Satélite).</li>
          </ul>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-lg border-l-2 border-blue-400">
          <h4 className="text-white text-sm font-bold mb-2">Épico Futuro (Sync Real-time):</h4>
          <ul className="text-sm text-[#A0A0A0] list-disc list-inside space-y-1">
            <li>Com o tempo e suporte da provedora do ERP, busca-se ligar o NestAPI nativamente (ou via API / DB Viewer aberto) para transações em tempo real dos pedidos no ato do checkout.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function DataModelingSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        04 / Database Schema + QA
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Qualidade, Rastreio & BOM </h2>
      <p className="text-[#A0A0A0] mb-6">
        Estrutura sugerida para garantir Rastreabilidade e Bloqueio de Qualidade da Indústria Química (Controle Bloqueante por Lote). Adição de Versionamento de FISPQ.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px] leading-relaxed">
        
        {/* Table 1 & 2 combined for layout logic */}
        <div className="border border-[#2A2A2A] bg-[#111] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold uppercase">bom_substitutions</span>
          </div>
          <p className="text-[#888] mb-2">// Substituições do MRP</p>
          <ul className="text-[#CCC] space-y-1 pl-4">
            <li><span className="text-purple-400">id</span> uuid PK</li>
            <li><span className="text-blue-400">bom_item_id</span> uuid FK <span className="text-[#777]"> (Fragrância A)</span></li>
            <li><span className="text-blue-400">substitute_material_id</span> FK <span className="text-[#777]"> (Fragrância B)</span></li>
            <li><span className="text-pink-400">conversion_factor</span> decimal</li>
          </ul>
        </div>

        {/* Table QA */}
        <div className="border border-[#2A2A2A] bg-[#1A1515] p-4 rounded-lg border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span className="text-red-500 font-bold uppercase">quality_control_logs</span>
            <span className="text-[#666] ml-auto text-[10px] uppercase">Controle Bloqueante</span>
          </div>
          <p className="text-[#888] mb-2">// Laudo do Lab p/ Liberar OP ao Estoque</p>
          <ul className="text-[#CCC] space-y-1 pl-4">
            <li><span className="text-purple-400">id</span> uuid PK</li>
            <li><span className="text-blue-400">production_lot_id</span> uuid FK</li>
            <li><span className="text-pink-400">status</span> ENUM(Quarentena, Aprovado, Reprovado)</li>
            <li><span className="text-green-400">results_data</span> JSONB <span className="text-[#777]"> // (pH, viscosidade, etc)</span></li>
          </ul>
        </div>
        
        {/* Table 4 */}
        <div className="border border-[#2A2A2A] bg-[#111] p-4 rounded-lg md:col-span-2">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-bold uppercase">fispq_versions & traceability</span>
          </div>
          <p className="text-[#888] mb-2">// Tabela Auxiliar: O E-commerce precisa servir sempre a Ficha de Segurança correta baseado na validade do registro e versão do lote produzido.</p>
          <ul className="text-[#CCC] space-y-1 pl-4 grid grid-cols-2">
            <li><span className="text-blue-400">product_id</span> uuid FK</li>
            <li><span className="text-blue-400">anvisa_registry_number</span> varchar</li>
            <li><span className="text-green-400">fispq_url</span> varchar</li>
            <li><span className="text-pink-400">validity_date</span> timestamp</li>
          </ul>
        </div>

      </div>
    </div>
  );
}


function AISection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        05 / Inteligência Artificial
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Gemini 1.5 Pro + Function Calling</h2>
      
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 mb-6">
         <h3 className="text-lg text-white font-medium mb-2 flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#00FF00]" />
            Uma aplicação real para análise profunda
         </h3>
         <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
           O sistema integrará a IA do Google usando <b>Function Calling Estruturado</b>. A interface via Chat genérico sai de cena, entrando uma IA que injeta respostas JSON diretamente nas tabelas de produção do Satélite.
         </p>
         
         <div className="space-y-6">
            <div className="border-l border-[#333] pl-4 relative">
               <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[4px] top-1"></div>
               <h4 className="text-md text-white font-medium mb-1">Passo 1: Envio do mega-contexto (Ingestão)</h4>
               <p className="text-sm text-[#888]">O NestJS pega 1) O Estoque Atual de MPa, 2) Histórico de yield da fábrica e 3) Pipeline do CRM. Com o contexto gigante (token window enorme do Gemini) ele passa a visualizar a linha de fabricação macro.</p>
            </div>

            <div className="border-l border-[#333] pl-4 relative">
               <div className="absolute w-2 h-2 bg-[#00FF00] rounded-full -left-[4px] top-1"></div>
               <h4 className="text-md text-[#00FF00] font-medium mb-1">Passo 2: Motor de Substituições e JSON Action</h4>
               <p className="text-sm text-[#888]">
                 Gemini analisa os "Gaps" (ex: falta fragrância titular). Processa qual substituta está parada e recomenda no painel: Uma lista estruturada de Ordens de Produção onde é possível ajustar as matérias primas em D-1 mantendo a ficha química estável.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function RoadmapSection() {
  return (
    <div className="space-y-6 pb-12">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        06 / Plano de Execução
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Roadmap & Next Steps (Merge Final)</h2>
      <p className="text-[#A0A0A0] mb-6">
        Estrutura iterativa para mitigar os riscos com o legado Tecnicon, blindando a operação por meses e entregando vendas antes de IA.
      </p>

      <div className="space-y-3 mb-8">
        <PhaseCard 
          phase="MVP 1"
          title="Fundações & Handshake"
          status="Mês 1-2"
          items={["Acesso à VPS Hetzner", "Setup do Turborepo (Next + Nest + Prisma)", "N8N fazendo Import CSV básico de Cadastros/BOM do Tecnicon"]}
        />
        <PhaseCard 
          phase="MVP 2"
          title="Portal Web & Varejo"
          status="Mês 3-4"
          items={["E-commerce B2B (Next.js SSR/SEO Ready)", "Área de Representantes Vendas (Kanban)", "Sincronização de Pedidos"]}
        />
        <PhaseCard 
          phase="MVP 3"
          title="Qualidade & Inteligência"
          status="Mês 5-6"
          items={["Módulo de QA de Fábrica (Lote em Quarentena bloqueante antes do Estoque)", "Gemini IA Function Calling para planejamento cruzado de MRP"]}
        />
        <PhaseCard 
          phase="MVP 4"
          title="Foco Logístico"
          status="Mês 7-8"
          items={["Versionamento de Fichas FISPQ automático", "BI e Dashboards", "Alertas Whatsapp Fabril (Evolution API / Z-api)"]}
        />
      </div>

      <div className="bg-[#1F1F15] border border-yellow-600/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
           <AlertCircle className="w-5 h-5 text-yellow-500" />
           <h4 className="text-yellow-500 font-bold">Os 3 Próximos Passos (To-Do Imediato)</h4>
        </div>
        <ul className="space-y-2 text-sm text-[#D0D0D0] ml-2">
           <li><strong>1. Solicitar API Oficial:</strong> Ligar para a Tecnicon formalmente pedindo os docs da API (Isso dita se teremos API no MVP 4).</li>
           <li><strong>2. Setup de Nuvem:</strong> Criar a conta na Hetzner e ligar uma instância vazia com Docker Compose para validar IPs.</li>
           <li><strong>3. Mapear o Seed:</strong> Escolher 3 produtos químicos reais fabricados, e elencar TODO o seu BOM e substitutos numa planilha para base inicial de testes.</li>
        </ul>
      </div>
    </div>
  );
}

function PhaseCard({ phase, title, status, items }: { phase: string, title: string, status: string, items: string[] }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-5 rounded-lg border border-[#2A2A2A] bg-[#111]">
      <div className="w-32 flex-shrink-0">
         <span className="text-xs font-mono text-[#00FF00] tracking-widest uppercase">{phase}</span>
         <h4 className="text-white font-medium mt-1">{title}</h4>
         <div className="mt-2 text-[10px] text-[#666] uppercase bg-[#1A1A1A] inline-block px-2 py-1 rounded">
           {status}
         </div>
      </div>
      <div className="flex-1">
         <ul className="space-y-2 mt-1">
           {items.map((item, i) => (
             <li key={i} className="text-sm text-[#A0A0A0] flex items-start gap-2">
               <div className="w-1 h-1 rounded-full bg-[#444] mt-1.5 flex-shrink-0"></div>
               {item}
             </li>
           ))}
         </ul>
      </div>
    </div>
  );
}

