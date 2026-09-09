import React, { useState, useMemo } from 'react';
import { Search, Plus, User, Phone, Shield, Settings, MessageCircle, X, Save, Trash2, Users, Activity, PauseCircle } from 'lucide-react';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<Operator | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Operator>>({});

  const filteredOperadores = useMemo(() => {
    if (!searchQuery.trim()) return operadores;
    const lowerQuery = searchQuery.toLowerCase();
    return operadores.filter(op => 
      op.nome.toLowerCase().includes(lowerQuery) || 
      op.email.toLowerCase().includes(lowerQuery) || 
      op.ramal.includes(lowerQuery)
    );
  }, [operadores, searchQuery]);

  const openNewModal = () => {
    setEditingOp(null);
    setFormData({ nome: '', email: '', ramal: '', permissao: 'Operador', filas: [], status: 'offline' });
    setIsModalOpen(true);
  };

  const openEditModal = (op: Operator) => {
    setEditingOp(op);
    setFormData({ ...op });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOp(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email) return;

    if (editingOp) {
      setOperadores(prev => prev.map(op => op.id === editingOp.id ? { ...op, ...formData } as Operator : op));
    } else {
      const newOp: Operator = {
        id: Date.now(),
        nome: formData.nome || '',
        email: formData.email || '',
        ramal: formData.ramal || '',
        permissao: formData.permissao || 'Operador',
        status: 'offline',
        filas: Array.isArray(formData.filas) ? formData.filas : (formData.filas as any || '').split(',').map((f: string) => f.trim()).filter(Boolean)
      };
      setOperadores(prev => [...prev, newOp]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este operador?')) {
      setOperadores(prev => prev.filter(op => op.id !== id));
      closeModal();
    }
  };

  // KPIs
  const kpis = {
    total: operadores.length,
    online: operadores.filter(o => o.status === 'online').length,
    pausa: operadores.filter(o => o.status === 'pausa').length
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 relative">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-outfit mb-2">Gestão de Operadores</h1>
            <p className="text-slate-600">Controle de acessos, ramais e filas de atendimento do provedor.</p>
          </div>
          <button 
            onClick={openNewModal}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95"
          >
            <Plus size={18} /> Novo Operador
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total de Contas</p>
              <h3 className="text-2xl font-bold text-slate-900 font-outfit">{kpis.total}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <Activity size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Operadores Online</p>
              <h3 className="text-2xl font-bold text-slate-900 font-outfit">{kpis.online}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
              <PauseCircle size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Em Pausa (NR-17)</p>
              <h3 className="text-2xl font-bold text-slate-900 font-outfit">{kpis.pausa}</h3>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou ramal..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-600/50 shadow-inner"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Operador</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Comunicações</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Permissões & Filas</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOperadores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                      Nenhum operador encontrado com estes filtros.
                    </td>
                  </tr>
                ) : (
                  filteredOperadores.map((op) => (
                    <tr key={op.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-500 font-bold font-outfit">
                            {op.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{op.nome}</p>
                            <p className="text-xs text-slate-500">{op.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Phone size={12} className="text-emerald-600" />
                            <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded text-emerald-600 border border-emerald-200">SIP/{op.ramal}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MessageCircle size={12} className="text-blue-400" />
                            <span>WhatsApp API</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center gap-1.5">
                            {op.permissao === 'Admin' ? (
                              <span className="bg-blue-600/10 text-blue-600 border border-blue-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                                <Shield size={10} /> {op.permissao}
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                                <User size={10} /> {op.permissao}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {op.filas.map((fila, idx) => (
                              <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                                {fila}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          op.status === 'online' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          op.status === 'pausa' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
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
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Settings size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 font-outfit">
                {editingOp ? 'Editar Operador' : 'Novo Operador'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.nome || ''}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: João Silva"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 shadow-sm"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="joao@provedor.com.br"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 shadow-sm"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Ramal SIP (FreePBX)</label>
                  <input 
                    type="text" 
                    value={formData.ramal || ''}
                    onChange={(e) => setFormData({...formData, ramal: e.target.value})}
                    placeholder="Ex: 2001"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-emerald-600 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 shadow-sm"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Nível de Acesso</label>
                  <select 
                    value={formData.permissao || 'Operador'}
                    onChange={(e) => setFormData({...formData, permissao: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 shadow-sm"
                  >
                    <option value="Operador">Operador (Padrão)</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Filas (Separar por vírgula)</label>
                  <input 
                    type="text" 
                    value={Array.isArray(formData.filas) ? formData.filas.join(', ') : formData.filas || ''}
                    onChange={(e) => setFormData({...formData, filas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    placeholder="Ex: Suporte N1, Vendas"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
              {editingOp ? (
                <button 
                  onClick={() => handleDelete(editingOp.id)}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                  <Trash2 size={16} /> Remover
                </button>
              ) : <div></div>}
              
              <div className="flex gap-3">
                <button 
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!formData.nome || !formData.email}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-700/20 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Save size={16} /> Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
