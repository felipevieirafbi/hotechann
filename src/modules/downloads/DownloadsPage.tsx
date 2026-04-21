import React from 'react';
import { FileDown, Download } from 'lucide-react';

export function DownloadsPage() {
  const files = [
    { title: "Tabela de Preços Atacado", date: "20/Abril/2026", size: "2.4 MB", type: "PDF" },
    { title: "Apresentação Corporativa FAZ", date: "15/Março/2026", size: "15.1 MB", type: "PPTX" },
    { title: "Catálogo de Produtos 2026", date: "10/Janeiro/2026", size: "8.7 MB", type: "PDF" },
    { title: "Kit Homologação Anvisa", date: "05/Fevereiro/2026", size: "12.0 MB", type: "ZIP" },
  ];

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-2xl bg-[#11244A] text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
             <FileDown className="w-8 h-8" />
           </div>
           <div>
             <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-1">Materiais de Apoio</span>
             <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Central de Downloads</h2>
             <p className="text-sm font-medium text-slate-500 mt-1">Baixe tabelas, catálogos e materiais para representantes comerciais.</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {files.map((file, i) => (
           <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <Download className="w-6 h-6" />
                 </div>
                 <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{file.type}</span>
              </div>
              <h3 className="font-bold text-[#11244A] mb-1">{file.title}</h3>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mt-auto pt-4">
                 <span>Atualizado: {file.date}</span>
                 <span>•</span>
                 <span>{file.size}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  )
}
