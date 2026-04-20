/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Workflow, 
  Layers, 
  Box, 
  Activity, 
  Bot,
  ShieldCheck,
  Code,
  FileCheck2,
  Lock,
  Beaker,
  Thermometer,
  TestTube
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const milestone1Sections = [
  { id: 'overview', title: 'Fatia Vertical', icon: Activity },
  { id: 'mrp', title: 'Simulador MRP c/ IA', icon: Bot },
  { id: 'schema', title: 'Contrato IA (JSON)', icon: Code },
];

const milestone2Sections = [
  { id: 'qa-overview', title: 'Visão QA Bloqueante', icon: ShieldCheck },
  { id: 'qa-flow', title: 'Workflow Laboratório', icon: Workflow },
  { id: 'fispq', title: 'Versionamento FISPQ', icon: FileCheck2 },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('qa-overview');

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#EDEDED] font-sans selection:bg-[#00FF00] selection:text-black">
      {/* Navbar / Header */}
      <header className="border-b border-[#2A2A2A] bg-[#0A0A0A] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#00FF00] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Hotechann<span className="text-[#00FF00] font-bold">FAZ</span> Satélite</h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#7A7A7A]">
          SAD - Milestone 2.0 (QA & Compliance)
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col md:flex-row h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-[#2A2A2A] overflow-y-auto bg-[#141414]">
          <nav className="p-4 space-y-4">
            
            {/* Milestone 2 (Active) */}
            <div>
              <div className="pb-3 pt-1 border-b border-[#222] mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse"></div>
                <span className="text-[10px] font-bold font-mono text-[#00FF00] uppercase tracking-wider">Milestone 2 (Ativo)</span>
              </div>
              <div className="space-y-1">
                {milestone2Sections.map((sec) => {
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
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#00FF00]' : 'text-[#666]'}`} />
                      {sec.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Milestone 1 (Completed) */}
            <div>
               <div className="pb-3 pt-4 border-b border-[#222] mb-2 flex items-center gap-2 opacity-50">
                <Box className="w-3 h-3 text-[#555]" />
                <span className="text-[10px] font-mono text-[#555] uppercase tracking-wider">Milestone 1 (Concluído)</span>
              </div>
              <div className="space-y-1 opacity-60">
                {milestone1Sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${
                        isActive 
                          ? 'bg-[#1F1F1F] text-white shadow-[inset_2px_0_0_#FFF]' 
                          : 'text-[#888] hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {sec.title}
                    </button>
                  );
                })}
              </div>
            </div>

          </nav>

          <div className="mt-4 p-4 border-t border-[#2A2A2A]">
            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
               <h4 className="text-xs font-bold text-[#00FF00] uppercase font-mono tracking-wider mb-2">Engenharia Dividida</h4>
               <p className="text-[11px] text-[#888] leading-relaxed">
                 <b>Claude (CLI):</b> Endpoints QA de bloqueio de estoque e formulários Admin.<br/><br/>
                 <b>Gemini (Studio):</b> UX do Frontend QA e Specs do Versionamento FISPQ.
               </p>
            </div>
          </div>
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
    case 'mrp': return <MRPSection />;
    case 'schema': return <SchemaSection />;
    case 'qa-overview': return <QAOverviewSection />;
    case 'qa-flow': return <QAFlowSection />;
    case 'fispq': return <FispqSection />;
    default: return <QAOverviewSection />;
  }
}

// ==========================================
// MILESTONE 2 SECTIONS
// ==========================================

function QAOverviewSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-500">
        Milestone 2.0 Iniciado
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Controle de Qualidade (QA Bloqueante)</h2>
      <p className="text-[#A0A0A0] text-lg leading-relaxed mb-6">
        Na indústria química (Hotechann), uma Ordem de Produção finalizada <b>não pode</b> ir direto para o status "Disponível para Venda". 
        Antes, o lote-filho (PA) gerado entra em Estado de <b>Quarentena</b> até que o Laboratório aprove suas características organolépticas físico-químicas.
      </p>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-0 overflow-hidden mb-6">
        <div className="grid grid-cols-3 border-b border-[#2A2A2A] bg-[#0A0A0A] text-xs font-mono text-[#888]">
           <div className="p-3 text-center border-r border-[#2A2A2A]">1. Produção (Chão de Fábrica)</div>
           <div className="p-3 text-center border-r border-[#2A2A2A] text-yellow-500">2. Quarentena (Laboratório)</div>
           <div className="p-3 text-center text-[#00FF00]">3. Liberação (Comercial / ERP)</div>
        </div>
        <div className="p-6">
           <div className="relative">
              {/* Line connector */}
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-[#222] -translate-y-1/2 rounded z-0"></div>
              
              <div className="flex justify-between relative z-10">
                 <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border-2 border-[#444] flex items-center justify-center">
                       <Box className="w-6 h-6 text-[#888]" />
                    </div>
                    <span className="text-xs text-[#888] max-w-[100px] text-center">Apontamento da OP e Baixa de MP</span>
                 </div>

                 <div className="flex flex-col items-center gap-3 relative -top-3">
                    <div className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                      ESTOQUE BLOQUEADO
                    </div>
                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500 flex items-center justify-center">
                       <Beaker className="w-6 h-6 text-yellow-500" />
                    </div>
                    <span className="text-xs text-yellow-500 max-w-[120px] text-center font-medium">Análise de Cor, Viscosidade e pH</span>
                 </div>

                 <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#00FF00]/10 border-2 border-[#00FF00] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.1)]">
                       <ShieldCheck className="w-6 h-6 text-[#00FF00]" />
                    </div>
                    <span className="text-xs text-[#A0A0A0] max-w-[100px] text-center">QA Aprovado! Lote livre para B2B</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function QAFlowSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-500">
        Detalhes de Integração
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Workflow do Laboratório</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
           <h3 className="text-emerald-400 font-medium mb-3 flex items-center gap-2 text-sm">
             <TestTube className="w-4 h-4" />
             O Gatilho (NestJS)
           </h3>
           <p className="text-[#888] text-xs leading-relaxed mb-4">
             Quando a Controller de <code>ApproveProductionOrder</code> é acionada, ela <b>NÃO</b> finaliza a ação lançando o saldo no tipo "OUT_SALE" imediatamente. 
             Ao invés disso, ela cria um <code>StockBalance</code> com a tag <code>isQuarantine: true</code>, e injeta uma pendência na tabela de <code>Task</code> do Laboratório.
           </p>
           <pre className="p-3 bg-[#0A0A0A] border border-[#333] rounded text-[10px] font-mono text-[#D4D4D4] whitespace-pre-wrap">
{`const lot = await createProductionLot({
  orderId,
  status: 'QUARANTINE',
  // Aguardando Lab...
})`}
           </pre>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
           <h3 className="text-blue-400 font-medium mb-3 flex items-center gap-2 text-sm">
             <Thermometer className="w-4 h-4" />
             Formulário Dinâmico (JSONB)
           </h3>
           <p className="text-[#888] text-xs leading-relaxed mb-4">
             A tela do Laboratório no Admin (Next.js) irá consumir o JSONB <code>resultsData</code>. Diferentes produtos exigem métricas de teste diferentes. Desinfetantes testam pH e Cor. Sabonetes testam Viscosidade.
           </p>
           <pre className="p-3 bg-[#0A0A0A] border border-[#333] rounded text-[10px] font-mono text-[#D4D4D4] whitespace-pre-wrap">
{`{
  metrics: {
    pH: { value: 7.2, passed: true },
    viscosity: { value: 1200, passed: true },
    colorMatch: { passed: true }
  },
  approvedBy: "quimico_id"
}`}
           </pre>
        </div>
      </div>
    </div>
  );
}

function FispqSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-500">
        Compliance Químico
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Versionamento FISPQ e Anvisa</h2>
      <p className="text-[#A0A0A0] text-sm mb-6">
        No B2B Químico, cada Ordem de Venda deve estar acompanhada da <b>exata versão da FISPQ</b> vigente na data em que o lote foi fabricado. Por isso a FISPQ não pode ser um cadastro estático do Produto.
      </p>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 relative overflow-hidden">
        <Lock className="absolute opacity-5 -right-10 -bottom-10 w-64 h-64 text-blue-500" />
        
        <ol className="relative border-l border-[#333] ml-3 mt-4">                  
            <li className="mb-6 pl-6">            
                <span className="absolute flex items-center justify-center w-6 h-6 bg-[#0E0E0E] rounded-full -left-3 ring-4 ring-[#141414] border border-blue-500">
                    <span className="text-[10px] font-bold text-blue-500">1</span>
                </span>
                <h3 className="flex items-center mb-1 text-sm font-semibold text-white">Nova Fórmula Registrada</h3>
                <time className="block mb-2 text-xs font-normal leading-none text-[#666]">ANVISA Registry update</time>
                <p className="mb-4 text-xs font-normal text-[#888]">Engenharia lança a versão 1.0 da FISPQ na tabela <code>Fispq</code> com os campos <code>validityStart</code> e o link do PDF.</p>
            </li>
            <li className="mb-6 pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-[#0E0E0E] rounded-full -left-3 ring-4 ring-[#141414] border-emerald-500">
                    <span className="text-[10px] font-bold text-emerald-500">2</span>
                </span>
                <h3 className="mb-1 text-sm font-semibold text-white">OP Executada e Lotes Gerados</h3>
                <p className="text-xs font-normal text-[#888]">O Laboratório aprova o QA. O sistema carimba o <code>ProductionLot</code> <i>congelando</i> o ID da FISPQ vigente naquele segundo exato.</p>
            </li>
            <li className="pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-[#0E0E0E] rounded-full -left-3 ring-4 ring-[#141414] border-[#00FF00]">
                    <span className="text-[10px] font-bold text-[#00FF00]">3</span>
                </span>
                <h3 className="mb-1 text-sm font-semibold text-white">Pedido Feito 2 Anos Depois</h3>
                <p className="text-xs font-normal text-[#888]">Mesmo que o produto já esteja na FISPQ 3.0, se vendermos um lote resíduo antigo, o PDF gerado pro cliente puxa a FISPQ 1.0 vinculada ao Rastro do Lote.</p>
            </li>
        </ol>
      </div>
      
    </div>
  );
}

// ==========================================
// MILESTONE 1 SECTIONS (Legacy visualizer)
// ==========================================

function OverviewSection() {
  return (
    <div className="space-y-6 opacity-60">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-white">
        Milestone 1 Encerrado
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-white mb-4 line-through decoration-red-500">Cadastro, BOM & Cálculo MRP</h2>
      <p className="text-[#A0A0A0] text-sm leading-relaxed mb-8">
        (Feature concluída pelo Claude - Commit `4ac2d5f`. Endpoints /mrp/requirements operantes).
      </p>
    </div>
  );
}

function MRPSection() {
  return (
    <div className="space-y-6 opacity-60">
      <h2 className="text-xl font-semibold tracking-tight text-white mb-4 line-through decoration-red-500">Motor Substitutivo (API Ativa)</h2>
    </div>
  );
}

function SchemaSection() {
  return (
    <div className="space-y-6 opacity-60">
      <h2 className="text-xl font-semibold tracking-tight text-white mb-4 line-through decoration-red-500">Contrato JSON (DTO Finalizado)</h2>
    </div>
  );
}
