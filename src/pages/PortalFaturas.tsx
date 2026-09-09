import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Clock, Download, QrCode, Loader2, Copy } from 'lucide-react';

export default function PortalFaturas() {
  const [faturas, setFaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State variables for generating transaction codes
  const [actionStates, setActionStates] = useState<Record<number, { type: 'pix' | 'boleto', status: 'loading' | 'success', data?: string }>>({});

  useEffect(() => {
    fetch('/api/sgp/faturas')
      .then(res => res.json())
      .then(data => {
        setFaturas(data);
        setLoading(false);
      });
  }, []);

  const handleGeneratePix = async (id: number) => {
    setActionStates(prev => ({ ...prev, [id]: { type: 'pix', status: 'loading' } }));
    try {
      const response = await fetch(`/api/sgp/pix/${id}`, { method: 'POST' });
      const data = await response.json();
      setActionStates(prev => ({ ...prev, [id]: { type: 'pix', status: 'success', data: data.codigo_pix } }));
    } catch (e) {
      setActionStates(prev => ({ ...prev, [id]: { type: 'pix', status: 'success', data: 'Erro ao gerar PIX' } }));
    }
  };

  const handleGenerateBoleto = async (id: number) => {
    setActionStates(prev => ({ ...prev, [id]: { type: 'boleto', status: 'loading' } }));
    try {
      const response = await fetch(`/api/sgp/boleto/${id}`, { method: 'POST' });
      const data = await response.json();
      // Simulate download prompt
      window.open(data.url_pdf, '_blank');
      setActionStates(prev => ({ ...prev, [id]: { type: 'boleto', status: 'success', data: 'Boleto gerado' } }));
      
      // Auto clear state after a while
      setTimeout(() => setActionStates(prev => { const next = {...prev}; delete next[id]; return next; }), 3000);
    } catch (e) {
      alert("Erro ao baixar boleto.");
      setActionStates(prev => { const next = {...prev}; delete next[id]; return next; });
    }
  };

  const copyPixCode = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Código PIX Copiado!');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white font-outfit mb-2">Faturas</h1>
        <p className="text-slate-400 text-sm md:text-base">Histórico financeiro e pagamentos pendentes.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-slate-500">Carregando faturas...</div>
      ) : (
        <div className="bg-[#101726] rounded-3xl shadow-xl shadow-black/20 border border-slate-800/60 overflow-hidden relative">
          <div className="divide-y divide-slate-800/60 relative z-10">
            {faturas.map(fatura => (
              <div key={fatura.id} className="p-5 md:p-6 hover:bg-slate-800/40 transition-colors group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner transition-colors ${
                      fatura.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20'
                    }`}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white font-outfit">Mensalidade - Fibra 500MB</h3>
                      <p className="text-sm text-slate-400 mb-2 font-medium">
                        Vencimento: {new Date(fatura.vencimento).toLocaleDateString('pt-BR')}
                      </p>
                      {fatura.status === 'pago' ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                          <CheckCircle2 size={12} /> Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                          <Clock size={12} /> Pendente
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 w-full md:w-auto mt-2 md:mt-0">
                    <div className="text-2xl font-bold text-white font-outfit">
                      <span className="text-lg text-slate-500">R$</span> {fatura.valor.toFixed(2).replace('.', ',')}
                    </div>
                    
                    {fatura.status === 'pendente' && (
                      <div className="flex gap-2 w-full md:w-auto">
                        <button 
                          onClick={() => handleGeneratePix(fatura.id)}
                          disabled={actionStates[fatura.id]?.status === 'loading'}
                          className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                        >
                          {actionStates[fatura.id]?.type === 'pix' && actionStates[fatura.id]?.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                          PIX
                        </button>
                        <button 
                          onClick={() => handleGenerateBoleto(fatura.id)}
                          disabled={actionStates[fatura.id]?.status === 'loading'}
                          className="flex-1 md:flex-none bg-[#1a2333] hover:bg-slate-800 border border-slate-700/50 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 shadow-inner"
                        >
                          {actionStates[fatura.id]?.type === 'boleto' && actionStates[fatura.id]?.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                          Boleto
                        </button>
                      </div>
                    )}
                    {fatura.status === 'pago' && (
                      <button className="w-full md:w-auto bg-[#1a2333] hover:bg-slate-800 border border-slate-700/50 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-inner">
                        <Download size={16} /> Recibo
                      </button>
                    )}
                  </div>
                </div>

                {/* Área de exibição do PIX */}
                {actionStates[fatura.id]?.type === 'pix' && actionStates[fatura.id]?.status === 'success' && actionStates[fatura.id]?.data && (
                  <div className="mt-5 p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl animate-in fade-in zoom-in-95">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">Código PIX Copia e Cola:</p>
                    <div className="flex items-center gap-2">
                      <input 
                        readOnly 
                        value={actionStates[fatura.id]?.data} 
                        className="flex-1 bg-[#0b0f19] border border-indigo-500/30 rounded-xl p-3 text-xs text-indigo-200 outline-none font-mono shadow-inner"
                      />
                      <button 
                        onClick={() => copyPixCode(actionStates[fatura.id]?.data!)}
                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500 flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {faturas.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                Nenhuma fatura encontrada.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
