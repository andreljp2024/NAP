import React, { useState } from 'react';
import { Search, Server, Wifi, Activity, CreditCard, ShieldCheck, AlertCircle, FileText, Router, CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react';

export default function ConsultaSGP() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<any[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/sgp/busca?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResultados(data.resultados);
    } catch (error) {
      console.error(error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <div className="p-6 border-b border-slate-200 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-2">
            <Server className="text-blue-600" size={24} />
            Diagnóstico SGP (Tempo Real)
          </h1>
          <p className="text-sm text-slate-600 mt-1">Busque contratos, clientes e status Radius diretamente na base do ERP.</p>
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busque por CPF, CNPJ, Nome ou ID do Contrato..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all font-medium placeholder:text-slate-500 shadow-inner"
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-700/20 disabled:opacity-70 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              Buscar
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="max-w-4xl mx-auto space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-blue-600">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="font-bold text-slate-600">Consultando API do SGP...</p>
            </div>
          )}

          {!loading && resultados && resultados.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-1">Nenhum resultado encontrado</h3>
              <p className="text-slate-600 text-sm">Verifique o termo buscado e tente novamente.</p>
            </div>
          )}

          {!loading && resultados && resultados.length > 0 && (
            resultados.map((res: any) => (
              <div key={res.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-slate-900 font-outfit">{res.nome}</h2>
                      {res.status_cliente === 'ativo' ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          <CheckCircle2 size={12} /> Ativo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-200 text-[10px] font-bold uppercase tracking-wider text-red-600">
                          <XCircle size={12} /> Inativo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                      <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                        <FileText size={14} className="text-slate-400" /> ID: #{res.id}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                        <ShieldCheck size={14} className="text-slate-400" /> {res.cpf_cnpj}
                      </span>
                    </div>
                  </div>
                  
                  {/* Conexão Rápida */}
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Status Radius</p>
                    <div className="flex items-center gap-2">
                      {res.conexao.status === 'online' ? (
                        <>
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span>
                          <span className="font-bold text-emerald-600 text-lg">Online</span>
                        </>
                      ) : (
                        <>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          <span className="font-bold text-red-600 text-lg">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Bloco: Radius / Conexão */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wider border-b border-slate-200 pb-2">
                      <Router size={16} className="text-blue-600" /> Parâmetros de Conexão
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Plano</p>
                        <p className="font-bold text-slate-900">{res.conexao.plano}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Uptime</p>
                        <p className="font-bold text-slate-900">{res.conexao.uptime}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">IP Alocado</p>
                        <p className="font-mono text-sm font-bold text-slate-900">{res.conexao.ip}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">MAC Address</p>
                        <p className="font-mono text-sm font-bold text-slate-900">{res.conexao.mac}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                       <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                         <Zap size={14} className="text-amber-500" /> Desconectar (Kick)
                       </button>
                       <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                         <Activity size={14} className="text-blue-600" /> Extrato Radius
                       </button>
                    </div>
                  </div>

                  {/* Bloco: Financeiro */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wider border-b border-slate-200 pb-2">
                      <CreditCard size={16} className="text-emerald-600" /> Histórico Financeiro
                    </h3>
                    
                    <div className="space-y-2">
                      {res.faturas.map((fatura: any) => (
                         <div key={fatura.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                           <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                               fatura.status === 'pago' 
                                 ? 'bg-emerald-500/10 border-emerald-200 text-emerald-600'
                                 : 'bg-amber-500/10 border-amber-200 text-amber-600'
                             }`}>
                               <CreditCard size={14} />
                             </div>
                             <div>
                               <p className="text-xs font-bold text-slate-900">Vencimento: {new Date(fatura.vencimento).toLocaleDateString('pt-BR')}</p>
                               <p className="text-[10px] text-slate-500 font-medium mt-0.5">Fatura #{fatura.id}</p>
                             </div>
                           </div>
                           <div className="text-right flex flex-col items-end">
                             <p className="font-bold text-slate-900 text-sm">R$ {fatura.valor.toFixed(2).replace('.', ',')}</p>
                             <span className={`text-[9px] uppercase font-bold tracking-wider mt-1 px-1.5 py-0.5 rounded ${
                               fatura.status === 'pago' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                             }`}>
                               {fatura.status}
                             </span>
                           </div>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
