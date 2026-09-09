import React, { useState, useEffect } from 'react';
import { Wifi, Activity, AlertCircle, CheckCircle2, Download, Copy, QrCode, HeadphonesIcon, CreditCard, Settings } from 'lucide-react';

export default function PortalDashboard() {
  const [faturas, setFaturas] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sgp/faturas')
      .then(res => res.json())
      .then(data => setFaturas(data));
  }, []);

  const faturaPendente = faturas.find(f => f.status === 'pendente');

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Olá, João!</h1>
        <p className="text-slate-600 text-sm md:text-base">Acompanhe sua conexão e faturas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        {/* Status da Conexão */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Wifi size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Status da Rede</p>
                <h3 className="text-lg font-bold text-slate-900">Conectado</h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold uppercase">
              <CheckCircle2 size={14} /> Online
            </div>
          </div>
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Plano Atual</span>
              <span className="font-semibold text-slate-900">Fibra 500MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Uptime (SGP)</span>
              <span className="font-semibold text-slate-900">12 dias, 4h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">IP Público</span>
              <span className="font-semibold text-slate-900">189.12.X.X</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
            <Activity size={18} /> Testar Velocidade
          </button>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-blue-700 p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <QrCode size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={18} className="text-blue-200" />
              <p className="text-sm font-medium text-blue-100">Próximo Vencimento</p>
            </div>
            {faturaPendente ? (
              <>
                <h2 className="text-4xl font-bold mb-1">
                  R$ {faturaPendente.valor.toFixed(2).replace('.', ',')}
                </h2>
                <p className="text-blue-200 text-sm mb-6">
                  Vence em {new Date(faturaPendente.vencimento).toLocaleDateString('pt-BR')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-white text-blue-700 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 hover:bg-blue-50">
                    <QrCode size={18} /> Copiar PIX
                  </button>
                  <button className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 hover:bg-blue-500 border border-blue-500">
                    <Download size={18} /> Ver Boleto
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-2">Tudo em dia!</h2>
                <p className="text-blue-200 text-sm">Você não possui faturas pendentes.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <h3 className="font-bold text-slate-900 mb-4 px-1">Atendimento Rápido</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction icon={<HeadphonesIcon />} label="Abrir Chamado" />
        <QuickAction icon={<CreditCard />} label="Histórico Financeiro" />
        <QuickAction icon={<Copy />} label="Comprovantes" />
        <QuickAction icon={<Settings />} label="Alterar Senha" />
      </div>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 hover:border-blue-300 hover:shadow-md transition-all group">
      <div className="w-10 h-10 rounded-full bg-slate-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <span className="text-xs md:text-sm font-semibold text-slate-700 text-center">{label}</span>
    </button>
  );
}
