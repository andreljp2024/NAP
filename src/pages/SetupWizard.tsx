import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, Network, Server, CheckCircle2, ChevronRight, Loader2, Play } from 'lucide-react';

export default function SetupWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isGenieInstalled, setIsGenieInstalled] = useState(false);

  const [formData, setFormData] = useState({
    adminEmail: 'admin@provedor.com.br',
    adminPassword: '',
    localIpRange: '192.168.0.0/24',
    domain: window.location.hostname
  });

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleInstallGenieACS = async () => {
    setLoading(true);
    setLogs(["Iniciando provisionamento do GenieACS via script..."]);
    
    try {
      const res = await fetch('/api/setup/install-genieacs', { method: 'POST' });
      if (!res.ok) throw new Error('Falha ao acionar instalação');
      
      // Simulação de leitura de stream de logs (como é mock, vamos simular os ecos do bash)
      const fakeLogs = [
        "[1/4] Instalando dependências e MongoDB 7.0...",
        "[2/4] Instalando Node.js e pacote core GenieACS...",
        "[3/4] Configurando Serviços Systemd (cwmp, nbi, fs, ui)...",
        "[4/4] Finalizando e Configurando Firewall...",
        "GenieACS INSTALADO COM SUCESSO!"
      ];

      for (const log of fakeLogs) {
        await new Promise(r => setTimeout(r, 1200));
        setLogs(prev => [...prev, log]);
      }
      setIsGenieInstalled(true);
    } catch (err: any) {
      setLogs(prev => [...prev, `[ERRO] ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await fetch('/api/setup/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Steps */}
        <div className="md:w-64 bg-slate-950 p-6 border-b md:border-b-0 md:border-r border-white/5">
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-500" /> NAP Setup
          </h2>
          
          <div className="space-y-6">
            {[
              { num: 1, title: 'Administrador', icon: Shield },
              { num: 2, title: 'Rede & Domínio', icon: Network },
              { num: 3, title: 'GenieACS (TR-069)', icon: Terminal },
              { num: 4, title: 'Conclusão', icon: CheckCircle2 }
            ].map((s) => (
              <div key={s.num} className={`flex items-center gap-3 transition-colors ${step >= s.num ? 'text-blue-400' : 'text-slate-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold ${
                  step === s.num ? 'border-blue-500 bg-blue-500/10' : 
                  step > s.num ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-700'
                }`}>
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="font-medium">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-bold text-white mb-2">Criar Super Administrador</h3>
              <p className="text-slate-400 mb-6">Defina as credenciais para o acesso raiz do painel NAP.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">E-mail do Administrador</label>
                  <input 
                    type="email" 
                    value={formData.adminEmail}
                    onChange={e => setFormData({...formData, adminEmail: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Senha Mestra</label>
                  <input 
                    type="password" 
                    value={formData.adminPassword}
                    onChange={e => setFormData({...formData, adminPassword: e.target.value})}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-bold text-white mb-2">Configurações de Rede</h3>
              <p className="text-slate-400 mb-6">Mapeamento da rede local e validação do domínio do proxy.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Domínio do Painel</label>
                  <input 
                    type="text" 
                    value={formData.domain}
                    onChange={e => setFormData({...formData, domain: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Este domínio receberá os certificados SSL Let's Encrypt.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Range de IP Local (NOC)</label>
                  <input 
                    type="text" 
                    value={formData.localIpRange}
                    onChange={e => setFormData({...formData, localIpRange: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Usado para permitir acesso interno sem restrições a APIs.</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-bold text-white mb-2">Instalação Visual do GenieACS</h3>
              <p className="text-slate-400 mb-6">O NAP requer um servidor TR-069 para o mapa de rede e leitura óptica das ONTs. Clique para acionar o shell script nativamente.</p>
              
              {!isGenieInstalled ? (
                <div className="bg-slate-950 border border-white/5 rounded-xl p-6 text-center">
                  <Server className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">Provisionamento Autônomo</h4>
                  <p className="text-sm text-slate-400 mb-6">Isso irá baixar, compilar e registrar os daemons do MongoDB 7 e GenieACS na máquina atual.</p>
                  <button 
                    onClick={handleInstallGenieACS}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50 w-64"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                    {loading ? 'Instalando...' : 'Iniciar Instalação TR-069'}
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-emerald-400">GenieACS Operacional</h4>
                  <p className="text-sm text-slate-300">Os daemons NBI e CWMP estão rodando.</p>
                </div>
              )}

              {logs.length > 0 && (
                <div className="mt-6 bg-black border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-400 h-40 overflow-y-auto">
                  {logs.map((log, i) => (
                    <div key={i}>{'>'} {log}</div>
                  ))}
                  {loading && <div className="animate-pulse">{'>'} _</div>}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center py-8">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Tudo Pronto!</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                A configuração inicial do servidor NAP foi concluída. O ambiente está provisionado, as conexões locais autorizadas e o GenieACS parametrizado.
              </p>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                disabled={loading}
                className="text-slate-400 hover:text-white px-4 py-2 font-medium disabled:opacity-50"
              >
                Voltar
              </button>
            ) : <div />}
            
            {step < 4 ? (
              <button 
                onClick={nextStep}
                disabled={loading || (step === 3 && loading)}
                className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Acessar Painel NAP'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
