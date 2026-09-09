import React, { useState, useEffect } from 'react';
import { Wifi, Activity, AlertCircle, CheckCircle2, Download, Copy, QrCode, HeadphonesIcon, CreditCard, Settings, Loader2 } from 'lucide-react';

export default function PortalDashboard() {
  const { simulatePush } = usePushNotifications();
  const [faturas, setFaturas] = useState<any[]>([]);
  const [loadingPix, setLoadingPix] = useState(false);
  const [loadingBoleto, setLoadingBoleto] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sgp/faturas')
      .then(res => res.json())
      .then(data => setFaturas(data));
  }, []);

  const faturaPendente = faturas.find(f => f.status === 'pendente');

  const handleCopiarPix = async () => {
    if (!faturaPendente) return;
    setLoadingPix(true);
    try {
      const res = await fetch(`/api/sgp/pix/${faturaPendente.id}`, { method: 'POST' });
      const data = await res.json();
      if (data.sucesso && data.codigo_pix) {
        setPixCode(data.codigo_pix);
        await navigator.clipboard.writeText(data.codigo_pix);
        alert("Código PIX Copia e Cola copiado para a área de transferência!");
      } else {
        alert("Erro ao gerar PIX. Tente novamente mais tarde.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao gerar PIX.");
    } finally {
      setLoadingPix(false);
    }
  };

  const handleVerBoleto = async () => {
    if (!faturaPendente) return;
    setLoadingBoleto(true);
    try {
      const res = await fetch(`/api/sgp/boleto/${faturaPendente.id}`, { method: 'POST' });
      const data = await res.json();
      if (data.sucesso && data.url_pdf) {
        window.open(data.url_pdf, '_blank');
      } else {
        alert("Erro ao gerar Boleto. Tente novamente mais tarde.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao gerar Boleto.");
    } finally {
      setLoadingBoleto(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit mb-1">Olá, João!</h1>
        <p className="text-slate-600 text-sm md:text-base">Acompanhe sua conexão e faturas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        {/* Status da Conexão */}
        <div className="bg-white p-6 rounded-3xl shadow-md shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-inner rounded-2xl flex items-center justify-center">
                <Wifi size={26} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status da Rede</p>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">Conectado</h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              <CheckCircle2 size={14} /> Online
            </div>
          </div>
          <div className="space-y-4 border-t border-slate-200 pt-5 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Plano Atual</span>
              <span className="font-bold text-slate-900">Fibra 500MB</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Uptime (SGP)</span>
              <span className="font-bold text-slate-900">12 dias, 4h</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">IP Público</span>
              <span className="font-bold text-slate-900 font-mono">189.12.X.X</span>
            </div>
          </div>
          <button className="w-full mt-8 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 relative z-10">
            <Activity size={18} /> Testar Velocidade
          </button>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-gradient-to-br from-blue-100/60 to-purple-900/30 p-6 rounded-3xl shadow-md shadow-blue-100/20 border border-blue-200 relative overflow-hidden flex flex-col">
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <QrCode size={160} className="fill-blue-600" />
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-blue-600" />
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Próximo Vencimento</p>
              </div>
              {faturaPendente ? (
                <>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white font-outfit tracking-tight">
                    <span className="text-xl md:text-2xl text-blue-600">R$</span> {faturaPendente.valor.toFixed(2).replace('.', ',')}
                  </h2>
                  <p className="text-blue-700 text-sm font-medium">
                    Vence em {new Date(faturaPendente.vencimento).toLocaleDateString('pt-BR')}
                  </p>
                </>
              ) : (
                <div className="mt-4">
                  <h2 className="text-3xl font-bold mb-2 text-white font-outfit">Tudo em dia!</h2>
                  <p className="text-blue-700 text-sm">Você não possui faturas pendentes.</p>
                </div>
              )}
            </div>
            
            {faturaPendente && (
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleCopiarPix}
                    disabled={loadingPix}
                    className="flex-1 bg-white text-blue-100 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 hover:bg-indigo-50 hover:scale-105 active:scale-95 disabled:opacity-75 disabled:hover:scale-100 shadow-lg"
                  >
                    {loadingPix ? <Loader2 size={18} className="animate-spin" /> : <QrCode size={18} />}
                    {loadingPix ? 'Gerando...' : 'Copiar PIX'}
                  </button>
                  <button 
                    onClick={handleVerBoleto}
                    disabled={loadingBoleto}
                    className="flex-1 bg-blue-700/80 backdrop-blur-sm text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 hover:bg-blue-600 border border-blue-600/50 hover:scale-105 active:scale-95 disabled:opacity-75 disabled:hover:scale-100 shadow-lg shadow-blue-100/20"
                  >
                    {loadingBoleto ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    {loadingBoleto ? 'Gerando...' : 'Ver Boleto'}
                  </button>
                </div>
                {pixCode && (
                   <div className="mt-4 p-3 bg-indigo-950/50 rounded-xl border border-blue-200 backdrop-blur-sm animate-in fade-in zoom-in-95">
                     <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">Linha Digitável Copiada:</p>
                     <p className="text-xs font-mono break-all text-blue-800 leading-relaxed">{pixCode}</p>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <h3 className="font-bold text-slate-900 font-outfit mb-5 px-1 flex items-center gap-2">
        Atendimento Rápido
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction icon={<HeadphonesIcon />} label="Abrir Chamado" />
        <QuickAction icon={<CreditCard />} label="Faturas SGP" />
        <QuickAction 
          icon={<Bell />} 
          label="Testar Push" 
          onClick={() => simulatePush('Aviso NAP', 'A sua conexão está operando perfeitamente!')}
        />
        <QuickAction icon={<Settings />} label="Alterar Senha" />
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-lg shadow-sm flex flex-col items-center justify-center gap-4 hover:border-blue-600/50 hover:bg-slate-50 hover:-translate-y-1 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200 shadow-inner flex items-center justify-center group-hover:bg-blue-600 group-hover:text-slate-900 group-hover:shadow-blue-600/40 transition-all">
        {icon}
      </div>
      <span className="text-xs md:text-sm font-bold text-slate-600 text-center group-hover:text-slate-900 transition-colors">{label}</span>
    </button>
  );
}
