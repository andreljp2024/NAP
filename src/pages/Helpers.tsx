import React, { useState } from 'react';
import { BookOpen, Sparkles, Server, MessageSquare, PhoneCall, LayoutDashboard, Database, ShieldCheck, Zap, Cog } from 'lucide-react';

const sections = [
  {
    id: 'visao-geral',
    title: 'Visão Geral do NAP',
    icon: <LayoutDashboard size={18} />,
    content: (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Núcleo de Atendimento ao Provedor (NAP)</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          O NAP é uma plataforma SaaS Omnichannel dedicada a provedores de internet (ISPs). Ele integra num único ecossistema o atendimento via WhatsApp (WABA) e Webchat, telefonia Asterisk/FreePBX e automações profundas com o sistema de gestão (ERP SGP) e roteadores de borda (MikroTik/BNG).
        </p>
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-4">
          <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
            <Sparkles size={16} /> Arquitetura de IA
          </h3>
          <p className="text-xs text-blue-100/70 leading-relaxed">
            A plataforma conta com um Cérebro Baseado em Gemini 2.5 rodando no servidor Node.js. A IA orquestra o atendimento de auto-serviço e auxilia os operadores humanos gerando análises de sentimentos e transcrição em tempo real de voz.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'inbox-omni',
    title: 'Inbox Omnichannel',
    icon: <MessageSquare size={18} />,
    content: (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Caixa de Entrada (Inbox) & Ações SGP</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Zap size={16} className="text-emerald-500" /> PIX Automático no Chat
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Durante o atendimento, clique no atalho do PIX para gerar uma linha digitável instantânea. O sistema fará um POST na rota <code>/api/sgp/pix/:id</code> conectando diretamente no seu ERP.
            </p>
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80" alt="Exemplo" className="h-32 object-cover rounded-lg border border-white/10 opacity-70" />
          </div>

          <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-500" /> Desbloqueio em Confiança (48h)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Para clientes em atraso e sem sinal, o botão de Desbloqueio em Confiança envia um webhook para o SGP alterar o status financeiro e um comando automático para o MikroTik, liberando a conexão temporariamente.
            </p>
          </div>

          <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Server size={16} className="text-red-500" /> Kick Radius (Reiniciar ONU)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Caso o assinante esteja travado no concentrador PPPoE, esta ferramenta envia um pacote PoD (Packet of Disconnect - porta 3799) forçando a queda da sessão no NAS e reconexão imediata.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'telefonia',
    title: 'Telefonia & Webphone',
    icon: <PhoneCall size={18} />,
    content: (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Webphone SIP e Análise de Voz</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          O PABX Cloud (Asterisk) está integrado nativamente. O operador pode realizar e receber chamadas no próprio navegador (WebRTC).
        </p>

        <div className="p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl">
          <h3 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
            <Sparkles size={16} /> Inteligência Artificial na Ligação
          </h3>
          <p className="text-xs text-indigo-200/70 leading-relaxed">
            Durante a ligação, o streaming de áudio é enviado à rota <code>/api/gemini/voice/analyze</code>. A IA faz:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Transcrição Speech-to-Text ao vivo.</li>
              <li>Análise de Sentimento (Frustrado, Positivo, Neutro).</li>
              <li>Recomendações e Script dinâmico em tempo real para o Operador.</li>
            </ul>
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'configuracoes',
    title: 'Configurações de Integração',
    icon: <Cog size={18} />,
    content: (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Parametrizações do SGP (Super Admin)</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          No menu <strong>Super Admin</strong>, você cadastra a URL Base, App ID e Token Secreto da API do SGP.
        </p>

        <div className="bg-[#0b0f19] border border-white/5 rounded-xl overflow-hidden mt-4">
          <div className="p-3 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fallback Automático (Mock Mode)</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Caso as chaves do SGP estejam incorretas, vazias, ou a rede do provedor esteja fora do ar, o backend Node.js (<code>server.ts</code>) aciona nativamente um <strong>Mock Database In-Memory</strong> para garantir que a plataforma (Dashboard, Kanban, Caixa de Entrada) continue 100% operacional para demonstração e testes, sem quebrar as interfaces (Fallback inteligente).
            </p>
          </div>
        </div>
      </div>
    )
  }
];

export default function Helpers() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  const activeContent = sections.find(s => s.id === activeSection);

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex bg-[#06080e] p-6 gap-6">
      
      {/* Menu Lateral de Navegação (Knowledge Base) */}
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <div className="px-2 mb-4">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-500" />
            Base de Ajuda
          </h1>
          <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Módulos e Procedimentos</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeSection === section.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className={`${activeSection === section.id ? 'text-emerald-400' : 'text-slate-500'}`}>
                {section.icon}
              </div>
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Área de Conteúdo */}
      <div className="flex-1 bg-[#101726] border border-white/5 rounded-3xl overflow-y-auto custom-scrollbar relative">
        {/* Header Decorativo */}
        <div className="h-32 bg-gradient-to-br from-emerald-900/30 to-blue-900/10 border-b border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
           <div className="absolute bottom-6 left-8 flex items-center gap-3">
             <div className="w-12 h-12 bg-[#0b0f19] border border-white/10 rounded-xl flex items-center justify-center text-emerald-400">
               {activeContent?.icon}
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white">{activeContent?.title}</h2>
               <p className="text-xs font-medium text-emerald-400 mt-1 uppercase tracking-widest">Documentação Oficial</p>
             </div>
           </div>
        </div>
        
        {/* Corpo do Conteúdo */}
        <div className="p-8 max-w-4xl">
          {activeContent?.content}
        </div>
      </div>

    </div>
  );
}
