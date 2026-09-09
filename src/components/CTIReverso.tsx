import React, { useEffect, useState } from 'react';
import { PhoneIncoming, X, PhoneForwarded } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTIReverso() {
  const [call, setCall] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const eventSource = new EventSource('/api/events/calls');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCall(data);
    };

    eventSource.onerror = (error) => {
      console.error("Erro no SSE do FreePBX:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (!call) return null;

  return (
    <div className="fixed top-6 right-6 w-80 bg-[#101726] text-slate-200 rounded-3xl shadow-2xl shadow-black/40 border border-slate-800/60 overflow-hidden animate-in slide-in-from-top-10 z-[100]">
      <div className="bg-[#0d1321] border-b border-slate-800/60 p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center animate-pulse">
          <PhoneIncoming size={22} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white font-outfit">Chamada Entrante</h3>
          <p className="text-indigo-400 text-sm font-medium tracking-wide uppercase text-[10px]">{call.fila}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">Contato Identificado</p>
        <p className="font-bold text-2xl text-white font-outfit mb-1">{call.contato}</p>
        <p className="text-slate-400 font-mono text-sm mb-6 bg-[#1a2333] px-2 py-1 rounded inline-block">{call.telefone}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              navigate('/crm');
              setCall(null);
            }}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <PhoneForwarded size={18} /> Abrir Ficha
          </button>
          <button 
            onClick={() => setCall(null)}
            className="w-12 bg-[#1a2333] hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-inner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
