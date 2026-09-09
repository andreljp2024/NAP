import React, { useState } from 'react';
import { Database, MessageCircle, Server, Shield, Activity, Bot, Save, Loader2, Key, SlidersHorizontal, Building2, Palette } from 'lucide-react';

export default function SuperAdmin() {
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Formulário de Configuração do Provedor (White-label)
  const [providerConfig, setProviderConfig] = useState({
    nomeFantasia: "Provedor Exemplo Telecom",
    cnpj: "00.000.000/0001-00",
    corPrincipal: "#4f46e5",
    logoUrl: "https://via.placeholder.com/150",
  });

  // Formulário de Configuração de IA
  const [iaConfig, setIaConfig] = useState({
    promptSuporte: "Você é um assistente técnico do {nome_provedor}. Tom: Empático, técnico mas acessível. Objetivo: Resolver o problema do cliente com base na base de conhecimento (BookStack). Regras: 1. Identifique o cliente. 2. Consulte o status da conexão. 3. Transborde se for problema físico.",
    promptVendas: "Você é um consultor de vendas do {nome_provedor}. Tom: Persuasivo, energético e focado em benefícios. Objetivo: Qualificar o lead e ofertar planos de fibra óptica. Regras: 1. Sempre ofereça o dobro de velocidade se o cliente hesitar no preço.",
    modeloPrimario: "gemini-3.8-flash",
    temperatura: 0.7,
    gatilhoTransbordo: "agressivo"
  });

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 font-outfit mb-2">Painel Super Admin</h1>
          <p className="text-slate-600">Configurações globais do NAP (Núcleo de Atendimento ao Provedor).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Uso de IA (Tokens)" value="452.1K" subtitle="Este mês, via 9router" icon={<Activity className="text-blue-600" />} />
          <StatCard title="Clientes Sincronizados" value="12,450" subtitle="Último sync: há 10 min" icon={<Database className="text-emerald-600" />} />
          <StatCard title="Saúde do Sistema" value="100%" subtitle="Todos os serviços operantes" icon={<Server className="text-blue-600" />} />
        </div>

        {/* White-label / Provider Settings */}
        <div className="bg-white rounded-3xl shadow-md shadow-sm border border-slate-200 overflow-hidden flex flex-col relative mb-8">
          <div className="border-b border-slate-200 p-6 flex items-center justify-between bg-white relative z-10">
            <div className="flex items-center gap-3">
              <Building2 className="text-emerald-600" size={20} />
              <h2 className="text-lg font-bold text-slate-900 font-outfit">Identidade Visual e Dados do Provedor (White-label)</h2>
            </div>
            <span className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
              Isolamento de Tenant
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Infos Cadastrais */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-4">
                <Database size={16} className="text-emerald-600" />
                Informações Cadastrais
              </h3>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Nome Fantasia (Exibido aos clientes)</label>
                <input 
                  type="text" 
                  value={providerConfig.nomeFantasia} 
                  onChange={(e) => setProviderConfig({...providerConfig, nomeFantasia: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all shadow-inner" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">CNPJ</label>
                <input 
                  type="text" 
                  value={providerConfig.cnpj} 
                  onChange={(e) => setProviderConfig({...providerConfig, cnpj: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all shadow-inner" 
                />
              </div>
            </div>
            {/* Visual */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-4">
                <Palette size={16} className="text-blue-600" />
                Identidade Visual (Portal e Relatórios)
              </h3>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Cor Principal (HEX)</label>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg border border-slate-200 shadow-inner" style={{ backgroundColor: providerConfig.corPrincipal }}></div>
                  <input 
                    type="text" 
                    value={providerConfig.corPrincipal} 
                    onChange={(e) => setProviderConfig({...providerConfig, corPrincipal: e.target.value})}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all shadow-inner" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Logo URL (PNG/SVG)</label>
                <input 
                  type="text" 
                  value={providerConfig.logoUrl} 
                  onChange={(e) => setProviderConfig({...providerConfig, logoUrl: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all shadow-inner" 
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 border-t border-slate-200 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-700/20 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Aplicando...' : 'Aplicar Branding'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Integrações Ativas */}
          <div className="bg-white rounded-3xl shadow-md shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
            <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-white relative z-10">
               <h2 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
                 <Shield className="text-emerald-600" size={20} />
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
                description="Modelos configurados: gemini-3.8-flash (Suporte)."
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
            
            <div className="bg-white p-5 border-t border-slate-200 flex gap-3 justify-end relative z-10">
              <button 
                onClick={handleSync}
                disabled={syncing}
                className="text-xs font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl transition-all shadow-inner flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-slate-50"
              >
                {syncing ? <Loader2 size={14} className="animate-spin" /> : null}
                {syncing ? 'Sincronizando...' : 'Forçar Sinc. SGP'}
              </button>
              <button 
                onClick={() => fetch('/api/webhooks/freepbx/incoming', { method: 'POST' })}
                className="text-xs font-bold uppercase tracking-wider bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-200 text-emerald-600 hover:text-slate-900 px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/20"
              >
                Simular Chamada FreePBX
              </button>
            </div>
          </div>

          {/* Configuração de Prompts IA */}
          <div className="bg-white rounded-3xl shadow-md shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
            <div className="border-b border-slate-200 p-6 flex items-center gap-3 bg-white relative z-10">
              <Bot className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-slate-900 font-outfit">Tuning de IA (9router)</h2>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-6 relative z-10">
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Prompt: Vertical de Suporte</label>
                <textarea 
                  value={iaConfig.promptSuporte}
                  onChange={(e) => setIaConfig({...iaConfig, promptSuporte: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 h-28 focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 outline-none resize-none shadow-inner leading-relaxed transition-all"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Prompt: Vertical de Vendas</label>
                <textarea 
                  value={iaConfig.promptVendas}
                  onChange={(e) => setIaConfig({...iaConfig, promptVendas: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 h-24 focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 outline-none resize-none shadow-inner leading-relaxed transition-all"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-200 pt-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Modelo Primário</label>
                  <select 
                    value={iaConfig.modeloPrimario}
                    onChange={(e) => setIaConfig({...iaConfig, modeloPrimario: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none shadow-inner focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Recomendado)</option>
                    <option value="gemini-3.5-pro">gemini-3.5-pro (Avançado)</option>
                    <option value="gpt-4o-mini">gpt-4o-mini (Backup)</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <span>Criatividade (Temperatura)</span>
                    <span className="text-blue-600">{iaConfig.temperatura}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={iaConfig.temperatura}
                    onChange={(e) => setIaConfig({...iaConfig, temperatura: parseFloat(e.target.value)})}
                    className="w-full accent-blue-600 mt-2" 
                  />
                </div>
              </div>

              <div className="mt-auto pt-6 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* API Credentials Section */}
        <div className="bg-white rounded-3xl shadow-md shadow-sm border border-slate-200 overflow-hidden flex flex-col relative mb-8">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-3">
                <Key className="text-amber-600" size={20} />
                <h2 className="text-lg font-bold text-slate-900 font-outfit">Credenciais de API e Webhooks</h2>
              </div>
              <span className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                Ambiente de Produção
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* SGP App e Token */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-4">
                  <Database size={16} className="text-emerald-600" />
                  ERP SGP
                </h3>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">SGP Base URL</label>
                  <input type="text" defaultValue="https://api.sgp.provedor.com.br" disabled className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none shadow-inner opacity-80 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">App / Token</label>
                  <div className="flex gap-2">
                    <input type="text" defaultValue="NAP_APP_991" disabled className="w-1/3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none shadow-inner opacity-80 cursor-not-allowed" />
                    <input type="password" defaultValue="************************" disabled className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none shadow-inner opacity-80 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* WhatsApp e 9router */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-4">
                  <MessageCircle size={16} className="text-blue-600" />
                  Mensageria (WABA) e IA
                </h3>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">WhatsApp Business API Token</label>
                  <input type="password" defaultValue="EAAGm0P..." disabled className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none shadow-inner opacity-80 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Webhook Receptor (N8N / Typebot)</label>
                  <input type="text" defaultValue="https://n8n.provedor.com.br/webhook/nap" disabled className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none shadow-inner opacity-80 cursor-not-allowed" />
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
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-sm flex items-start justify-between relative overflow-hidden group hover:border-blue-200 transition-all">
      <div className="relative z-10">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 font-outfit mb-1">{value}</h3>
        <p className="text-xs font-medium text-slate-600">{subtitle}</p>
      </div>
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 shadow-inner group-hover:scale-110 group-hover:bg-blue-600/10 group-hover:border-blue-200 transition-all z-10">
        {icon}
      </div>
      <div className="absolute -right-6 -bottom-6 text-slate-800/20 rotate-12 scale-[2.5] group-hover:text-blue-600/5 transition-colors duration-500">
        {icon}
      </div>
    </div>
  )
}

function IntegrationRow({ title, status, description, icon }: any) {
  const isOk = status === 'Conectado';
  return (
    <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-600 bg-slate-50/50 hover:bg-slate-50 transition-all group">
      <div className={`p-3 rounded-xl shadow-inner transition-colors ${isOk ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200 group-hover:bg-amber-500/20'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-slate-900 font-outfit text-sm">{title}</h4>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${isOk ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : 'bg-amber-500/10 text-amber-600 border-amber-200'}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
