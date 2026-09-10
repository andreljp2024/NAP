import React, { useState, useEffect } from 'react';
import { Wifi, Activity, AlertCircle, CheckCircle2, Download, Copy, QrCode, HeadphonesIcon, CreditCard, Settings, Loader2, Bell, Smartphone, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { usePWAInstall } from '../hooks/usePWAInstall';
import PortalWifiModal from '../components/PortalWifiModal';
import AutoDiagnosticoModal from '../components/AutoDiagnosticoModal';

export default function PortalDashboard() {
  const navigate = useNavigate();
  const { triggerTestPush, permission, requestPermission } = usePushNotifications();
  const { isInstallable, isInstalled } = usePWAInstall();
  const [faturas, setFaturas] = useState<any[]>([]);
  const [loadingPix, setLoadingPix] = useState(false);
  const [loadingBoleto, setLoadingBoleto] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isDiagnosticoOpen, setIsDiagnosticoOpen] = useState(false);
  const [wifiSummary, setWifiSummary] = useState<{ ssid: string; modelo: string; dispositivos: number } | null>(null);

  useEffect(() => {
    fetch('/api/sgp/faturas')
      .then(res => res.json())
      .then(data => setFaturas(data));

    fetch('/api/portal/wifi')
      .then(res => res.json())
      .then(data => {
        if (data.sucesso && data.config) {
          setWifiSummary({
            ssid: data.config.ssid5 || data.config.ssid24,
            modelo: data.config.modeloCpe,
            dispositivos: data.config.dispositivosConectados?.length || 0
          });
        }
      })
      .catch(() => {});
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
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit mb-1">Olá, João!</h1>
          <p className="text-slate-600 text-sm md:text-base">Acompanhe sua conexão e faturas em tempo real.</p>
        </div>
        {(!isInstalled || permission !== 'granted') && (
          <div className="flex items-center gap-2">
            {!isInstalled && isInstallable && <PWAInstallButton />}
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-all "
              >
                <Bell size={14} /> Ativar Alertas
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        {/* Status da Conexão */}
        <div className="bg-white p-6 rounded-3xl   border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 border border-emerald-200  rounded-2xl flex items-center justify-center">
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
          <div className="space-y-3.5 border-t border-slate-200 pt-5 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Plano Atual</span>
              <span className="font-bold text-slate-900">Fibra 500MB</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Rede Wi-Fi (SSID)</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                {wifiSummary?.ssid || 'Carregando...'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Dispositivos no Wi-Fi</span>
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {wifiSummary?.dispositivos || 5} aparelhos conectados
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Roteador / ONU</span>
              <span className="font-bold text-slate-700 text-xs font-mono">{wifiSummary?.modelo?.split(' ')[0] || 'ZTE'} F670L</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 relative z-10">
            <button 
              onClick={() => setIsWifiModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <Lock size={15} /> Alterar Senha do Wi-Fi
            </button>
            <button 
              onClick={() => setIsDiagnosticoOpen(true)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Activity size={15} /> Auto-Diagnóstico de Rede
            </button>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-6 rounded-3xl  -900/20 border border-blue-600 relative overflow-hidden flex flex-col">
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <QrCode size={160} className="fill-white" />
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-blue-300" />
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Próximo Vencimento</p>
              </div>
              {faturaPendente ? (
                <>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white font-outfit tracking-tight">
                    <span className="text-xl md:text-2xl text-blue-300">R$</span> {faturaPendente.valor.toFixed(2).replace('.', ',')}
                  </h2>
                  <p className="text-blue-200 text-sm font-medium">
                    Vence em {new Date(faturaPendente.vencimento).toLocaleDateString('pt-BR')}
                  </p>
                </>
              ) : (
                <div className="mt-4">
                  <h2 className="text-3xl font-bold mb-2 text-white font-outfit">Tudo em dia!</h2>
                  <p className="text-blue-200 text-sm">Você não possui faturas pendentes.</p>
                </div>
              )}
            </div>
            
            {faturaPendente && (
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleCopiarPix}
                    disabled={loadingPix}
                    className="flex-1 bg-white text-blue-900 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 hover:bg-slate-50 hover:scale-105 active:scale-95 disabled:opacity-75 disabled:hover:scale-100 "
                  >
                    {loadingPix ? <Loader2 size={18} className="animate-spin" /> : <QrCode size={18} />}
                    {loadingPix ? 'Gerando...' : 'Copiar PIX'}
                  </button>
                  <button 
                    onClick={handleVerBoleto}
                    disabled={loadingBoleto}
                    className="flex-1 bg-blue-600/30 backdrop-blur-sm text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 hover:bg-blue-600/50 border border-white/20 hover:scale-105 active:scale-95 disabled:opacity-75 disabled:hover:scale-100 "
                  >
                    {loadingBoleto ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    {loadingBoleto ? 'Gerando...' : 'Ver Boleto'}
                  </button>
                </div>
                {pixCode && (
                   <div className="mt-4 p-3 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm animate-in fade-in zoom-in-95">
                     <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-1">Linha Digitável Copiada:</p>
                     <p className="text-xs font-mono break-all text-white leading-relaxed">{pixCode}</p>
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
        <QuickAction icon={<Wifi />} label="Wi-Fi & Senha" onClick={() => setIsWifiModalOpen(true)} />
        <QuickAction icon={<CreditCard />} label="Faturas SGP" onClick={() => navigate('/portal/faturas')} />
        <QuickAction icon={<HeadphonesIcon />} label="Abrir Chamado" onClick={() => navigate('/portal/suporte')} />
        <QuickAction icon={<Settings />} label="Minha Conta" onClick={() => navigate('/portal/conta')} />
      </div>

      {/* Modal de Gerenciamento do Wi-Fi Residencial via TR-069 */}
      <PortalWifiModal 
        isOpen={isWifiModalOpen} 
        onClose={() => setIsWifiModalOpen(false)}
        onSuccess={() => {
          // Atualizar resumo na tela
          fetch('/api/portal/wifi')
            .then(res => res.json())
            .then(data => {
              if (data.sucesso && data.config) {
                setWifiSummary({
                  ssid: data.config.ssid5 || data.config.ssid24,
                  modelo: data.config.modeloCpe,
                  dispositivos: data.config.dispositivosConectados?.length || 0
                });
              }
            });
        }}
      />

      <AutoDiagnosticoModal
        isOpen={isDiagnosticoOpen}
        onClose={() => setIsDiagnosticoOpen(false)}
        clienteBairro="Centro Histórico"
      />
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="bg-white p-5 rounded-2xl border border-slate-200   flex flex-col items-center justify-center gap-4 hover:border-blue-600/50 hover:bg-slate-50 hover:-translate-y-1 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200  flex items-center justify-center group-hover:bg-blue-600 group-hover:text-slate-900 group-hover:-600/40 transition-all">
        {icon}
      </div>
      <span className="text-xs md:text-sm font-bold text-slate-600 text-center group-hover:text-slate-900 transition-colors">{label}</span>
    </button>
  );
}
