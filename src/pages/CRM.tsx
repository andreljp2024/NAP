import React, { useState, useEffect } from 'react';
import { Search, UserPlus, RefreshCw, Filter, MoreHorizontal, CheckCircle2, XCircle, X, Activity, FileText, Trello, Zap, Phone, Server, Sparkles, Send, CreditCard, ChevronRight, MapPin, Share2, Compass } from 'lucide-react';
import type { Contato } from '../types';
import SgpAdvancedSearch from '../components/SgpAdvancedSearch';
import AddressMapModal from '../components/AddressMapModal';

export default function CRM() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  
  // Controle de visão: Tabela de Clientes vs. Consulta Avançada SGP
  const [crmView, setCrmView] = useState<'tabela' | 'consulta_avancada_sgp'>('tabela');
  const [sgpTargetId, setSgpTargetId] = useState<number | string>(1001);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal de Mapa / Busca CEP / Compartilhar WhatsApp com Técnico
  const [mapTargetCliente, setMapTargetCliente] = useState<Contato | null>(null);

  useEffect(() => {
    fetch('/api/contatos')
      .then(res => res.json())
      .then(data => {
        setContatos(data);
        setLoading(false);
      });
  }, []);

  const handleOpenSgpConsulta = (idOrCpf: number | string) => {
    setSgpTargetId(idOrCpf);
    setCrmView('consulta_avancada_sgp');
  };

  const filteredContatos = contatos.filter(c => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return c.nome.toLowerCase().includes(term) ||
           c.cpf_cnpj.includes(term) ||
           c.telefone.includes(term) ||
           String(c.id).includes(term);
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <div className="p-6 border-b border-slate-200 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Base de Clientes (CRM)</h1>
          <p className="text-sm text-slate-600 mt-1">Gestão de assinantes, consulta avançada ao SGP e ações financeiras em tempo real.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Alternador de visualização */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => setCrmView('tabela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                crmView === 'tabela' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lista de Clientes
            </button>
            <button
              onClick={() => setCrmView('consulta_avancada_sgp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                crmView === 'consulta_avancada_sgp' 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server size={13} />
              <span>Consulta Avançada SGP</span>
            </button>
          </div>

          <button 
            onClick={() => {
              setLoading(true);
              fetch('/api/contatos')
                .then(res => res.json())
                .then(data => {
                  setContatos(data);
                  setLoading(false);
                });
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync SGP
          </button>
          <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-700/20 hover:scale-102 active:scale-98">
            <UserPlus size={14} /> Novo Contato
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
        {crmView === 'consulta_avancada_sgp' ? (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCrmView('tabela')}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                ← Voltar para lista de clientes
              </button>
              <span className="text-xs text-slate-500">
                Módulo SGP ERP v4.2 • API Token Ativo
              </span>
            </div>
            <SgpAdvancedSearch 
              initialClienteId={sgpTargetId} 
              onSelectCliente={(c) => {
                // Sincroniza se necessário
              }} 
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 bg-white flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-3 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    <th className="px-5 py-4">ID SGP</th>
                    <th className="px-5 py-4">Nome / Razão Social</th>
                    <th className="px-5 py-4">CPF / CNPJ</th>
                    <th className="px-5 py-4">Telefone</th>
                    <th className="px-5 py-4">Endereço & Rota</th>
                    <th className="px-5 py-4">Plano Atual</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Ações SGP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-white">
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-8 text-slate-500">Carregando contatos...</td></tr>
                  ) : filteredContatos.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-slate-500">Nenhum cliente encontrado.</td></tr>
                  ) : (
                    filteredContatos.map((contato) => (
                      <tr 
                        key={contato.id} 
                        className="hover:bg-slate-100/40 transition-colors group"
                      >
                        <td 
                          onClick={() => setSelectedContato(contato)}
                          className="px-6 py-4 font-bold text-slate-600 cursor-pointer"
                        >
                          #{contato.id}
                        </td>
                        <td 
                          onClick={() => setSelectedContato(contato)}
                          className="px-6 py-4 font-medium text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {contato.nome}
                        </td>
                        <td 
                          onClick={() => setSelectedContato(contato)}
                          className="px-6 py-4 font-mono text-xs cursor-pointer"
                        >
                          {contato.cpf_cnpj}
                        </td>
                        <td 
                          onClick={() => setSelectedContato(contato)}
                          className="px-5 py-4 font-mono text-xs cursor-pointer"
                        >
                          {contato.telefone}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="max-w-[200px] truncate">
                              <p className="text-xs text-slate-800 font-medium truncate" title={contato.endereco || 'Endereço não informado'}>
                                {contato.endereco || 'Endereço a confirmar'}
                              </p>
                              {contato.cep && (
                                <p className="text-[10px] text-slate-500 font-mono">
                                  CEP: {contato.cep}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMapTargetCliente(contato);
                                }}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition-colors shadow-2xs"
                                title="Ver no Mapa / Consultar CEP"
                              >
                                <MapPin size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMapTargetCliente(contato);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors shadow-2xs"
                                title="Compartilhar localização com técnico via WhatsApp"
                              >
                                <Share2 size={13} />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td 
                          onClick={() => setSelectedContato(contato)}
                          className="px-5 py-4 cursor-pointer"
                        >
                          <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold">
                            {contato.plano || 'Sem Plano'}
                          </span>
                        </td>
                        <td 
                          onClick={() => setSelectedContato(contato)}
                          className="px-6 py-4 cursor-pointer"
                        >
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
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleOpenSgpConsulta(contato.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                              title="Abrir Consulta Avançada SGP com Financeiro e Ofertas"
                            >
                              <Zap size={13} className="text-blue-600" />
                              <span>Consulta SGP</span>
                            </button>
                            <button 
                              onClick={() => setSelectedContato(contato)}
                              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                              title="Ver ficha 360"
                            >
                              Ficha
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Mostrando {filteredContatos.length} de {contatos.length} contatos</span>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">Anterior</button>
                <button className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">Próxima</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer 360 Panel */}
      {selectedContato && (
        <>
          <div 
            onClick={() => setSelectedContato(null)} 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs z-40 md:hidden"
            aria-hidden="true"
          />
          <div className="absolute top-0 right-0 h-full w-full sm:max-w-xl bg-white shadow-2xl border-l border-slate-200 animate-in slide-in-from-right flex flex-col z-50">
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMapTargetCliente(selectedContato)}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Abrir mapa, consultar CEP ou compartilhar rota via WhatsApp com técnico"
              >
                <MapPin size={13} className="text-emerald-600" />
                <span className="hidden sm:inline">Mapa / Rota Técnico</span>
              </button>
              <button
                onClick={() => {
                  handleOpenSgpConsulta(selectedContato.id);
                  setSelectedContato(null);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Expandir Consulta Avançada SGP completa"
              >
                <Zap size={13} />
                <span>Modo Completo SGP</span>
              </button>
              <button 
                onClick={() => setSelectedContato(null)}
                className="p-2 hover:bg-slate-100/80 rounded-full text-slate-600 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Componente Integrado de Consulta Avançada SGP dentro da Ficha 360 */}
            <div className="border border-blue-200 rounded-2xl overflow-hidden shadow-xs">
              <SgpAdvancedSearch 
                initialClienteId={selectedContato.id}
              />
            </div>

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
                <Phone size={16} className="text-blue-600" /> Histórico PABX (FreePBX)
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200 shadow-inner">
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
            <button 
              onClick={() => {
                handleOpenSgpConsulta(selectedContato.id);
                setSelectedContato(null);
              }}
              className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap size={14} className="text-blue-600" />
              <span>Abrir no SGP</span>
            </button>
            <button className="flex-1 bg-blue-700 hover:bg-blue-600 text-white px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-700/20">
              Iniciar Atendimento
            </button>
          </div>
        </div>
        </>
      )}

      {/* Modal de Mapa, Busca de CEP e Compartilhamento com Técnico */}
      {mapTargetCliente && (
        <AddressMapModal
          isOpen={!!mapTargetCliente}
          onClose={() => setMapTargetCliente(null)}
          cliente={{
            id: mapTargetCliente.id,
            nome: mapTargetCliente.nome,
            telefone: mapTargetCliente.telefone,
            endereco: mapTargetCliente.endereco,
            logradouro: mapTargetCliente.logradouro,
            numero: mapTargetCliente.numero,
            complemento: mapTargetCliente.complemento,
            bairro: mapTargetCliente.bairro,
            cidade: mapTargetCliente.cidade,
            uf: mapTargetCliente.uf,
            cep: mapTargetCliente.cep,
            ponto_referencia: mapTargetCliente.ponto_referencia,
            coordenadas: mapTargetCliente.coordenadas
          }}
          onAddressUpdated={(novo) => {
            setContatos(prev => prev.map(c => c.id === mapTargetCliente.id ? {
              ...c,
              ...novo,
              endereco: novo.endereco || c.endereco
            } : c));
            if (selectedContato && selectedContato.id === mapTargetCliente.id) {
              setSelectedContato(prev => prev ? {
                ...prev,
                ...novo,
                endereco: novo.endereco || prev.endereco
              } : null);
            }
          }}
        />
      )}
    </div>
  );
}
