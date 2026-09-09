import React, { useState } from 'react';
import { Workflow, Webhook, Bot, Database, MessageCircle, Phone, GitFork, Play, Settings, Save, Plus, MoreHorizontal } from 'lucide-react';

export default function Automacoes() {
  const [activeFlow, setActiveFlow] = useState('Triagem Inteligente (WhatsApp)');

  const flows = [
    { id: 1, name: 'Triagem Inteligente (WhatsApp)', status: 'Ativo' },
    { id: 2, name: 'Cobrança PIX Vencimento', status: 'Ativo' },
    { id: 3, name: 'Pesquisa NPS (URA Reversa)', status: 'Pausado' },
  ];

  return (
    <div className="flex-1 flex h-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar - Lista de Fluxos */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-5 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
            <Workflow className="text-blue-600" size={20} />
            Motor Visual (n8n)
          </h2>
          <p className="text-xs text-slate-600 mt-1">Automação de processos via nós.</p>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {flows.map(flow => (
            <div 
              key={flow.id}
              onClick={() => setActiveFlow(flow.name)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activeFlow === flow.name 
                  ? 'bg-slate-50 border-blue-600/50 shadow-inner' 
                  : 'bg-transparent border-transparent hover:bg-slate-100/40 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className={`font-bold text-sm ${activeFlow === flow.name ? 'text-blue-600' : 'text-slate-600'}`}>
                  {flow.name}
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                flow.status === 'Ativo' 
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {flow.status}
              </span>
            </div>
          ))}
          
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-200 hover:border-blue-600 hover:bg-blue-600/5 text-slate-600 hover:text-blue-600 transition-colors text-sm font-bold">
            <Plus size={16} /> Novo Workflow
          </button>
        </div>
      </div>

      {/* Main Canvas (Mocking N8N interface) */}
      <div className="flex-1 flex flex-col relative bg-slate-50">
        
        {/* Canvas Header */}
        <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-slate-900 text-lg font-outfit">{activeFlow}</h1>
            <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono px-2 py-1 rounded">ID: wkf_982jh3</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
              <Settings size={18} />
            </button>
            <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-inner">
              <Play size={16} className="text-emerald-600" /> Executar Teste
            </button>
            <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-700/20">
              <Save size={16} /> Salvar e Ativar
            </button>
          </div>
        </div>

        {/* Node Graph Area */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center">
          
          <div className="relative w-full max-w-5xl h-[500px] flex items-center justify-between z-10 px-10">
            {/* SVG Lines connecting nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* WABA to Agent (Horizontal center) */}
              <path d="M 180 250 L 320 250" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Agent to Switch (Horizontal center) */}
              <path d="M 490 250 L 630 250" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Switch to SGP (Diagonal Up) */}
              <path d="M 800 240 C 850 240, 850 150, 880 150" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Switch to FreePBX (Diagonal Down) */}
              <path d="M 800 260 C 850 260, 850 350, 880 350" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Column 1: Trigger */}
            <div className="relative z-10">
              <NodeCard 
                icon={<Webhook className="text-emerald-600" size={20} />}
                title="Webhook WABA"
                subtitle="Gatilho WABA Oficial"
                type="trigger"
              />
            </div>

            {/* Column 2: Agent */}
            <div className="relative z-10">
              <NodeCard 
                icon={<Bot className="text-blue-600" size={20} />}
                title="Agente IA (9router)"
                subtitle="Análise de Intenção"
                type="action"
              />
            </div>

            {/* Column 3: Logic Router */}
            <div className="relative z-10">
              <NodeCard 
                icon={<GitFork className="text-amber-600" size={20} />}
                title="Roteador Lógico"
                subtitle="Regras de Transbordo"
                type="logic"
              />
            </div>

            {/* Column 4: Endpoints */}
            <div className="relative z-10 flex flex-col gap-20">
              <NodeCard 
                icon={<Database className="text-blue-400" size={20} />}
                title="Consultar SGP"
                subtitle="Busca Financeira (HTTP)"
                type="action"
              />
              <NodeCard 
                icon={<Phone className="text-red-400" size={20} />}
                title="Originar Chamada"
                subtitle="FreePBX AMI / AGI"
                type="action"
              />
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="absolute bottom-6 left-6 flex bg-white border border-slate-200 rounded-lg shadow-md z-20">
            <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900 border-r border-slate-200 transition-colors font-mono font-bold">-</button>
            <span className="px-4 py-1.5 text-slate-600 text-xs font-mono flex items-center">100%</span>
            <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900 border-l border-slate-200 transition-colors font-mono font-bold">+</button>
          </div>

          {/* Powered by N8N badge */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Powered by</span>
              <div className="flex items-center gap-1 font-bold text-slate-900 text-lg">
                <span className="text-orange-500">n8</span>n
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeCard({ icon, title, subtitle, type }: { icon: React.ReactNode, title: string, subtitle: string, type: 'trigger' | 'action' | 'logic' }) {
  return (
    <div className="w-[170px] bg-slate-50 border border-slate-200 rounded-xl shadow-md shadow-sm flex flex-col relative group hover:border-blue-600/50 transition-colors cursor-grab">
      {/* Input Port (Left) */}
      {type !== 'trigger' && (
        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-100 border-2 border-slate-500 rounded-full group-hover:border-blue-600 transition-colors"></div>
      )}
      
      {/* Output Port (Right) */}
      <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-slate-100 border-2 border-slate-500 rounded-full group-hover:border-blue-600 transition-colors"></div>

      <div className="p-3 flex items-start gap-3">
        <div className="mt-1 bg-white p-1.5 rounded-lg border border-slate-200 shadow-inner">
          {icon}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">{title}</p>
          <p className="text-[9px] text-slate-600 mt-0.5 truncate">{subtitle}</p>
        </div>
      </div>
      
      <div className={`h-1 w-full rounded-b-xl ${
        type === 'trigger' ? 'bg-emerald-500' : type === 'logic' ? 'bg-amber-500' : 'bg-blue-600'
      }`}></div>
    </div>
  )
}
