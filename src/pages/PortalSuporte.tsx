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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit mb-2">Suporte Técnico</h1>
          <p className="text-slate-600 text-sm md:text-base">Meus chamados e solicitações.</p>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95">
          <Plus size={18} /> Novo Chamado
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-slate-500">Carregando chamados...</div>
      ) : (
        <div className="grid gap-4">
          {chamados.map(chamado => (
            <div key={chamado.id} className="bg-white p-5 md:p-6 rounded-3xl shadow-md border border-slate-200 hover:border-blue-600/50 transition-all group hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 border border-slate-200 shadow-inner group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
                    <HeadphonesIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 font-outfit text-lg">{chamado.titulo}</h3>
                    <p className="text-sm text-slate-600 font-mono mt-0.5">#{chamado.id}</p>
                  </div>
                </div>
                {chamado.estagio === 'Resolvido' ? (
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
                    <CheckCircle2 size={14} /> Resolvido
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md">
                    <Clock size={14} /> {chamado.estagio}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-200 pt-5 mt-3">
                <p className="text-sm text-slate-600 line-clamp-1 flex-1 mr-4">
                  Acompanhe o andamento pelo chat.
                </p>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-600 font-bold text-sm transition-colors uppercase tracking-wider">
                  <MessageSquare size={16} /> Ver Chat
                </button>
              </div>
            </div>
          ))}

          {chamados.length === 0 && (
            <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center shadow-inner">
              <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">Nenhum chamado aberto</h3>
              <p className="text-slate-600 text-sm max-w-sm">
                Sua conexão está estável. Caso precise de ajuda, clique em "Novo Chamado".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
