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
    <div className="fixed top-6 right-6 w-80 bg-white text-slate-900 rounded-3xl shadow-lg shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-top-10 z-[100]">
      <div className="bg-white border-b border-slate-200 p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600/10 border border-blue-200 rounded-2xl flex items-center justify-center animate-pulse">
          <PhoneIncoming size={22} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white font-outfit">Chamada Entrante</h3>
          <p className="text-blue-600 text-sm font-medium tracking-wide uppercase text-[10px]">{call.fila}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">Contato Identificado</p>
        <p className="font-bold text-2xl text-white font-outfit mb-1">{call.contato}</p>
        <p className="text-slate-600 font-mono text-sm mb-6 bg-slate-50 px-2 py-1 rounded inline-block">{call.telefone}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              navigate('/crm');
              setCall(null);
            }}
            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <PhoneForwarded size={18} /> Abrir Ficha
          </button>
          <button 
            onClick={() => setCall(null)}
            className="w-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl flex items-center justify-center transition-all shadow-inner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
