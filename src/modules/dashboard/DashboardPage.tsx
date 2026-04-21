import React from 'react';
import { ShoppingCart, Beaker, AlertTriangle, TrendingUp, CheckCircle2, ArrowRightLeft, FileCheck2 } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Visão Geral Operacional</h2>
        <div className="p-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold shadow-sm text-slate-600">
          Hoje, 20 de Abril de 2026
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Pedidos B2B P/ Integração", val: "14", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Lotes na Quarentena (Lab)", val: "2", icon: Beaker, color: "text-orange-500", bg: "bg-orange-50" },
          { title: "Alerta de Estoque (MRP)", val: "1", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
          { title: "Faturamento Estimado", val: "R$ 45k", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{card.title}</span>
               <div className={`p-2 rounded-lg ${card.bg}`}><card.icon className={`w-4 h-4 ${card.color}`} /></div>
             </div>
             <span className="text-3xl font-black text-[#11244A]">{card.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
           <h3 className="text-sm font-bold text-[#11244A] mb-4 uppercase tracking-wider">Produção Semanal vs Meta (Caixas)</h3>
           <div className="flex-1 flex items-end gap-4 text-xs font-bold text-slate-500 pt-4 px-4 min-h-[200px]">
             {/* Fake Bar Chart */}
             {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day, i) => {
               const height = [40, 70, 45, 90, 60][i];
               return (
                 <div key={day} className="flex-1 flex flex-col justify-end items-center gap-2 group h-full">
                   <div className="w-full max-w-[48px] bg-blue-50 rounded-t-lg relative flex items-end justify-center hover:bg-blue-100 transition-colors border border-blue-100" style={{height: `${height}%`}}>
                      <div className="w-full bg-[#11244A] rounded-t-lg transition-all shadow-sm" style={{height: `${height * 0.7}%`}}></div>
                   </div>
                   <span>{day}</span>
                 </div>
               )
             })}
           </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
           <h3 className="text-sm font-bold text-[#11244A] mb-6 uppercase tracking-wider">Log de Atividades do ERP</h3>
           <div className="space-y-5 flex-1">
             {[
               { text: "Lote LT-204 aprovado pelo Lab", time: "Há 10 min", icon: CheckCircle2, color: "text-emerald-500" },
               { text: "Pedido #4021 enviado pro Tecnicon", time: "Há 1h", icon: ArrowRightLeft, color: "text-blue-500" },
               { text: "Déficit de MP detectado (Essência)", time: "Há 2h", icon: AlertTriangle, color: "text-red-500" },
               { text: "FISPQ 2.0 gerada p/ Desinfetante", time: "Há 4h", icon: FileCheck2, color: "text-orange-500" },
             ].map((log, i) => (
               <div key={i} className="flex gap-4 items-start">
                 <div className="mt-0.5"><log.icon className={`w-5 h-5 ${log.color}`} /></div>
                 <div>
                   <p className="text-sm font-semibold text-[#11244A]">{log.text}</p>
                   <p className="text-xs font-medium text-slate-400 mt-0.5">{log.time}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  )
}
