import React, { useState } from 'react';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Factory, UploadCloud, AlertCircle, CheckCircle2, FlaskConical } from 'lucide-react';

const BOM_DATA = [
  {
    productName: "Detergente Neutro FAZ",
    productSlug: "detergente-neutro-faz",
    baseYieldQty: 1000,
    unit: "L",
    isActive: true,
    items: [
      { materialId: "mp-acid-sulf", requiredQty: 150 },
      { materialId: "mp-amida", requiredQty: 50 },
      { materialId: "mp-essflo-a", requiredQty: 15, substituteId: "mp-essflo-b", conversionFactor: 1.2 },
      { materialId: "mp-cloreto", requiredQty: 20 },
      { materialId: "mp-agua", requiredQty: 800 }
    ]
  },
  {
    productName: "Desinfetante Lavanda FAZ",
    productSlug: "desinfetante-lavanda-faz",
    baseYieldQty: 1000,
    unit: "L",
    isActive: true,
    items: [
      { materialId: "mp-essflo-a", requiredQty: 20 },
      { materialId: "mp-lauril", requiredQty: 30 },
      { materialId: "mp-agua", requiredQty: 900 }
    ]
  },
  {
    productName: "Água Sanitária FAZ",
    productSlug: "agua-sanitaria-faz",
    baseYieldQty: 1000,
    unit: "L",
    isActive: true,
    items: [
      { materialId: "mp-hipocl", requiredQty: 400 },
      { materialId: "mp-naoh", requiredQty: 10 },
      { materialId: "mp-agua", requiredQty: 600 }
    ]
  }
];

const RAW_MATERIALS = [
  { id: "mp-acid-sulf", name: "Ácido Sulfônico", unit: "KG" },
  { id: "mp-amida", name: "Amida 60", unit: "KG" },
  { id: "mp-essflo-a", name: "Essência Floral A", unit: "KG" },
  { id: "mp-essflo-b", name: "Essência Floral B", unit: "KG" },
  { id: "mp-cloreto", name: "Cloreto de Sódio", unit: "KG" },
  { id: "mp-lauril", name: "Lauril Sulfato", unit: "KG" },
  { id: "mp-agua", name: "Água Deionizada", unit: "L" },
  { id: "mp-hipocl", name: "Hipoclorito Sódio 12%", unit: "L" },
  { id: "mp-glicerina", name: "Glicerina", unit: "KG" },
  { id: "mp-naoh", name: "Hidróxido de Sódio", unit: "KG" }
];

const STOCK_BALANCE = [
  { id: "mp-acid-sulf", qty: 150 },
  { id: "mp-amida", qty: 80 },
  { id: "mp-essflo-a", qty: 3 }, // DEFICIT INTENCIONAL
  { id: "mp-essflo-b", qty: 25 }, // SUBSTITUTO
  { id: "mp-cloreto", qty: 200 },
  { id: "mp-lauril", qty: 120 },
  { id: "mp-agua", qty: 5000 },
  { id: "mp-hipocl", qty: 500 },
  { id: "mp-glicerina", qty: 40 },
  { id: "mp-naoh", qty: 30 }
];

