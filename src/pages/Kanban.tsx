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
    </div>
  );
}
