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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Minha Conta</h1>
        <p className="text-slate-600 text-sm md:text-base">Gerencie seus dados pessoais e de acesso.</p>
      </div>

      <div className="space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <User className="text-blue-600" size={20} />
            <h2 className="font-bold text-slate-900">Dados Pessoais</h2>
          </div>
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                defaultValue="João Silva" 
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-400 mt-1">Alteração de titularidade apenas via suporte.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CPF / CNPJ</label>
              <input 
                type="text" 
                defaultValue="111.222.333-44" 
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  defaultValue="joao.silva@email.com" 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="tel" 
                  defaultValue="+55 11 99999-9999" 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <Shield className="text-emerald-600" size={20} />
            <h2 className="font-bold text-slate-900">Segurança</h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="Deixe em branco para não alterar" 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Habilitar Autenticação em 2 Fatores (2FA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
