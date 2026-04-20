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
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const sections = [
  { id: 'overview', title: 'Fatia Vertical', icon: Activity },
  { id: 'mrp', title: 'Simulador MRP c/ IA', icon: Bot },
  { id: 'schema', title: 'Contrato IA (JSON)', icon: Code },
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
          SAD - Vertical Slice 1.0
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col md:flex-row h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-[#2A2A2A] overflow-y-auto bg-[#141414]">
          <nav className="p-4 space-y-1">
            <div className="pb-4 pt-2">
              <span className="text-[10px] font-mono text-[#555] uppercase tracking-wider ml-3">Milestone 1</span>
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
          <div className="mt-8 p-4">
            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
               <h4 className="text-xs font-bold text-[#00FF00] uppercase font-mono tracking-wider mb-2">Engenharia Dividida</h4>
               <p className="text-[11px] text-[#888] leading-relaxed">
                 <b>Claude (CLI):</b> Seed db, API NestJS e Next Admin.<br/><br/>
                 <b>Gemini (Studio):</b> SAD, Prompts MRP e Function Calling contract.
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
    default: return <OverviewSection />;
  }
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        01 / Fatia Vertical (Vertical Slice)
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Cadastro, BOM & Cálculo MRP</h2>
      <p className="text-[#A0A0A0] text-lg leading-relaxed mb-8">
        Vamos focar em entregar ponta-a-ponta a primeira feature core do Satélite. Sem CRUDs genéricos, vamos validar o valor real da plataforma: <b>Calcular a Necessidade Bruta baseado no BOM de Produtos reais.</b>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Database, title: '1. O Seed Real', desc: 'Claude injeta no Nest/Prisma 5 produtos de fábrica reais (Ex: Desinfetantes) e suas matérias primas exatas.' },
          { icon: Workflow, title: '2. Cálculo NestJS', desc: 'API /mrp/requirements. NestJS desmembra o produto em multiníveis do BOM contra o estoque atual.' },
          { icon: Bot, title: '3. Sugestão IA', desc: 'Se estourar o estoque de MP, IA é chamada no back para justificar e sugerir a Substituição perfeita.' }
        ].map((feat, i) => (
          <div key={i} className="p-5 rounded-xl border border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A] transition">
             <div className="w-10 h-10 rounded bg-[#1F1F1F] flex items-center justify-center mb-4">
               <feat.icon className="w-5 h-5 text-[#00FF00]" />
             </div>
             <h3 className="text-white font-medium mb-2 text-sm">{feat.title}</h3>
             <p className="text-xs text-[#8A8A8A] leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MRPSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        02 / Prompt e Lógica do Motor
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Motor Substitutivo (Gemini)</h2>
      
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 mb-6">
         <h3 className="text-lg text-white font-medium mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#00FF00]" />
            Prompt de Sistema (O Cérebro da Inteligência Química)
         </h3>
         
         <div className="bg-[#0A0A0A] p-4 rounded border border-[#333] font-mono text-sm text-[#D4D4D4] whitespace-pre-wrap leading-relaxed">
{`Você é um Engenheiro de Químico Especialista e Analista de MRP na Hotechann Faz.
Sua missão é atuar como "Safety Net" no processo de Planejamento de Produção.

[CONTEXTO]
O NestJS acabou de rodar o /mrp/requirements para "Desinfetante Floral 5L".
A requisição falhou no estoque de "Essência Floral A (UUID: xyz)".
Temos uma lista de matrizes de substituição cadastradas.

[LÓGICA OPERACIONAL]
1. Analise o 'shortfall' (déficit de matéria prima).
2. Busque no payload de opções a essência alternativa homologada.
3. Considere fatores de conversão (se a Essência B é mais fraca, precisamos de 1.2x).
4. Acione a função "suggest_mrp_substitution" justificando quimicamente as razões para manter a integridade da receita (FISPQs compatíveis).`}
         </div>
      </div>
    </div>
  );
}

function SchemaSection() {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-0.5 text-xs font-semibold text-[#00FF00]">
        03 / Contrato Funcional (NestJS x IA)
      </div>
      <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">JSON Function Calling</h2>
      <p className="text-[#A0A0A0] text-sm mb-6">
        Este é o schema JSON estrito que o Gemini 1.5 Pro será forçado a preencher na reposta e que a API NestJS enviará para o painel Admin do Next.js.
      </p>

      <pre className="p-4 bg-[#0A0A0A] border border-[#333] rounded-xl text-[13px] font-mono text-green-400 overflow-x-auto leading-relaxed">
{`{
  "name": "suggest_mrp_substitution",
  "description": "Sugerir substituição de matéria-prima quando o estoque está abaixo do mínimo exigido (Necessidade Bruta ID).",
  "parameters": {
    "type": "object",
    "properties": {
      "shortfallProductSku": { 
        "type": "string", 
        "description": "SKU da matéria-prima original faltante" 
      },
      "substituteProductSku": { 
        "type": "string", 
        "description": "SKU do material homologado sugerido como substituta garantida" 
      },
      "conversionFactorApplied": { 
        "type": "number", 
        "description": "Fator de multiplicador para equalizar o rendimento químico (Ex: 1.15)" 
      },
      "chemicalReasoning": { 
        "type": "string", 
        "description": "Breve justificativa físico-química ou de estoque do por que o lote ainda será válido." 
      }
    },
    "required": [
      "shortfallProductSku", 
      "substituteProductSku", 
      "conversionFactorApplied", 
      "chemicalReasoning"
    ]
  }
}`}
      </pre>
      
      <div className="p-4 bg-[#1F1F15] rounded border border-yellow-600/50 mt-4">
        <h4 className="text-yellow-500 font-bold text-sm mb-1">Para o Dev Node.js (Claude):</h4>
        <p className="text-[#D0D0D0] text-xs">O schema acima deve ser modelado no Zod/DTO no Controller de <code>/mrp/requirements</code>. Envia o prompt em caso de "Not Enough Stock", captura esse Type e despacha a requisição pro React Admin validar.</p>
      </div>
    </div>
  );
}
