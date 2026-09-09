import React, { useState } from 'react';
import { Search, Plus, User, Phone, Shield, Settings, MessageCircle, X, Save } from 'lucide-react';

type Operator = {
  id: number;
  nome: string;
  email: string;
  ramal: string;
  permissao: string;
  status: 'online' | 'offline' | 'pausa';
  filas: string[];
};

export default function Operadores() {
  const [operadores, setOperadores] = useState<Operator[]>([
    { id: 1, nome: "João Silva", email: "joao@provedor.com.br", ramal: "2001", permissao: "Admin", status: "online", filas: ["Suporte N2", "Vendas"] },
    { id: 2, nome: "Ana Santos", email: "ana@provedor.com.br", ramal: "2002", permissao: "Operador", status: "online", filas: ["Suporte N1"] },
    { id: 3, nome: "Carlos Mendes", email: "carlos@provedor.com.br", ramal: "2003", permissao: "Operador", status: "pausa", filas: ["Retenção", "Vendas"] },
    { id: 4, nome: "Fernanda Lima", email: "fernanda@provedor.com.br", ramal: "2004", permissao: "Operador", status: "offline", filas: ["Suporte N1"] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<Operator | null>(null);

  const openNewModal = () => {
    setEditingOp(null);
    setIsModalOpen(true);
  };

  const openEditModal = (op: Operator) => {
    setEditingOp(op);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOp(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] relative">
      {/* Header */}
      <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-6 bg-[#0d1321] shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white font-outfit">Gestão de Operadores</h1>
          <p className="text-xs text-slate-400 mt-0.5">Administre acessos, ramais (FreePBX) e roteamento omnichannel.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} />
          Novo Operador
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome, e-mail ou ramal..." 
                className="w-full bg-[#101726] border border-slate-800/60 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
            </div>
            <select className="bg-[#101726] border border-slate-800/60 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50 transition-all">
              <option>Todas as Filas</option>
              <option>Suporte N1</option>
              <option>Suporte N2</option>
              <option>Vendas</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-[#101726] rounded-3xl border border-slate-800/60 overflow-hidden shadow-xl shadow-black/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0d1321] border-b border-slate-800/60">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Operador</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Comunicação</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Acessos & Filas</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Status OMNI</th>
                  <th className="px-6 py-4 text-center text-[10px] uppercase tracking-wider font-bold text-slate-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {operadores.map((op) => (
                  <tr key={op.id} className="hover:bg-[#1a2333]/50 transition-colors group">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                          {op.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{op.nome}</p>
                          <p className="text-xs text-slate-500">{op.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Phone size={12} className="text-emerald-400" />
                          <span className="font-mono bg-[#1a2333] px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-500/20">SIP/{op.ramal}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MessageCircle size={12} className="text-blue-400" />
                          <span>WhatsApp API</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-1.5">
                          {op.permissao === 'Admin' ? (
                            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                              <Shield size={10} /> {op.permissao}
                            </span>
                          ) : (
                            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                              <User size={10} /> {op.permissao}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {op.filas.map((fila, idx) => (
                            <span key={idx} className="bg-[#1a2333] border border-slate-700/50 text-slate-400 px-2 py-0.5 rounded text-[10px] font-medium">
                              {fila}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                        op.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        op.status === 'pausa' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          op.status === 'online' ? 'bg-emerald-400 animate-pulse' :
                          op.status === 'pausa' ? 'bg-amber-400' : 'bg-slate-500'
                        }`}></span>
                        {op.status === 'online' ? 'Livre' : op.status === 'pausa' ? 'Em Pausa' : 'Deslogado'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => openEditModal(op)}
                        className="p-2 text-slate-500 hover:text-white hover:bg-[#1a2333] rounded-lg transition-colors"
                      >
                        <Settings size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101726] border border-slate-800 rounded-3xl shadow-2xl shadow-black w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800/60 bg-[#0d1321] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white font-outfit">
                {editingOp ? 'Editar Operador' : 'Novo Operador'}
              </h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    defaultValue={editingOp?.nome}
                    className="w-full bg-[#1a2333] border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 shadow-inner"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">E-mail</label>
                  <input 
                    type="email" 
                    defaultValue={editingOp?.email}
                    className="w-full bg-[#1a2333] border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 shadow-inner"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Ramal SIP (FreePBX)</label>
                  <input 
                    type="text" 
                    defaultValue={editingOp?.ramal}
                    className="w-full bg-[#1a2333] border border-slate-700/50 rounded-xl px-4 py-3 text-sm font-mono text-emerald-400 outline-none focus:border-indigo-500/50 shadow-inner"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Nível de Acesso</label>
                  <select 
                    defaultValue={editingOp?.permissao || 'Operador'}
                    className="w-full bg-[#1a2333] border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 shadow-inner appearance-none"
                  >
                    <option value="Operador">Operador (Padrão)</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Filas (Separar por vírgula)</label>
                  <input 
                    type="text" 
                    defaultValue={editingOp?.filas.join(', ')}
                    placeholder="Ex: Suporte N1, Vendas"
                    className="w-full bg-[#1a2333] border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800/60 bg-[#0d1321] flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={closeModal}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
              >
                <Save size={16} /> Salvar Operador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
