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
import { collection, onSnapshot, getDoc, doc, getDocs, setDoc, updateDoc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

import { GLOBAL_CATALOG } from './lib/catalog';

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

export interface UserProfile extends User {
  role?: string;
}

export default function App() {
  const [view, setView] = useState<'ecommerce' | 'erp'>('ecommerce');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Obter role do banco
        const userRef = doc(db, 'users', currentUser.uid);
        let profileDoc = await getDoc(userRef);
        
        let role = 'customer';
        if (!profileDoc.exists()) {
           // Inicializar
           role = currentUser.email === 'felipe.vieira.consultoria@gmail.com' ? 'admin' : 'customer';
           await setDoc(userRef, { email: currentUser.email, role });
        } else {
           role = profileDoc.data().role;
        }

        // Ficar ouvindo mudanças para essa aba reativa
        const unsubscribeDoc = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
             setUser(Object.assign({}, currentUser, { role: snapshot.data().role }));
          }
        });

        setUser(Object.assign({}, currentUser, { role }));
        setAuthReady(true);

        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setAuthReady(true);
      }
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setView('erp');
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.warn('Login popup closed.');
      } else {
        console.error('Login failed:', error);
        alert('Erro ao fazer login com o Google. Se estiver no preview, tente abrir em uma nova guia.');
      }
    } finally {
      setIsLoggingIn(false);
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

function ErpDashboard({ onLogout, user }: { onLogout: () => void, user: UserProfile }) {
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
            {menuItems.filter(i => i.id !== 'integration').map(item => {
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

          {user.role === 'admin' && (
            <>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2 mt-6">Administração</div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveModule('admin-products')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    activeModule === 'admin-products' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3"><Box className="w-4 h-4" /> Catálogo & DB</div>
                </button>
                <button
                  onClick={() => setActiveModule('admin-users')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    activeModule === 'admin-users' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Usuários (RBAC)</div>
                </button>
              </nav>
            </>
          )}

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
               {user.email?.slice(0, 2).toUpperCase()}
             </div>
             <div className="flex flex-col text-left">
                <span className="text-xs font-bold">{user.email?.split('@')[0]}</span>
                <span className="text-[10px] text-slate-400 uppercase">{user.role}</span>
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

import { UsersPage } from './modules/admin/UsersPage';
import { ProductsPage } from './modules/admin/ProductsPage';
import { ShopfloorPage } from './modules/shopfloor/ShopfloorPage';
import { TecniconPage } from './modules/integration/TecniconPage';
import { DownloadsPage } from './modules/downloads/DownloadsPage';

import { DashboardPage } from './modules/dashboard/DashboardPage';
import { EcommerceSite } from './modules/ecommerce/EcommerceSite';
import { KanbanBoard } from './modules/kanban/KanbanBoard';
import { QaPage } from './modules/qa/QaPage';
import { MrpPage } from './modules/mrp/MrpPage';

function ModuleRouter({ id }: { id: string }) {
  switch(id) {
    case 'dashboard': return <DashboardPage />;
    case 'production': return <MrpPage />;
    case 'shopfloor': return <ShopfloorPage />;
    case 'qa': return <QaPage />;
    case 'sales': return <KanbanBoard />;
    case 'downloads': return <DownloadsPage />;
    case 'integration': return <TecniconPage />;
    case 'admin-users': return <UsersPage />;
    case 'admin-products': return <ProductsPage />;
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
