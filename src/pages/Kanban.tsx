import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { Deal } from '../types';

export default function Kanban({ type }: { type: "Suporte" | "Vendas" }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8">Carregando kanban...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kanban de {type}</h1>
          <p className="text-sm text-slate-500">Arraste os cards para atualizar o status no SGP.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Plus size={16} /> Novo {type === 'Suporte' ? 'Chamado' : 'Deal'}
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-max">
            {stages.map(stage => {
              const stageDeals = deals.filter(d => d.estagio === stage);
              return (
                <div key={stage} className="w-80 flex flex-col max-h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-700">{stage}</h3>
                    <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{stageDeals.length}</span>
                  </div>
                  
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto space-y-3 pb-4 rounded-lg transition-colors min-h-[150px] ${
                          snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        {stageDeals.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-4 rounded-lg border border-slate-200 shadow-sm cursor-grab ${
                                  snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 rotate-2' : 'hover:shadow-md'
                                } transition-all`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">#{deal.id}</span>
                                  <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">{deal.titulo}</h4>
                                <p className="text-sm text-slate-600 mb-3">{deal.contato}</p>
                                
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                                  <div className="flex -space-x-2">
                                     <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                                       IA
                                     </div>
                                  </div>
                                  {deal.prioridade === 1 && <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-sm">Alta Pri.</span>}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                          <div className="border-2 border-dashed border-slate-200 rounded-lg h-24 flex items-center justify-center text-sm text-slate-400">
                            Nenhum card
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
    </div>
  );
}
