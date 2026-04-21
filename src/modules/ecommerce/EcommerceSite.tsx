import React, { useState } from 'react';
import { ShoppingCart, Store, Truck, ShieldCheck, Beaker } from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { GLOBAL_CATALOG } from '../../lib/catalog';
import type { User } from 'firebase/auth';

const HotechannLogo = ({ collapsed }: { collapsed?: boolean }) => (
  <svg viewBox="0 0 100 100" className={collapsed ? "w-8 h-8" : "w-12 h-12"}>
    <g transform="translate(50, 50)">
      <path d="M-30,-20 L0,-40 L30,-20 L30,20 L0,40 L-30,20 Z" fill="#11244A" />
      <path d="M-30,-20 L0,0 L30,-20" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0,0 L0,40" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
      <circle cx="0" cy="0" r="6" fill="#ffffff" />
    </g>
  </svg>
);

export function EcommerceSite({ onLogin, user }: { onLogin: () => void, user: User | null }) {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const [catalog, setCatalog] = useState<any[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const snap = await getDocs(collection(db, 'products'));
        if (snap.empty) {
          // Fallback if empty so the preview isn't dead
          setCatalog(GLOBAL_CATALOG);
        } else {
          setCatalog(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (e) {
        console.error("Failed to load catalog", e);
        setCatalog(GLOBAL_CATALOG);
      } finally {
        setLoadingCatalog(false);
      }
    }
    if (isCatalogOpen) {
       loadProducts();
    }
  }, [isCatalogOpen]);


  const handleAddBox = async (product: any) => {
    if (!user) {
      alert("Por favor, faça login para começar a comprar no B2B.");
      return;
    }
    try {
      await addDoc(collection(db, 'orders'), {
        client: user.email || 'Cliente B2B',
        type: 'E-commerce B2B',
        value: product.price,
        items: [{ title: product.title, qty: 1, price: product.price, sub: product.sub }],
        status: 'lead',
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      alert(`O produto ${product.title} foi adicionado como Lead no nosso ERP!`);
    } catch (err) {
      console.error(err);
      alert(`Erro ao tentar adicionar: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const renderProductVisual = (p: any) => {
    // If we have a photo URL, we try to render the image
    if (p.photoUrl) {
       return (
         <div className="w-16 h-20 relative group overflow-hidden rounded-md flex items-center justify-center">
           <img 
              src={p.photoUrl} 
              alt={p.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                 // Fallback if image fails to load
                 e.currentTarget.style.display = 'none';
                 const fallbackSvg = e.currentTarget.nextElementSibling as HTMLElement;
                 if (fallbackSvg) fallbackSvg.style.display = 'block';
              }}
           />
           <div style={{ display: 'none' }}>
             {renderSvgFallback(p)}
           </div>
         </div>
       );
    }
    
    // Otherwise return the typical SVG
    return renderSvgFallback(p);
  };

  const renderSvgFallback = (p: any) => {
    const isPote = p.sub.includes("1Kg");
    const isPump = p.tag === "Fortmaster";
    
    if (isPote) {
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md group-hover:scale-110 transition-transform">
           <path d="M25 20 h50 v10 h-50 z" fill="#ef4444" />
           <path d="M20 30 h60 v60 a5 5 0 0 1 -5 5 h-50 a5 5 0 0 1 -5 -5 z" fill="#ffffff" />
           <text x="50" y="60" fontSize="14" fontWeight="900" textAnchor="middle" fill="#11244A">FAZ</text>
           <text x="50" y="75" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#ef4444">99% SODA</text>
        </svg>
      );
    }
    
    if (isPump) {
      const isAlcool = p.title.includes("Álcool");
      return (
        <svg viewBox="0 0 100 120" className="w-16 h-20 drop-shadow-md group-hover:scale-110 transition-transform">
           <path d="M40 0 h20 v5 h-20 z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
           <path d="M55 5 h15 v4 h-15 z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
           <path d="M45 5 h10 v15 h-10 z" fill="#f1f5f9" />
           <path d="M20 20 h60 a10 10 0 0 1 10 10 v80 a10 10 0 0 1 -10 10 h-60 a10 10 0 0 1 -10 -10 v-80 a10 10 0 0 1 10 -10 z" fill={p.color} fillOpacity={isAlcool ? 0.3 : 1} />
           <path d="M25 40 h50 v40 h-50 z" fill="rgba(255,255,255,0.95)" />
           <text x="50" y="60" fontSize="8" fontWeight="900" textAnchor="middle" fill="#11244A">FORT</text>
           <text x="50" y="70" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#64748b">MASTER</text>
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 100 120" className="w-16 h-20 drop-shadow-md group-hover:scale-110 transition-transform">
         <path d="M40 5 h20 v10 h-20 z" fill={p.title.includes('Água Sanitária') ? '#115e59' : '#ef4444'} />
         <path d="M35 15 h30 v5 h-30 z" fill={p.title.includes('Água Sanitária') ? '#115e59' : '#ef4444'} />
         <path d="M20 20 h45 c 10 0 15 5 15 15 v15 c 0 10 -5 15 -15 15 h-5 v45 a10 10 0 0 1 -10 10 h-30 a10 10 0 0 1 -10 -10 v-80 a10 10 0 0 1 10 -10 z" fill={p.color} />
         <path d="M60 30 c 5 0 8 2 8 8 v8 c 0 5 -3 8 -8 8 z" fill="#f8fafc" />
         <path d="M15 45 h40 v45 h-40 z" fill="rgba(255,255,255,0.95)" />
         <text x="35" y="65" fontSize="12" fontWeight="900" textAnchor="middle" fill="#11244A">FAZ</text>
         <text x="35" y="78" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#64748b">{p.sub}</text>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsCatalogOpen(false)}>
               <HotechannLogo collapsed={true} />
               <span className="font-bold tracking-tight text-[#11244A] text-xl">Hotechann <span className="text-orange-500 font-black">FAZ</span></span>
            </div>
            
            <nav className="hidden md:flex gap-8 text-sm font-bold text-[#11244A]">
               <button onClick={() => setIsCatalogOpen(true)} className={`${isCatalogOpen ? 'text-orange-500' : 'hover:text-orange-500'} transition-colors`}>Produtos</button>
               <a href="#" className="hover:text-orange-500 transition-colors">A Empresa</a>
               <a href="#" className="hover:text-orange-500 transition-colors">Contato</a>
            </nav>

            <div className="flex items-center gap-4">
               <button className="p-2 text-slate-400 hover:text-[#11244A] relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">0</span>
               </button>
               <button onClick={onLogin} className="bg-[#11244A] hover:bg-[#0c1a36] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all flex items-center gap-2 border border-transparent hover:border-blue-800">
                  <ShieldCheck className="w-4 h-4" /> {user ? 'Acessar ERP' : 'Portal Interno (ERP)'}
               </button>
            </div>
         </div>
      </header>

      {isCatalogOpen ? (
        <section className="bg-slate-50 border-b border-slate-200 flex-1 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black text-[#11244A]">Catálogo B2B de Produtos</h1>
              <span className="text-sm font-bold text-slate-500">{loadingCatalog ? 'Carregando catálogo...' : `Mostrando ${catalog.length} itens`}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {catalog.map((p, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center text-center">
                   <div className="self-start bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded mb-4 shadow-sm border border-slate-200">{p.tag}</div>
                   <div className="w-32 h-32 flex items-center justify-center mb-6">
                     {renderProductVisual(p)}
                   </div>
                   <h3 className="font-bold text-[#11244A] text-sm leading-tight mb-2 h-10">{p.title}</h3>
                   <span className="text-[10px] font-bold text-slate-400 mb-4 bg-slate-50 px-2 py-1 rounded border border-slate-100">{p.sub}</span>
                   <div className="mt-auto w-full">
                     <span className="block text-xl font-black text-emerald-600 mb-3">{p.price}</span>
                     <button onClick={() => handleAddBox(p)} className="w-full bg-[#11244A] text-white font-bold py-2.5 rounded-xl hover:bg-orange-500 transition-colors flex justify-center items-center gap-2 text-xs">
                       <ShoppingCart className="w-4 h-4" /> ADD CAIXA
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-slate-50 border-b border-slate-200">
         <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
               <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase">Indústria Brasileira</span>
               <h1 className="text-5xl lg:text-6xl font-black text-[#11244A] leading-tight tracking-tight">Qualidade Química que a sua empresa <span className="text-orange-500">FAZ</span>.</h1>
               <p className="text-lg text-slate-500 font-medium max-w-xl">Produtos de limpeza profissional direto da fábrica para atacadistas, hospitais, licitações e revendas em todo o Brasil.</p>
               <div className="pt-4 flex gap-4">
                 <button onClick={() => setIsCatalogOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all text-lg">
                   Ver Catálogo de Produtos
                 </button>
               </div>
            </div>
            <div className="flex-1 relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-orange-50 rounded-full blur-3xl opacity-50"></div>
               <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-6 transform rotate-2 hover:rotate-0 transition-all duration-500">
                  <div className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                     <Beaker className="w-16 h-16 text-slate-300" />
                  </div>
                  <div>
                    <div className="text-orange-500 text-sm font-black mb-1">NOVO LANÇAMENTO</div>
                    <h3 className="text-2xl font-black text-[#11244A]">Detergente Neutro DA50 (5L)</h3>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Fórmula concentrada FAZ com alto rendimento para cozinhas industriais.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
      )}

      {/* Footer / Info */}
      <section className="py-20 bg-white shadow-inner">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-[#11244A] mb-8">Compre como Pessoa Jurídica (B2B)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-6 bg-slate-50 rounded-2xl flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-blue-600"><Store className="w-6 h-6"/></div>
                 <h4 className="font-bold text-[#11244A] mb-2">Atacadistas</h4>
                 <p className="text-sm text-slate-500">Condições exclusivas para compras de grandes volumes.</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-2xl flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-orange-500"><Truck className="w-6 h-6"/></div>
                 <h4 className="font-bold text-[#11244A] mb-2">Logística Rápida</h4>
                 <p className="text-sm text-slate-500">Integração ERP garantindo despacho com nota fiscal no ato.</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-2xl flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-emerald-600"><ShieldCheck className="w-6 h-6"/></div>
                 <h4 className="font-bold text-[#11244A] mb-2">Homologação QA</h4>
                 <p className="text-sm text-slate-500">Todos os lotes possuem FISPQ validada em laboratório próprio.</p>
               </div>
            </div>
        </div>
      </section>
    </div>
  )
}
