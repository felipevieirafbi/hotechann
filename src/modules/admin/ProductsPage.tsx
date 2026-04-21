import React, { useState, useEffect, useRef } from 'react';
import { collection, query, getDocs, doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { GLOBAL_CATALOG } from '../../lib/catalog';
import { Box, UploadCloud, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [uploadingState, setUploadingState] = useState<{[key: string]: boolean | number}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

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
        const productRef = doc(db, 'products', slug);
        const snap = await getDoc(productRef);
        if (!snap.exists()) {
          await setDoc(productRef, {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProductId || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const productId = selectedProductId;
    
    // Reset selection logic
    setSelectedProductId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const storageRef = ref(storage, `products/${productId}.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploadingState(prev => ({ ...prev, [productId]: 0 }));

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadingState(prev => ({ ...prev, [productId]: progress }));
      }, 
      (error) => {
        console.error("Erro ao fazer upload:", error);
        alert(`Erro de upload: ${error.message}`);
        setUploadingState(prev => ({ ...prev, [productId]: false }));
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, 'products', productId), {
            photoUrl: downloadURL
          });
          setUploadingState(prev => ({ ...prev, [productId]: false }));
          await fetchProducts();
        } catch (error: any) {
          console.error("Erro ao atualizar URL da foto no Firestore:", error);
        }
      }
    );
  };

  const triggerFileInput = (productId: string) => {
    setSelectedProductId(productId);
    fileInputRef.current?.click();
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Carregando produtos...</div>;
  }

  const hasProducts = products.length > 0;

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Gestão de Produtos (B2B)</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Gerencie seu catálogo online, fotos e SKUs da ERP.</p>
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
                <th className="p-4">Foto</th>
                <th className="p-4 text-right">Preço</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {products.map(p => {
                const uploadState = uploadingState[p.id];
                const isUploading = typeof uploadState === 'number';
                
                return (
                  <tr key={p.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shrink-0 overflow-hidden">
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <Box className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#11244A] break-words">{p.title}</p>
                          <p className="text-xs text-slate-400 font-medium">{p.sub}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                       <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-200">
                         {p.tag}
                       </span>
                    </td>
                    <td className="p-4">
                       {isUploading ? (
                         <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                           <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadState}%` }}></div>
                         </div>
                       ) : (
                         <button 
                           onClick={() => triggerFileInput(p.id)}
                           className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                         >
                           <ImageIcon className="w-3.5 h-3.5" />
                           {p.photoUrl ? 'Trocar' : 'Adicionar'}
                         </button>
                       )}
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                       {p.price}
                    </td>
                  </tr>
                );
              })}
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
