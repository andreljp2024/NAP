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
    <div className="fixed top-6 right-6 w-80 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in slide-in-from-top-10 z-[100]">
      <div className="bg-emerald-600 p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <PhoneIncoming size={24} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Chamada Entrante</h3>
          <p className="text-emerald-100 text-sm">{call.fila}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-slate-400 mb-1">Contato Identificado</p>
        <p className="font-bold text-xl mb-1">{call.contato}</p>
        <p className="text-slate-300 font-mono text-sm mb-4">{call.telefone}</p>
        
        <div className="flex gap-2">
          <button 
            onClick={() => {
              navigate('/crm');
              setCall(null);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <PhoneForwarded size={16} /> Abrir Ficha
          </button>
          <button 
            onClick={() => setCall(null)}
            className="w-10 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
