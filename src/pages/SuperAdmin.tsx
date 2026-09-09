import React from 'react';
import { Database, MessageCircle, Server, Shield, Activity, Bot, Save } from 'lucide-react';

export default function SuperAdmin() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Painel Super Admin</h1>
          <p className="text-slate-600">Configurações globais do NAP (Núcleo de Atendimento ao Provedor).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Uso de IA (Tokens)" value="452.1K" subtitle="Este mês, via 9router" icon={<Activity className="text-blue-500" />} />
          <StatCard title="Clientes Sincronizados" value="12,450" subtitle="Último sync: há 10 min" icon={<Database className="text-emerald-500" />} />
          <StatCard title="Saúde do Sistema" value="100%" subtitle="Todos os serviços operantes" icon={<Server className="text-indigo-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Integrações Ativas */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 p-5 flex justify-between items-center bg-slate-50">
               <h2 className="text-lg font-bold text-slate-900">Integrações Ativas</h2>
               <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Forçar Sincronização SGP</button>
            </div>
            <div className="p-5 grid gap-4">
              <IntegrationRow 
                title="SGP (Sistema de Gestão)" 
                status="Conectado"
                description="Sincronização em 3 camadas ativa. Leitura de contratos e financeiro."
                icon={<Database />}
              />
              <IntegrationRow 
                title="9router (Gateway IA)" 
                status="Conectado"
                description="Modelos configurados: gpt-4o-mini (Suporte), claude-3-5-sonnet (Backup)."
                icon={<Activity />}
              />
              <IntegrationRow 
                title="WhatsApp Oficial" 
                status="Conectado"
                description="Phone Number ID conectado. Templates aprovados: 12."
                icon={<MessageCircle />}
              />
              <IntegrationRow 
                title="FreePBX (AVA)" 
                status="Aviso"
                description="Falha no último ping do AMI na porta 5038."
                icon={<Server />}
              />
            </div>
          </div>

          {/* Configuração de Prompts IA */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="border-b border-slate-200 p-5 flex items-center gap-3 bg-slate-50">
              <Bot className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Tuning de IA (9router)</h2>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Prompt: Vertical de Suporte</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600 h-28 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  defaultValue="Você é um assistente técnico do {nome_provedor}. Tom: Empático, técnico mas acessível. Objetivo: Resolver o problema do cliente com base na base de conhecimento (BookStack). Regras: 1. Identifique o cliente. 2. Consulte o status da conexão. 3. Transborde se for problema físico."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Modelo Primário</label>
                  <select className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none">
                    <option>gpt-4o-mini</option>
                    <option>gemini-3.8-flash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gatilho de Transbordo (Sentimento)</label>
                  <select className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none">
                    <option>Agressivo / Insatisfeito</option>
                    <option>Apenas palavras-chave</option>
                  </select>
                </div>
              </div>

              <div className="mt-auto pt-4 flex justify-end">
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Save size={16} /> Salvar Configurações
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
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
        {icon}
      </div>
    </div>
  )
}

function IntegrationRow({ title, status, description, icon }: any) {
  const isOk = status === 'Conectado';
  return (
    <div className="flex items-start gap-4 p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
      <div className={`p-3 rounded-md ${isOk ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOk ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
    </div>
  )
}
