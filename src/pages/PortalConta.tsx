import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Shield, Bell, BellRing, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { PWAInstallButton } from '../components/PWAInstallButton';

export default function PortalConta() {
  const [loading, setLoading] = useState(false);
  const { permission, loading: loadingPush, requestPermission, triggerTestPush } = usePushNotifications();

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit mb-2">Minha Conta</h1>
        <p className="text-slate-600 text-sm md:text-base">Gerencie seus dados pessoais e de acesso.</p>
      </div>

      <div className="space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-3xl  border border-slate-200 overflow-hidden relative">
          <div className="p-5 md:p-6 border-b border-slate-200 bg-white flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200 flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="font-bold text-slate-900 font-outfit">Dados Pessoais</h2>
          </div>
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nome Completo</label>
              <input 
                type="text" 
                defaultValue="João Silva" 
                disabled
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium "
              />
              <p className="text-[10px] text-slate-500 mt-2 font-medium">Alteração de titularidade apenas via suporte.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">CPF / CNPJ</label>
              <input 
                type="text" 
                defaultValue="111.222.333-44" 
                disabled
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium "
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  defaultValue="joao.silva@email.com" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 outline-none text-slate-900  transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Telefone / WhatsApp</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="tel" 
                  defaultValue="+55 11 99999-9999" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 outline-none text-slate-900  transition-all"
                />
              </div>
            </div>
          </div>
          <div className="p-5 bg-white border-t border-slate-200 flex justify-end relative z-10">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all  -700/20 hover:scale-105 active:scale-95"
            >
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-3xl  border border-slate-200 overflow-hidden relative">
          <div className="p-5 md:p-6 border-b border-slate-200 bg-white flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h2 className="font-bold text-slate-900 font-outfit">Segurança</h2>
          </div>
          <div className="p-5 md:p-6 space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nova Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Deixe em branco para não alterar" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 outline-none text-slate-900  transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-600 transition-colors flex items-center gap-2">
              <Shield size={16} /> Habilitar Autenticação em 2 Fatores (2FA)
            </button>
          </div>
        </div>

        {/* Notificações Push & Instalação PWA */}
        <div className="bg-white rounded-3xl  border border-slate-200 overflow-hidden relative">
          <div className="p-5 md:p-6 border-b border-slate-200 bg-white flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 font-outfit">Notificações Push & PWA</h2>
                <p className="text-xs text-slate-500">Alertas em tempo real sobre faturas, manutenções e suporte.</p>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              permission === 'granted' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {permission === 'granted' ? 'Push Ativo' : 'Não Ativado'}
            </span>
          </div>

          <div className="p-5 md:p-6 space-y-6 relative z-10">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 ">
                  <BellRing size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Alertas de Faturas e Rede</h4>
                  <p className="text-xs text-slate-500">Receba a 2ª via e aviso de quedas sem precisar abrir o e-mail.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {permission !== 'granted' ? (
                  <button
                    onClick={requestPermission}
                    disabled={loadingPush}
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all  active:scale-95 disabled:opacity-50"
                  >
                    {loadingPush ? 'Ativando...' : 'Permitir Notificações'}
                  </button>
                ) : (
                  <button
                    onClick={() => triggerTestPush({ title: 'Portal NAP', body: 'Push de teste entregue com sucesso no seu dispositivo!' })}
                    className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all  active:scale-95 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Enviar Teste Push
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 ">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Aplicativo Instalado (PWA)</h4>
                  <p className="text-xs text-slate-500">Acesse o portal diretamente da tela inicial do seu celular ou PC.</p>
                </div>
              </div>
              <PWAInstallButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
