import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Beaker, 
  Factory, 
  ShoppingCart, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Microscope,
  Clock,
  Box,
  Layers,
  Thermometer,
  ArrowRightLeft,
  Truck,
  FileCheck2,
  Bot,
  Tablet,
  PlayCircle,
  RefreshCw,
  Server,
  Database,
  Wifi,
  Terminal,
  Store,
  FileDown,
  LogOut,
  Download,
  Phone,
  Mail,
  MapPin,
  KanbanSquare,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, getDocs, setDoc, updateDoc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export const GLOBAL_CATALOG = [
  { title: "Alvejante Sem Cloro FAZ", price: "R$ 58,12", sub: "Caixa 4x5L", tag: "Lavanderia", color: "#ec4899" },
  { title: "Amaciante de Roupas BLUE", price: "R$ 46,33", sub: "Caixa 4x5L", tag: "Lavanderia", color: "#38bdf8" },
  { title: "Lava Roupas Liq. Floral FAZ", price: "R$ 74,87", sub: "Caixa 4x5L", tag: "Lavanderia", color: "#0ea5e9" },
  { title: "Lava Roupas Liq. Coco FAZ", price: "R$ 74,87", sub: "Caixa 4x5L", tag: "Lavanderia", color: "#fed7aa" },
  { title: "Desinfetante Lavanda FAZ", price: "R$ 34,51", sub: "Caixa 4x5L", tag: "Banheiro", color: "#a855f7" },
  { title: "Desinfetante Pinho FAZ", price: "R$ 34,51", sub: "Caixa 4x5L", tag: "Banheiro", color: "#16a34a" },
  { title: "Desinfetante Citronela FAZ", price: "R$ 34,51", sub: "Caixa 4x5L", tag: "Banheiro", color: "#06b6d4" },
  { title: "Detergente Amoniacal DA50", price: "R$ 51,22", sub: "Caixa 4x5L", tag: "Limpeza Pesada", color: "#22c55e" },
  { title: "Detergente Neutro FAZ", price: "R$ 52,76", sub: "Caixa 4x5L", tag: "Cozinha", color: "#fef08a" },
  { title: "Desengordurante Fazmol", price: "R$ 97,36", sub: "Caixa 4x5L", tag: "Cozinha", color: "#a3e635" },
  { title: "Limpa Forno FAZ", price: "R$ 54,70", sub: "Caixa 4x5L", tag: "Limpeza Pesada", color: "#166534" },
  { title: "Limpa Pedra Fazclean", price: "R$ 72,18", sub: "Caixa 4x5L", tag: "Limpeza Pesada", color: "#6366f1" },
  { title: "Multiuso Floral FAZ", price: "R$ 45,72", sub: "Caixa 4x5L", tag: "Limpeza Geral", color: "#f472b6" },
  { title: "Álcool Perfumado Floral", price: "R$ 60,00", sub: "Caixa 4x5L", tag: "Limpeza Geral", color: "#f472b6" },
  { title: "Água Sanitária FAZ", price: "R$ 28,00", sub: "Caixa 4x5L", tag: "Limpeza Geral", color: "#115e59" },
  { title: "Soda Cáustica Escama 99%", price: "R$ 221,35", sub: "Caixa 12x1Kg", tag: "Especiais", color: "#ffffff" },
  { title: "Álcool em Gel Fortmaster", price: "R$ 144,67", sub: "Caixa 12x1L", tag: "Fortmaster", color: "#e2e8f0" },
  { title: "Sabonete Líq. Açaí & Pitanga", price: "R$ 145,60", sub: "Cx Pump 12x1L", tag: "Fortmaster", color: "#c026d3" },
  { title: "Sabonete Líq. Erva Doce", price: "R$ 145,60", sub: "Cx Pump 12x1L", tag: "Fortmaster", color: "#4ade80" },
  { title: "Sabonete Líq. Algas", price: "R$ 145,60", sub: "Cx Pump 12x1L", tag: "Fortmaster", color: "#0284c7" },
];

