import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { GLOBAL_CATALOG } from '../../lib/catalog';
import { Box, UploadCloud, CheckCircle2 } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedCatalog = async () => {
    setSyncing(true);
    try {
      let count = 0;
      for (const p of GLOBAL_CATALOG) {
        const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const ref = doc(db, 'products', slug);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            title: p.title,
            price: p.price,
            sub: p.sub,
            tag: p.tag,
            color: p.color,
            createdAt: serverTimestamp()
          });
          count++;
        }
      }
      if (count > 0) {
        alert(`Sucesso! ${count} produtos novos foram adicionados no Banco de Dados.`);
        await fetchProducts();
      } else {
        alert("O catálogo já está atualizado no servidor. Nenhum produto novo.");
      }
    } catch (error: any) {
      console.error("Erro ao fazer seed do catálogo:", error);
      alert(`Falha na sincronização: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Carregando produtos...</div>;
  }

  const hasProducts = products.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Gestão de Produtos (B2B)</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Gerencie seu catálogo online e as SKUs da ERP.</p>
        </div>
        <button 
          onClick={seedCatalog}
          disabled={syncing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" /> 
          {syncing ? 'Sincronizando...' : 'Importar base GLOBAL_CATALOG'}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {hasProducts ? (
          <table className="w-full text-left bg-white">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-4">SKU / Produto</th>
                <th className="p-4">Categoria/Tag</th>
                <th className="p-4 text-right">Preço</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                        <Box className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#11244A]">{p.title}</p>
                        <p className="text-xs text-slate-400 font-medium">{p.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                     <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-200">
                       {p.tag}
                     </span>
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-600">
                     {p.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
            <Box className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="font-bold text-slate-700 text-lg mb-2">Seu catálogo está vazio no Firestore</h3>
            <p className="text-sm text-slate-500 max-w-md">
              Os produtos que aparecem na vitrine atualmente estão hardcoded no arquivo TS. 
              Clique em "Importar base" para transferi-los definitivamente para o banco de dados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
