import React, { useState } from 'react';
import { Database, MessageCircle, Server, Shield, Activity, Bot, Save, Loader2 } from 'lucide-react';

export default function SuperAdmin() {
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0f19] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-outfit mb-2">Painel Super Admin</h1>
          <p className="text-slate-400">Configurações globais do NAP (Núcleo de Atendimento ao Provedor).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Uso de IA (Tokens)" value="452.1K" subtitle="Este mês, via 9router" icon={<Activity className="text-indigo-400" />} />
          <StatCard title="Clientes Sincronizados" value="12,450" subtitle="Último sync: há 10 min" icon={<Database className="text-emerald-400" />} />
          <StatCard title="Saúde do Sistema" value="100%" subtitle="Todos os serviços operantes" icon={<Server className="text-indigo-400" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Integrações Ativas */}
          <div className="bg-[#101726] rounded-3xl shadow-xl shadow-black/20 border border-slate-800/60 overflow-hidden flex flex-col relative">
            <div className="border-b border-slate-800/60 p-6 flex justify-between items-center bg-[#0d1321] relative z-10">
               <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                 <Shield className="text-emerald-400" size={20} />
                 Integrações Ativas
               </h2>
            </div>
            <div className="p-6 flex-1 grid gap-4 relative z-10">
              <IntegrationRow 
                title="SGP (Sistema de Gestão)" 
                status="Conectado"
                description="Sincronização em 3 camadas ativa. Leitura de contratos e financeiro."
                icon={<Database size={18} />}
              />
              <IntegrationRow 
                title="9router (Gateway IA)" 
                status="Conectado"
                description="Modelos configurados: gpt-4o-mini (Suporte), claude-3-5-sonnet (Backup)."
                icon={<Activity size={18} />}
              />
              <IntegrationRow 
                title="WhatsApp Oficial" 
                status="Conectado"
                description="Phone Number ID conectado. Templates aprovados: 12."
                icon={<MessageCircle size={18} />}
              />
              <IntegrationRow 
                title="FreePBX (AVA)" 
                status="Aviso"
                description="CTI Reverso e URA Ativos na porta 5038."
                icon={<Server size={18} />}
              />
            </div>
            <div className="bg-[#0d1321] p-5 border-t border-slate-800/60 flex gap-3 justify-end relative z-10">
              <button 
                onClick={handleSync}
                disabled={syncing}
                className="text-xs font-bold uppercase tracking-wider bg-[#1a2333] border border-slate-700/50 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl transition-all shadow-inner flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-[#1a2333]"
              >
                {syncing ? <Loader2 size={14} className="animate-spin" /> : null}
                {syncing ? 'Sincronizando...' : 'Forçar Sinc. SGP'}
              </button>
              <button 
                onClick={() => fetch('/api/webhooks/freepbx/incoming', { method: 'POST' })}
                className="text-xs font-bold uppercase tracking-wider bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/20"
              >
                Simular Chamada FreePBX
              </button>
            </div>
          </div>

          {/* Configuração de Prompts IA */}
          <div className="bg-[#101726] rounded-3xl shadow-xl shadow-black/20 border border-slate-800/60 overflow-hidden flex flex-col relative">
            <div className="border-b border-slate-800/60 p-6 flex items-center gap-3 bg-[#0d1321] relative z-10">
              <Bot className="text-indigo-400" size={20} />
              <h2 className="text-lg font-bold text-white font-outfit">Tuning de IA (9router)</h2>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-6 relative z-10">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Prompt: Vertical de Suporte</label>
                <textarea 
                  className="w-full p-4 bg-[#1a2333] border border-slate-700/50 rounded-xl text-sm text-slate-300 h-32 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none shadow-inner leading-relaxed transition-all"
                  defaultValue="Você é um assistente técnico do {nome_provedor}. Tom: Empático, técnico mas acessível. Objetivo: Resolver o problema do cliente com base na base de conhecimento (BookStack). Regras: 1. Identifique o cliente. 2. Consulte o status da conexão. 3. Transborde se for problema físico."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-5 border-t border-slate-800/60 pt-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Modelo Primário</label>
                  <select className="w-full p-3 bg-[#1a2333] border border-slate-700/50 rounded-xl text-sm text-slate-300 outline-none shadow-inner focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all">
                    <option>gpt-4o-mini</option>
                    <option>gemini-3.8-flash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Gatilho de Transbordo (Sentimento)</label>
                  <select className="w-full p-3 bg-[#1a2333] border border-slate-700/50 rounded-xl text-sm text-slate-300 outline-none shadow-inner focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all">
                    <option>Agressivo / Insatisfeito</option>
                    <option>Apenas palavras-chave</option>
                  </select>
                </div>
              </div>

              <div className="mt-auto pt-6 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: any) {
  return (
    <div className="bg-[#101726] p-6 rounded-3xl border border-slate-800/60 shadow-xl shadow-black/20 flex items-start justify-between relative overflow-hidden group hover:border-indigo-500/30 transition-all">
      <div className="relative z-10">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-white font-outfit mb-1">{value}</h3>
        <p className="text-xs font-medium text-slate-400">{subtitle}</p>
      </div>
      <div className="w-14 h-14 bg-[#1a2333] rounded-2xl flex items-center justify-center border border-slate-700/50 shadow-inner group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all z-10">
        {icon}
      </div>
      <div className="absolute -right-6 -bottom-6 text-slate-800/20 rotate-12 scale-[2.5] group-hover:text-indigo-500/5 transition-colors duration-500">
        {icon}
      </div>
    </div>
  )
}

function IntegrationRow({ title, status, description, icon }: any) {
  const isOk = status === 'Conectado';
  return (
    <div className="flex items-start gap-4 p-4 border border-slate-700/50 rounded-xl hover:border-slate-600 bg-[#1a2333]/50 hover:bg-[#1a2333] transition-all group">
      <div className={`p-3 rounded-xl shadow-inner transition-colors ${isOk ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-white font-outfit text-sm">{title}</h4>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${isOk ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