function HotechannLogo({ collapsed = false }) {
  return (
    <div className={`relative flex items-center justify-center ${collapsed ? 'w-10 h-8' : 'w-16 h-12'} transition-all`} aria-label="Hotechann FAZ Logo">
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-yellow-400 rotate-12 scale-[0.8] blur-[1px]" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-orange-400 to-yellow-300 scale-[0.85]" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
      <div className="relative z-10 flex flex-col items-center leading-none mt-1">
        {!collapsed && <span className="text-[7px] font-extrabold text-[#11244A] tracking-tighter drop-shadow-sm uppercase">HOTECHANN</span>}
        <span className={`${collapsed ? 'text-lg' : 'text-2xl mt-[-2px]'} font-black italic text-[#11244A] tracking-tighter drop-shadow-sm`} style={{textShadow: '1px 1px 0 #FFF, -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF'}}>FAZ</span>
      </div>
    </div>
  );
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sales', label: 'CRM & Vendas (Kanban)', icon: KanbanSquare },
  { id: 'production', label: 'Engenharia (MRP)', icon: Factory },
  { id: 'shopfloor', label: 'Chão de Fábrica', icon: Tablet, badge: '1' },
  { id: 'qa', label: 'Laboratório (QA)', icon: Beaker, badge: '2' },
  { id: 'downloads', label: 'Central de Downloads', icon: FileDown },
  { id: 'integration', label: 'Integração Tecnicon', icon: ArrowRightLeft },
];

export default function App() {
  const [view, setView] = useState<'ecommerce' | 'erp'>('ecommerce');
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      // Auto-assign admin role on first login for the specific user in Firestore
      if (currentUser && currentUser.email === 'felipe.vieira.consultoria@gmail.com') {
         setDoc(doc(db, 'users', currentUser.uid), {
           email: currentUser.email,
           role: 'admin'
         }, { merge: true });
      } else if (currentUser) {
         setDoc(doc(db, 'users', currentUser.uid), {
           email: currentUser.email,
           role: 'customer'
         }, { merge: true });
      }
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setView('erp');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Erro ao fazer login com o Google.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('ecommerce');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!authReady) {
    return <div className="h-screen w-full flex items-center justify-center bg-white"><div className="animate-spin text-orange-500"><RefreshCw className="w-8 h-8" /></div></div>;
  }

  if (view === 'ecommerce') {
    return <EcommerceSite onLogin={handleLogin} user={user} />;
  }

  if (!user) {
    // Force view back if not logged in
    return <EcommerceSite onLogin={handleLogin} user={user} />;
  }

  return <ErpDashboard onLogout={handleLogout} user={user} />;
}

function ErpDashboard({ onLogout, user }: { onLogout: () => void, user: User }) {
  const [activeModule, setActiveModule] = useState('sales');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex">
      {/* Sidebar ERP */}
      <aside className="w-64 bg-[#11244A] text-white flex flex-col shadow-xl z-20 shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-white/10 bg-[#0c1a36]">
          <div className="flex items-center gap-2">
            <HotechannLogo collapsed={true} />
            <span className="font-bold tracking-tight text-white">Satélite <span className="text-orange-400 font-black">ERP</span></span>
          </div>
        </div>
        
        <div className="p-4 flex-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Módulos</div>
          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    isActive ? 'bg-blue-600/20 text-white border border-blue-500/30 shadow-[inset_2px_0_0_#FFF]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-5">
               <HotechannLogo />
             </div>
             <h4 className="text-[11px] font-bold text-orange-400 mb-1 leading-tight">Mockup Interativo</h4>
             <p className="text-[10px] text-slate-300 leading-relaxed font-medium">Este layout reflete o futuro admin real com a paleta Hotechann FAZ. O SAD Document foi transicionado para cá.</p>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-slate-300 transition-colors text-sm font-medium">
            <Settings className="w-4 h-4" /> Configurações
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium mt-1">
            <LogOut className="w-4 h-4" /> Sair (Portal B2B)
          </button>
          <div className="mt-4 flex items-center gap-3 px-3">
             <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-sm border border-orange-400">
               FC
             </div>
             <div className="flex flex-col text-left">
                <span className="text-xs font-bold">Felipe</span>
                <span className="text-[10px] text-slate-400">Administrador</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="text-slate-400">Hotechann FAZ</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-[#11244A] font-bold">
              {menuItems.find(m => m.id === activeModule)?.label}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Buscar pedidos, lotes..." className="pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none w-64 transition-all" />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-[#11244A] transition-colors rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <ModuleRouter id={activeModule} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ModuleRouter({ id }: { id: string }) {
  switch(id) {
    case 'dashboard': return <DashboardModule />;
    case 'production': return <EngineeringModule />;
    case 'shopfloor': return <ShopFloorModule />;
    case 'qa': return <QaLabModule />;
    case 'sales': return <SalesKanbanModule />;
    case 'downloads': return <DownloadsModule />;
    case 'integration': return <IntegrationModule />;
    default: return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 rounded-2xl border-dashed">
        <Factory className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-semibold text-slate-600">Módulo em Desenvolvimento</p>
        <p className="text-sm mt-2 max-w-sm text-center">A arquitetura deste módulo já foi mapeada e será conectada ao schema Prisma nas próximas etapas de Full-Stack.</p>
      </div>
    );
  }
}

