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
    <div className="flex-1 flex h-full bg-[#0b0f19] overflow-hidden">
      
      {/* Sidebar - Lista de Fluxos */}
      <div className="w-72 bg-[#101726] border-r border-slate-800/60 flex flex-col z-20">
        <div className="p-5 border-b border-slate-800/60 bg-[#0d1321]">
          <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <Workflow className="text-indigo-400" size={20} />
            Motor Visual (n8n)
          </h2>
          <p className="text-xs text-slate-400 mt-1">Automação de processos via nós.</p>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {flows.map(flow => (
            <div 
              key={flow.id}
              onClick={() => setActiveFlow(flow.name)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activeFlow === flow.name 
                  ? 'bg-[#1a2333] border-indigo-500/50 shadow-inner' 
                  : 'bg-transparent border-transparent hover:bg-slate-800/40 hover:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className={`font-bold text-sm ${activeFlow === flow.name ? 'text-indigo-300' : 'text-slate-300'}`}>
                  {flow.name}
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                flow.status === 'Ativo' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {flow.status}
              </span>
            </div>
          ))}
          
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5 text-slate-400 hover:text-indigo-400 transition-colors text-sm font-bold">
            <Plus size={16} /> Novo Workflow
          </button>
        </div>
      </div>

      {/* Main Canvas (Mocking N8N interface) */}
      <div className="flex-1 flex flex-col relative bg-[#0b0f19]">
        
        {/* Canvas Header */}
        <div className="h-16 border-b border-slate-800/60 bg-[#101726]/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-white text-lg font-outfit">{activeFlow}</h1>
            <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono px-2 py-1 rounded">ID: wkf_982jh3</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={18} />
            </button>
            <button className="flex items-center gap-2 bg-[#1a2333] hover:bg-slate-800 border border-slate-700/50 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-inner">
              <Play size={16} className="text-emerald-400" /> Executar Teste
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
              <Save size={16} /> Salvar e Ativar
            </button>
          </div>
        </div>

        {/* Node Graph Area */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
          
          {/* SVG Lines connecting nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* WABA to Agent */}
            <path d="M 220 200 C 270 200, 300 200, 350 200" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {/* Agent to Switch */}
            <path d="M 550 200 C 600 200, 630 200, 680 200" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {/* Switch to SGP (Top) */}
            <path d="M 880 180 C 930 180, 930 100, 980 100" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            {/* Switch to FreePBX (Bottom) */}
            <path d="M 880 220 C 930 220, 930 300, 980 300" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          </svg>

          {/* Nodes Container */}
          <div className="absolute inset-0 p-8 z-10 overflow-auto">
            
            {/* Node 1: Webhook */}
            <div className="absolute top-[160px] left-[50px]">
              <NodeCard 
                icon={<Webhook className="text-emerald-400" size={20} />}
                title="Webhook WABA"
                subtitle="Gatilho WABA Oficial"
                type="trigger"
              />
            </div>

            {/* Node 2: IA Agent */}
            <div className="absolute top-[160px] left-[350px]">
              <NodeCard 
                icon={<Bot className="text-indigo-400" size={20} />}
                title="Agente IA (9router)"
                subtitle="Análise de Intenção"
                type="action"
              />
            </div>

            {/* Node 3: Switch/Router */}
            <div className="absolute top-[160px] left-[680px]">
              <NodeCard 
                icon={<GitFork className="text-amber-400" size={20} />}
                title="Roteador Lógico"
                subtitle="Regras de Transbordo"
                type="logic"
              />
            </div>

            {/* Node 4: SGP Integration */}
            <div className="absolute top-[60px] left-[980px]">
              <NodeCard 
                icon={<Database className="text-blue-400" size={20} />}
                title="Consultar SGP"
                subtitle="Busca Financeira (HTTP)"
                type="action"
              />
            </div>

            {/* Node 5: FreePBX Call */}
            <div className="absolute top-[260px] left-[980px]">
              <NodeCard 
                icon={<Phone className="text-red-400" size={20} />}
                title="Originar Chamada"
                subtitle="FreePBX AMI / AGI"
                type="action"
              />
            </div>

          </div>
          
          {/* Zoom Controls */}
          <div className="absolute bottom-6 left-6 flex bg-[#101726] border border-slate-800 rounded-lg shadow-xl z-20">
            <button className="px-3 py-1.5 text-slate-400 hover:text-white border-r border-slate-800 transition-colors font-mono font-bold">-</button>
            <span className="px-4 py-1.5 text-slate-300 text-xs font-mono flex items-center">100%</span>
            <button className="px-3 py-1.5 text-slate-400 hover:text-white border-l border-slate-800 transition-colors font-mono font-bold">+</button>
          </div>

          {/* Powered by N8N badge */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="bg-[#101726]/80 backdrop-blur-md border border-slate-800/60 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Powered by</span>
              <div className="flex items-center gap-1 font-bold text-white text-lg">
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
    <div className="w-[170px] bg-[#1a2333] border border-slate-700/50 rounded-xl shadow-xl shadow-black/40 flex flex-col relative group hover:border-indigo-500/50 transition-colors cursor-grab">
      {/* Input Port (Left) */}
      {type !== 'trigger' && (
        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-800 border-2 border-slate-500 rounded-full group-hover:border-indigo-400 transition-colors"></div>
      )}
      
      {/* Output Port (Right) */}
      <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-slate-800 border-2 border-slate-500 rounded-full group-hover:border-indigo-400 transition-colors"></div>

      <div className="p-3 flex items-start gap-3">
        <div className="mt-1 bg-[#101726] p-1.5 rounded-lg border border-slate-800/60 shadow-inner">
          {icon}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[11px] font-bold text-white leading-tight truncate">{title}</p>
          <p className="text-[9px] text-slate-400 mt-0.5 truncate">{subtitle}</p>
        </div>
      </div>
      
      <div className={`h-1 w-full rounded-b-xl ${
        type === 'trigger' ? 'bg-emerald-500' : type === 'logic' ? 'bg-amber-500' : 'bg-indigo-500'
      }`}></div>
    </div>
  )
}
