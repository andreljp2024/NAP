import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Shield } from 'lucide-react';

export default function PortalConta() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white font-outfit mb-2">Minha Conta</h1>
        <p className="text-slate-400 text-sm md:text-base">Gerencie seus dados pessoais e de acesso.</p>
      </div>

      <div className="space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-[#101726] rounded-3xl shadow-xl shadow-black/20 border border-slate-800/60 overflow-hidden relative">
          <div className="p-5 md:p-6 border-b border-slate-800/60 bg-[#0d1321] flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="font-bold text-white font-outfit">Dados Pessoais</h2>
          </div>
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nome Completo</label>
              <input 
                type="text" 
                defaultValue="João Silva" 
                disabled
                className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed font-medium shadow-inner"
              />
              <p className="text-[10px] text-slate-500 mt-2 font-medium">Alteração de titularidade apenas via suporte.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">CPF / CNPJ</label>
              <input 
                type="text" 
                defaultValue="111.222.333-44" 
                disabled
                className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed font-medium shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  defaultValue="joao.silva@email.com" 
                  className="w-full pl-11 pr-4 py-3 bg-[#1a2333] border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-slate-200 shadow-inner transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Telefone / WhatsApp</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="tel" 
                  defaultValue="+55 11 99999-9999" 
                  className="w-full pl-11 pr-4 py-3 bg-[#1a2333] border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-slate-200 shadow-inner transition-all"
                />
              </div>
            </div>
          </div>
          <div className="p-5 bg-[#0d1321] border-t border-slate-800/60 flex justify-end relative z-10">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95"
            >
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-[#101726] rounded-3xl shadow-xl shadow-black/20 border border-slate-800/60 overflow-hidden relative">
          <div className="p-5 md:p-6 border-b border-slate-800/60 bg-[#0d1321] flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h2 className="font-bold text-white font-outfit">Segurança</h2>
          </div>
          <div className="p-5 md:p-6 space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nova Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Deixe em branco para não alterar" 
                  className="w-full pl-11 pr-4 py-3 bg-[#1a2333] border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-slate-200 shadow-inner transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
            <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
              <Shield size={16} /> Habilitar Autenticação em 2 Fatores (2FA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
