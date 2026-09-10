import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, User, Phone, Zap, MessageCircle, MonitorSmartphone, 
  ArrowLeft, CheckCheck, Clock, ShieldCheck, Lock, Sparkles, 
  ChevronRight, Copy, Check, RefreshCw, AlertTriangle, 
  Wifi, CreditCard, Layers, CheckCircle, FileText, CornerDownLeft,
  Paperclip, Mic, Play, Pause, X, UserCheck, Inbox as InboxIcon,
  MapPin, Share2, Navigation
} from 'lucide-react';
import type { Conversa, Mensagem } from '../types';
import AddressMapModal from '../components/AddressMapModal';

interface ExtendedConversa extends Conversa {
  nome_cliente: string;
  telefone: string;
  cpf: string;
  plano: string;
  protocolo: string;
  tempo_espera: string;
  fila: string;
  pilar_negocio: 'suporte' | 'cobranca' | 'vendas';
  endereco?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  ponto_referencia?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  status_conexao: {
    status: 'online' | 'offline' | 'alerta';
    sinal_onu: string;
    ip: string;
    concentrador: string;
    uptime: string;
  };
  financeiro: {
    valor: number;
    vencimento: string;
    status: 'pendente' | 'pago' | 'atrasado';
    pix_copia_cola: string;
  };
}

const INITIAL_CHATS: ExtendedConversa[] = [
  {
    id: 1,
    canal: 'whatsapp',
    contato_id: 9982,
    nome_cliente: 'Maria Oliveira',
    telefone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    plano: 'Fibra 500MB Simétrico',
    protocolo: 'NAP-2026-0909-481',
    tempo_espera: '1m 20s',
    fila: 'Suporte Técnico N1',
    pilar_negocio: 'suporte',
    status: 'aberta',
    prioridade: 1,
    endereco: 'Rua das Flores, 123 - Centro Histórico, São Paulo/SP',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 34B',
    bairro: 'Centro Histórico',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01001-000',
    ponto_referencia: 'Ao lado da Estação Sé / Prédio Azul',
    coordenadas: {
      lat: -23.5489,
      lng: -46.6388
    },
    status_conexao: {
      status: 'online',
      sinal_onu: '-19.4 dBm (Ótimo)',
      ip: '177.45.2.19',
      concentrador: 'MikroTik-Core-01',
      uptime: '15d 2h 45m'
    },
    financeiro: {
      valor: 99.90,
      vencimento: '2026-09-10',
      status: 'pendente',
      pix_copia_cola: '00020126580014br.gov.bcb.pix0136nap-provedor-fibra-9982-fatura520400005303986540599.905802BR5913NAP PROVEDOR6009SAO PAULO62070503***6304E8A1'
    },
    mensagens: [
      { id: 1, conversa_id: 1, autor_tipo: 'cliente', conteudo: 'Olá, bom dia! Notei uma pequena oscilação na velocidade da internet aqui em casa.', enviada_em: '10:00', status: 'lido' },
      { id: 2, conversa_id: 1, autor_tipo: 'ia', conteudo: 'Olá, Maria! Verifiquei sua ONU no sistema SGP: o sinal óptico está em -19.4 dBm (excelente) e a sessão PPPoE está ativa há 15 dias. Como posso te auxiliar no diagnóstico?', enviada_em: '10:01', status: 'lido' },
      { id: 3, conversa_id: 1, autor_tipo: 'operador', tipo: 'nota_interna', conteudo: 'Cliente ligou ontem com o mesmo sintoma. Roteador dela é Wi-Fi 5 dual-band no canal 36.', enviada_em: '10:02' },
      { id: 4, conversa_id: 1, autor_tipo: 'cliente', conteudo: 'Estou usando o Wi-Fi no quarto do fundo. Poderia verificar se o roteador precisa ser reiniciado?', enviada_em: '10:03', status: 'entregue' }
    ]
  },
  {
    id: 2,
    canal: 'whatsapp',
    contato_id: 9985,
    nome_cliente: 'Carlos Eduardo Silva',
    telefone: '(11) 97654-3210',
    cpf: '234.567.890-11',
    plano: 'Fibra 300MB Residencial',
    protocolo: 'NAP-2026-0909-512',
    tempo_espera: '4m 50s',
    fila: 'Financeiro & Cobrança',
    pilar_negocio: 'cobranca',
    status: 'aberta',
    prioridade: 2,
    endereco: 'Rua das Acácias, 412 - Jardim Primavera, São Paulo/SP',
    logradouro: 'Rua das Acácias',
    numero: '412',
    complemento: 'Casa',
    bairro: 'Jardim Primavera',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04856-200',
    ponto_referencia: 'Próximo à Padaria Flor da Primavera / Em frente à CTO-12',
    coordenadas: {
      lat: -23.7083,
      lng: -46.6852
    },
    status_conexao: {
      status: 'alerta',
      sinal_onu: '-27.8 dBm (Atenuação Alta)',
      ip: '177.45.18.90',
      concentrador: 'MikroTik-Sul-02',
      uptime: '2d 11h'
    },
    financeiro: {
      valor: 89.90,
      vencimento: '2026-09-05',
      status: 'atrasado',
      pix_copia_cola: '00020126580014br.gov.bcb.pix0136nap-provedor-fibra-9985-fatura520400005303986540589.905802BR5913NAP PROVEDOR6009SAO PAULO62070503***6304C7B2'
    },
    mensagens: [
      { id: 5, conversa_id: 2, autor_tipo: 'cliente', conteudo: 'Bom dia! Gostaria de pagar minha mensalidade via PIX, pode me mandar a chave copia e cola?', enviada_em: '09:45', status: 'lido' },
      { id: 6, conversa_id: 2, autor_tipo: 'ia', conteudo: 'Com certeza, Carlos! Estou localizando sua fatura com vencimento em 05/09.', enviada_em: '09:46', status: 'lido' }
    ]
  },
  {
    id: 3,
    canal: 'webchat',
    contato_id: 9990,
    nome_cliente: 'Fernanda Costa',
    telefone: '(11) 96543-2109',
    cpf: '345.678.901-22',
    plano: 'Fibra 1GB Gamer / Pro',
    protocolo: 'NAP-2026-0909-530',
    tempo_espera: '0m 45s',
    fila: 'Vendas & Upgrades',
    pilar_negocio: 'vendas',
    status: 'aberta',
    prioridade: 3,
    endereco: 'Av. Paulista, 1800, Conj 41 - Bela Vista, São Paulo/SP',
    logradouro: 'Avenida Paulista',
    numero: '1800',
    complemento: 'Conjunto 41',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01310-200',
    ponto_referencia: 'Próximo ao MASP / Torre Sul',
    coordenadas: {
      lat: -23.5614,
      lng: -46.6559
    },
    status_conexao: {
      status: 'online',
      sinal_onu: '-18.1 dBm (Excelente)',
      ip: '177.45.100.4',
      concentrador: 'MikroTik-Core-01',
      uptime: '42d 8h'
    },
    financeiro: {
      valor: 149.90,
      vencimento: '2026-09-20',
      status: 'pago',
      pix_copia_cola: '00020126580014br.gov.bcb.pix0136nap-provedor-fibra-9990'
    },
    mensagens: [
      { id: 7, conversa_id: 3, autor_tipo: 'cliente', conteudo: 'Olá, gostaria de saber se é possível fazer o upgrade para o roteador Wi-Fi 6 Mesh.', enviada_em: '10:04', status: 'entregue' }
    ]
  }
];

