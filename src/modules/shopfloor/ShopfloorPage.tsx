import React, { useState } from 'react';
import { Tablet, CheckCircle2, PlayCircle, Factory } from 'lucide-react';

export function ShopfloorPage() {
  const [itemsChecked, setItemsChecked] = useState<Record<number, boolean>>({});

  const checklist = [
    { label: "Ácido Sulfônico 90%", qty: "80.0 Kg" },
    { label: "Amida 60", qty: "25.0 Kg" },
    { label: "Essência Glicerina DA20 (Substituto)", qty: "2.0 Kg" },
    { label: "Corante Amarelo Tartrazina", qty: "0.1 Kg" },
    { label: "Água Desmineralizada", qty: "892.9 Kg" },
  ];

  const allChecked = Object.keys(itemsChecked).length === checklist.length && Object.values(itemsChecked).every(Boolean);

  const toggleCheck = (index: number) => {
    setItemsChecked(prev => ({...prev, [index]: !prev[index]}));
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-2xl bg-[#11244A] text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
             <Tablet className="w-8 h-8" />
           </div>
           <div>
             <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-1">Terminal Operador T-01</span>
             <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Painel de Apontamento (Fábrica)</h2>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex-1 overflow-hidden flex flex-col">
         {/* Active OP Header */}
         <div className="bg-blue-50 border-b border-blue-100 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="bg-blue-600 text-white font-black text-sm px-3 py-1 rounded-md shadow-sm">OP-9011</div>
                 <div className="bg-emerald-100 text-emerald-700 font-bold text-xs px-2 py-1 rounded-md flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5"/> EM PROCESSAMENTO</div>
               </div>
               <h3 className="text-xl font-black text-[#11244A]">Detergente Neutro DA50 (1.000L)</h3>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 uppercase">Misturador Alocado</p>
              <p className="text-lg font-black text-[#11244A]">Tanque Inox TQ-04</p>
            </div>
         </div>

         <div className="p-8 flex-1 overflow-y-auto">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Checklist de Adição (Baixa de Estoque)</h4>
             <div className="space-y-3">
               {checklist.map((item, i) => (
                 <button 
                   key={i} 
                   onClick={() => toggleCheck(i)}
                   className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                     itemsChecked[i] 
                       ? 'bg-emerald-50 border-emerald-400 shadow-sm' 
                       : 'bg-white border-slate-200 hover:border-blue-300'
                   }`}
                 >
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        itemsChecked[i] ? 'bg-emerald-500 text-white' : 'bg-slate-100 border border-slate-300 text-transparent'
                      }`}>
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className={`text-lg font-bold ${itemsChecked[i] ? 'text-emerald-900' : 'text-[#11244A]'}`}>
                        {item.label}
                      </span>
                   </div>
                   <span className={`text-2xl font-black ${itemsChecked[i] ? 'text-emerald-600' : 'text-slate-400'}`}>
                     {item.qty}
                   </span>
                 </button>
               ))}
             </div>
         </div>

         {/* Footer Action */}
         <div className="p-6 border-t border-slate-200 bg-slate-50">
           <button 
             disabled={!allChecked}
             className={`w-full py-5 rounded-2xl text-lg font-black flex items-center justify-center gap-3 transition-all ${
               allChecked 
                 ? 'bg-orange-500 hover:bg-orange-600 text-[#11244A] shadow-[0_4px_20px_rgba(249,115,22,0.4)]' 
                 : 'bg-slate-200 text-slate-400 cursor-not-allowed'
             }`}
           >
             <Factory className="w-6 h-6" />
             FINALIZAR BATELADA E ENVIAR PARA QUARENTENA LABORATÓRIO (QA)
           </button>
         </div>
      </div>
    </div>
  )
}
