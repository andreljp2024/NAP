import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  X, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Activity, 
  Search, 
  Check, 
  AlertTriangle, 
  Wifi, 
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Share2,
  Navigation
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { Deal } from '../types';
import AddressMapModal from '../components/AddressMapModal';

export default function Kanban({ type }: { type: "Suporte" | "Vendas" | "Cobranca" }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high'>('all');
  
  // Modal de Novo Card
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal de Mapa / CEP / Rota do Técnico
  const [mapTargetDeal, setMapTargetDeal] = useState<Deal | null>(null);
  const [newDealData, setNewDealData] = useState({
    titulo: '',
    contato: '',
    telefone: '',
    endereco: '',
    plano: 'Fibra 500MB',
    valor: 99.90,
    dias_atraso: 0,
    prioridade: 2,
    contexto_ia: ''
  });

  const stages = type === 'Suporte' 
    ? ['Novo Chamado', 'Em Análise', 'Técnico em Rota', 'Resolvido']
    : type === 'Vendas'
    ? ['Novo Lead', 'Qualificado (IA)', 'Negociação', 'Fechado/Ganho']
    : ['A Vencer (Preventivo)', 'Vencido (1-5d)', 'Bloqueado', 'Desbloqueio 48h', 'Recuperado (PIX)'];

  useEffect(() => {
    fetch('/api/deals')
      .then(res => res.json())
      .then((data: Deal[]) => {
        setDeals(data.filter(d => d.pipeline === type));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [type]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const destStage = destination.droppableId;
      const movedDealId = parseInt(result.draggableId);
      
      // Atualização otimista no estado local
      setDeals(prev => prev.map(deal => 
        deal.id === movedDealId 
          ? { ...deal, estagio: destStage } 
          : deal
      ));

      if (selectedDeal && selectedDeal.id === movedDealId) {
        setSelectedDeal(prev => prev ? { ...prev, estagio: destStage } : null);
      }

      // Persistência nativa no backend do NAP
      try {
        await fetch(`/api/deals/${movedDealId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estagio: destStage })
        });
      } catch (err) {
        console.error("Falha ao persistir movimentação no servidor:", err);
      }
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealData.titulo.trim() || !newDealData.contato.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDealData,
          pipeline: type
        })
      });
      const created: Deal = await res.json();
      setDeals(prev => [created, ...prev]);
      setIsModalOpen(false);
      setNewDealData({
        titulo: '',
        contato: '',
        telefone: '',
        endereco: '',
        plano: 'Fibra 500MB',
        prioridade: 2,
        contexto_ia: ''
      });
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdvanceStage = async (deal: Deal) => {
    const currentIndex = stages.indexOf(deal.estagio);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, estagio: nextStage } : d));
      setSelectedDeal(prev => prev ? { ...prev, estagio: nextStage } : null);

      try {
        await fetch(`/api/deals/${deal.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estagio: nextStage })
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(deal.id).includes(searchTerm);

    const matchesPriority = filterPriority === 'all' ? true : deal.prioridade === 1;

    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0b0f19] text-slate-500 font-medium">
        Carregando Kanban de {type}...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f19] overflow-hidden">
      
      {/* Top Header */}
      <div className="p-5 border-b border-white/10 bg-[#101726]/90 backdrop-blur-md flex flex-wrap justify-between items-center gap-4 sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-outfit">
              Kanban de {type}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Sincronizado SGP
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Arraste os cards para atualizar as etapas da ordem de serviço ou lead comercial.
          </p>
        </div>

        {/* Search, Filter & Action Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente, título ou #ID..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white/[0.02] hover:bg-[#0b0f19] border border-white/10 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-[#101726] transition-all w-52"
            />
          </div>

          <button
            onClick={() => setFilterPriority(p => p === 'all' ? 'high' : 'all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              filterPriority === 'high'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-[#101726] text-slate-400 border-white/10 hover:bg-[#0b0f19]'
            }`}
          >
            {filterPriority === 'high' ? '🚨 Alta Prioridade' : 'Todas Pri.'}
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-1.5 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-none active:scale-95 ${
              type === 'Cobranca' ? 'bg-amber-600 hover:bg-amber-700' : type === 'Vendas' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Plus size={14} /> Novo {type === 'Suporte' ? 'Chamado' : type === 'Vendas' ? 'Lead' : 'Título'}
          </button>
        </div>
      </div>

      {/* Columns Container */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-5 h-full min-w-max pb-2">
            {stages.map(stage => {
              const stageDeals = filteredDeals.filter(d => d.estagio === stage);
              return (
                <div key={stage} className="w-80 flex flex-col max-h-full">
                  
                  {/* Column Header */}
                  <div className="flex justify-between items-center mb-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        stage.includes('Novo') ? 'bg-blue-500/100' :
                        stage.includes('Análise') || stage.includes('Qualificado') ? 'bg-amber-500' :
                        stage.includes('Rota') || stage.includes('Negociação') ? 'bg-indigo-500' :
                        'bg-emerald-500'
                      }`} />
                      <h3 className="font-bold text-slate-300 tracking-wide text-xs uppercase font-outfit">
                        {stage}
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold bg-[#101726] text-slate-400 px-2 py-0.5 rounded-md border border-white/10 shadow-2xs">
                      {stageDeals.length}
                    </span>
                  </div>
                  
                  {/* Droppable Column */}
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto space-y-3 pb-4 rounded-xl transition-all duration-200 min-h-[160px] p-2 ${
                          snapshot.isDraggingOver ? 'bg-blue-500/10/80 border-2 border-dashed border-blue-400' : 'bg-white/[0.02]/60 border border-white/10/60'
                        }`}
                      >
                        {stageDeals.map((deal, index) => {
                          const draggableProps = { key: deal.id, draggableId: String(deal.id), index } as any;
                          return (
                            <Draggable {...draggableProps}>
                              {(provided: any, snapshot: any) => (
                                <div 
                                  onClick={() => setSelectedDeal(deal)}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-[#101726] p-4 rounded-xl border border-white/10/90 shadow-2xs cursor-grab select-none ${
                                    snapshot.isDragging 
                                      ? 'shadow-xl ring-2 ring-blue-500 rotate-1 scale-105 z-50' 
                                      : 'hover:border-white/10 hover:shadow-xs'
                                  } transition-all`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
                                      #{deal.id}
                                    </span>
                                    {deal.prioridade === 1 && (
                                      <span className="text-[9px] uppercase font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                        <AlertTriangle size={10} /> Alta Pri.
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="font-bold text-white text-xs leading-snug mb-1">
                                    {deal.titulo}
                                  </h4>

                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
                                    <User size={12} className="text-slate-400" />
                                    <span className="truncate font-medium">{deal.contato}</span>
                                  </div>
                                  
                                  <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[10px] text-slate-500">
                                    <span className="flex items-center gap-1 font-medium">
                                      {type === 'Cobranca' && deal.valor ? (
                                        <span className="text-amber-700 font-bold bg-amber-50 px-1 rounded">
                                          R$ {deal.valor.toFixed(2)}
                                        </span>
                                      ) : (
                                        <>
                                          <Wifi size={11} className="text-blue-500" />
                                          {deal.plano || 'Fibra 500MB'}
                                        </>
                                      )}
                                    </span>
                                    <span className="text-slate-400 font-medium">
                                      {type === 'Cobranca' && deal.dias_atraso !== undefined && deal.dias_atraso > 0 ? (
                                        <span className="text-red-600 font-bold">
                                          {deal.dias_atraso}d atraso
                                        </span>
                                      ) : (
                                        deal.criado_em || 'Hoje'
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        
                        {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                          <div className="border border-dashed border-white/10 rounded-xl h-24 flex items-center justify-center text-[11px] text-slate-400 bg-[#101726]/40">
                            Nenhum card nesta etapa
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Slide-over Deal Panel */}
      {selectedDeal && (
        <>
          <div 
            onClick={() => setSelectedDeal(null)} 
            className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-2xs z-40"
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-[#101726] shadow-2xl border-l border-white/10 animate-in slide-in-from-right flex flex-col z-50 font-sans">
            
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-[#101726] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    #{selectedDeal.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/[0.02] border border-white/10 px-2 py-0.5 rounded">
                    {selectedDeal.estagio}
                  </span>
                  {selectedDeal.prioridade === 1 && (
                    <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                      Crítico
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-white font-outfit">
                  {selectedDeal.titulo}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedDeal(null)}
                className="p-1.5 hover:bg-white/[0.02] rounded-lg text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Body Details */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0b0f19]">
              
              {/* Cliente SGP */}
              <div className="bg-[#101726] p-4 rounded-xl border border-white/10 shadow-2xs space-y-3 text-xs">
                <h3 className="font-bold text-white font-outfit pb-2 border-b border-slate-100 flex items-center gap-2">
                  <User size={14} className="text-blue-400" /> Detalhes do Assinante
                </h3>
                
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Nome</p>
                  <p className="font-semibold text-slate-200 text-sm">{selectedDeal.contato}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Telefone / WhatsApp</p>
                    <p className="font-medium text-slate-300">{selectedDeal.telefone || '(11) 98765-4321'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Plano Contratado</p>
                    <p className="font-medium text-blue-400">{selectedDeal.plano || 'Fibra 500MB'}</p>
                  </div>
                </div>

                {type === 'Cobranca' && selectedDeal.valor && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Valor em Débito</p>
                      <p className="text-base font-extrabold text-amber-700">R$ {selectedDeal.valor.toFixed(2)}</p>
                    </div>
                    {selectedDeal.dias_atraso !== undefined && selectedDeal.dias_atraso > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-lg text-[10px] font-bold">
                        {selectedDeal.dias_atraso} dias em atraso
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Endereço de Instalação</p>
                    <button
                      type="button"
                      onClick={() => setMapTargetDeal(selectedDeal)}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-400 flex items-center gap-1"
                    >
                      <MapPin size={11} />
                      <span>Ver no Mapa / CEP</span>
                    </button>
                  </div>
                  <div className="bg-[#0b0f19] border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={14} className="text-blue-400 shrink-0" />
                      <span className="font-medium text-slate-300 text-xs truncate">
                        {selectedDeal.endereco || 'Rua das Acácias, 412 - Jd. Primavera'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMapTargetDeal(selectedDeal)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                      title="Compartilhar localização e rotas com técnico via WhatsApp"
                    >
                      <Share2 size={11} />
                      <span>WhatsApp Técnico</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contexto IA */}
              <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-100 rounded-xl p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-indigo-700 font-bold uppercase tracking-wider mb-2 text-[10px]">
                  <Activity size={12} />
                  Contexto IA & Telemetria
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedDeal.contexto_ia || 
                    (type === 'Suporte' 
                      ? 'Telemetria indica atenuação normal na ONU (-19.2 dBm). Sessão PPPoE ativa. Recomendado suporte nível 1.'
                      : 'Lead qualificado via WhatsApp. Interesse confirmado no plano 500MB.')}
                </p>
              </div>

              {/* Histórico */}
              <div className="bg-[#101726] p-4 rounded-xl border border-white/10 shadow-2xs">
                <h3 className="font-bold text-white font-outfit mb-3 text-xs flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-400" /> Linha do Tempo
                </h3>
                <div className="space-y-3 pl-2 border-l-2 border-white/10 ml-1.5 text-xs">
                  <div className="relative pl-3">
                    <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
                    <p className="text-[10px] text-slate-400">{selectedDeal.criado_em || 'Hoje'}</p>
                    <p className="font-semibold text-slate-200">Card no estágio: {selectedDeal.estagio}</p>
                  </div>
                  <div className="relative pl-3">
                    <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 bg-slate-300 rounded-full border-2 border-white" />
                    <p className="text-[10px] text-slate-400">Abertura</p>
                    <p className="text-slate-400">Ticket criado pelo sistema</p>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Actions Footer */}
            <div className="p-4 border-t border-white/10 bg-[#101726] flex gap-2.5">
              <a
                href={`https://wa.me/55${(selectedDeal.telefone || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#101726] hover:bg-[#0b0f19] border border-white/10 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <MessageSquare size={14} className="text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              {stages.indexOf(selectedDeal.estagio) < stages.length - 1 ? (
                <button 
                  onClick={() => handleAdvanceStage(selectedDeal)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Avançar Etapa</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <div className="flex-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                  <Check size={14} /> Concluído
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal de Criação de Novo Card */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0b0f19]/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#101726] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-white font-outfit text-base">
                Criar Novo {type === 'Suporte' ? 'Chamado de Suporte' : 'Lead Comercial'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-300 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Título do Card / Motivo</label>
                <input
                  type="text"
                  required
                  placeholder={type === 'Suporte' ? "Ex: Queda de Fibra na CTO-08" : type === 'Vendas' ? "Ex: Contratação Residencial 700MB" : "Ex: Mensalidade Vencida 05/09"}
                  value={newDealData.titulo}
                  onChange={(e) => setNewDealData({ ...newDealData, titulo: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-600 focus:bg-[#101726]"
                />
              </div>

              {type === 'Cobranca' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Valor da Fatura (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="99.90"
                      value={newDealData.valor}
                      onChange={(e) => setNewDealData({ ...newDealData, valor: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-600 focus:bg-[#101726]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Dias de Atraso</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newDealData.dias_atraso}
                      onChange={(e) => setNewDealData({ ...newDealData, dias_atraso: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-600 focus:bg-[#101726]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nome do Cliente</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Clara Lima"
                    value={newDealData.contato}
                    onChange={(e) => setNewDealData({ ...newDealData, contato: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-600 focus:bg-[#101726]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={newDealData.telefone}
                    onChange={(e) => setNewDealData({ ...newDealData, telefone: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-600 focus:bg-[#101726]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Plano</label>
                  <select
                    value={newDealData.plano}
                    onChange={(e) => setNewDealData({ ...newDealData, plano: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-600 focus:bg-[#101726]"
                  >
                    <option value="Fibra 300MB">Fibra 300MB</option>
                    <option value="Fibra 500MB">Fibra 500MB</option>
                    <option value="Fibra 700MB Gamer">Fibra 700MB Gamer</option>
                    <option value="Fibra 1GB Empresarial">Fibra 1GB Empresarial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Prioridade</label>
                  <select
                    value={newDealData.prioridade}
                    onChange={(e) => setNewDealData({ ...newDealData, prioridade: Number(e.target.value) })}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-600 focus:bg-[#101726]"
                  >
                    <option value={2}>Normal (Padrão)</option>
                    <option value={1}>Alta Prioridade</option>
                    <option value={3}>Baixa Prioridade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Endereço de Atendimento</label>
                <input
                  type="text"
                  placeholder="Rua, número e bairro"
                  value={newDealData.endereco}
                  onChange={(e) => setNewDealData({ ...newDealData, endereco: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-600 focus:bg-[#101726]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-slate-400 rounded-xl font-bold hover:bg-[#0b0f19]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  {isSaving ? 'Salvando...' : 'Adicionar ao Kanban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Mapa, Busca de CEP e Compartilhamento com Técnico */}
      {mapTargetDeal && (
        <AddressMapModal
          isOpen={!!mapTargetDeal}
          onClose={() => setMapTargetDeal(null)}
          cliente={{
            id: mapTargetDeal.id,
            nome: mapTargetDeal.contato,
            telefone: mapTargetDeal.telefone,
            endereco: mapTargetDeal.endereco
          }}
          onAddressUpdated={(novo) => {
            setDeals(prev => prev.map(d => d.id === mapTargetDeal.id ? {
              ...d,
              endereco: novo.endereco || d.endereco
            } : d));
            if (selectedDeal && selectedDeal.id === mapTargetDeal.id) {
              setSelectedDeal(prev => prev ? {
                ...prev,
                endereco: novo.endereco || prev.endereco
              } : null);
            }
          }}
        />
      )}

    </div>
  );
}