export default function Inbox() {
  const [chats, setChats] = useState<ExtendedConversa[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<number | null>(1);
  const [filterQueue, setFilterQueue] = useState<'meus' | 'fila_geral' | 'finalizados'>('meus');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Painel Lateral 360 / SGP no chat
  const [isSgpDrawerOpen, setIsSgpDrawerOpen] = useState(true);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Composer
  const [messageText, setMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Gemini Copilot
  const [isGeneratingCopilot, setIsGeneratingCopilot] = useState(false);
  const [copilotSuccess, setCopilotSuccess] = useState(false);

  // Modal de Tabulação / Finalizar
  const [isTabulating, setIsTabulating] = useState(false);
  const [isAutoTabulating, setIsAutoTabulating] = useState(false);
  const [tabulationData, setTabulationData] = useState({
    categoria: 'Suporte Técnico',
    motivo: 'Lentidão / Wi-Fi',
    resolucao: 'Orientações de posicionamento do roteador e teste no canal 5GHz.',
    enviarPesquisaNps: true
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Macros dinâmicas sincronizadas com o SuperAdmin
  const [macros, setMacros] = useState<any[]>([
    { id: '1', atalho: '/pix', conteudo: 'Aqui está sua chave PIX para pagamento: {chave_pix}. A baixa no sistema é imediata!' },
    { id: '2', atalho: '/reset_onu', conteudo: 'Por favor, desligue o roteador e a ONU da tomada por 30 segundos e ligue novamente. Aguarde os leds PON e Internet estabilizarem.' },
    { id: '3', atalho: '/desbloqueio', conteudo: 'Seu sinal de internet foi liberado provisoriamente por 48 horas em confiança! O comprovante pode ser enviado por aqui.' },
    { id: '4', atalho: '/visita_tecnica', conteudo: 'Ordem de serviço aberta com sucesso. Nossa equipe técnica entrará em contato para alinhar o turno de visita.' }
  ]);

  useEffect(() => {
    async function loadMacros() {
      try {
        const res = await fetch('/api/configuracoes');
        if (res.ok) {
          const data = await res.json();
          if (data.config?.respostasRapidas && Array.isArray(data.config.respostasRapidas) && data.config.respostasRapidas.length > 0) {
            setMacros(data.config.respostasRapidas);
          }
        }
      } catch (e) {
        // fallback to defaults
      }
    }
    loadMacros();
  }, []);

  const applyMacro = (macro: any) => {
    if (!activeChat) return;
    let text = macro.conteudo || '';
    text = text.replace(/\{chave_pix\}/g, activeChat.financeiro?.pix_copia_cola || '00020126580014br.gov.bcb.pix...');
    text = text.replace(/\{nome_cliente\}/g, activeChat.nome_cliente || '');
    text = text.replace(/\{protocolo\}/g, activeChat.protocolo || '');
    text = text.replace(/\{valor\}/g, activeChat.financeiro?.valor ? `R$ ${activeChat.financeiro.valor.toFixed(2)}` : '');
    text = text.replace(/\{sinal_optico\}/g, activeChat.status_conexao?.sinal_onu || '-19 dBm');
    text = text.replace(/\{nome_provedor\}/g, 'NAP Telecom Fibra');
    setMessageText(text);
  };

  // Conversa ativa
  const activeChat = chats.find(c => c.id === activeChatId) || null;

  // Rolar para o final ao mudar ou enviar mensagens
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.mensagens.length, activeChatId]);

  // Exibir toast temporário
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtragem de fila
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.nome_cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          chat.protocolo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          chat.cpf.includes(searchQuery);

    if (filterQueue === 'meus') {
      return matchesSearch && chat.status === 'aberta' && chat.id !== 3;
    }
    if (filterQueue === 'fila_geral') {
      return matchesSearch && chat.status === 'aberta' && chat.id === 3;
    }
    if (filterQueue === 'finalizados') {
      return matchesSearch && chat.status === 'fechada';
    }
    return matchesSearch;
  });

  // Enviar Mensagem Real
  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChat) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: Mensagem = {
      id: Date.now(),
      conversa_id: activeChat.id,
      autor_tipo: 'operador',
      tipo: isInternalNote ? 'nota_interna' : 'texto',
      conteudo: messageText.trim(),
      enviada_em: timeStr,
      status: 'enviado'
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          mensagens: [...c.mensagens, newMsg]
        };
      }
      return c;
    }));

    setMessageText('');

    // Se for mensagem pública, simula resposta do cliente após 2 segundos
    if (!isInternalNote) {
      setTimeout(() => {
        const clientReply: Mensagem = {
          id: Date.now() + 1,
          conversa_id: activeChat.id,
          autor_tipo: 'cliente',
          conteudo: 'Perfeito! Fiz o procedimento e a velocidade já normalizou aqui. Muito obrigada!',
          enviada_em: timeStr,
          status: 'entregue'
        };

        setChats(prev => prev.map(c => {
          if (c.id === activeChat.id) {
            return {
              ...c,
              mensagens: [...c.mensagens, clientReply]
            };
          }
          return c;
        }));
      }, 2000);
    }
  };

  // Puxar da Fila Geral para o Operador
  const handleAssignToMe = (chatId: number) => {
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return { ...c, fila: 'Meu Atendimento' };
      }
      return c;
    }));
    setActiveChatId(chatId);
    setFilterQueue('meus');
    showToast('Chamado atribuído com sucesso para o seu operador!');
  };

  // Copiloto Gemini: Sugere resposta inteligente para o operador
  const handleGeminiCopilot = async () => {
    if (!activeChat || isGeneratingCopilot) return;
    setIsGeneratingCopilot(true);

    const lastClientMsg = [...activeChat.mensagens].reverse().find(m => m.autor_tipo === 'cliente')?.conteudo || 'Solicito suporte técnico na minha fibra.';

    try {
      const res = await fetch('/api/gemini/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Gere uma resposta profissional, técnica e acolhedora de um operador de ISP para o cliente ${activeChat.nome_cliente} que perguntou: "${lastClientMsg}". Se for sobre sinal, use a informação real de que a ONU dele está em ${activeChat.status_conexao.sinal_onu} e a conexão dura ${activeChat.status_conexao.uptime}. Seja conciso.`,
          clientContext: {
            nome: activeChat.nome_cliente,
            plano: activeChat.plano,
            sinal_onu: activeChat.status_conexao.sinal_onu,
            uptime: activeChat.status_conexao.uptime
          }
        })
      });

      const data = await res.json();
      if (data.resposta) {
        setMessageText(data.resposta);
        setIsInternalNote(false);
        setCopilotSuccess(true);
        setTimeout(() => setCopilotSuccess(false), 2000);
        showToast('Sugestão do Gemini inserida no campo!');
      }
    } catch {
      showToast('Erro ao consultar sugestão da IA.');
    } finally {
      setIsGeneratingCopilot(false);
    }
  };

  // Enviar PIX instantâneo no Chat
  const handleSendPixToChat = () => {
    if (!activeChat) return;
    const pixText = `Olá ${activeChat.nome_cliente.split(' ')[0]}! Segue sua chave PIX Copia e Cola para pagamento da mensalidade de R$ ${activeChat.financeiro.valor.toFixed(2)}:\n\n${activeChat.financeiro.pix_copia_cola}\n\nApós o pagamento, a baixa no SGP ocorre automaticamente em até 2 minutos.`;
    setMessageText(pixText);
    setIsInternalNote(false);
    showToast('Chave PIX inserida no campo de resposta!');
  };

  // Desbloqueio em Confiança
  const handleDesbloqueio48h = () => {
    if (!activeChat) return;
    const desbloqueioText = `Olá ${activeChat.nome_cliente.split(' ')[0]}! Registramos no SGP o seu Desbloqueio em Confiança válido por 48 horas. Sua conexão já foi liberada com a velocidade contratada.`;
    setMessageText(desbloqueioText);
    setIsInternalNote(false);
    showToast('Ação de Desbloqueio em Confiança preparada no SGP!');
  };

  // Reiniciar ONU / Kick Radius
  const handleKickRadius = () => {
    if (!activeChat) return;
    showToast(`Comando Kick Radius enviado para ${activeChat.status_conexao.concentrador}. Sessão reiniciada.`);
  };

  // Auto-Tabulação Inteligente com Gemini
  const handleAutoTabulateGemini = async () => {
    if (!activeChat || isAutoTabulating) return;
    setIsAutoTabulating(true);

    const historySummary = activeChat.mensagens.map(m => `${m.autor_tipo}: ${m.conteudo}`).join(' | ');

    try {
      const res = await fetch('/api/gemini/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Com base no diálogo a seguir de um provedor de internet, resuma a tabulação em formato direto:
Histórico: ${historySummary}
Retorne exatamente no formato:
CATEGORIA: [Suporte Técnico OU Financeiro OU Suporte Avançado N2 OU Vendas & Upgrades OU Retenção / Cancelamento]
MOTIVO: [descrição curta em até 5 palavras]
RESOLUCAO: [resumo da solução dada em 1 ou 2 frases]`
        })
      });

      const data = await res.json();
      const text = data.resposta || '';

      let cat = 'Suporte Técnico';
      if (text.includes('Financeiro')) cat = 'Financeiro';
      else if (text.includes('Avançado N2')) cat = 'Suporte Avançado N2';
      else if (text.includes('Vendas')) cat = 'Vendas & Upgrades';
      else if (text.includes('Retenção')) cat = 'Retenção / Cancelamento';

      // Extrair motivo e resolução
      const motivoMatch = text.match(/MOTIVO:\s*([^\n\r]+)/i);
      const resolucaoMatch = text.match(/RESOLUCAO:\s*([^\n\r]+)/i);

      setTabulationData(prev => ({
        ...prev,
        categoria: cat,
        motivo: motivoMatch ? motivoMatch[1].trim() : (activeChat.plano.includes('500MB') ? 'Diagnóstico de Banda e Sinal Óptico' : 'Atendimento ao Assinante'),
        resolucao: resolucaoMatch ? resolucaoMatch[1].trim() : (data.resposta ? data.resposta.substring(0, 160) : 'Atendimento concluído conforme solicitação do cliente.')
      }));

      showToast('Tabulação gerada automaticamente pelo Gemini!');
    } catch {
      showToast('Não foi possível gerar tabulação automática.');
    } finally {
      setIsAutoTabulating(false);
    }
  };

  // Concluir Tabulação
  const handleFinishTicket = () => {
    if (!activeChat) return;
    setChats(prev => prev.map(c => {
      if (c.id === activeChat.id) {
        return { ...c, status: 'fechada' };
      }
      return c;
    }));
    setIsTabulating(false);
    showToast(`Atendimento #${activeChat.protocolo} tabulado e finalizado com sucesso!`);
  };

  const getPilarBadge = (pilar?: 'suporte' | 'cobranca' | 'vendas') => {
    switch (pilar) {
      case 'cobranca':
        return (
          <span className="flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded">
            <CreditCard size={10} className="text-amber-600" />
            <span>COBRANÇA</span>
          </span>
        );
      case 'vendas':
        return (
          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded">
            <Zap size={10} className="text-emerald-600" />
            <span>VENDAS</span>
          </span>
        );
      case 'suporte':
      default:
        return (
          <span className="flex items-center gap-1 text-[9px] font-bold text-blue-800 bg-blue-500/10 border border-blue-300 px-1.5 py-0.5 rounded">
            <Wifi size={10} className="text-blue-400" />
            <span>SUPORTE</span>
          </span>
        );
    }
  };

  const getChannelBadge = (canal: string) => {
    switch (canal) {
      case 'whatsapp':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <MessageCircle size={11} className="text-emerald-600" />
            <span>WABA Oficial</span>
          </span>
        );
      case 'webchat':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
            <MonitorSmartphone size={11} className="text-blue-400" />
            <span>Portal PWA</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-200 bg-white/[0.02] border border-white/10 px-2 py-0.5 rounded-full">
            <Phone size={11} className="text-slate-400" />
            <span>Voz / Asterisk</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex h-full bg-[#0b0f19] overflow-hidden relative font-sans">
      
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#101726] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in-50 zoom-in-95">
          <CheckCircle size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* COLUNA 1: Fila & Lista de Conversas Omnichannel */}
      <aside className={`w-full md:w-80 lg:w-96 border-r border-white/10 bg-[#101726] flex flex-col z-10 shrink-0 ${
        activeChatId ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Header de Filas com Filtros */}
        <div className="p-4 border-b border-white/10 bg-[#101726]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-extrabold text-lg text-white font-outfit tracking-tight">
                Inbox Omnichannel
              </h1>
              <p className="text-[11px] text-slate-400">Filas WhatsApp WABA & WebChat</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 rounded-lg text-xs font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{chats.filter(c => c.status === 'aberta').length} Abertos</span>
            </div>
          </div>

          {/* Abas de Fila */}
          <div className="flex rounded-xl bg-white/[0.02] p-1 mb-3 text-xs font-semibold text-slate-400">
            <button
              onClick={() => setFilterQueue('meus')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                filterQueue === 'meus' ? 'bg-[#101726] text-white shadow-2xs font-bold' : 'hover:text-white'
              }`}
            >
              <span>Meus</span>
              <span className="text-[10px] bg-blue-100 text-blue-400 px-1.5 py-0.2 rounded-full font-bold">2</span>
            </button>
            <button
              onClick={() => setFilterQueue('fila_geral')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                filterQueue === 'fila_geral' ? 'bg-[#101726] text-white shadow-2xs font-bold' : 'hover:text-white'
              }`}
            >
              <span>Espera</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">1</span>
            </button>
            <button
              onClick={() => setFilterQueue('finalizados')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterQueue === 'finalizados' ? 'bg-[#101726] text-white shadow-2xs font-bold' : 'hover:text-white'
              }`}
            >
              <span>Histórico</span>
            </button>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, CPF ou protocolo..." 
              className="w-full pl-9 pr-4 py-2 bg-[#0b0f19] border border-white/10 rounded-xl text-xs text-white outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Lista de Atendimentos */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5" style={{ scrollbarWidth: 'thin' }}>
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <InboxIcon size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">Nenhum chamado nesta fila</p>
            </div>
          ) : (
            filteredChats.map(chat => {
              const lastMsg = chat.mensagens[chat.mensagens.length - 1];
              const isSelected = activeChatId === chat.id;

              return (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-3.5 cursor-pointer transition-all border-l-4 ${
                    isSelected 
                      ? 'bg-blue-500/10/70 border-l-blue-600 shadow-2xs' 
                      : 'hover:bg-[#0b0f19] border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-white truncate max-w-[130px]">
                        {chat.nome_cliente}
                      </span>
                      {getPilarBadge(chat.pilar_negocio)}
                      {getChannelBadge(chat.canal)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {lastMsg?.enviada_em || '--:--'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                    {lastMsg?.tipo === 'nota_interna' ? `🔒 [Nota] ${lastMsg.conteudo}` : lastMsg?.conteudo}
                  </p>

                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="font-mono">{chat.plano.split(' ')[0]} {chat.plano.split(' ')[1]}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-700 font-semibold">
                        <Clock size={10} /> {chat.tempo_espera}
                      </span>
                    </div>

                    {filterQueue === 'fila_geral' ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignToMe(chat.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-0.5 rounded text-[10px] transition-colors"
                      >
                        Puxar Chamado
                      </button>
                    ) : (
                      <span className="text-slate-400 font-mono text-[10px]">
                        #{chat.protocolo.slice(-4)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* COLUNA 2: Janela Central de Conversa e Composer */}
      {activeChat ? (
        <div className={`flex-1 flex-col bg-[#0b0f19] relative ${activeChatId ? 'flex' : 'hidden md:flex'} overflow-hidden`}>
          
          {/* Header Superior do Atendimento */}
          <header className="h-16 border-b border-white/10 bg-[#101726] px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-2xs">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveChatId(null)}
                className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-lg transition-colors"
                title="Voltar à lista"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                {activeChat.nome_cliente.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white font-outfit text-sm sm:text-base leading-tight">
                    {activeChat.nome_cliente}
                  </h2>
                  {getPilarBadge(activeChat.pilar_negocio)}
                  {getChannelBadge(activeChat.canal)}
                </div>
                
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  <span className="font-mono text-slate-400">{activeChat.protocolo}</span>
                  <span>•</span>
                  <span>{activeChat.plano}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck size={12} /> Autenticado SGP
                  </span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas do Header */}
            <div className="flex items-center gap-2">
              <a 
                href={`tel:${activeChat.telefone}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 bg-white/[0.02] hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                title="Ligar via Ramal SIP"
              >
                <Phone size={13} className="text-slate-400" />
                <span>{activeChat.telefone}</span>
              </a>

              {/* Alternar Drawer Contextual SGP */}
              <button
                onClick={() => setIsSgpDrawerOpen(!isSgpDrawerOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  isSgpDrawerOpen 
                    ? 'bg-blue-500/10 border-blue-300 text-blue-400' 
                    : 'bg-[#101726] hover:bg-white/[0.02] border-white/10 text-slate-300'
                }`}
                title="Painel 360 do Assinante no ERP SGP"
              >
                <Layers size={13} />
                <span className="hidden sm:inline">CRM & SGP</span>
              </button>

              {/* Finalizar / Tabular Atendimento */}
              <button
                onClick={() => setIsTabulating(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
              >
                <CheckCircle size={13} className="text-emerald-600" />
                <span className="hidden sm:inline">Finalizar</span>
              </button>
            </div>
          </header>

          {/* Área com Stream de Mensagens e Drawer Contextual */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Thread de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" style={{ scrollbarWidth: 'thin' }}>
              
              {/* Alerta de Início do Chamado & Protocolo */}
              <div className="flex justify-center my-2">
                <div className="bg-white/[0.02] border border-white/10 rounded-full px-3 py-1 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <Clock size={11} />
                  <span>Atendimento iniciado às {activeChat.mensagens[0]?.enviada_em} • Protocolo {activeChat.protocolo}</span>
                </div>
              </div>

              {/* Mensagens */}
              {activeChat.mensagens.map((msg) => {
                const isMe = msg.autor_tipo === 'operador';
                const isClient = msg.autor_tipo === 'cliente';
                const isAi = msg.autor_tipo === 'ia';
                const isNote = msg.tipo === 'nota_interna';

                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isMe || isAi ? 'justify-end' : 'justify-start'} animate-in fade-in-50 duration-150`}
                  >
                    <div 
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-2xs text-xs sm:text-sm leading-relaxed ${
                        isNote 
                          ? 'bg-amber-50 border border-amber-200 text-amber-950 w-full max-w-[90%]' 
                          : isClient
                            ? 'bg-[#101726] border border-white/10 text-white rounded-tl-xs'
                            : isAi
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-500/20 text-blue-950 rounded-tr-xs'
                              : 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-600/10'
                      }`}
                    >
                      {/* Header da Mensagem */}
                      <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-black/5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          isNote 
                            ? 'text-amber-800' 
                            : isClient 
                              ? 'text-slate-400' 
                              : isAi 
                                ? 'text-blue-400' 
                                : 'text-blue-100'
                        }`}>
                          {isNote && <Lock size={10} />}
                          {isAi && <Sparkles size={10} />}
                          {isNote ? 'Sussurro (Nota Interna Privada)' : isClient ? activeChat.nome_cliente : isAi ? 'Assistente IA (9router)' : 'Você (Operador)'}
                        </span>

                        <div className="flex items-center gap-1 text-[10px] font-mono opacity-75">
                          <span>{msg.enviada_em}</span>
                          {isMe && !isNote && (
                            <CheckCheck size={12} className={msg.status === 'lido' ? 'text-cyan-200' : 'text-white/80'} />
                          )}
                        </div>
                      </div>

                      {/* Conteúdo com quebra de linha */}
                      <p className="whitespace-pre-wrap">{msg.conteudo}</p>
                    </div>
                  </div>
                );
              })}

              <div ref={chatEndRef} />
            </div>

            {/* COLUNA 3: Contexto 360 do Assinante & Ações SGP (Drawer Direito) */}
            {isSgpDrawerOpen && (
              <aside className="w-80 lg:w-96 border-l border-white/10 bg-[#101726] overflow-y-auto p-4 space-y-4 shrink-0 shadow-none animate-in slide-in-from-right-3 duration-200">
                
                {/* Header do Drawer */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider font-outfit">
                      Raio-X do Assinante (SGP)
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsSgpDrawerOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-300 rounded-md"
                    title="Ocultar Painel"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Bloco 1: Conexão & ONU ao Vivo */}
                <div className="p-3.5 rounded-2xl bg-[#0b0f19] border border-white/10 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                      <Wifi size={13} className="text-blue-400" /> Rede & Sinal Óptico
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      PPPoE Online
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-[#101726] rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 block">Sinal ONU</span>
                      <span className="font-bold text-emerald-800 font-mono text-xs">{activeChat.status_conexao.sinal_onu}</span>
                    </div>
                    <div className="p-2 bg-[#101726] rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 block">Uptime</span>
                      <span className="font-bold text-slate-200 font-mono text-xs">{activeChat.status_conexao.uptime}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono space-y-1 pt-1 border-t border-white/10/60">
                    <div className="flex justify-between">
                      <span>IP Público:</span>
                      <span className="text-white font-bold">{activeChat.status_conexao.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Concentrador:</span>
                      <span className="text-white font-bold">{activeChat.status_conexao.concentrador}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleKickRadius}
                    className="w-full py-1.5 bg-[#101726] hover:bg-white/[0.02] border border-white/10 text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw size={12} className="text-slate-500" />
                    <span>Reautenticar Sessão (Kick)</span>
                  </button>
                </div>

                {/* Bloco 2: Financeiro & PIX Instantâneo */}
                <div className="p-3.5 rounded-2xl bg-[#0b0f19] border border-white/10 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                      <CreditCard size={13} className="text-indigo-600" /> Financeiro / Mensalidade
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeChat.financeiro.status === 'pendente' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activeChat.financeiro.status === 'pendente' ? 'A Vencer' : 'Pago'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#101726] rounded-xl border border-white/10 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Vencimento {activeChat.financeiro.vencimento}</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        R$ {activeChat.financeiro.valor.toFixed(2)}
                      </span>
                    </div>
                    <button 
                      onClick={handleSendPixToChat}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                      title="Copiar e colar PIX diretamente no chat"
                    >
                      <Copy size={12} />
                      <span>Enviar PIX</span>
                    </button>
                  </div>

                  {/* Ação de Desbloqueio 48h */}
                  <button 
                    onClick={handleDesbloqueio48h}
                    className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <ShieldCheck size={13} className="text-amber-700" />
                    <span>Desbloqueio em Confiança (48h)</span>
                  </button>
                </div>

                {/* Bloco 3: Dados Cadastrais */}
                <div className="p-3 bg-[#101726] rounded-2xl border border-white/10 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wide block mb-1">
                    Dados do Contrato
                  </span>
                  <div className="flex justify-between text-slate-400">
                    <span>CPF:</span>
                    <span className="font-mono text-white font-semibold">{activeChat.cpf}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Telefone WABA:</span>
                    <span className="font-mono text-white font-semibold">{activeChat.telefone}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Protocolo Atual:</span>
                    <span className="font-mono text-blue-400 font-bold">{activeChat.protocolo}</span>
                  </div>
                </div>

                {/* Bloco 4: Endereço de Instalação & Rota Técnica */}
                <div className="p-3 bg-[#101726] rounded-2xl border border-white/10 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                      <MapPin size={12} className="text-blue-400" /> Endereço & Rota
                    </span>
                    {activeChat.cep && (
                      <span className="text-[10px] font-mono text-slate-500 bg-white/[0.02] px-1.5 py-0.5 rounded">
                        {activeChat.cep}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-200 text-[11px] leading-snug">
                      {activeChat.endereco || 'Endereço a confirmar no cadastro'}
                    </p>
                    {activeChat.ponto_referencia && (
                      <p className="text-[10px] text-amber-700 font-medium mt-1">
                        Ref: {activeChat.ponto_referencia}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setMapModalOpen(true)}
                      className="py-1.5 px-2 bg-blue-500/10 hover:bg-blue-100 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                      title="Ver mapa, consultar CEP ou abrir rotas no GPS"
                    >
                      <MapPin size={11} />
                      <span>Mapa / CEP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapModalOpen(true)}
                      className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                      title="Disparar rota e dados para técnico via WhatsApp"
                    >
                      <Share2 size={11} />
                      <span>WhatsApp OS</span>
                    </button>
                  </div>
                </div>

              </aside>
            )}
          </div>

          {/* COMPOSER OMNICHANNEL MODERNO */}
          <footer className="border-t border-white/10 bg-[#101726] p-3 sm:p-4 z-20 space-y-2">
            
            {/* Barra de Modos & Macros Rápidas */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              
              {/* Alternar Mensagem Pública vs Nota Interna */}
              <div className="flex rounded-xl bg-white/[0.02] p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setIsInternalNote(false)}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    !isInternalNote ? 'bg-[#101726] text-blue-400 shadow-2xs font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageCircle size={12} />
                  <span>Mensagem {activeChat.canal === 'whatsapp' ? 'WhatsApp' : 'Cliente'}</span>
                </button>
                <button
                  onClick={() => setIsInternalNote(true)}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    isInternalNote ? 'bg-amber-100 text-amber-900 shadow-2xs font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock size={12} className="text-amber-700" />
                  <span>Nota Interna (Sussurro)</span>
                </button>
              </div>

              {/* Botões Rápidos de HSM / Macros do Provedor e Copiloto Gemini */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={handleGeminiCopilot}
                  disabled={isGeneratingCopilot}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs border ${
                    copilotSuccess
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                  }`}
                  title="O Gemini analisa a dúvida do cliente e o sinal da fibra no SGP e gera uma resposta pronta"
                >
                  <Sparkles size={12} className={isGeneratingCopilot ? 'animate-spin text-indigo-500' : 'text-indigo-600'} />
                  <span>{isGeneratingCopilot ? 'Gemini gerando...' : copilotSuccess ? 'Sugestão Aplicada!' : 'Copiloto Gemini'}</span>
                </button>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline ml-1">
                  Macros:
                </span>
                {macros.slice(0, 5).map((macro) => (
                  <button 
                    key={macro.id || macro.atalho}
                    onClick={() => applyMacro(macro)}
                    className="px-2.5 py-1 bg-white/[0.02] hover:bg-blue-500/10 hover:text-blue-400 text-slate-300 rounded-lg font-mono font-bold text-[11px] whitespace-nowrap transition-colors"
                    title={macro.titulo || macro.atalho}
                  >
                    {macro.atalho}
                  </button>
                ))}
              </div>
            </div>

            {/* Caixa de Entrada e Envio */}
            <div className={`flex items-end gap-2 p-1.5 rounded-2xl border transition-all ${
              isInternalNote 
                ? 'bg-amber-50/60 border-amber-300 focus-within:ring-2 focus-within:ring-amber-500/20' 
                : 'bg-[#0b0f19] border-white/10 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500'
            }`}>
              
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder={isInternalNote ? 'Escreva uma anotação interna visível apenas para os operadores...' : 'Digite sua mensagem (use Enter para enviar)...'}
                className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-white placeholder:text-slate-500 resize-none max-h-32 px-2 py-1.5 leading-relaxed"
              />

              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 shrink-0 ${
                  isInternalNote 
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                }`}
                title="Enviar Mensagem (Enter)"
              >
                <Send size={16} />
              </button>
            </div>
          </footer>

        </div>
      ) : (
        /* Estado Vazio */
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0b0f19] text-slate-500 p-8 text-center">
          <div className="w-16 h-16 bg-[#101726] rounded-2xl flex items-center justify-center mb-4 border border-white/10 shadow-none">
            <MessageCircle size={28} className="text-slate-400" />
          </div>
          <h3 className="font-outfit text-lg text-slate-200 font-bold mb-1">
            Nenhum Atendimento Selecionado
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Escolha uma conversa na fila ao lado para iniciar o atendimento integrado ao SGP e Asterisk.
          </p>
        </div>
      )}

      {/* MODAL DE TABULAÇÃO / FINALIZAR CHAMADO */}
      {isTabulating && activeChat && (
        <>
          <div 
            onClick={() => setIsTabulating(false)} 
            className="fixed inset-0 bg-[#0b0f19]/60 backdrop-blur-2xs z-50 animate-in fade-in-50"
            aria-hidden="true"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#101726] rounded-3xl p-6 shadow-2xl border border-white/10 z-50 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-white font-outfit">
                  Tabulação de Atendimento
                </h3>
                <p className="text-xs text-slate-500">Protocolo {activeChat.protocolo}</p>
              </div>
              <button 
                onClick={() => setIsTabulating(false)}
                className="text-slate-400 hover:text-slate-300 p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            {/* Banner de Auto-Tabulação com Gemini */}
            <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="font-bold text-indigo-950 text-xs block">Preenchimento IA</span>
                  <span className="text-[10px] text-indigo-700">Analisa o diálogo e preenche tudo em 1 segundo</span>
                </div>
              </div>
              <button
                onClick={handleAutoTabulateGemini}
                disabled={isAutoTabulating}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                {isAutoTabulating ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    <span>Lendo conversa...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    <span>Auto-Preencher</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Fila / Categoria</label>
                <select 
                  value={tabulationData.categoria}
                  onChange={(e) => setTabulationData(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full p-2.5 bg-[#0b0f19] border border-white/10 rounded-xl font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="Suporte Técnico">Suporte Técnico N1</option>
                  <option value="Suporte Avançado N2">Suporte Avançado N2 (Fibra/NOC)</option>
                  <option value="Financeiro">Financeiro / 2ª Via</option>
                  <option value="Vendas & Upgrades">Vendas & Upgrades</option>
                  <option value="Retenção / Cancelamento">Retenção de Clientes</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Motivo do Contato</label>
                <input 
                  type="text"
                  value={tabulationData.motivo}
                  onChange={(e) => setTabulationData(prev => ({ ...prev, motivo: e.target.value }))}
                  className="w-full p-2.5 bg-[#0b0f19] border border-white/10 rounded-xl font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Resumo da Resolução</label>
                <textarea 
                  rows={3}
                  value={tabulationData.resolucao}
                  onChange={(e) => setTabulationData(prev => ({ ...prev, resolucao: e.target.value }))}
                  className="w-full p-2.5 bg-[#0b0f19] border border-white/10 rounded-xl font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-400" />
                  <div>
                    <span className="font-bold text-blue-900 block">Pesquisa CSAT / NPS</span>
                    <span className="text-[10px] text-blue-400">Disparar avaliação automática via WhatsApp</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={tabulationData.enviarPesquisaNps}
                  onChange={(e) => setTabulationData(prev => ({ ...prev, enviarPesquisaNps: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-400 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setIsTabulating(false)}
                className="flex-1 py-2.5 bg-white/[0.02] hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-colors"
              >
                Voltar ao Chat
              </button>
              <button 
                onClick={handleFinishTicket}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Concluir & Tabular
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de Mapa, Busca de CEP e Rota para Técnico em Campo */}
      {activeChat && (
        <AddressMapModal
          isOpen={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          cliente={{
            id: activeChat.contato_id,
            nome: activeChat.nome_cliente,
            telefone: activeChat.telefone,
            endereco: activeChat.endereco,
            logradouro: activeChat.logradouro,
            numero: activeChat.numero,
            complemento: activeChat.complemento,
            bairro: activeChat.bairro,
            cidade: activeChat.cidade,
            uf: activeChat.uf,
            cep: activeChat.cep,
            ponto_referencia: activeChat.ponto_referencia,
            coordenadas: activeChat.coordenadas
          }}
          onAddressUpdated={(novo) => {
            setChats(prev => prev.map(c => c.id === activeChat.id ? {
              ...c,
              ...novo,
              endereco: novo.endereco || c.endereco
            } : c));
          }}
        />
      )}

    </div>
  );
}
