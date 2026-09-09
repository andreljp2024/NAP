import React, { useState, useEffect } from 'react';
import { Search, UserPlus, RefreshCw, Filter, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';
import type { Contato } from '../types';

export default function CRM() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contatos')
      .then(res => res.json())
      .then(data => {
        setContatos(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Base de Clientes (CRM)</h1>
          <p className="text-sm text-slate-500">Banco de dados unificado com sincronização ativa do SGP.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <RefreshCw size={16} /> Sync SGP
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <UserPlus size={16} /> Novo Contato
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome, CPF/CNPJ ou telefone..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <Filter size={16} /> Filtros
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID SGP</th>
                  <th className="px-6 py-4">Nome / Razão Social</th>
                  <th className="px-6 py-4">CPF / CNPJ</th>
                  <th className="px-6 py-4">Telefone</th>
                  <th className="px-6 py-4">Plano Atual</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8">Carregando contatos...</td></tr>
                ) : contatos.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">Nenhum cliente encontrado.</td></tr>
                ) : (
                  contatos.map((contato) => (
                    <tr key={contato.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">#{contato.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{contato.nome}</td>
                      <td className="px-6 py-4 text-slate-500">{contato.cpf_cnpj}</td>
                      <td className="px-6 py-4 text-slate-500">{contato.telefone}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                          {contato.plano || 'Sem Plano'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {contato.status_cliente === 'ativo' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-bold w-max">
                            <CheckCircle2 size={14} /> Ativo
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs font-bold w-max">
                            <XCircle size={14} /> Bloqueado
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        <button className="hover:text-slate-600 transition-colors"><MoreHorizontal size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Mostrando {contatos.length} contatos sincronizados</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">Anterior</button>
              <button className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">Próxima</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
