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
      <div className="p-6 border-b border-slate-200 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Base de Clientes (CRM)</h1>
          <p className="text-sm text-slate-600 mt-1">Banco de dados unificado com sincronização ativa do SGP.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <RefreshCw size={16} /> Sync SGP
          </button>
          <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95">
            <UserPlus size={16} /> Novo Contato
          </button>
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-white flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome, CPF/CNPJ ou telefone..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 placeholder:text-slate-500 transition-all shadow-inner"
              />
            </div>
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Filter size={16} /> Filtros
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-800/60 bg-white">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">Carregando contatos...</td></tr>
                ) : contatos.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">Nenhum cliente encontrado.</td></tr>
                ) : (
                  contatos.map((contato) => (
                    <tr 
                      key={contato.id} 
                      onClick={() => setSelectedContato(contato)}
                      className="hover:bg-slate-100/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-bold text-slate-600">#{contato.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{contato.nome}</td>
                      <td className="px-6 py-4 font-mono text-xs">{contato.cpf_cnpj}</td>
                      <td className="px-6 py-4 font-mono text-xs">{contato.telefone}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold">
                          {contato.plano || 'Sem Plano'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {contato.status_cliente === 'ativo' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold w-max">
                            <CheckCircle2 size={14} /> Ativo
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold w-max">
                            <XCircle size={14} /> Bloqueado
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        <button className="hover:text-blue-600 hover:border-blue-600/50 transition-colors px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold uppercase tracking-wider">Ver Ficha</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Mostrando {contatos.length} contatos sincronizados</span>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">Anterior</button>
              <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">Próxima</button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer 360 Panel */}
      {selectedContato && (
        <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-lg shadow-sm border-l border-slate-200/80 animate-in slide-in-from-right flex flex-col z-50">
          <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-xl font-bold text-slate-900 font-outfit">{selectedContato.nome}</h2>
                {selectedContato.status_cliente === 'ativo' ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : (
                  <XCircle size={18} className="text-red-400" />
                )}
              </div>
              <p className="text-sm text-slate-600 font-mono flex items-center gap-2">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600">ID: #{selectedContato.id}</span>
                {selectedContato.cpf_cnpj}
              </p>
            </div>
            <button 
              onClick={() => setSelectedContato(null)}
              className="p-2 hover:bg-slate-100/80 rounded-full text-slate-600 hover:text-white transition-colors border border-transparent hover:border-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* AI Summary Block */}
            <div className="bg-gradient-to-br from-blue-100/40 to-purple-900/20 border border-blue-200 rounded-xl p-5 shadow-lg shadow-blue-100/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={64} className="fill-blue-600" />
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider mb-3 text-[11px] relative z-10">
                <Zap size={14} className="fill-blue-600" />
                Resumo 9router (IA)
              </div>
              <p className="text-sm text-blue-800 leading-relaxed relative z-10">
                Cliente com boa retenção (2 anos), porém registrou 3 quedas de conexão nos últimos 15 dias. Sentimento atual da última conversa: <span className="font-bold text-amber-600 bg-amber-500/10 px-1 rounded">Frustrado</span>. Recomenda-se visita técnica proativa.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 font-outfit mb-3 text-sm flex items-center gap-2">
                <Activity size={16} className="text-blue-600" /> Conexão e Plano
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Plano SGP</p>
                  <p className="font-bold text-slate-900 text-sm">{selectedContato.plano}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Telefone Principal</p>
                  <p className="font-bold text-slate-900 text-sm">{selectedContato.telefone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 font-outfit mb-3 text-sm flex items-center gap-2">
                <FileText size={16} className="text-blue-600" /> Financeiro (SGP)
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-700/50 shadow-inner">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Mensalidade (Setembro)</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Vence em 10/09/2026</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-500/10 border border-amber-200 px-2.5 py-1 rounded-md">Pendente</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Mensalidade (Agosto)</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Pago via PIX</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-200 px-2.5 py-1 rounded-md">Pago</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 font-outfit mb-3 text-sm flex items-center gap-2">
                <Phone size={16} className="text-blue-600" /> Histórico PABX (FreePBX)
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-700/50 shadow-inner">
                <div className="p-4 flex justify-between items-center hover:bg-slate-100/40 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-200 flex items-center justify-center">
                      <Phone size={12} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Recebida (Suporte N1)</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Atendida por: João Silva (Ramal 2001)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-600">Hoje, 10:45</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">04m 12s</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center hover:bg-slate-100/40 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Phone size={12} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Não Atendida</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Fila: Retenção (Abandono)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-600">Ontem, 16:30</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">--</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 font-outfit mb-3 text-sm flex items-center gap-2">
                <Trello size={16} className="text-blue-600" /> Histórico de Chamados
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-600/10 border border-blue-200 px-2 py-0.5 rounded">Suporte</span>
                  <span className="text-xs font-medium text-slate-500">Há 2 dias</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">Lentidão no Wi-Fi 5G</p>
                <p className="text-xs text-slate-600 leading-relaxed">Resolvido via IA: Cliente instruído a reiniciar ONU (BookStack #204).</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 border-t border-slate-200 bg-white flex gap-3 z-10">
            <button className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-3 rounded-xl text-sm font-bold transition-colors">
              Histórico
            </button>
            <button className="flex-1 bg-blue-700 hover:bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-700/20">
              Atender
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
