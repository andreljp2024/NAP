import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Sparkles, Server, MessageSquare, PhoneCall, 
  LayoutDashboard, Database, ShieldCheck, Zap, Cog, 
  Wifi, Smartphone, Radio, Search, Check, Copy, 
  AlertTriangle, ExternalLink, Activity, Users, 
  MapPin, HardDrive, RefreshCw, FileText, ChevronRight, 
  HelpCircle, Wrench, Shield, CheckCircle2, ClipboardCheck,
  CheckSquare, ArrowRight, ShieldAlert, PieChart, Terminal, Globe, Lock,
  ListChecks, Clock, KeyRound, Filter, Megaphone
} from 'lucide-react';
import ChecklistHomologacao from '../components/ChecklistHomologacao';

interface HelpSection {
  id: string;
  category: 'core' | 'erp' | 'atendimento' | 'portal' | 'rede' | 'campo' | 'seguranca' | 'homologacao';
  title: string;
  badge: string;
  icon: React.ReactNode;
  tags: string[];
  summary: string;
  content: React.ReactNode;
}

export default function Helpers() {
  const [activeSectionId, setActiveSectionId] = useState<string>('pendencias-homologacao');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const categories = [
    { id: 'todos', label: 'Todos os Módulos' },
    { id: 'homologacao', label: 'Pendências & Homologação' },
    { id: 'core', label: 'Visão & Core' },
    { id: 'erp', label: 'Multi-ERP & APIs' },
    { id: 'atendimento', label: 'Inbox & IA' },
    { id: 'portal', label: 'Portal do Assinante' },
    { id: 'rede', label: 'TR-069 & Wi-Fi' },
    { id: 'campo', label: 'Técnico de Campo' },
    { id: 'seguranca', label: 'Auditoria & LGPD' }
  ];

  const sections: HelpSection[] = useMemo(() => [
    {
      id: 'pendencias-homologacao',
      category: 'homologacao',
      title: 'Checklist & Pendências de Homologação (Staging / UAT)',
      badge: 'Roteiro de Homologação',
      icon: <ClipboardCheck size={18} className="text-emerald-400" />,
      tags: ['homologacao', 'staging', 'uat', 'pendencias', 'checklist', 'producao', 'testes', 'deploy', 'provedor', 'vps'],
      summary: 'Matriz técnica consolidada de pendências técnicas, de segurança e de documentação com progresso visual para o lançamento oficial.',
      content: <ChecklistHomologacao />
    },
    {
      id: 'visao-geral',
      category: 'core',
      title: 'Visão Geral & Arquitetura do NAP',
      badge: 'Arquitetura Core',
      icon: <LayoutDashboard size={18} />,
      tags: ['arquitetura', 'full-stack', 'express', 'react', 'soberania', 'vps', 'gemini', 'mock'],
      summary: 'Estrutura técnica e propósito do Núcleo de Atendimento ao Provedor (NAP) para ISPs.',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Núcleo de Atendimento ao Provedor (NAP)</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              O <strong>NAP</strong> é uma plataforma SaaS Omnichannel de missão crítica desenvolvida sob medida para <strong>Provedores de Internet (ISPs)</strong>. Projetado para rodar em uma VM/VPS Debian 12 dedicada por provedor, o NAP garante isolamento completo dos dados cadastrais, financeiros e de telefonia do assinante.
            </p>
          </div>

          {/* Grid de Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <Server size={16} /> Soberania & Isolamento
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada ISP opera em container/VM isolada. Chaves de API, credenciais de ERP e troncos SIP Asterisk não são compartilhados com outros clientes.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Sparkles size={16} /> Cérebro Gemini 2.5
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Orquestração nativa via SDK do Google GenAI executada em rotas protegidas no servidor Node.js (`server.ts`), operando como Copiloto e Triagem autônoma.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck size={16} /> Fallback Mock Resiliente
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Caso a rede externa ou ERP caia temporariamente, a camada in-memory mantém o painel funcional sem travar a interface do operador ou assinante.
              </p>
            </div>
          </div>

          {/* Especificações de Portas e Infraestrutura */}
          <div className="p-5 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity size={14} className="text-blue-400" /> Mapa de Portas e Serviços
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Porta 3000</span>
                <span className="text-white font-bold">NAP Web / API</span>
                <span className="text-slate-500 text-[10px] block mt-1">Nginx Reverse Proxy</span>
              </div>
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Porta 7557</span>
                <span className="text-emerald-400 font-bold">GenieACS TR-069</span>
                <span className="text-slate-500 text-[10px] block mt-1">NBI / CWMP API</span>
              </div>
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Porta 5060 / 8089</span>
                <span className="text-indigo-400 font-bold">Asterisk SIP / WSS</span>
                <span className="text-slate-500 text-[10px] block mt-1">WebRTC Webphone</span>
              </div>
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Porta 3799</span>
                <span className="text-amber-400 font-bold">Radius PoD / CoA</span>
                <span className="text-slate-500 text-[10px] block mt-1">Kick MikroTik / BNG</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'multi-erp',
      category: 'erp',
      title: 'Multi-ERP: IXC Soft, Hubsoft, MikWeb & SGP',
      badge: 'Integrações Homologadas',
      icon: <Database size={18} />,
      tags: ['erp', 'ixc', 'hubsoft', 'mikweb', 'sgp', 'mksolutions', 'ispfy', 'radiusnet', 'ping', 'latencia', 'api', 'token'],
      summary: 'Catálogo de conectores, validador de handshake em tempo real e monitor de latência (ping).',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Conectores de Gestão Telecom (Multi-ERP)</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              O NAP possui uma camada de abstração com suporte aos principais sistemas de gestão do mercado telecom brasileiro. Você pode alternar o ERP ativo com um único clique em <strong>Configurações &gt; Conectores ERP</strong>.
            </p>
          </div>

          {/* Cards dos 3 Principais ERPs Homologados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#0b0f19] border border-blue-500/20 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-lg bg-blue-600/20 text-blue-400 font-black text-xs font-mono">IXC</span>
                <span className="text-[10px] text-emerald-400 font-mono">REST v1</span>
              </div>
              <h3 className="text-sm font-bold text-white">IXC Soft (IXC Provedor)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consome o Webservice REST v1 em formato JSON. Necessita permissões em <code>cliente</code>, <code>radusuarios</code> e <code>fn_areceber</code>.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500 font-mono">
                Endpoint: /webservice/v1
              </div>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-cyan-500/20 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-lg bg-cyan-600/20 text-cyan-400 font-black text-xs font-mono">HUB</span>
                <span className="text-[10px] text-emerald-400 font-mono">REST v1/v2</span>
              </div>
              <h3 className="text-sm font-bold text-white">Hubsoft Telecom</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integração via Bearer Token / Client Secret. Permite sincronização em tempo real de contratos, emissão de PIX dinâmico e auto-desbloqueio.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500 font-mono">
                Endpoint: /api/v1
              </div>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-rose-500/20 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-lg bg-rose-600/20 text-rose-400 font-black text-xs font-mono">MIK</span>
                <span className="text-[10px] text-emerald-400 font-mono">API v1.2</span>
              </div>
              <h3 className="text-sm font-bold text-white">MikWeb</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conexão em nuvem especializada em concentradores MikroTik, sincronizando bloqueios de acesso e liberação de confiança imediata.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500 font-mono">
                Endpoint: /v1
              </div>
            </div>
          </div>

          {/* Validador de API & Indicador de Ping */}
          <div className="p-5 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap size={16} className="text-amber-400" /> Como Utilizar o Validador de API e Indicador de Latência (Ping)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O NAP inclui um <strong>Validador em Tempo Real</strong> na aba de ERP para testar a comunicação antes de colocar a integração em produção:
            </p>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Acesse <strong>Configurações &gt; Integrações ERP</strong> e clique na aba <em>"Validador de API"</em>.</li>
              <li>Selecione o provedor desejado (IXC, Hubsoft ou MikWeb).</li>
              <li>Preencha a <strong>URL Base</strong> e o <strong>Token de API</strong> (ou utilize o botão <em>"Dados Homologados"</em> para testar o simulador).</li>
              <li>Clique em <strong>"Testar Conexão"</strong> para executar a bateria de 5 verificações: Handshake TLS, Autenticação, Leitura de Contratos, PIX e Desbloqueio 48h.</li>
              <li>Observe o <strong>Badge de Ping</strong> que avalia a latência em milissegundos e qualidade de sinal (Excelente &lt;60ms, Estável &lt;150ms).</li>
              <li>Clique em <strong>"Salvar e Ativar"</strong> para definir o ERP como fonte de verdade ativa no NAP.</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'inbox-triagem-ia',
      category: 'atendimento',
      title: 'Inbox Omnichannel & Triagem IA (Gemini 2.5)',
      badge: 'Atendimento & Copiloto',
      icon: <MessageSquare size={18} />,
      tags: ['inbox', 'whatsapp', 'waba', 'webchat', 'gemini', 'ia', 'triagem', 'sentimento', 'pix', 'desbloqueio', 'copiloto'],
      summary: 'Centralização de WhatsApp WABA e Webchat, respostas com IA, PIX e desbloqueio 48h no chat.',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Inbox Omnichannel & Triagem com Cérebro IA</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              O Inbox unifica mensagens vindas do <strong>WhatsApp Cloud API (WABA)</strong> oficial da Meta e do <strong>Webchat do Portal do Assinante</strong> em uma única interface em tempo real, sem necessidade de alternar entre abas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Modo Triagem IA & Copiloto
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mensagens que entram na fila de <code>Triagem IA</code> são analisadas pelo <strong>Gemini 2.5 Flash</strong>. O modelo consulta automaticamente os dados cadastrais do cliente no ERP ativo e a telemetria da ONU no GenieACS:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Detecta a intenção (2ª via, suporte técnico, alteração de plano, lentidão).</li>
                <li>Mede o <strong>Sentimento do Cliente</strong> (Positivo, Neutro ou Frustrado).</li>
                <li>Sugere respostas prontas e resumos da conversa para o operador.</li>
              </ul>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Zap size={14} /> Ações Rápidas no Atendimento
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O operador conta com botões de disparo com 1 clique diretamente na caixa de composição do chat:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#06080e] border border-white/5 flex items-center gap-2">
                  <Zap size={14} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white">Gerar Chave PIX:</strong>
                    <span className="text-slate-400 block text-[11px]">Gera payload Copia-e-Cola e QR Code dinâmico da fatura aberta.</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#06080e] border border-white/5 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-white">Desbloqueio em Confiança (48h):</strong>
                    <span className="text-slate-400 block text-[11px]">Envia webhook para o ERP e comando ao MikroTik liberando o acesso.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Handoff Humano-IA */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
            <h3 className="text-xs font-bold text-blue-300 flex items-center gap-2">
              <Users size={16} /> Regra de Handoff (Transferência Humana Inteligente)
            </h3>
            <p className="text-xs text-blue-100/70 leading-relaxed">
              Se o cliente solicitar falar com um atendente ou se o algoritmo de sentimento detectar índice severo de frustração, o atendimento sai do modo automático e é movido instantaneamente para a fila humana do <strong>Kanban de Suporte</strong>, notificando a equipe.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'portal-pwa',
      category: 'portal',
      title: 'Portal do Assinante PWA (Autoatendimento)',
      badge: 'Autoatendimento Mobile',
      icon: <Smartphone size={18} />,
      tags: ['portal', 'pwa', 'cliente', 'faturas', 'pix', 'wifi', 'senha', 'tr069', 'webphone', 'webchat'],
      summary: 'Aplicativo mobile-first para o assinante gerenciar faturas, alterar Wi-Fi e acionar suporte.',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Portal do Cliente PWA (`/portal`)</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              O Portal do Assinante funciona como um <strong>Progressive Web App (PWA)</strong> instalável diretamente na tela inicial do celular do cliente (Android e iOS) sem necessidade de publicação prévia em lojas de aplicativos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Zap size={14} /> 2ª Via de Fatura & PIX Dinâmico
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O cliente visualiza o histórico financeiro, data de vencimento e valor. Pode copiar o código PIX Copia-e-Cola com 1 clique para colar no aplicativo do seu banco, com compensação em tempo real via webhook.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Wifi size={14} /> Gestão da Rede Wi-Fi (TR-069)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permite ao cliente alterar o nome da rede (SSID) e a senha do Wi-Fi residencial sem precisar de visita técnica. Inclui medidor de segurança da senha e geração de QR Code para conexão instantânea de convidados.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <PhoneCall size={14} /> Webphone WebRTC Direto no App
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O assinante pode originar uma chamada telefônica gratuita diretamente pelo navegador com a central de suporte do provedor, trafegando via WebSockets (WSS) com o Asterisk.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <RefreshCw size={14} /> Reinício Remoto de Roteador
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O próprio assinante pode solicitar o reinício do equipamento caso sinta lentidão. O portal dispara um comando <code>Reboot</code> via GenieACS, reduzindo aberturas de chamados em até 40%.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'telefonia-ia',
      category: 'atendimento',
      title: 'Telefonia Asterisk/FreePBX & Webphone com IA',
      badge: 'Voz & WebRTC',
      icon: <PhoneCall size={18} />,
      tags: ['telefonia', 'asterisk', 'freepbx', 'webrtc', 'webphone', 'cti', 'transcricao', 'stt', 'voz'],
      summary: 'PABX Cloud integrado, Webphone WebRTC no navegador, pop-up CTI reverso e análise de voz ao vivo.',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Telefonia Asterisk & Webphone WebRTC com IA</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              O NAP se conecta diretamente à central telefônica <strong>Asterisk / FreePBX</strong> via SIP, WebSockets seguros (WSS) e AMI (Asterisk Manager Interface).
            </p>
          </div>

          <div className="p-5 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Sparkles size={16} /> Como Funciona a Inteligência na Ligação (Audio Streaming)
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                Durante a chamada recebida no Webphone, o fluxo de áudio é transmitido em tempo real para o endpoint <code>/api/gemini/voice/analyze</code>:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li><strong>Transcrição Speech-to-Text ao vivo:</strong> O atendente visualiza na tela a fala do cliente transcrita em texto em tempo real.</li>
                <li><strong>Detecção de Sentimento do Cliente:</strong> Avaliação contínua do humor da voz (Calmo, Indeciso, Estressado ou Frustrado).</li>
                <li><strong>Script Tático Dinâmico:</strong> A IA sugere na tela do operador respostas pontuais para contornar objeções ou resolver problemas técnicos na hora.</li>
                <li><strong>Resumo Automático de Protocolo:</strong> Ao desligar, a IA gera a ata da ligação pronta para ser gravada no histórico do cliente.</li>
              </ul>
            </div>
          </div>

          {/* CTI Reverso */}
          <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Activity size={16} /> Pop-up de CTI Reverso
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assim que o assinante liga, o FreePBX envia um evento AMI com o número de telefone de origem (CallerID). O NAP consulta a base cadastral do ERP e abre automaticamente a <strong>Ficha CRM 360</strong> do cliente na tela do operador antes mesmo de ele atender o ramal.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'tecnico-campo',
      category: 'campo',
      title: 'Técnico de Campo (PWA) & Rastreamento GPS',
      badge: 'Operação de Campo',
      icon: <MapPin size={18} />,
      tags: ['campo', 'tecnico', 'os', 'gps', 'radar', 'foto', 'assinatura', 'canvas', 'ordem', 'servico'],
      summary: 'Módulo mobile-first para técnicos na rua, GPS contínuo, diagnóstico óptico e assinatura na tela.',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Módulo Técnico de Campo Mobile-First (`/admin/campo`)</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Dedicado aos técnicos de rua para execução de Ordens de Serviço (Instalações, Manutenções, Reparo de Fibra e Recolhimento de Equipamentos).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <MapPin size={16} /> Telemetria GPS em Tempo Real
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ao iniciar o expediente, o PWA transmite coordenadas de latitude e longitude em tempo real ao endpoint <code>/api/usuarios/localizacao</code>, plotando o técnico no <strong>Radar de Campo</strong> do NOC.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <Activity size={16} /> Diagnóstico Óptico TR-069 in loco
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                O técnico consulta diretamente a potência óptica RX da ONU recém-instalada, recebendo sinalização clara se o sinal está na faixa recomendada (ideal entre -18 dBm e -24 dBm).
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Smartphone size={16} /> Foto da Instalação & CTO
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captura fotográfica nativa via câmera do celular para registrar o conector na CTO do poste e a ONU ligada na residência antes de dar baixa na OS.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 size={16} /> Assinatura Digital no Canvas
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                O cliente assina a conclusão do serviço na tela do celular do técnico com o dedo ou caneta stylus, gravando o termo digital no histórico do ERP.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'genieacs-tr069',
      category: 'rede',
      title: 'GenieACS & Telemetria Óptica de CPEs (TR-069)',
      badge: 'Engenharia de Rede',
      icon: <Wifi size={18} />,
      tags: ['genieacs', 'tr069', 'cpe', 'onu', 'potencia', 'rx', 'tx', 'sinal', 'reboot', 'cwmp'],
      summary: 'Monitoramento remoto de ONUs e roteadores residenciais via protocolo TR-069.',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Telemetria CPE via TR-069 (GenieACS)</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              O módulo <strong>GenieACS</strong> do NAP conecta-se à API NBI (Northbound Interface) do servidor GenieACS na porta <code>7557</code> para diagnosticar remotamente os parâmetros físicos do equipamento do cliente.
            </p>
          </div>

          <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Parâmetros Monitorados em Tempo Real:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Potência Óptica RX</span>
                <span className="text-emerald-400 font-mono font-bold">-21.4 dBm</span>
                <span className="text-slate-500 text-[10px] block mt-1">Normal (-18 a -24 dBm)</span>
              </div>
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Potência Óptica TX</span>
                <span className="text-blue-400 font-mono font-bold">+2.1 dBm</span>
                <span className="text-slate-500 text-[10px] block mt-1">Dentro dos parâmetros</span>
              </div>
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Temperatura do Laser</span>
                <span className="text-amber-400 font-mono font-bold">44.2 °C</span>
                <span className="text-slate-500 text-[10px] block mt-1">Faixa operacional segura</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'seguranca-rbac-backup',
      category: 'seguranca',
      title: 'Hierarquia de Usuários (RBAC) & Backup',
      badge: 'Controle & Auditoria',
      icon: <Shield size={18} />,
      tags: ['usuarios', 'rbac', 'permissoes', 'backup', 'restore', 'disaster', 'recovery', 'seguranca'],
      summary: 'Perfis de acesso estritos em 4 níveis e rotinas de backup e restauração de dados.',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Hierarquia RBAC & Recuperação de Desastres</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              O controle de acesso ao NAP é governado por uma matriz rígida de 4 perfis de usuários com restrições por rota e visibilidade de dados.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Níveis de Acesso:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#0b0f19] border border-white/5 rounded-xl space-y-1">
                <span className="text-indigo-400 font-bold font-mono">1. Admin Geral (Super Admin)</span>
                <p className="text-slate-400">Acesso irrestrito a configurações, parametrização de ERP, Disaster Recovery, gestão de planos e usuários.</p>
              </div>
              <div className="p-3.5 bg-[#0b0f19] border border-white/5 rounded-xl space-y-1">
                <span className="text-blue-400 font-bold font-mono">2. Operador de Atendimento</span>
                <p className="text-slate-400">Acesso ao Inbox Omnichannel, Kanban de Suporte/Vendas/Cobrança, Webphone e consulta à Ficha 360 do assinante.</p>
              </div>
              <div className="p-3.5 bg-[#0b0f19] border border-white/5 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold font-mono">3. Técnico NOC (N1/N2)</span>
                <p className="text-slate-400">Acesso a telemetria GenieACS, dashboard de rede, ferramentas de ping/tracert e suporte técnico avançado.</p>
              </div>
              <div className="p-3.5 bg-[#0b0f19] border border-white/5 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold font-mono">4. Técnico de Campo</span>
                <p className="text-slate-400">Acesso exclusivo ao módulo mobile-first de Ordens de Serviço (`/admin/campo`) com rastreamento GPS.</p>
              </div>
            </div>
          </div>

          {/* Backup e Restauração */}
          <div className="p-5 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <HardDrive size={16} /> Rotinas de Backup (Disaster Recovery)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O sistema disponibiliza rotas automáticas e manuais para geração de snapshots:
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 font-mono text-xs">
              <div className="p-2.5 bg-[#06080e] border border-white/10 rounded-xl flex-1 text-slate-300 flex items-center justify-between">
                <span>GET /api/backup</span>
                <span className="text-[10px] text-slate-500">Download snapshot JSON</span>
              </div>
              <div className="p-2.5 bg-[#06080e] border border-white/10 rounded-xl flex-1 text-slate-300 flex items-center justify-between">
                <span>POST /api/restore</span>
                <span className="text-[10px] text-slate-500">Upload e importação de base</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'auditoria-lgpd',
      category: 'seguranca',
      title: 'Auditoria Forense, Gráfico de Rosca & LGPD',
      badge: 'Conformidade & LGPD Art. 37',
      icon: <ShieldCheck size={18} className="text-emerald-400" />,
      tags: ['auditoria', 'lgpd', 'art37', 'anatel', 'marcocivil', 'sha256', 'grafico', 'rosca', 'forense', 'seguranca', 'exportar'],
      summary: 'Rastreabilidade inalterável com SHA-256, gráfico de rosca analítico por tipo e exportação forense para LGPD e Anatel.',
      content: (
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Padrão Regulatório: LGPD Art. 37 & Marco Civil da Internet Art. 15
            </span>
            <h2 className="text-xl font-bold text-white mt-2 mb-2">Trilha Forense e Auditoria de Ações dos Operadores</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              O NAP implementa uma cadeia de custódia inalterável (<strong>Append-Only Audit Log</strong>) que registra detalhadamente todas as operações realizadas pelos operadores no painel, garantindo não-repúdio, rastreabilidade forense e cumprimento integral da legislação brasileira de telecomunicações e proteção de dados.
            </p>
          </div>

          {/* Os 4 Eixos Monitorados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Users size={16} /> 1. Acessos & Sessões Autenticadas
              </div>
              <p className="text-slate-400 leading-relaxed">
                Registra todos os logins e encerramentos de sessão dos operadores, gravando o endereço IP de origem, data/hora precisa UTC e agente de navegação.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Server size={16} /> 2. Alterações no SGP & Multi-ERP
              </div>
              <p className="text-slate-400 leading-relaxed">
                Rastreia modificações em credenciais de API, tokens, URLs de webhook e parâmetros de timeout dos ERPs (MikWeb, IXC, Hubsoft e SGP) com comparativo antes/depois.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Radio size={16} /> 3. Comandos GenieACS (TR-069)
              </div>
              <p className="text-slate-400 leading-relaxed">
                Registra comandos CWMP disparados contra CPEs de clientes (reboots remotos de ONUs, alterações de SSID e senhas Wi-Fi), prevenindo abusos operacionais.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Megaphone size={16} /> 4. Disparos em Massa & Campanhas
              </div>
              <p className="text-slate-400 leading-relaxed">
                Audita campanhas de aviso preventivo de rompimento de fibra, lembretes automáticos de vencimento e réguas de cobrança enviadas via WhatsApp WABA.
              </p>
            </div>
          </div>

          {/* Gráfico de Rosca Analítico */}
          <div className="p-5 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <PieChart size={16} /> Gráfico de Rosca: Visão Rápida de Conformidade
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No topo da tela de Auditoria (`/admin/auditoria`), o sistema exibe um <strong>gráfico de rosca dinâmico (Donut Chart)</strong> renderizado com Recharts. Ele totaliza as ações por categoria e fornece:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-5">
              <li><strong>Proporção Percentual</strong> de cada categoria sobre o volume total de eventos.</li>
              <li><strong>Contador Central Integrado</strong> com o total consolidado de ações registradas na cadeia forense.</li>
              <li><strong>Filtro Rápido Interativo</strong>: ao clicar em qualquer cartão de categoria, a tabela de auditoria abaixo filtra instantaneamente as ações selecionadas.</li>
            </ul>
          </div>

          {/* Integridade Criptográfica SHA-256 e Exportação Oficial */}
          <div className="p-5 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Lock size={16} /> Assinatura SHA-256 e Exportação Legal (CSV / JSON)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cada log gerado no NAP possui um identificador único com hash criptográfico SHA-256 que atesta a inviolabilidade do registro perante perícias de segurança ou auditorias do Encarregado de Dados (DPO):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Exportação CSV</span>
                <span className="text-white font-bold">GET /api/auditoria/exportar?formato=csv</span>
                <p className="text-[10px] text-slate-400 mt-1">Compatível com Excel, PowerBI e relatórios de auditoria interna.</p>
              </div>
              <div className="p-3 bg-[#06080e] rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">Exportação JSON Forense</span>
                <span className="text-white font-bold">GET /api/auditoria/exportar?formato=json</span>
                <p className="text-[10px] text-slate-400 mt-1">Exportação bruta com metadados e certificado de conformidade.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-procedimentos',
      category: 'core',
      title: 'Perguntas Frequentes & Resolução de Problemas',
      badge: 'Solução Rápida',
      icon: <HelpCircle size={18} />,
      tags: ['faq', 'erros', 'duvidas', 'procedimentos', 'resolucao', 'ajuda', 'suporte'],
      summary: 'Respostas diretas para dúvidas técnicas frequentes na operação diária.',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Perguntas Frequentes (FAQ)</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Consulte orientações rápidas para os cenários e dúvidas mais comuns no dia a dia do provedor:
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-blue-400" />
                Como alterar o ERP ativo do provedor?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vá até <strong>Configurações &gt; Integrações ERP</strong>, acerte as credenciais no formulário do conector desejado (IXC, Hubsoft, MikWeb, etc.) e clique no botão <strong>"Salvar e Ativar"</strong>. O sistema passará a consultar esse endpoint imediatamente para todas as rotinas de CRM e faturas.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-emerald-400" />
                O que fazer se o Ping do ERP estiver alto ou acusando Offline?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1. Verifique se o endereço informado começa com <code>https://</code>.<br />
                2. Cheque se o firewall do seu servidor de ERP permite conexões de entrada originadas pelo IP da VPS do NAP.<br />
                3. Utilize o <strong>Validador de API</strong> para inspecionar o relatório de Handshake TLS.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-amber-400" />
                Como funciona o Desbloqueio em Confiança (48h)?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ao acionar o botão de desbloqueio no chat ou no CRM, o backend despacha uma instrução para a API do ERP selecionado. O ERP, por sua vez, remove o assinante da lista de corte e envia um pacote Radius PoD / CoA para o MikroTik ou BNG, liberando o tráfego da sessão PPPoE imediatamente.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-white/5 rounded-2xl space-y-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-indigo-400" />
                O cliente precisa baixar o app pela Play Store ou App Store?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Não é obrigatório. O Portal do Assinante é um PWA moderno. O cliente abre o link do portal no navegador do celular (Chrome ou Safari) e seleciona <em>"Adicionar à Tela de Início"</em>. Ele passa a abrir como um app nativo, com suporte a push e carregamento instantâneo.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ], []);

  // Filtro de Seções por Categoria e Busca
  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      const matchCategory = selectedCategory === 'todos' || s.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inTitle = s.title.toLowerCase().includes(q);
      const inSummary = s.summary.toLowerCase().includes(q);
      const inTags = s.tags.some(t => t.toLowerCase().includes(q));
      return inTitle || inSummary || inTags;
    });
  }, [sections, selectedCategory, searchQuery]);

  // Seção ativa selecionada (ou a primeira filtrada)
  const activeSection = sections.find(s => s.id === activeSectionId) || filteredSections[0] || sections[0];

  return (
    <div id="pagina-base-de-ajuda" className="h-[calc(100vh-64px)] flex flex-col bg-[#06080e] overflow-hidden text-slate-200">
      
      {/* Topo do Módulo de Ajuda: Título, Busca & Filtros Rápidos */}
      <div className="p-5 border-b border-white/5 bg-[#0b0f19]/80 backdrop-blur-md shrink-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500" />
              Ajuda, Documentação & Roteiro de Homologação
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                NAP v2.6
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Documentação técnica, procedimentos operacionais, trilha de conformidade LGPD e checklist de homologação para ISPs.
            </p>
          </div>

          {/* Campo de Pesquisa em Tempo Real */}
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="input-busca-ajuda"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por IXC, Hubsoft, Ping, TR-069, PIX..."
              className="w-full pl-9 pr-3 py-2 bg-[#06080e] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Barra de Categorias */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo Principal Dividido em Sidebar e Área de Leitura */}
      <div className="flex-1 flex overflow-hidden p-4 md:p-6 gap-6">
        
        {/* Sidebar Esquerda: Lista de Tópicos */}
        <div className="w-full sm:w-72 md:w-80 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
            <span>Tópicos ({filteredSections.length})</span>
            {searchQuery && (
              <span className="text-[10px] text-blue-400 lowercase font-normal">
                filtrado por "{searchQuery}"
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {filteredSections.map((sec) => {
              const isSelected = activeSection.id === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  id={`btn-topico-${sec.id}`}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#101726] border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30'
                      : 'bg-[#0b0f19]/70 border-white/5 hover:border-white/15 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-xl shrink-0 transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    {sec.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        {sec.badge}
                      </span>
                      {isSelected && (
                        <ChevronRight size={13} className="text-blue-400 shrink-0" />
                      )}
                    </div>
                    <h3 className={`text-xs font-bold leading-snug mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {sec.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-normal">
                      {sec.summary}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="p-6 text-center text-slate-500 bg-[#0b0f19] rounded-2xl border border-white/5">
                <HelpCircle size={24} className="mx-auto mb-2 text-slate-600" />
                <p className="text-xs">Nenhum tópico encontrado para a busca informada.</p>
              </div>
            )}
          </div>
        </div>

        {/* Área Central: Visualizador de Artigo / Documentação */}
        <div className="flex-1 bg-[#101726] border border-white/5 rounded-3xl overflow-y-auto p-6 md:p-8 relative">
          {/* Header do Artigo */}
          <div className="pb-6 mb-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                {activeSection.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  {activeSection.badge}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                  {activeSection.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyCode(window.location.href, 'link')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/5"
                title="Copiar link deste manual"
              >
                {copiedCode === 'link' ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Compartilhar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tags de Indexação */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
              Tags:
            </span>
            {activeSection.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 rounded-md bg-[#06080e] border border-white/5 text-[10px] font-mono text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Renderização do Conteúdo Específico */}
          <div className="max-w-4xl">
            {activeSection.content}
          </div>

        </div>

      </div>

    </div>
  );
}
