import React from 'react';
import { Server, Wifi, Settings, RefreshCw, Terminal } from 'lucide-react';

export function TecniconPage() {
  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-2xl bg-[#11244A] text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
             <Server className="w-8 h-8" />
           </div>
           <div>
             <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block mb-1 flex items-center gap-1.5"><Wifi className="w-3 h-3"/> CONEXÃO ESTABELECIDA</span>
             <h2 className="text-2xl font-black text-[#11244A] tracking-tight">DataOps Sync (Tecnicon ERP)</h2>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
             <Settings className="w-4 h-4" /> Configurar Servidor (N8N)
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
         {/* Left Column: Triggers */}
         <div className="md:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-sm font-bold text-[#11244A] uppercase tracking-wider mb-4">Serviços de Extração</h3>
               <div className="space-y-3">
                 {[
                   { label: 'Sincronizar Cadastros BOM', time: 'Último sync: Há 10 min', status: 'ok' },
                   { label: 'Atualizar Estoque MP', time: 'Último sync: Há 2 min', status: 'ok' },
                   { label: 'Carga de Clientes B2B', time: 'Último sync: Ontem 23:00', status: 'ok' },
                   { label: 'Títulos Fiscais', time: 'Último sync: Falhou (Timeout)', status: 'error' },
                 ].map((job, i) => (
                   <div key={i} className={`p-4 rounded-xl border flex flex-col gap-2 ${job.status === 'error' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-200'}`}>
                     <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-[#11244A]">{job.label}</span>
                        <button className="p-1.5 bg-white rounded shadow-sm hover:bg-blue-50 text-blue-600 transition-colors border border-slate-200">
                          <RefreshCw className="w-3 h-3" />
                        </button>
                     </div>
                     <span className={`text-[10px] font-bold ${job.status === 'error' ? 'text-red-500' : 'text-slate-400'}`}>{job.time}</span>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* Right Column: Console / Log */}
         <div className="md:col-span-2 bg-[#0c1a36] rounded-2xl border border-slate-800 shadow-inner flex flex-col overflow-hidden">
            <div className="bg-[#081226] border-b border-slate-800 p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Terminal className="w-5 h-5 text-slate-400" />
                 <span className="text-sm font-bold text-slate-300">N8N Worker Logs (Streaming Engine)</span>
               </div>
               <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                 <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-0.5 ml-1"></div>
               </div>
            </div>
            <div className="p-6 font-mono text-xs overflow-y-auto flex-1 space-y-3 text-slate-300">
               <div className="text-emerald-400">[2026-04-20 22:45:01] SUCCESS: Cron trigger [Sync_Produtos] activated.</div>
               <div className="text-blue-300">[2026-04-20 22:45:02] INFO: Connecting to Firebird DB (10.0.0.155:3050)...</div>
               <div className="text-emerald-400">[2026-04-20 22:45:03] SUCCESS: 14 new products found. Extracting.</div>
               <div className="text-slate-400">[2026-04-20 22:45:04] UPSERT: Processing batch into Postgres (Satélite).</div>
               <div className="text-emerald-400 pb-4 border-b border-white/5">[2026-04-20 22:45:05] SUCCESS: Batch [Sync_Produtos] finished in 4.2s.</div>
               
               <div className="text-emerald-400 pt-2">[2026-04-20 22:50:00] SUCCESS: Webhook received. Action: Send_Invoice. Order: #4021.</div>
               <div className="text-blue-300">[2026-04-20 22:50:01] INFO: Formatting payload for Tecnicon SOAP API.</div>
               <div className="text-red-400 font-bold bg-red-900/20 py-1 px-2 rounded">[2026-04-20 22:50:05] WARN: Timeout TCP from 10.0.0.155. Retrying (1/3)...</div>
               <div className="text-emerald-400">[2026-04-20 22:50:10] SUCCESS: Tecnicon responded. ID de Faturamento: 99120.</div>
               
               <div className="flex items-center gap-2 mt-4 text-slate-500 italic pt-6">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Aguardando eventos de mensageria RabbitMQ...
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
