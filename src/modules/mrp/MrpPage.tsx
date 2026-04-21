import React, { useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2 } from 'lucide-react';

export function MrpPage() {
  const [activeTab, setActiveTab] = useState<'mrp' | 'bom'>('mrp');

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-3 shadow-sm">
            Core Engine (Satélite)
          </div>
          <h2 className="text-3xl font-black text-[#11244A] tracking-tight">Engenharia e Produção (PCP)</h2>
          <p className="text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
            Painel do motor MRP. Exibe relatórios de déficit baseados nos pedidos pendentes e gestão de componentes de substituição para Lotes via Engenharia.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 font-bold text-sm">
        <button 
          onClick={() => setActiveTab('mrp')}
          className={`pb-4 px-6 transition-colors border-b-2 ${activeTab === 'mrp' ? 'border-[#11244A] text-[#11244A]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Planejamento de Materiais (MRP)
        </button>
        <button 
          onClick={() => setActiveTab('bom')}
          className={`pb-4 px-6 transition-colors border-b-2 ${activeTab === 'bom' ? 'border-[#11244A] text-[#11244A]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Gestão de Fórmulas (BOM)
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'mrp' ? (
           <div className="space-y-6">
              {/* Alerta de Deficit simulando o que fizemos na API */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-red-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                       <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <div>
                            <h3 className="text-red-700 font-black text-lg tracking-tight mb-1">Déficit Crítico de Componente Detectado</h3>
                            <p className="text-red-600/80 text-sm font-medium">A Ordem de Produção <strong className="text-red-700 font-bold">#OP-9011 (Detergente Neutro)</strong> está travada por falta de estoque.</p>
                         </div>
                         <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded">Hoje, 09:12</span>
                       </div>
                       
                       <div className="mt-5 p-4 bg-white/60 border border-red-100 rounded-xl space-y-3">
                         <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-600 font-bold">Material:</span>
                           <span className="text-[#11244A] font-bold">Essência Floral FAZ ("ESSFLO-A")</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-600 font-bold">Necessidade para a O.P.:</span>
                           <span className="text-slate-700">20.0 Kg</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-600 font-bold">Estoque Físico Atual:</span>
                           <span className="text-red-600 font-black">5.0 Kg <span className="font-medium text-xs">(Falta: 15.0 Kg)</span></span>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bot - Gemini Function Calling Simulation */}
              <div className="bg-[#11244A] rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
                 <div className="absolute right-0 bottom-0 opacity-5 translate-x-1/4 translate-y-1/4 w-64 h-64">
                   <Bot className="w-full h-full text-white" />
                 </div>
                 
                 <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex-shrink-0">
                    <Bot className="w-8 h-8 text-orange-400" />
                 </div>
                 
                 <div className="flex-1 relative z-10 text-white">
                    <div className="inline-flex items-center gap-2 text-xs font-bold bg-orange-500 text-[#11244A] px-2.5 py-1 rounded mb-3 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                      ✨ MOTOR SUBSTITUTIVO (IA)
                    </div>
                    <p className="text-sm text-blue-100 leading-relaxed font-medium mb-4">
                      Detectei que você precisa rodar a <b>OP-9011</b>, mas falta <span className="font-bold underline decoration-orange-400">ESSFLO-A</span>.
                      <br/>No modelo de dados <code className="text-xs bg-black/30 px-1 rounded mx-1">bom_substitutions</code>, encontrei que o componente alternativo <span className="font-bold text-orange-400">ESSFLO-C</span> possui estoques suficientes em Tecnicon (300 Kg) para cobrir isso, e é compatível com Detergentes na proporção 1:1.
                    </p>
                    <button className="bg-white text-[#11244A] px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-slate-100 transition-colors flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" /> APROVAR SUBSTITUIÇÃO E LIBERAR O.P.
                    </button>
                 </div>
              </div>

           </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
             Lista de estruturas de produto (Bill of Materials) aparecerá aqui.
          </div>
        )}
      </div>
    </div>
  );
}