// ------------------------------
// Shop Floor (Tablet view) Module
// ------------------------------
function ShopFloorModule() {
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

// ------------------------------
// Integration Module (Tecnicon DataOps)
// ------------------------------
function IntegrationModule() {
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

// ------------------------------
// Downloads Module
// ------------------------------
function DownloadsModule() {
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

// ------------------------------
// E-commerce Public Site (Facade)
// ------------------------------
function EcommerceSite({ onLogin, user }: { onLogin: () => void, user: User | null }) {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

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
              <span className="text-sm font-bold text-slate-500">Mostrando {GLOBAL_CATALOG.length} itens</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {GLOBAL_CATALOG.map((p, i) => (
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
function EngineeringModule() {
  const [activeTab, setActiveTab] = useState<'mrp' | 'bom'>('mrp');

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-3 shadow-sm">
            Core Engine (Satélite)
          </div>
          <h2 className="text-3xl font-black text-[#11244A] tracking-tight">Engenharia e Produção (PCP)</h2>
          <p className="text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
            Painel do motor MRP. Exibe relatórios de déficit baseados nos pedidos pendentes e gestão de componentes de substituição para Lotes via Engenharia.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 font-bold text-sm">
        <button 
          onClick={() => setActiveTab('mrp')}
          className={`pb-4 px-6 transition-colors border-b-2 ${activeTab === 'mrp' ? 'border-[#11244A] text-[#11244A]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Planejamento de Materiais (MRP)
        </button>
        <button 
          onClick={() => setActiveTab('bom')}
          className={`pb-4 px-6 transition-colors border-b-2 ${activeTab === 'bom' ? 'border-[#11244A] text-[#11244A]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Gestão de Fórmulas (BOM)
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'mrp' ? (
           <div className="space-y-6">
              {/* Alerta de Deficit simulando o que fizemos na API */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-red-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                       <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <div>
                            <h3 className="text-red-700 font-black text-lg tracking-tight mb-1">Déficit Crítico de Componente Detectado</h3>
                            <p className="text-red-600/80 text-sm font-medium">A Ordem de Produção <strong className="text-red-700 font-bold">#OP-9011 (Detergente Neutro)</strong> está travada por falta de estoque.</p>
                         </div>
                         <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded">Hoje, 09:12</span>
                       </div>
                       
                       <div className="mt-5 p-4 bg-white/60 border border-red-100 rounded-xl space-y-3">
                         <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-600 font-bold">Material:</span>
                           <span className="text-[#11244A] font-bold">Essência Floral FAZ ("ESSFLO-A")</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-600 font-bold">Necessidade para a O.P.:</span>
                           <span className="text-slate-700">20.0 Kg</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-600 font-bold">Estoque Físico Atual:</span>
                           <span className="text-red-600 font-black">5.0 Kg <span className="font-medium text-xs">(Falta: 15.0 Kg)</span></span>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bot - Gemini Function Calling Simulation */}
              <div className="bg-[#11244A] rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
                 <div className="absolute right-0 bottom-0 opacity-5 translate-x-1/4 translate-y-1/4 w-64 h-64">
                   <Bot className="w-full h-full text-white" />
                 </div>
                 
                 <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex-shrink-0">
                    <Bot className="w-8 h-8 text-orange-400" />
                 </div>
                 
                 <div className="flex-1 relative z-10 text-white">
                    <div className="inline-flex items-center gap-2 text-xs font-bold bg-orange-500 text-[#11244A] px-2.5 py-1 rounded mb-3 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                      ✨ MOTOR SUBSTITUTIVO (IA)
                    </div>
                    <p className="text-sm text-blue-100 leading-relaxed font-medium mb-4">
                      Detectei que você precisa rodar a <b>OP-9011</b>, mas falta <span className="font-bold underline decoration-orange-400">ESSFLO-A</span>.
                      <br/>No modelo de dados <code className="text-xs bg-black/30 px-1 rounded mx-1">bom_substitutions</code>, encontrei que o componente alternativo <span className="font-bold text-orange-400">ESSFLO-C</span> possui estoques suficientes em Tecnicon (300 Kg) para cobrir isso, e é compatível com Detergentes na proporção 1:1.
                    </p>
                    <button className="bg-white text-[#11244A] px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-slate-100 transition-colors flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" /> APROVAR SUBSTITUIÇÃO E LIBERAR O.P.
                    </button>
                 </div>
              </div>

              {/* OPs Abertas */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-6">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="font-bold text-[#11244A]">Ordens de Produção (Aguardando Liberação PCP)</h3>
                   <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 border border-blue-100">CRIAR NOVA O.P.</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-4">OP</th>
                        <th className="p-4">Produto Master</th>
                        <th className="p-4">Demanda Resultante</th>
                        <th className="p-4">Status Material (MRP)</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-4 font-bold text-[#11244A]">#9011</td>
                        <td className="p-4">DETERGENTE NEUTRO FAZ (5L)</td>
                        <td className="p-4">Reservado: Batelada 1000L</td>
                        <td className="p-4"><span className="text-red-500 bg-red-50 font-bold px-2.5 py-1 rounded text-xs border border-red-200">Déficit Crítico</span></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-[#11244A]">#9012</td>
                        <td className="p-4">ALVEJANTE SEM CLORO FAZ (1L)</td>
                        <td className="p-4">Reservado: Batelada 500L</td>
                        <td className="p-4"><span className="text-emerald-600 bg-emerald-50 font-bold px-2.5 py-1 rounded text-xs border border-emerald-200">Materiais Liberados</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
           </div>
        ) : (
           <div className="flex bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[600px]">
             {/* Sidebar Fórmulas */}
             <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50/50">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                   <h3 className="font-bold text-[#11244A] text-sm object-contain">Receituário Base (Fórmulas)</h3>
                   <button className="text-[#11244A] p-1.5 hover:bg-slate-200 rounded">
                     <Search className="w-4 h-4" />
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm font-medium">
                  {/* Lista Mockada de Fórmulas */}
                  {[
                    { id: 'FML-01', name: 'Detergente Neutro DA50', version: 'v2.1', active: true },
                    { id: 'FML-02', name: 'Alvejante Sem Cloro FAZ', version: 'v1.4', active: false },
                    { id: 'FML-03', name: 'Amaciante Blue Premium', version: 'v1.0', active: false },
                    { id: 'FML-04', name: 'Desinfetante Floral 5L', version: 'v3.2', active: false },
                  ].map((frm, i) => (
                    <button key={i} className={`w-full text-left p-3 rounded-lg flex flex-col gap-1 transition-colors ${frm.active ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'hover:bg-slate-100 border border-transparent'}`}>
                       <div className="flex items-center justify-between">
                         <span className={`text-xs font-bold ${frm.active ? 'text-blue-700' : 'text-slate-500'}`}>{frm.id} <span className="text-slate-400 font-medium">({frm.version})</span></span>
                         {frm.active && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>}
                       </div>
                       <span className={`font-semibold ${frm.active ? 'text-[#11244A]' : 'text-slate-700'}`}>{frm.name}</span>
                    </button>
                  ))}
                </div>
             </div>
             {/* Detalhes da Fórmula Selecionada */}
             <div className="w-2/3 flex flex-col bg-white">
                <div className="p-6 border-b border-slate-100">
                   <div className="flex justify-between items-start mb-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-widest">
                         <CheckCircle2 className="w-3 h-3" /> Base Homologada
                      </div>
                      <button className="text-xs font-bold text-slate-500 hover:text-[#11244A] border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50">EDITAR RECEITA</button>
                   </div>
                   <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Detergente Neutro DA50</h2>
                   <p className="text-sm font-medium text-slate-500 mt-1">Rendimento Padrão Bruto: <strong className="text-slate-700">1.000 Litros (Lote)</strong></p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ingredientes & Matérias-Primas (BOM Items)</h3>
                   
                   <div className="space-y-3">
                     {[
                       { mat: 'Ácido Sulfônico 90%', vol: '80.0 Kg', pct: '8.0%', type: 'ATIVO', warn: false },
                       { mat: 'Amida 60', vol: '25.0 Kg', pct: '2.5%', type: 'ATIVO', warn: false },
                       { mat: 'Essência DA50 Neutra', vol: '2.0 Kg', pct: '0.2%', type: 'ESSÊNCIA', warn: true },
                       { mat: 'Corante Amarelo Tartrazina', vol: '0.1 Kg', pct: '0.01%', type: 'CORANTE', warn: false },
                       { mat: 'Água Desmineralizada (Q.S.P.)', vol: '892.9 Kg', pct: '89.29%', type: 'VEÍCULO', warn: false },
                     ].map((ing, i) => (
                       <div key={i} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ing.warn ? 'bg-orange-100' : 'bg-slate-100'}`}>
                               <Beaker className={`w-4 h-4 ${ing.warn ? 'text-orange-500' : 'text-slate-400'}`} />
                             </div>
                             <div className="flex flex-col">
                               <span className="font-bold text-[#11244A] text-sm flex items-center gap-2">{ing.mat} {ing.warn && <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />}</span>
                               <span className="text-[10px] font-bold text-slate-400">{ing.type}</span>
                             </div>
                          </div>
                          <div className="flex flex-col text-right">
                             <span className="font-black text-[#11244A]">{ing.vol}</span>
                             <span className="text-[11px] font-semibold text-slate-400">{ing.pct} vol</span>
                          </div>
                       </div>
                     ))}
                   </div>
                   
                   <h3 className="text-xs font-bold flex items-center gap-2 text-slate-400 uppercase tracking-widest mt-8 mb-4">
                     <ArrowRightLeft className="w-4 h-4" /> Matriz de Substituição Ativa
                   </h3>
                   <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl border-dashed">
                      <p className="text-xs font-medium text-slate-600 mb-2">A <strong className="text-[#11244A]">Essência DA50 Neutra</strong> permite substituição em caso de quebra de estoque, homologada pela qualidade:</p>
                      <ul className="text-sm font-bold text-[#11244A] space-y-1">
                        <li className="flex items-center gap-2 przed"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Essência Glicerina DA20 <span className="text-slate-400 font-medium text-[10px] ml-1">(Proporção 1:1)</span></li>
                      </ul>
                   </div>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  )
}

// ------------------------------
// Dashboard Module
// ------------------------------
function DashboardModule() {
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

// ------------------------------
// Sales Kanban (CRM B2B) Module
// ------------------------------
function SalesKanbanModule() {
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


// ------------------------------
// QA Lab Module (from Milestone 2)
// ------------------------------
function QaLabModule() {
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
