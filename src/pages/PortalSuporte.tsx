import React, { useState, useEffect } from 'react';
import { HeadphonesIcon, Plus, MessageSquare, Clock, CheckCircle2, PhoneCall, Bot } from 'lucide-react';
import type { Deal } from '../types';

export default function PortalSuporte() {
  const [chamados, setChamados] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCall, setActiveCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

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

  useEffect(() => {
    let interval: any;
    if (activeCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleWebphone = () => {
    if (activeCall) {
      setActiveCall(false);
    } else {
      setActiveCall(true);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full pb-24">
      {/* CTI / Webphone Banner */}
      {activeCall && (
        <div className="bg-slate-900 rounded-3xl p-6 mb-8 text-white shadow-2xl flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-4 relative">
            <div className="absolute inset-0 rounded-full border border-emerald-500 animate-ping"></div>
            <PhoneCall className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-xl font-bold font-outfit mb-1">Chamada em Andamento</h3>
          <p className="text-slate-400 text-sm mb-6">Falando com: Operador (Suporte N1)</p>
          <div className="text-3xl font-mono font-light text-emerald-400 mb-8">{formatTime(callDuration)}</div>
          
          <button 
            onClick={handleWebphone}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <PhoneCall className="rotate-[135deg]" size={18} /> Encerrar Ligação
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit mb-2">Suporte Técnico</h1>
          <p className="text-slate-600 text-sm md:text-base">Meus chamados e contato direto.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Card: Ligar para Suporte (WebRTC) */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
            <PhoneCall size={24} className="text-blue-100" />
          </div>
          <h3 className="text-xl font-bold font-outfit mb-2">Ligação Gratuita</h3>
          <p className="text-blue-100 text-sm mb-6 max-w-[250px]">Fale agora mesmo com um de nossos especialistas usando a internet do seu dispositivo, sem gastar seus créditos.</p>
          <button 
            onClick={handleWebphone}
            disabled={activeCall}
            className="bg-white text-blue-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {activeCall ? 'Ligação em andamento...' : 'Iniciar Chamada de Voz'}
          </button>
        </div>

        {/* Card: Webchat / Fila */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
            <MessageSquare size={24} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold font-outfit text-slate-900 mb-2">Atendimento via Chat</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-[250px]">Inicie uma conversa por texto. Você será direcionado para o setor correto (Financeiro, Suporte ou Vendas).</p>
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 transition-all active:scale-95 shadow-emerald-600/20 flex items-center gap-2">
            Entrar na Fila de Chat
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 font-outfit">Histórico de Chamados</h2>
        <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors">
          <Plus size={16} /> Novo Chamado
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-slate-500">Carregando chamados...</div>
      ) : (
        <div className="grid gap-4">
          {chamados.map(chamado => (
            <div key={chamado.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-600/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                    <HeadphonesIcon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 font-outfit">{chamado.titulo}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">#{chamado.id}</p>
                  </div>
                </div>
                {chamado.estagio === 'Resolvido' ? (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <CheckCircle2 size={12} /> Resolvido
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    <Clock size={12} /> {chamado.estagio}
                  </span>
                )}
              </div>
            </div>
          ))}

          {chamados.length === 0 && (
            <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-outfit mb-1">Nenhum chamado aberto</h3>
              <p className="text-slate-500 text-xs max-w-[200px]">
                Sua conexão está estável.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
