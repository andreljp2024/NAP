import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Clock, Download, QrCode } from 'lucide-react';

export default function PortalFaturas() {
  const [faturas, setFaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sgp/faturas')
      .then(res => res.json())
      .then(data => {
        setFaturas(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Faturas</h1>
        <p className="text-slate-600 text-sm md:text-base">Histórico financeiro e pagamentos pendentes.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8 text-slate-500">Carregando faturas...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {faturas.map(fatura => (
              <div key={fatura.id} className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    fatura.status === 'pago' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Mensalidade - Fibra 500MB</h3>
                    <p className="text-sm text-slate-500 mb-1">
                      Vencimento: {new Date(fatura.vencimento).toLocaleDateString('pt-BR')}
                    </p>
                    {fatura.status === 'pago' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={12} /> Pago
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        <Clock size={12} /> Pendente
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <div className="text-xl font-bold text-slate-900">
                    R$ {fatura.valor.toFixed(2).replace('.', ',')}
                  </div>
                  
                  {fatura.status === 'pendente' && (
                    <div className="flex gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <QrCode size={16} /> PIX
                      </button>
                      <button className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Download size={16} /> Boleto
                      </button>
                    </div>
                  )}
                  {fatura.status === 'pago' && (
                    <button className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Download size={16} /> Recibo
                    </button>
                  )}
                </div>
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
