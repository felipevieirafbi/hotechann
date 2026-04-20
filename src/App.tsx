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
  Bot
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
        01 / Arquitetura Macro
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">O Ecossistema Satélite</h2>
      <p className="text-[#A0A0A0] text-lg leading-relaxed mb-8">
        Projeto de arquitetura para um sistema "Satélite Inteligente" paralelo ao ERP Tecnicon da fábrica Hotechann Faz. 
        Este sistema atua nas áreas onde o legado não atende: Engenharia Dinâmica (MRP/BOM), Automação de Vendas (E-commerce B2B/B2C, Licitações) e Inteligência Artificial.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Kanban, title: 'CRM & Vendas', desc: 'Múltiplos funis Kanban para E-commerce, Representantes e Pregões.' },
          { icon: Box, title: 'Gestão Avançada de Estoque', desc: 'Múltiplos almoxarifados, recálculo de estoque mínimo, disparo de compras.' },
          { icon: Network, title: 'Integração ERP', desc: 'O Satélite envia Pedidos e OC para o Tecnicon, que fatura e emite nota fiscal.' },
          { icon: ShoppingCart, title: 'Portal Web B2B/B2C', desc: 'Loja virtual com login para parceiros extraírem catálogos, FISPQ e baixar tabelas.' }
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
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Stack Tecnológico Sugerido</h2>
      
      <div className="space-y-8 mt-6">
        <div className="p-6 rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-6 h-6 text-[#00FF00]" />
            <h3 className="text-xl font-medium text-white">Backend & APIs (Node.js)</h3>
          </div>
          <p className="text-[#A0A0A0] text-sm mb-4">
            Sugerida a utilização do <strong>NestJS</strong> ou <strong>Express robustecido</strong> (TypeScript). Escolhido devido à facilidade de integração via APIs REST e desenvolvimento rápido. <br/>
            <em>Atenção ao Hostgator:</em> Hospedagens compartilhadas limitam processos contínuos Node.js. O plano <strong>deve ser um Servidor VPS ou Dedicado</strong> rodando PM2 ou Docker.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-[#00FF00]" />
            <h3 className="text-xl font-medium text-white">Banco de Dados Principal</h3>
          </div>
          <p className="text-[#A0A0A0] text-sm mb-4">
            <strong>PostgreSQL</strong>. A escolha por relacional se deve à integridade financeira e produtiva necessária (ACID). O PostgreSQL possui colunas nativas suportando <code>JSONB</code>, perfeitas para cadastrar regras de substituição dinâmicas de engenharia que mudam de produto para produto.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-[#00FF00]" />
            <h3 className="text-xl font-medium text-white">Mensageria & Fila (Sync ERP)</h3>
          </div>
          <p className="text-[#A0A0A0] text-sm mb-4">
            <strong>Redis Pub/Sub ou RabbitMQ</strong>. Para garantir que um pedido desça para o Tecnicon. Se o ERP estiver indisponível ou instável, o pedido cai em fila e ocorre <em>retry</em> automático, evitando perda de dados fiscais/pedidos.
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
        03 / Middleware & ETL
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Estratégia de Integração Tecnicon</h2>
      <p className="text-[#A0A0A0] mb-6">
        A comunicação entre o Node.js e o ERP deve ser isolada, usando um serviço de Middleware (ou ferramentas como <strong>N8N</strong> em VPS) para padronizar contratos JSON/XML e orquestrar fluxos (CRON).
      </p>

      <div className="grid gap-6">
        <div className="grid grid-cols-[1fr_80px_1fr] items-center gap-4 bg-[#141414] p-6 rounded-xl border border-[#2A2A2A]">
          <div className="text-center p-4 border border-dashed border-[#444] rounded bg-[#0A0A0A]">
            <h4 className="font-mono text-sm text-[#00FF00]">SISTEMA SATÉLITE</h4>
            <span className="text-[10px] text-[#666]">Node.js / PostgreSQL</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2">
             <div className="flex flex-col items-center text-[#555]">
               <span className="text-[10px] uppercase">Webhook/REST</span>
               <div className="w-full h-px bg-[#00FF00] my-1 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0E0E0E] px-1">
                    <Workflow className="w-4 h-4 text-[#00FF00]" />
                  </div>
               </div>
             </div>
          </div>

          <div className="text-center p-4 border border-dashed border-[#444] rounded bg-[#0A0A0A]">
            <h4 className="font-mono text-sm text-blue-400">ERP TECNICON</h4>
            <span className="text-[10px] text-[#666]">Faturamento / Fiscal</span>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-lg border-l-2 border-[#00FF00]">
          <h4 className="text-white text-sm font-bold mb-2">Fluxo de Dados: Tecnicon → Satélite (Leitura)</h4>
          <ul className="text-sm text-[#A0A0A0] list-disc list-inside space-y-1">
            <li>Sincronização passiva de Clientes, Fornecedores e Produtos.</li>
            <li>Sincronização diária (ou real-time via evento) do Saldo Físico de Estoque para alinhar e-commerce.</li>
            <li>Tabelas de preços atualizadas do fiscal.</li>
          </ul>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-lg border-l-2 border-blue-400">
          <h4 className="text-white text-sm font-bold mb-2">Fluxo de Dados: Satélite → Tecnicon (Escrita Faturada)</h4>
          <ul className="text-sm text-[#A0A0A0] list-disc list-inside space-y-1">
            <li><strong>Pedidos de Venda aprovados</strong> originados do B2B/Representantes. Vão para Tecnicon gerar boleto/NFe.</li>
            <li><strong>Ordens de Compra (OCs)</strong> geradas pelo MRP. O fiscal valida a tributação e finaliza o pedido ao fornecedor.</li>
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
        04 / Database Schema
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Modelagem MRP & Substituições</h2>
      <p className="text-[#A0A0A0] mb-6">
        Estrutura sugerida para garantir Rastreabilidade de Lote e BOM com Substituições Dinâmicas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px] leading-relaxed">
        
        {/* Table 1 */}
        <div className="border border-[#2A2A2A] bg-[#111] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold uppercase">bom_formulas</span>
          </div>
          <p className="text-[#888] mb-2">// Receita máster</p>
          <ul className="text-[#CCC] space-y-1 pl-4">
            <li><span className="text-purple-400">id</span> uuid PK</li>
            <li><span className="text-blue-400">product_id</span> uuid FK</li>
            <li><span className="text-blue-400">base_yield_qty</span> int</li>
            <li><span className="text-blue-400">version</span> varchar</li>
          </ul>
        </div>

        {/* Table 2 */}
        <div className="border border-[#2A2A2A] bg-[#111] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold uppercase">bom_items</span>
          </div>
          <p className="text-[#888] mb-2">// Ingredientes padrões</p>
          <ul className="text-[#CCC] space-y-1 pl-4">
            <li><span className="text-purple-400">id</span> uuid PK</li>
            <li><span className="text-blue-400">bom_id</span> uuid FK</li>
            <li><span className="text-blue-400">raw_material_id</span> uuid FK</li>
            <li><span className="text-blue-400">required_qty</span> decimal</li>
          </ul>
        </div>

        {/* Table 3 */}
        <div className="border border-[#2A2A2A] bg-[#111] p-4 rounded-lg md:col-span-2 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
            <Database className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 font-bold uppercase">bom_substitutions</span>
            <span className="text-[#666] ml-auto text-[10px]">Núcleo Dinâmico</span>
          </div>
          <p className="text-[#888] mb-2">// Regras de substituição autorizadas pelo Químico</p>
          <ul className="text-[#CCC] space-y-1 pl-4">
            <li><span className="text-purple-400">id</span> uuid PK</li>
            <li><span className="text-blue-400">bom_item_id</span> uuid FK <span className="text-[#777]"> // (Ex: Fragrância Padrão)</span></li>
            <li><span className="text-blue-400">substitute_material_id</span> uuid FK <span className="text-[#777]"> // (Ex: Fragrância B)</span></li>
            <li><span className="text-pink-400">conversion_factor</span> decimal <span className="text-[#777]"> // (Ex: Usa 1.2x mais)</span></li>
            <li><span className="text-green-400">ai_preference_score</span> int <span className="text-[#777]"> // Peso para sugestão da IA</span></li>
          </ul>
        </div>
        
        {/* Table 4 */}
        <div className="border border-[#2A2A2A] bg-[#111] p-4 rounded-lg md:col-span-2">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-bold uppercase">production_lots_traceability</span>
          </div>
          <p className="text-[#888] mb-2">// Lote a Lote ponta-a-ponta</p>
          <ul className="text-[#CCC] space-y-1 pl-4 grid grid-cols-2">
            <li><span className="text-purple-400">id</span> uuid PK</li>
            <li><span className="text-blue-400">production_order_id</span> uuid FK</li>
            <li><span className="text-blue-400">final_lot_code</span> varchar</li>
            <li><span className="text-green-400">consumed_lots</span> JSONB <span className="text-[#777]"> // Ex: ["LOTE_MP_01", "LOTE_MP_08"]</span></li>
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
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Motor de IA para Planejamento</h2>
      
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 mb-6">
         <h3 className="text-lg text-white font-medium mb-2 flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#00FF00]" />
            Como o Motor atua no MRP (Material Requirements Planning)
         </h3>
         <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
           O sistema integrará a IA não apenas para "Chat", mas como um orquestrador analítico (usando Modelos Preditivos e a API do Gemini para insigths não-estruturados, combinados com Algoritmos Heurísticos do Node.js).
         </p>
         
         <div className="space-y-6">
            <div className="border-l border-[#333] pl-4 relative">
               <div className="absolute w-2 h-2 bg-[#00FF00] rounded-full -left-[4px] top-1"></div>
               <h4 className="text-md text-white font-medium mb-1">Passo 1: Leitura de Demanda Projetada</h4>
               <p className="text-sm text-[#888]">O algoritmo cruza os Kanbans de Vendas e Licitações. Se uma licitação pública está 90% ganha, a IA já insere aquela demanda não-consumada na pipeline de "Necessidade Mínima".</p>
            </div>
            
            <div className="border-l border-[#333] pl-4 relative">
               <div className="absolute w-2 h-2 bg-[#00FF00] rounded-full -left-[4px] top-1"></div>
               <h4 className="text-md text-white font-medium mb-1">Passo 2: Análise de Gap no Almoxarifado</h4>
               <p className="text-sm text-[#888]">A explosão de materiais revela: Faltam 200L de Fragrância Lavanda Original para cumprir a demanda futura.</p>
            </div>

            <div className="border-l border-[#333] pl-4 relative">
               <div className="absolute w-2 h-2 bg-[#00FF00] rounded-full -left-[4px] top-1"></div>
               <h4 className="text-md text-[#00FF00] font-medium mb-1">Passo 3: Motor de Substituição Inteligente</h4>
               <p className="text-sm text-[#888]">
                 Em vez de barrar a O.P ou emitir pedido de compra de alto custo e atraso, o algoritmo busca na tabela <code>bom_substitutions</code> e verifica que há 500L de "Lavanda Silvestre" no estoque com fator de conversão 1.1x. Ele auto-sugere a OP com a matéria prima secundária.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function RoadmapSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        06 / Plano de Execução
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Roadmap & Fases MVP</h2>
      <p className="text-[#A0A0A0] mb-6">
        Estrutura iterativa para mitigar os riscos com o legado Tecnicon, entregando valor rapidamente à operação.
      </p>

      <div className="space-y-3">
        <PhaseCard 
          phase="MVP 1"
          title="Fundações & Handshake"
          status="Mês 1-2"
          items={["Setup do Host VPS (Database, Node, RabbitMQ)", "Sync Unidirecional (Produtos, Estoque e Cadastros Tecnicon -> Satélite)"]}
        />
        <PhaseCard 
          phase="MVP 2"
          title="Portal Web & CRM"
          status="Mês 3-4"
          items={["E-commerce B2B Logado (Download de catálogos e FISPQ)", "CRM Kanban para Representantes e Licitações"]}
        />
        <PhaseCard 
          phase="MVP 3"
          title="Motor de Produção"
          status="Mês 5-6"
          items={["Cadastro do BOM Dinâmico com regras de substituição", "Geração de OPs e Rastreabilidade de Lotes Pai/Filho", "Baixa de Estoque sincronizada com ERP"]}
        />
        <PhaseCard 
          phase="MVP 4"
          title="Inteligência Autônoma"
          status="Mês 7-8"
          items={["Motor de IA para leitura de pipeline e sugestão automatizada de OPs", "Recálculos de Ponto de Pedido Automático", "Dashboards Full BI"]}
        />
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

