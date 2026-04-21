import React, { useState } from 'react';
import { Clock, Beaker, Thermometer, Microscope, Box, Layers, XCircle, CheckCircle2 } from 'lucide-react';

export function QaPage() {
  const [selectedLot, setSelectedLot] = useState<any>(null);
  
  const lots = [
    { id: 'LT-260420-A1', product: 'ALVEJANTE SEM CLORO FAZ', size: '5L (4x5)', qty: '1000 Cx', status: 'Aguardando Lab', time: 'Há 45 min',  metrics: { ph: { min: 2.0, max: 3.5 }, visc: null } },
    { id: 'LT-260420-A2', product: 'AMACIANTE BLUE FAZ', size: '2L (6x2)', qty: '500 Cx', status: 'Aguardando Lab', time: 'Há 2 hrs', metrics: { ph: { min: 5.5, max: 6.5 }, visc: { min: 400, max: 800 } } },
    { id: 'LT-260420-A3', product: 'DETERG. DA50 FAZ', size: '5L (4x5)', qty: '800 Cx', status: 'Aguardando Lab', time: 'Há 5 hrs', metrics: { ph: { min: 9.0, max: 10.5 }, visc: { min: 100, max: 300 } } },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 h-full max-w-6xl mx-auto">
      <div className="w-full md:w-1/3 flex flex-col space-y-4">
        <h3 className="text-[#11244A] font-bold text-lg flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Fila de Quarentena
        </h3>
        
        <div className="space-y-3">
          {lots.map(lot => (
            <button 
              key={lot.id} 
              onClick={() => setSelectedLot(lot)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedLot?.id === lot.id ? 'border-orange-400 bg-orange-50/50 shadow-md transform scale-[1.02]' : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-[#11244A] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{lot.id}</span>
                <span className="text-xs font-medium text-slate-500">{lot.time}</span>
              </div>
              <h4 className="text-sm text-[#11244A] font-extrabold mb-1">{lot.product}</h4>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Box className="w-3 h-3 text-slate-400" /> {lot.size}</span>
                <span className="flex items-center gap-1.5"><Layers className="w-3 h-3 text-slate-400" /> {lot.qty} Produzidas</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full md:w-2/3 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col overflow-hidden">
        {!selectedLot ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center bg-slate-50/50">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <Microscope className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-[#11244A] mb-2 tracking-tight">Laboratório de Controle de Qualidade</h3>
            <p className="max-w-md text-sm leading-relaxed text-slate-500 font-medium">Selecione um lote recém-produzido na quarentena para iniciar a aferição físico-química obrigatória (Módulo de Qualidade Bloqueante).</p>
          </div>
        ) : (
          <div className="p-8 flex-1 flex flex-col overflow-y-auto">
            <div className="border-b border-slate-100 pb-5 mb-6 relative">
              <div className="absolute right-0 top-0 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-200"># {selectedLot.id}</div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-200 shadow-sm">
                  <Beaker className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#11244A] tracking-tight">{selectedLot.product}</h2>
                  <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
                    Apresentação: <span className="text-[#11244A]">{selectedLot.size}</span> | Volume: <span className="text-[#11244A]">{selectedLot.qty}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <form className="space-y-8 flex-1">
              <div>
                <h3 className="text-sm font-bold text-[#11244A] tracking-tight mb-4 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  Parâmetros Físico-Químicos da FISPQ
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Potencial Hidrogeniônico (pH)</label>
                    <div className="relative">
                      <input type="number" step="0.1" placeholder="Ex: 7.2" className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
                      <span className="absolute right-3 top-3 text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Alvo: {selectedLot.metrics.ph.min} - {selectedLot.metrics.ph.max}</span>
                    </div>
                  </div>
                  
                  {selectedLot.metrics.visc && (
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Viscosidade (cPs)</label>
                      <div className="relative">
                        <input type="number" placeholder="Ex: 20" className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
                        <span className="absolute right-3 top-3 text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Alvo: {selectedLot.metrics.visc.min} - {selectedLot.metrics.visc.max}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Aspecto e Cor (Inspeção Visual)</label>
                <select className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 text-sm font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm cursor-pointer">
                  <option value="conforme">Conforme Padrão Comercial da Ficha</option>
                  <option value="turvo">Turvo / Translúcido Incorreto</option>
                  <option value="tonalidade_incorreta">Fora de Tonalidade Adotada</option>
                  <option value="fases">Separação de Fases ou Precipitado</option>
                </select>
              </div>

              <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Laudo Oficial / Parecer Laboratorial</label>
                  <textarea rows={3} placeholder="Assinatura química e parecer do especialista..." className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm resize-none"></textarea>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">
               <button className="px-6 py-3 rounded-xl border-2 border-red-200 text-red-600 bg-red-50 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 hover:border-red-300 transition-colors">
                 <XCircle className="w-5 h-5" /> REPROVAR LOTE (DESCARTAR)
               </button>
               <button className="px-6 py-3 rounded-xl bg-[#11244A] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0A1630] shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                 <CheckCircle2 className="w-5 h-5 text-orange-400" /> APROVAR LOTE (LIBERAR ERP)
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
