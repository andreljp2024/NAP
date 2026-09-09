import React, { useState, useEffect } from 'react';
import { Search, UserPlus, RefreshCw, Filter, MoreHorizontal, CheckCircle2, XCircle, X, Activity, FileText, Trello, Zap } from 'lucide-react';
import type { Contato } from '../types';

export default function CRM() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);

  useEffect(() => {
    fetch('/api/contatos')
      .then(res => res.json())
      .then(data => {
        setContatos(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
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
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8">Carregando contatos...</td></tr>
                ) : contatos.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">Nenhum cliente encontrado.</td></tr>
                ) : (
                  contatos.map((contato) => (
                    <tr 
                      key={contato.id} 
                      onClick={() => setSelectedContato(contato)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
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
                      <td className="px-6 py-4 text-center text-slate-400">
                        <button className="hover:text-blue-600 transition-colors px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium">Ver Ficha</button>
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

      {/* Customer 360 Panel */}
      {selectedContato && (
        <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-200 animate-in slide-in-from-right flex flex-col z-50">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{selectedContato.nome}</h2>
                {selectedContato.status_cliente === 'ativo' ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <XCircle size={16} className="text-red-500" />
                )}
              </div>
              <p className="text-sm text-slate-500 font-mono">ID: #{selectedContato.id} • {selectedContato.cpf_cnpj}</p>
            </div>
            <button 
              onClick={() => setSelectedContato(null)}
              className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* AI Summary Block */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2 text-sm">
                <Zap size={16} className="fill-indigo-700" />
                Resumo 9router (IA)
              </div>
              <p className="text-sm text-indigo-900 leading-relaxed">
                Cliente com boa retenção (2 anos), porém registrou 3 quedas de conexão nos últimos 15 dias. Sentimento atual da última conversa: <span className="font-bold text-amber-600">Frustrado</span>. Recomenda-se visita técnica proativa.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                <Activity size={16} className="text-blue-500" /> Conexão e Plano
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Plano SGP</p>
                  <p className="font-bold text-slate-900 text-sm">{selectedContato.plano}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Telefone Principal</p>
                  <p className="font-bold text-slate-900 text-sm">{selectedContato.telefone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                <FileText size={16} className="text-blue-500" /> Financeiro (SGP)
              </h3>
              <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Mensalidade (Setembro)</p>
                    <p className="text-xs text-slate-500">Vence em 10/09/2026</p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">Pendente</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Mensalidade (Agosto)</p>
                    <p className="text-xs text-slate-500">Pago via PIX</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Pago</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                <Trello size={16} className="text-blue-500" /> Histórico de Chamados
              </h3>
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Suporte</span>
                  <span className="text-xs font-bold text-slate-500">Há 2 dias</span>
                </div>
                <p className="text-sm font-medium text-slate-900 mb-1">Lentidão no Wi-Fi 5G</p>
                <p className="text-xs text-slate-500">Resolvido via IA: Cliente instruído a reiniciar ONU (BookStack #204).</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-white flex gap-3">
            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Histórico Completo
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Iniciar Atendimento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
