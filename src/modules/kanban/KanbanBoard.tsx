import React, { useState, useEffect } from 'react';
import { KanbanSquare, Plus, CheckCircle2, ShoppingCart, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { GLOBAL_CATALOG } from '../../lib/catalog';

export function KanbanBoard() {
  const [filterType, setFilterType] = useState('Todos');
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [newCardData, setNewCardData] = useState<{client: string, type: string, items: any[]}>({ client: '', type: 'Vendedor', items: [] });
  const [selectedProductToAdd, setSelectedProductToAdd] = useState('');
  const [addQty, setAddQty] = useState(1);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const dbCards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCards(dbCards);
    });
    return unsub;
  }, []);

  const parsePrice = (priceStr: string) => parseFloat(priceStr.replace('R$ ', '').replace('.', '').replace(',', '.'));
  const formatPrice = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const calculateTotalValue = (items: any[]) => {
    let sum = 0;
    items.forEach(i => sum += (parsePrice(i.price) * i.qty));
    return formatPrice(sum);
  };

  const handleAddItemToForm = () => {
    const p = GLOBAL_CATALOG.find(x => x.title === selectedProductToAdd);
    if (p) {
      setNewCardData(prev => ({
        ...prev,
        items: [...prev.items, { title: p.title, qty: addQty, price: p.price, sub: p.sub }]
      }));
      setSelectedProductToAdd('');
      setAddQty(1);
    }
  };

  const columns = [
    { id: 'lead', title: 'Leads / Novos', color: 'bg-slate-100', borderColor: 'border-slate-200' },
    { id: 'cotacao', title: 'Em Cotação / Licitação', color: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 'aprovado', title: 'Aprovado (Pend. ERP)', color: 'bg-orange-50', borderColor: 'border-orange-200' },
    { id: 'entregue', title: 'Faturado & Entregue', color: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  ];

  const filteredCards = cards.filter(c => filterType === 'Todos' || c.type === filterType);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('cardId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (!cardId) return;

    try {
      await updateDoc(doc(db, 'orders', cardId), { status: colId });
    } catch (err) {
      console.error('Failed to change status', err);
      alert('Erro ao atualizar status! Verifique permissões.');
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    if (newCardData.items.length === 0) {
      alert('Por favor, adicione pelo menos um produto ao pedido.');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        client: newCardData.client,
        type: newCardData.type,
        value: calculateTotalValue(newCardData.items),
        items: newCardData.items,
        status: 'lead',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setIsNewCardModalOpen(false);
      setNewCardData({ client: '', type: 'Vendedor', items: [] });
    } catch (err) {
      console.error(err);
      alert('Erro ao criar card.');
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-2xl bg-[#11244A] text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
             <KanbanSquare className="w-8 h-8" />
           </div>
           <div>
             <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-1">CRM Multicanal</span>
             <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Kanban de Vendas & B2B</h2>
             <p className="text-sm font-medium text-slate-500 mt-1">Acompanhe cards de E-commerce, Vendedores, Representantes e Licitações.</p>
           </div>
        </div>
        <div className="flex flex-col gap-3 items-end">
           <div className="flex items-center gap-2">
             <button onClick={() => setIsNewCardModalOpen(true)} className="bg-[#11244A] hover:bg-[#0c1a36] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all whitespace-nowrap">
               <Plus className="w-4 h-4" /> NOVO PEDIDO
             </button>
             <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all whitespace-nowrap">
               <CheckCircle2 className="w-4 h-4" /> INTEGRAR APROVADOS (TECNICON)
             </button>
           </div>
           <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 p-1.5 border border-slate-200 rounded-lg overflow-x-auto max-w-full">
             {['Todos', 'E-commerce B2B', 'Vendedor', 'Representante', 'Licitação'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilterType(f)}
                 className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${filterType === f ? 'bg-white shadow-sm border border-slate-300 text-[#11244A]' : 'text-slate-500 hover:bg-slate-200'}`}
               >
                 {f}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map(col => (
          <div 
            key={col.id} 
            className={`flex-shrink-0 w-80 rounded-2xl border ${col.borderColor} ${col.color} flex flex-col`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
             <div className="p-4 border-b border-transparent">
               <h3 className="font-black text-[#11244A] text-sm uppercase tracking-wide flex justify-between items-center">
                 {col.title}
                 <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-inherit">{cards.filter(c => c.status === col.id).length}</span>
               </h3>
             </div>
             <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[200px]">
               <AnimatePresence>
                 {filteredCards.filter(c => c.status === col.id).map(card => (
                   <motion.div 
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     key={card.id} 
                     draggable
                     onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, card.id)}
                     onClick={() => setSelectedCard(card)}
                     className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md transition-all group"
                   >
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded bg-slate-50 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors uppercase">UID: {card.id.slice(0, 5)}</span>
                       <span className="text-[10px] font-bold text-[#11244A] bg-orange-100 px-2 py-0.5 rounded">{card.type}</span>
                     </div>
                     <h4 className="font-bold text-[#11244A] text-sm mb-3 leading-tight">{card.client}</h4>
                     <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                       <span className="text-xs font-semibold text-slate-400">Total Previsto</span>
                       <span className="font-black text-emerald-600">{card.value}</span>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
          </div>
        ))}
      </div>

      {/* Modern Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#11244A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
               <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase mb-2 block">{selectedCard.type}</span>
                    <h2 className="text-2xl font-black text-[#11244A]">{selectedCard.client}</h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">ID: {selectedCard.id}</p>
                  </div>
                  <button onClick={() => setSelectedCard(null)} className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-full border border-slate-200 hover:border-red-200 transition-colors shadow-sm">
                    <XCircle className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="p-6 flex-1 bg-white">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                      <span className="text-xs font-bold text-slate-400 uppercase mb-1">Status Atual</span>
                      <span className="font-black text-[#11244A] text-lg">{columns.find(c => c.id === selectedCard.status)?.title || selectedCard.status}</span>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-center">
                      <span className="text-xs font-bold text-emerald-600/70 uppercase mb-1">Valor Total</span>
                      <span className="font-black text-emerald-600 text-2xl">{selectedCard.value}</span>
                    </div>
                  </div>

                  <div>
                     <h3 className="font-bold text-[#11244A] text-sm mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                       <ShoppingCart className="w-4 h-4 text-orange-500" /> Resumo do Pedido Real
                     </h3>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                       {selectedCard.items && selectedCard.items.length > 0 ? (
                         selectedCard.items.map((item: any, idx: number) => (
                           <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                             <div className="flex flex-col">
                               <span className="font-bold text-[#11244A] text-sm">{item.title}</span>
                               <span className="text-[10px] font-semibold text-slate-400">{item.sub || item.price}</span>
                             </div>
                             <span className="text-sm font-bold text-slate-600 border border-slate-200 bg-white px-2 py-1 rounded">{item.qty} cx</span>
                           </div>
                         ))
                       ) : (
                         <div className="text-sm text-slate-400 italic">Nenhum detalhe de produto preenchido.</div>
                       )}
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                  <button onClick={() => setSelectedCard(null)} className="px-5 py-2 font-bold text-sm text-slate-500 hover:text-[#11244A] transition-colors rounded-lg hover:bg-slate-200">
                    Fechar
                  </button>
                  <button className="px-5 py-2 font-bold text-sm bg-[#11244A] text-white rounded-lg shadow-md hover:bg-orange-500 transition-all flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Avançar Processo
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Card Modal */}
      <AnimatePresence>
        {isNewCardModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#11244A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsNewCardModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
               <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                  <div>
                    <h2 className="text-xl font-black text-[#11244A]">Novo Card / Pedido</h2>
                    <p className="text-xs text-slate-500 mt-1">Crie um card manualmente em Leads</p>
                  </div>
                  <button onClick={() => setIsNewCardModalOpen(false)} className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-full border border-slate-200 hover:border-red-200 transition-colors shadow-sm">
                    <XCircle className="w-5 h-5" />
                  </button>
               </div>
               
               <form onSubmit={handleCreateCard} className="p-6 flex-1 bg-white space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Cliente / Empresa</label>
                    <input 
                      required
                      type="text" 
                      value={newCardData.client} 
                      onChange={e => setNewCardData({...newCardData, client: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-blue-500" 
                      placeholder="Ex: Hospital Municipal" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Canal de Origem</label>
                    <select 
                      value={newCardData.type} 
                      onChange={e => setNewCardData({...newCardData, type: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Vendedor">Vendedor</option>
                      <option value="Representante">Representante</option>
                      <option value="Licitação">Licitação</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Adicionar Produtos ao Pedido</label>
                    <div className="flex gap-2 mb-3">
                      <select 
                        value={selectedProductToAdd}
                        onChange={e => setSelectedProductToAdd(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">Selecione um produto...</option>
                        {GLOBAL_CATALOG.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                      </select>
                      <input 
                        type="number"
                        placeholder="Qtd (Cx)"
                        value={addQty}
                        onChange={e => setAddQty(Number(e.target.value))}
                        className="w-24 border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-blue-500"
                        min="1"
                      />
                      <button 
                        type="button"
                        onClick={handleAddItemToForm}
                        disabled={!selectedProductToAdd || addQty < 1}
                        className="bg-[#11244A] hover:bg-orange-500 text-white px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {newCardData.items.length > 0 && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 mb-2 max-h-40 overflow-y-auto">
                        {newCardData.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded text-sm">
                            <div className="flex flex-col">
                              <span className="font-bold text-[#11244A] text-xs">{item.title}</span>
                              <span className="text-[10px] text-slate-400">{item.sub} | {item.price}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-600 border border-slate-200 bg-slate-50 px-2 rounded">{item.qty} cx</span>
                              <button type="button" onClick={() => setNewCardData(p => ({...p, items: p.items.filter((_, i) => i !== idx)}))} className="text-red-400 hover:text-red-500">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-[#11244A] uppercase">Valor Total Calculado</span>
                    <span className="text-xl font-black text-emerald-600">{calculateTotalValue(newCardData.items)}</span>
                  </div>

                  <div className="pt-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsNewCardModalOpen(false)} className="px-5 py-2 font-bold text-sm text-slate-500 hover:text-[#11244A] transition-colors rounded-lg hover:bg-slate-200">
                      Cancelar
                    </button>
                    <button type="submit" className="px-5 py-2 font-bold text-sm bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Criar Card
                    </button>
                  </div>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
