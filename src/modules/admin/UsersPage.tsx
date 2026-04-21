import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ShieldCheck, Mail, User as UserIcon } from 'lucide-react';

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(docs);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Erro ao atualizar função:", error);
      alert("Erro ao atualizar. Você precisa ser um admin.");
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Carregando usuários...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#11244A] tracking-tight">Gestão de Usuários</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Gerencie os acessos e permissões da plataforma.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left bg-white">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="p-4">Usuário</th>
              <th className="p-4">Função (Role)</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      {u.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-[#11244A]">{u.email}</p>
                      <p className="text-xs text-slate-400 font-medium">UID: {u.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <select 
                     value={u.role || 'customer'}
                     onChange={(e) => handleRoleChange(u.id, e.target.value)}
                     className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none font-medium"
                   >
                     <option value="admin">Administrador</option>
                     <option value="sales">Vendas / Comercial</option>
                     <option value="customer">Cliente (SAD)</option>
                   </select>
                </td>
                <td className="p-4 text-right">
                   <span className="text-xs text-slate-400">Salvo auto.</span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">Nenhum usuário encontrado na base.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
