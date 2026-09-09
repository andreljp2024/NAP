import React, { useState, useEffect } from 'react';
import { HeadphonesIcon, Plus, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import type { Deal } from '../types';

export default function PortalSuporte() {
  const [chamados, setChamados] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca apenas chamados de suporte (mock)
    fetch('/api/deals')
      .then(res => res.json())
      .then((data: Deal[]) => {
        // Simular filtro do cliente logado "João Silva"
        const clienteChamados = data.filter(d => d.pipeline === 'Suporte' && d.contato === 'João Silva');
        setChamados(clienteChamados);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Suporte Técnico</h1>
          <p className="text-slate-600 text-sm md:text-base">Meus chamados e solicitações.</p>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={18} /> Novo Chamado
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-slate-500">Carregando chamados...</div>
      ) : (
        <div className="grid gap-4">
          {chamados.map(chamado => (
            <div key={chamado.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
                    <HeadphonesIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{chamado.titulo}</h3>
                    <p className="text-sm text-slate-500">Protocolo #{chamado.id}</p>
                  </div>
                </div>
                {chamado.estagio === 'Resolvido' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                    <CheckCircle2 size={14} /> Resolvido
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    <Clock size={14} /> {chamado.estagio}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                <p className="text-sm text-slate-500 line-clamp-1 flex-1 mr-4">
                  Acompanhe o andamento pelo chat.
                </p>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
                  <MessageSquare size={16} /> Ver Chat
                </button>
              </div>
            </div>
          ))}

          {chamados.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum chamado aberto</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Sua conexão está estável. Caso precise de ajuda, clique em "Novo Chamado".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
