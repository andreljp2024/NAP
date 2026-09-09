import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, X, Clock, User, Phone, MapPin, Tag, Activity, FileText } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { Deal } from '../types';

export default function Kanban({ type }: { type: "Suporte" | "Vendas" }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const stages = type === 'Suporte' 
    ? ['Novo Chamado', 'Em Análise', 'Técnico em Rota', 'Resolvido']
    : ['Novo Lead', 'Qualificado (IA)', 'Negociação', 'Fechado/Ganho'];

  useEffect(() => {
    fetch('/api/deals')
      .then(res => res.json())
      .then((data: Deal[]) => {
        setDeals(data.filter(d => d.pipeline === type));
        setLoading(false);
      });
  }, [type]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      // Movimentou entre colunas
      const sourceStage = source.droppableId;
      const destStage = destination.droppableId;
      
      const movedDealId = parseInt(result.draggableId);
      
      setDeals(prev => prev.map(deal => 
        deal.id === movedDealId 
          ? { ...deal, estagio: destStage } 
          : deal
      ));
    }
  };

  if (loading) return <div className="p-8 text-slate-600">Carregando kanban...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      <div className="p-6 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Kanban de {type}</h1>
          <p className="text-sm text-slate-600 mt-1">Arraste os cards para atualizar o status no SGP.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95">
          <Plus size={16} /> Novo {type === 'Suporte' ? 'Chamado' : 'Deal'}
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-max">
            {stages.map(stage => {
              const stageDeals = deals.filter(d => d.estagio === stage);
              return (
                <div key={stage} className="w-80 flex flex-col max-h-full">
                  <div className="flex justify-between items-center mb-5 px-1">
                    <h3 className="font-semibold text-slate-600 tracking-wide text-sm uppercase">{stage}</h3>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">{stageDeals.length}</span>
                  </div>
                  
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto space-y-4 pb-4 rounded-xl transition-all duration-300 min-h-[150px] p-2 -mx-2 ${
                          snapshot.isDraggingOver ? 'bg-blue-600/5 border border-blue-200' : ''
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
                                className={`bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-md shadow-sm cursor-grab ${
                                  snapshot.isDragging ? 'shadow-md shadow-blue-600/10 ring-2 ring-blue-600/50 rotate-2 scale-105' : 'hover:border-slate-600'
                                } transition-all`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider bg-blue-600/10 border border-blue-200 px-2 py-1 rounded">#{deal.id}</span>
                                  <button className="text-slate-500 hover:text-slate-600 transition-colors"><MoreHorizontal size={16} /></button>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">{deal.titulo}</h4>
                                <p className="text-sm text-slate-600 mb-4">{deal.contato}</p>
                                
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                                  <div className="flex -space-x-2">
                                     <div className="w-7 h-7 rounded-full bg-blue-600 to-purple-600 border-2 border-slate-50 flex items-center justify-center text-[9px] text-white font-bold shadow-sm">
                                       IA
                                     </div>
                                  </div>
                                  {deal.prioridade === 1 && <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md">Alta Pri.</span>}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )})}
                        {provided.placeholder}
                        
                        {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                          <div className="border-2 border-dashed border-slate-200 rounded-xl h-28 flex items-center justify-center text-sm text-slate-500 bg-white/50">
                            Dropzone
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
        <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-lg shadow-sm border-l border-slate-200 animate-in slide-in-from-right flex flex-col z-50">
          <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider bg-blue-600/10 border border-blue-200 px-2 py-0.5 rounded">#{selectedDeal.id}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">{selectedDeal.estagio}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-outfit mb-1">{selectedDeal.titulo}</h2>
            </div>
            <button 
              onClick={() => setSelectedDeal(null)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors border border-transparent"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {/* Info do Contato */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-inner">
              <h3 className="font-bold text-slate-900 font-outfit mb-4 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <User size={16} className="text-blue-600" /> Detalhes do Cliente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Nome</p>
                    <p className="text-sm font-medium text-slate-900">{selectedDeal.contato}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <Phone size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Telefone / WhatsApp</p>
                    <p className="text-sm font-medium text-slate-900">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <MapPin size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Endereço (SGP)</p>
                    <p className="text-sm font-medium text-slate-900">Rua das Flores, 123 - Centro</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary Block */}
            <div className="bg-gradient-to-br from-blue-100/40 to-purple-900/20 border border-blue-200 rounded-xl p-5 shadow-lg shadow-blue-100/10 relative overflow-hidden">
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider mb-3 text-[11px] relative z-10">
                <Activity size={14} className="fill-blue-600" />
                Contexto IA (9router)
              </div>
              <p className="text-sm text-blue-800 leading-relaxed relative z-10">
                {type === 'Suporte' 
                  ? 'Cliente relatou lentidão severa após temporal. Verificado no SGP: ONU online, mas com atenuação alta. Possível rompimento na CTO.'
                  : 'Lead originado via WhatsApp Ads. Demonstrou interesse no plano de 1GB Empresarial. Orçamento estimado R$ 299/mês.'
                }
              </p>
            </div>

            {/* Timeline Mock */}
            <div>
              <h3 className="font-bold text-slate-900 font-outfit mb-4 text-sm flex items-center gap-2">
                <Clock size={16} className="text-blue-600" /> Histórico de Atividade
              </h3>
              <div className="space-y-4 pl-3 border-l-2 border-slate-200 ml-2">
                <div className="relative pl-4">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-600 rounded-full border-[3px] border-white"></div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Hoje, 14:30</p>
                  <p className="text-sm text-slate-900 font-medium">Movido para {selectedDeal.estagio}</p>
                </div>
                <div className="relative pl-4">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full border-[3px] border-white"></div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Ontem, 09:15</p>
                  <p className="text-sm text-slate-900 font-medium">Classificação inicial realizada pela IA</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-5 border-t border-slate-200 bg-white flex gap-3 z-10">
            <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm">
              Ver no SGP
            </button>
            <button className="flex-1 bg-blue-700 hover:bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-700/20">
              Assumir Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