export function MrpPage() {
  const [selectedSlug, setSelectedSlug] = useState('detergente-neutro-faz');
  const [quantity, setQuantity] = useState(1000);
  const [mrpResult, setMrpResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      for (const item of RAW_MATERIALS) {
        await setDoc(doc(db, 'raw_materials', item.id), item);
      }
      for (const item of STOCK_BALANCE) {
        await setDoc(doc(db, 'stock_balance', item.id), item);
      }
      for (const item of BOM_DATA) {
        await setDoc(doc(db, 'bom_formulas', item.productSlug), item);
      }
      alert("Sucesso! Banco de Produtividade atualizado com dados estáticos.");
    } catch (e: any) {
      alert("Erro ao seedar: " + e.message);
    } finally {
      setSeeding(false);
    }
  };

  const calculateMrp = async () => {
    setLoading(true);
    setMrpResult(null);
    try {
      const response = await fetch('/api/mrp/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug: selectedSlug, quantity })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setMrpResult(data);
    } catch (error: any) {
      alert("Erro ao calcular: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Engenharia Química (MRP)</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Cálculos de batelada, análise de gargalos e check de matéria-prima (IA).</p>
        </div>
        <button 
          onClick={handleSeedData}
          disabled={seeding}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" /> 
          {seeding ? 'Enviando...' : 'Importar BOM e Estoques (Seeding)'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
         <div className="flex gap-4 items-end">
            <div className="flex-1">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Fórmula Base (Produto)</label>
               <select 
                 className="w-full bg-slate-50 border border-slate-200 text-[#11244A] text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 outline-none font-bold"
                 value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)}
               >
                 {BOM_DATA.map(b => (
                   <option key={b.productSlug} value={b.productSlug}>{b.productName}</option>
                 ))}
               </select>
            </div>
            <div className="w-32">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Qtd (Litros)</label>
               <input 
                 type="number" 
                 className="w-full bg-slate-50 border border-slate-200 text-[#11244A] text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 outline-none font-bold"
                 value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
               />
            </div>
            <button 
              onClick={calculateMrp}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all h-[46px] flex items-center"
            >
              {loading ? 'Calculando...' : 'Calcular Necessidade'}
            </button>
         </div>
      </div>

      {mrpResult && (
        <div className="space-y-6">
           <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${mrpResult.feasible ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
              {mrpResult.feasible ? <CheckCircle2 className="w-8 h-8 opacity-80" /> : <AlertCircle className="w-8 h-8 opacity-80" />}
              <div>
                 <h3 className="text-lg font-black">{mrpResult.feasible ? 'Batelada 100% Viável' : 'Alerta de Inviabilidade: Faltam MP'}</h3>
                 <p className="text-sm font-medium opacity-90">{mrpResult.feasible ? 'O estoque atual cobre todas as necessidades da fórmula requerida.' : 'Foram encontrados gargalos no estoque de matérias-primas críticas. Cheque os laudos substitutivos.'}</p>
              </div>
           </div>

           <table className="w-full text-left bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase">Input Material</th>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Necessário</th>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Estoque Disp.</th>
                 <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
               </tr>
             </thead>
             <tbody className="text-sm divide-y divide-slate-100">
                {mrpResult.items.map((i: any) => (
                  <tr key={i.materialId} className={i.status === 'SHORTFALL' ? 'bg-red-50/50' : ''}>
                    <td className="p-4 font-bold text-[#11244A]">{i.name} ({i.unit})</td>
                    <td className="p-4 text-right font-semibold text-slate-600">{i.required.toFixed(2)}</td>
                    <td className="p-4 text-right font-semibold text-slate-600">{i.available.toFixed(2)}</td>
                    <td className="p-4 text-center">
                       {i.status === 'OK' ? (
                          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 font-bold rounded text-xs">OK</span>
                       ) : (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-700 font-bold rounded text-xs">DÉFICIT</span>
                       )}
                    </td>
                  </tr>
                ))}
             </tbody>
           </table>

           {mrpResult.shortfalls.length > 0 && (
             <div className="space-y-4">
               <h3 className="text-xl font-black text-[#11244A] flex items-center gap-2">
                 <FlaskConical className="w-6 h-6 text-orange-500" /> Relatório Mestre de Substituição (Gemini)
               </h3>
               {mrpResult.shortfalls.map((s: any) => (
                 <div key={s.materialId} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200 border-l-4 border-l-blue-500 relative">
                    <p className="text-xs font-bold text-blue-500 uppercase mb-2">ANÁLISE PARA O DÉFICIT DE: {s.name}</p>
                    <p className="text-slate-600 mb-4 font-medium text-sm">Faltam <strong>{s.deficit.toFixed(2)} {s.unit}</strong> para compor o lote. Foi tentada a substituição por <strong>{s.substituteName}</strong>.</p>
                    
                    {s.aiSuggestion?.chemicalReasoning ? (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-sm text-slate-700 relative">
                         <span className="absolute -top-3 -right-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 font-bold rounded shadow-sm">AI STUDIO CHECKED</span>
                         " {s.aiSuggestion.chemicalReasoning} "
                         
                         <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-6">
                            <div>
                               <span className="text-xs text-slate-400 font-bold uppercase">Substituto</span>
                               <p className="font-bold text-[#11244A]">{s.aiSuggestion.substituteProductSku}</p>
                            </div>
                            <div>
                               <span className="text-xs text-slate-400 font-bold uppercase">Fator de Conv.</span>
                               <p className="font-bold text-emerald-600">{s.aiSuggestion.conversionFactorApplied}x</p>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded">
                        Erro ao buscar validação IA: {s.aiSuggestion?.error || 'Aguardando chave da API'}
                      </div>
                    )}
                 </div>
               ))}
             </div>
           )}
        </div>
      )}
    </div>
  )
}
