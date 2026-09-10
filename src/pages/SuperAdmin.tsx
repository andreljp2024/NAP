import React, { useState, useEffect } from 'react';
import { 
  Building2, Palette, Database, Server, MessageCircle, Bot, 
  Shield, Activity, Save, Loader2, Key, PhoneCall, CheckCircle2, 
  AlertTriangle, RefreshCw, Download, Upload, Copy, Check, Eye, 
  EyeOff, Clock, Sparkles, Globe, Lock, Sliders, Radio, 
  Terminal, ShieldCheck, ChevronRight, Zap, Plus, Trash2, Edit3, X
} from 'lucide-react';

export interface MacroItem {
  id: string;
  atalho: string;
  titulo: string;
  conteudo: string;
  categoria: 'Financeiro' | 'Suporte' | 'Vendas' | 'Geral';
}

interface SystemConfig {
  provedor: {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: string;
    telefoneSuporte: string;
    telefoneWhatsapp: string;
    emailAtendimento: string;
    cidadeUf: string;
    corPrincipal: string;
    corSecundaria: string;
    logoUrl: string;
    portalUrl: string;
    themeMode: 'dark' | 'light';
  };
  sgp: {
    urlBase: string;
    appId: string;
    token: string;
    syncIntervalMinutes: number;
    autoDesbloqueio48h: boolean;
    avisoSonoroInadimplente: boolean;
    habilitarConsultaRadius: boolean;
    status: 'conectado' | 'desconectado' | 'alerta';
  };
  telefonia: {
    amiHost: string;
    amiPort: number;
    amiUser: string;
    amiSecret: string;
    contextoDiscagem: string;
    ramalWebRTC: string;
    secretWebRTC: string;
    websocketUrl: string;
    gravarChamadas: boolean;
    transcricaoAutomatica: boolean;
    status: 'conectado' | 'desconectado' | 'alerta';
  };
  whatsapp: {
    phoneNumberId: string;
    businessAccountId: string;
    tokenAcesso: string;
    webhookUrl: string;
    verifyToken: string;
    canalOficial: boolean;
    envioAutomaticoPix: boolean;
    status: 'conectado' | 'desconectado' | 'alerta';
  };
  ia: {
    modeloPrimario: string;
    provedorGateway: string;
    temperatura: number;
    topP: number;
    maxTokens: number;
    promptSuporte: string;
    promptVendas: string;
    promptCobranca: string;
    gatilhoTransbordo: 'imediato' | 'apos_3_falhas' | 'solicitacao_cliente';
    copilotoAtivo: boolean;
    status: 'conectado' | 'desconectado' | 'alerta';
  };
  seguranca: {
    sessaoTimeoutMinutos: number;
    exigir2FAOperadores: boolean;
    permitirAcessoExterno: boolean;
    limiteTentativasLogin: number;
    armazenamentoLogsDias: number;
  };
  atendimento: {
    horarioSemana: string;
    horarioSabado: string;
    horarioDomingoFeriado: string;
    mensagemForaHorario: string;
    slaRespostaMinutos: number;
    slaResolucaoHoras: number;
    mensagemBoasVindas: string;
    permitirTransbordoNocForaHorario: boolean;
  };
  respostasRapidas: MacroItem[];
}

const DEFAULT_CONFIG: SystemConfig = {
  provedor: {
    nomeFantasia: "NAP Telecom Fibra",
    razaoSocial: "NAP Telecomunicações e Conectividade Ltda",
    cnpj: "18.345.678/0001-90",
    inscricaoEstadual: "112.456.789.001",
    telefoneSuporte: "0800 591 0000",
    telefoneWhatsapp: "(11) 98765-4321",
    emailAtendimento: "suporte@naptelecom.com.br",
    cidadeUf: "São Paulo - SP",
    corPrincipal: "#2563eb",
    corSecundaria: "#10b981",
    logoUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=150&auto=format&fit=crop&q=80",
    portalUrl: "https://central.naptelecom.com.br",
    themeMode: "dark"
  },
  sgp: {
    urlBase: "https://api.sgp.provedor.com.br/v1",
    appId: "NAP_SGP_PROD_991",
    token: "sgp_sec_token_99182374981729",
    syncIntervalMinutes: 15,
    autoDesbloqueio48h: true,
    avisoSonoroInadimplente: true,
    habilitarConsultaRadius: true,
    status: "conectado"
  },
  telefonia: {
    amiHost: "192.168.10.250",
    amiPort: 5038,
    amiUser: "nap_ami_user",
    amiSecret: "ami_asterisk_secret_2026",
    contextoDiscagem: "from-internal",
    ramalWebRTC: "2001",
    secretWebRTC: "sip_pass_2001_webrtc",
    websocketUrl: "wss://pbx.naptelecom.com.br:8089/ws",
    gravarChamadas: true,
    transcricaoAutomatica: true,
    status: "conectado"
  },
  whatsapp: {
    phoneNumberId: "109823471029384",
    businessAccountId: "394857201928374",
    tokenAcesso: "EAAGm0PXq1...9823h4",
    webhookUrl: "https://api.naptelecom.com.br/api/webhooks/whatsapp",
    verifyToken: "nap_waba_verify_token_secure",
    canalOficial: true,
    envioAutomaticoPix: true,
    status: "conectado"
  },
  ia: {
    modeloPrimario: "gemini-2.5-flash",
    provedorGateway: "9router",
    temperatura: 0.6,
    topP: 0.95,
    maxTokens: 1024,
    promptSuporte: "Você é o assistente virtual do {nome_provedor}. Atenda clientes de internet fibra óptica com empatia e precisão técnica. Identifique o sinal óptico e oriente o cliente a verificar conexões físicas e reset de 30s da ONU. Se houver rompimento de fibra ou sinal atenuado acima de -27dBm, ofereça abertura de OS presencial.",
    promptVendas: "Você é consultor comercial do {nome_provedor}. Oferte planos residenciais de fibra óptica simétrica com Wi-Fi 6 Mesh, Paramount+ e suporte 24h. Destaque instalação gratuita e fidelidade de 12 meses.",
    promptCobranca: "Você atua no setor financeiro do {nome_provedor}. Forneça a chave PIX copia-e-cola e código de barras instantâneo. Se o cliente tiver bloqueio parcial, explique a opção de Desbloqueio em Confiança válido por 48 horas.",
    gatilhoTransbordo: "solicitacao_cliente",
    copilotoAtivo: true,
    status: "conectado"
  },
  seguranca: {
    sessaoTimeoutMinutos: 60,
    exigir2FAOperadores: true,
    permitirAcessoExterno: true,
    limiteTentativasLogin: 5,
    armazenamentoLogsDias: 90
  },
  atendimento: {
    horarioSemana: "08:00 - 20:00",
    horarioSabado: "08:00 - 14:00",
    horarioDomingoFeriado: "Plantão NOC Emergencial",
    mensagemForaHorario: "Olá! Nosso atendimento humano encerrou por hoje. Você pode retirar sua 2ª via de fatura, obter a chave PIX ou solicitar o desbloqueio em confiança de 48h pelo Portal do Assinante ou diretamente com nosso assistente virtual!",
    slaRespostaMinutos: 5,
    slaResolucaoHoras: 4,
    mensagemBoasVindas: "Olá! Seja bem-vindo à central de atendimento do {nome_provedor}. Para agilizar seu contato, informe seu CPF ou motivo do contato.",
    permitirTransbordoNocForaHorario: true
  },
  respostasRapidas: [
    { id: "macro-1", atalho: "/pix", titulo: "Chave PIX Copia e Cola", conteudo: "Aqui está sua chave PIX para pagamento: {chave_pix}. A baixa no sistema é imediata!", categoria: "Financeiro" },
    { id: "macro-2", atalho: "/reset_onu", titulo: "Reinicialização da ONU", conteudo: "Por favor, desligue o roteador e a ONU da tomada por 30 segundos e ligue novamente. Aguarde os leds PON e Internet estabilizarem.", categoria: "Suporte" },
    { id: "macro-3", atalho: "/desbloqueio", titulo: "Desbloqueio em Confiança", conteudo: "Seu sinal de internet foi liberado provisoriamente por 48 horas em confiança! O comprovante pode ser enviado por aqui.", categoria: "Financeiro" },
    { id: "macro-4", atalho: "/visita_tecnica", titulo: "Agendamento Visita Técnica", conteudo: "Ordem de serviço aberta com sucesso. Nossa equipe técnica entrará em contato para alinhar o turno de visita.", categoria: "Suporte" },
    { id: "macro-5", atalho: "/velocidade", titulo: "Instruções Teste de Velocidade", conteudo: "Para testar com precisão, pause downloads e acesse https://fast.com preferencialmente conectado via cabo de rede ou no Wi-Fi 5GHz.", categoria: "Suporte" }
  ]
};

type TabType = 'identidade' | 'sgp' | 'telefonia' | 'whatsapp' | 'ia' | 'atendimento' | 'macros' | 'seguranca';

export default function SuperAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('identidade');
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal e Edição de Macros
  const [macroModalOpen, setMacroModalOpen] = useState(false);
  const [editingMacro, setEditingMacro] = useState<MacroItem | null>(null);
  const [macroFilterCategory, setMacroFilterCategory] = useState<string>('todos');
  const [formMacro, setFormMacro] = useState<{ atalho: string; titulo: string; conteudo: string; categoria: 'Financeiro' | 'Suporte' | 'Vendas' | 'Geral' }>({
    atalho: '',
    titulo: '',
    conteudo: '',
    categoria: 'Geral'
  });

  // Visibilidade de senhas
  const [showSgpToken, setShowSgpToken] = useState(false);
  const [showAmiSecret, setShowAmiSecret] = useState(false);
  const [showWabaToken, setShowWabaToken] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Estados de testes de integração
  const [testing, setTesting] = useState<{ [key: string]: boolean }>({});
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({});

  // Auditoria
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Carregar dados da API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/configuracoes');
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            setConfig(data.config);
          }
        }
        // Carrega auditoria
        const auditRes = await fetch('/api/configuracoes/auditoria');
        if (auditRes.ok) {
          const auditData = await auditRes.json();
          if (auditData.logs) {
            setAuditLogs(auditData.logs);
          }
        }
      } catch (err) {
        console.error("Falha ao carregar configurações:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Configurações do sistema gravadas com sucesso!');
        // Atualiza auditoria
        const auditRes = await fetch('/api/configuracoes/auditoria');
        if (auditRes.ok) {
          const auditData = await auditRes.json();
          if (auditData.logs) setAuditLogs(auditData.logs);
        }
      } else {
        showToast('error', data.error || 'Erro ao persistir configurações.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Falha de comunicação com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  // Testes individuais de microsserviços
  const runTest = async (service: 'sgp' | 'freepbx' | 'whatsapp' | 'gemini') => {
    setTesting(prev => ({ ...prev, [service]: true }));
    try {
      const res = await fetch(`/api/configuracoes/test-${service}`, { method: 'POST' });
      const data = await res.json();
      setTestResults(prev => ({ ...prev, [service]: data }));
      if (data.success) {
        showToast('success', `Teste de conexão com ${service.toUpperCase()} concluído com sucesso!`);
      } else {
        showToast('error', `Falha no teste com ${service.toUpperCase()}.`);
      }
    } catch (err: any) {
      showToast('error', `Erro ao testar ${service.toUpperCase()}: ${err.message}`);
    } finally {
      setTesting(prev => ({ ...prev, [service]: false }));
    }
  };

  // Exportar backup
  const handleExportBackup = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(config, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `nap_config_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'Arquivo de backup exportado com sucesso.');
  };

  // Importar backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.provedor && parsed.sgp) {
          setConfig(parsed);
          showToast('success', 'Backup importado! Clique em Salvar para aplicar.');
        } else {
          showToast('error', 'Arquivo de backup com formato inválido.');
        }
      } catch (err) {
        showToast('error', 'Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Funções de Gestão de Macros
  const handleOpenNewMacro = () => {
    setEditingMacro(null);
    setFormMacro({
      atalho: '/',
      titulo: '',
      conteudo: '',
      categoria: 'Geral'
    });
    setMacroModalOpen(true);
  };

  const handleEditMacro = (macro: MacroItem) => {
    setEditingMacro(macro);
    setFormMacro({
      atalho: macro.atalho,
      titulo: macro.titulo,
      conteudo: macro.conteudo,
      categoria: macro.categoria
    });
    setMacroModalOpen(true);
  };

  const handleDeleteMacro = (id: string) => {
    setConfig(prev => ({
      ...prev,
      respostasRapidas: (prev.respostasRapidas || []).filter(m => m.id !== id)
    }));
    showToast('success', 'Macro removida com sucesso. Clique em Salvar para persistir.');
  };

  const handleSaveMacro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMacro.atalho.trim() || !formMacro.titulo.trim() || !formMacro.conteudo.trim()) {
      showToast('error', 'Preencha todos os campos da macro.');
      return;
    }

    const formattedShortcut = formMacro.atalho.startsWith('/') ? formMacro.atalho.trim() : `/${formMacro.atalho.trim()}`;

    if (editingMacro) {
      setConfig(prev => ({
        ...prev,
        respostasRapidas: (prev.respostasRapidas || []).map(m => 
          m.id === editingMacro.id ? { ...m, ...formMacro, atalho: formattedShortcut } : m
        )
      }));
      showToast('success', 'Macro atualizada! Clique em Salvar para persistir.');
    } else {
      const newMacro: MacroItem = {
        id: `macro-${Date.now()}`,
        atalho: formattedShortcut,
        titulo: formMacro.titulo.trim(),
        conteudo: formMacro.conteudo.trim(),
        categoria: formMacro.categoria
      };
      setConfig(prev => ({
        ...prev,
        respostasRapidas: [newMacro, ...(prev.respostasRapidas || [])]
      }));
      showToast('success', 'Nova macro adicionada! Clique em Salvar para persistir.');
    }
    setMacroModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0b0f19]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm font-bold text-slate-400">Carregando parâmetros do sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0f19] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#101726] p-6 rounded-2xl border border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Sliders size={22} />
              </span>
              <h1 className="text-2xl font-bold text-white font-outfit">Configurações do Sistema</h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 tracking-wider">
                <ShieldCheck size={12} /> Multi-tenant Ativo
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Gerencie a identidade visual, parâmetros de billing SGP, telefonia Asterisk/FreePBX e credenciais de IA.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportBackup}
              type="button"
              className="px-4 py-2.5 bg-[#0b0f19] hover:bg-white/5 text-slate-300 border border-white/5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Exportar arquivo JSON com todas as configurações"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Exportar Backup</span>
            </button>

            <label className="cursor-pointer px-4 py-2.5 bg-[#0b0f19] hover:bg-white/5 text-slate-300 border border-white/5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5">
              <Upload size={14} />
              <span className="hidden sm:inline">Restaurar</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              type="button"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2  disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{saving ? 'Gravando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </div>

        {/* Toast Notifier */}
        {toastMessage && (
          <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            <div className="flex items-center gap-2">
              {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{toastMessage.text}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-xs font-bold underline ml-4 hover:opacity-80">Fechar</button>
          </div>
        )}

        {/* Painel de Status das Integrações Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <IntegrationStatusBadge 
            title="SGP Billing" 
            sub="Porta 80 / REST" 
            status="online" 
            icon={<Database size={16} className="text-emerald-600" />} 
            latency={testResults.sgp?.latenciaMs || 38}
          />
          <IntegrationStatusBadge 
            title="Asterisk FreePBX" 
            sub="AMI 5038 / WSS" 
            status="online" 
            icon={<Server size={16} className="text-blue-400" />} 
            latency={testResults.freepbx?.latenciaMs || 29}
          />
          <IntegrationStatusBadge 
            title="WhatsApp WABA" 
            sub="Cloud API Meta" 
            status="online" 
            icon={<MessageCircle size={16} className="text-emerald-600" />} 
            latency={testResults.whatsapp?.latenciaMs || 45}
          />
          <IntegrationStatusBadge 
            title="Gemini IA 9router" 
            sub="gemini-2.5-flash" 
            status="online" 
            icon={<Sparkles size={16} className="text-indigo-600" />} 
            latency={testResults.gemini?.latenciaMs || 185}
          />
        </div>

        {/* Abas de Navegação Principal */}
        <div className="bg-[#101726] rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex border-b border-white/5 overflow-x-auto bg-[#0b0f19]">
            <TabButton 
              active={activeTab === 'identidade'} 
              onClick={() => setActiveTab('identidade')} 
              icon={<Building2 size={16} />} 
              label="Identidade & White-label" 
            />
            <TabButton 
              active={activeTab === 'sgp'} 
              onClick={() => setActiveTab('sgp')} 
              icon={<Database size={16} />} 
              label="ERP SGP (Billing)" 
            />
            <TabButton 
              active={activeTab === 'telefonia'} 
              onClick={() => setActiveTab('telefonia')} 
              icon={<PhoneCall size={16} />} 
              label="Telefonia Asterisk" 
            />
            <TabButton 
              active={activeTab === 'whatsapp'} 
              onClick={() => setActiveTab('whatsapp')} 
              icon={<MessageCircle size={16} />} 
              label="WhatsApp WABA" 
            />
            <TabButton 
              active={activeTab === 'ia'} 
              onClick={() => setActiveTab('ia')} 
              icon={<Bot size={16} />} 
              label="Inteligência Artificial" 
            />
            <TabButton 
              active={activeTab === 'atendimento'} 
              onClick={() => setActiveTab('atendimento')} 
              icon={<Clock size={16} />} 
              label="Horários & SLA" 
            />
            <TabButton 
              active={activeTab === 'macros'} 
              onClick={() => setActiveTab('macros')} 
              icon={<Zap size={16} />} 
              label="Macros & HSM" 
            />
            <TabButton 
              active={activeTab === 'seguranca'} 
              onClick={() => setActiveTab('seguranca')} 
              icon={<Shield size={16} />} 
              label="Segurança & Auditoria" 
            />
          </div>

          <div className="p-6 md:p-8">
            {/* ABA 1: IDENTIDADE & WHITE-LABEL */}
            {activeTab === 'identidade' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                    <Building2 className="text-blue-400" size={18} />
                    Dados Cadastrais do Provedor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Estas informações são exibidas no cabeçalho das faturas, portal do cliente e assinaturas automáticas do chat.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nome Fantasia (Marca do Provedor)</label>
                    <input 
                      type="text" 
                      value={config.provedor.nomeFantasia} 
                      onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, nomeFantasia: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Razão Social</label>
                    <input 
                      type="text" 
                      value={config.provedor.razaoSocial} 
                      onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, razaoSocial: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">CNPJ</label>
                    <input 
                      type="text" 
                      value={config.provedor.cnpj} 
                      onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, cnpj: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Inscrição Estadual (IE)</label>
                    <input 
                      type="text" 
                      value={config.provedor.inscricaoEstadual} 
                      onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, inscricaoEstadual: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Telefone de Suporte / 0800</label>
                    <input 
                      type="text" 
                      value={config.provedor.telefoneSuporte} 
                      onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, telefoneSuporte: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">WhatsApp Principal do Provedor</label>
                    <input 
                      type="text" 
                      value={config.provedor.telefoneWhatsapp} 
                      onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, telefoneWhatsapp: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">E-mail de Atendimento / SAC</label>
                    <input 
                      type="email" 
                      value={config.provedor.emailAtendimento} 
                      onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, emailAtendimento: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cidade e UF de Operação</label>
                    <input 
                      type="text" 
                      value={config.provedor.cidadeUf} 
                      onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, cidadeUf: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                    <Palette className="text-emerald-600" size={18} />
                    Identidade Visual (White-label & Portal PWA)
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Personalize as cores mestras e logotipo do sistema administrativo e do Portal do Cliente.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cor Principal (HEX)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={config.provedor.corPrincipal} 
                          onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, corPrincipal: e.target.value } })}
                          className="w-11 h-11 p-1 rounded-xl border border-white/5 cursor-pointer bg-[#101726]"
                        />
                        <input 
                          type="text" 
                          value={config.provedor.corPrincipal} 
                          onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, corPrincipal: e.target.value } })}
                          className="flex-1 p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-mono text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 uppercase"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        {['#2563eb', '#4f46e5', '#059669', '#dc2626', '#d97706', '#7c3aed'].map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setConfig({ ...config, provedor: { ...config.provedor, corPrincipal: hex } })}
                            style={{ backgroundColor: hex }}
                            className="w-6 h-6 rounded-md border border-white/5 hover:scale-110 transition-transform "
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">URL do Logotipo (PNG / SVG)</label>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={config.provedor.logoUrl} 
                          onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, logoUrl: e.target.value } })}
                          className="flex-1 p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                        <div className="w-12 h-11 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                          {config.provedor.logoUrl ? (
                            <img src={config.provedor.logoUrl} alt="Logo Preview" className="max-h-8 max-w-10 object-contain" />
                          ) : (
                            <Globe size={18} className="text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Domínio do Portal do Assinante</label>
                      <input 
                        type="text" 
                        value={config.provedor.portalUrl} 
                        onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, portalUrl: e.target.value } })}
                        className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        placeholder="https://central.meuprovedor.com.br"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tema de Interface Padrão</label>
                      <select
                        value={config.provedor.themeMode}
                        onChange={(e) => setConfig({ ...config, provedor: { ...config.provedor, themeMode: e.target.value as any } })}
                        className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      >
                        <option value="dark">Tema Escuro Premium (Padrão NOC / Suporte)</option>
                        <option value="light">Tema Claro Corporativo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: ERP SGP BILLING */}
            {activeTab === 'sgp' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                    <Database className="text-emerald-600" size={18} />
                    Conexão com Sistema de Gestão SGP
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configuração da API REST do SGP para leitura de faturas, desbloqueio em confiança, contratos e telemetria de OLT.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">URL Base da API do SGP</label>
                    <input 
                      type="text" 
                      value={config.sgp.urlBase} 
                      onChange={(e) => setConfig({ ...config, sgp: { ...config.sgp, urlBase: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">SGP App ID</label>
                    <input 
                      type="text" 
                      value={config.sgp.appId} 
                      onChange={(e) => setConfig({ ...config, sgp: { ...config.sgp, appId: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Token Secreto de API</label>
                    <div className="relative">
                      <input 
                        type={showSgpToken ? 'text' : 'password'} 
                        value={config.sgp.token} 
                        onChange={(e) => setConfig({ ...config, sgp: { ...config.sgp, token: e.target.value } })}
                        className="w-full p-2.5 pr-10 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowSgpToken(!showSgpToken)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-400"
                      >
                        {showSgpToken ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Intervalo de Sincronização Automática</label>
                    <select
                      value={config.sgp.syncIntervalMinutes}
                      onChange={(e) => setConfig({ ...config, sgp: { ...config.sgp, syncIntervalMinutes: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value={5}>A cada 5 minutos (Alta rotatividade)</option>
                      <option value={15}>A cada 15 minutos (Recomendado)</option>
                      <option value={30}>A cada 30 minutos</option>
                      <option value={60}>A cada 1 hora</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#0b0f19] rounded-2xl border border-white/5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Regras de Negócio & Cobrança Automática</span>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.sgp.autoDesbloqueio48h} 
                      onChange={(e) => setConfig({ ...config, sgp: { ...config.sgp, autoDesbloqueio48h: e.target.checked } })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Habilitar Desbloqueio 48h em Confiança Automático</span>
                      <span className="text-[11px] text-slate-500">Permite que assinantes inadimplentes reativem o sinal provisoriamente via Portal ou WhatsApp sem intervenção humana.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.sgp.avisoSonoroInadimplente} 
                      onChange={(e) => setConfig({ ...config, sgp: { ...config.sgp, avisoSonoroInadimplente: e.target.checked } })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Alerta Visual e Sonoro de Fatura em Atraso para Operadores</span>
                      <span className="text-[11px] text-slate-500">Destaca em vermelho no atendimento quando o cliente que está chamando possui fatura vencida há mais de 5 dias.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.sgp.habilitarConsultaRadius} 
                      onChange={(e) => setConfig({ ...config, sgp: { ...config.sgp, habilitarConsultaRadius: e.target.checked } })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Consulta Instantânea de Sessão RADIUS (PPPoE / IP)</span>
                      <span className="text-[11px] text-slate-500">Lê o IP atribuído, MAC Address da ONU e tempo de conexão diretamente do servidor de acesso MikroTik/Huawei.</span>
                    </div>
                  </label>
                </div>

                {/* Card de Teste SGP */}
                <div className="p-4 bg-[#0b0f19] rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                      <Database size={14} className="text-emerald-400" /> Teste de Conectividade do SGP
                    </h4>
                    <p className="text-xs text-slate-400">
                      Executa verificação da API REST, banco de faturas e servidores de autenticação RADIUS.
                    </p>
                    {testResults.sgp && (
                      <p className="text-xs font-mono text-emerald-400 mt-2 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg inline-block">
                        ✓ Status: {testResults.sgp.status.toUpperCase()} • Latência: {testResults.sgp.latenciaMs}ms • Versão: {testResults.sgp.versaoApi}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => runTest('sgp')}
                    disabled={testing.sgp}
                    type="button"
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-emerald-500/20 shrink-0"
                  >
                    {testing.sgp ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    <span>{testing.sgp ? 'Testando...' : 'Testar Conexão SGP'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ABA 3: TELEFONIA ASTERISK & FREEPBX */}
            {activeTab === 'telefonia' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                    <Server className="text-blue-400" size={18} />
                    Telefonia Asterisk & FreePBX 17
                  </h3>
                  <p className="text-xs text-slate-500">
                    Parâmetros para CTI Reverso, WebRTC SIP nos navegadores dos atendentes e integração com a interface AMI (Asterisk Manager Interface).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Host Asterisk AMI (IP ou Domínio)</label>
                    <input 
                      type="text" 
                      value={config.telefonia.amiHost} 
                      onChange={(e) => setConfig({ ...config, telefonia: { ...config.telefonia, amiHost: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Porta AMI (Padrão 5038)</label>
                    <input 
                      type="number" 
                      value={config.telefonia.amiPort} 
                      onChange={(e) => setConfig({ ...config, telefonia: { ...config.telefonia, amiPort: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Usuário AMI (Asterisk Manager)</label>
                    <input 
                      type="text" 
                      value={config.telefonia.amiUser} 
                      onChange={(e) => setConfig({ ...config, telefonia: { ...config.telefonia, amiUser: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Senha Secreta AMI</label>
                    <div className="relative">
                      <input 
                        type={showAmiSecret ? 'text' : 'password'} 
                        value={config.telefonia.amiSecret} 
                        onChange={(e) => setConfig({ ...config, telefonia: { ...config.telefonia, amiSecret: e.target.value } })}
                        className="w-full p-2.5 pr-10 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowAmiSecret(!showAmiSecret)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-400"
                      >
                        {showAmiSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Ramal SIP WebRTC Padrão</label>
                    <input 
                      type="text" 
                      value={config.telefonia.ramalWebRTC} 
                      onChange={(e) => setConfig({ ...config, telefonia: { ...config.telefonia, ramalWebRTC: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">WebSocket WSS do FreePBX (WebRTC)</label>
                    <input 
                      type="text" 
                      value={config.telefonia.websocketUrl} 
                      onChange={(e) => setConfig({ ...config, telefonia: { ...config.telefonia, websocketUrl: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                      placeholder="wss://pbx.provedor.com.br:8089/ws"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#0b0f19] rounded-2xl border border-white/5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Gravação e Inteligência de Voz</span>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.telefonia.gravarChamadas} 
                      onChange={(e) => setConfig({ ...config, telefonia: { ...config.telefonia, gravarChamadas: e.target.checked } })}
                      className="w-4 h-4 rounded text-blue-400 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Gravação Contínua de Todas as Ligações de Atendimento</span>
                      <span className="text-[11px] text-slate-500">Armazena áudio em formato WAV/MP3 com vinculação ao protocolo de atendimento no CRM.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.telefonia.transcricaoAutomatica} 
                      onChange={(e) => setConfig({ ...config, telefonia: { ...config.telefonia, transcricaoAutomatica: e.target.checked } })}
                      className="w-4 h-4 rounded text-blue-400 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Transcrição de Áudio em Tempo Real via Gemini Voice Intelligence</span>
                      <span className="text-[11px] text-slate-500">Transcreve a conversa operador-cliente, detectando sentimento e alerta de churn ou cliente irritado.</span>
                    </div>
                  </label>
                </div>

                {/* Card de Teste FreePBX */}
                <div className="p-4 bg-[#0b0f19] rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-1">
                      <Server size={14} className="text-blue-400" /> Diagnóstico de Conexão Asterisk / FreePBX
                    </h4>
                    <p className="text-xs text-slate-400">
                      Valida credenciais do socket AMI, canais simultâneos e registro de WebRTC.
                    </p>
                    {testResults.freepbx && (
                      <p className="text-xs font-mono text-blue-400 mt-2 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg inline-block">
                        ✓ Status: {testResults.freepbx.status.toUpperCase()} • Latência: {testResults.freepbx.latenciaMs}ms • {testResults.freepbx.versaoAsterisk} • {testResults.freepbx.ramaisRegistrados} Ramais Ativos
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => runTest('freepbx')}
                      disabled={testing.freepbx}
                      type="button"
                      className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 active:scale-95 text-blue-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-blue-500/20 shrink-0"
                    >
                      {testing.freepbx ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                      <span>{testing.freepbx ? 'Testando...' : 'Testar Conexão Asterisk'}</span>
                    </button>
                    <button
                      onClick={() => fetch('/api/webhooks/freepbx/incoming', { method: 'POST' })}
                      type="button"
                      className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 rounded-xl text-xs font-bold transition-all shrink-0"
                    >
                      Simular Chamada
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: WHATSAPP BUSINESS API (WABA) */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                    <MessageCircle className="text-emerald-600" size={18} />
                    WhatsApp Business API (WABA Oficial Meta)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configurações oficiais da Cloud API da Meta para atendimento omnichannel sem risco de banimento de chip.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number ID</label>
                    <input 
                      type="text" 
                      value={config.whatsapp.phoneNumberId} 
                      onChange={(e) => setConfig({ ...config, whatsapp: { ...config.whatsapp, phoneNumberId: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">WhatsApp Business Account ID (WABA ID)</label>
                    <input 
                      type="text" 
                      value={config.whatsapp.businessAccountId} 
                      onChange={(e) => setConfig({ ...config, whatsapp: { ...config.whatsapp, businessAccountId: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Token Permanente de Acesso (Meta Graph API)</label>
                    <div className="relative">
                      <input 
                        type={showWabaToken ? 'text' : 'password'} 
                        value={config.whatsapp.tokenAcesso} 
                        onChange={(e) => setConfig({ ...config, whatsapp: { ...config.whatsapp, tokenAcesso: e.target.value } })}
                        className="w-full p-2.5 pr-10 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowWabaToken(!showWabaToken)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-400"
                      >
                        {showWabaToken ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Webhook URL do Servidor NAP (Cole no painel Meta Developers)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={config.whatsapp.webhookUrl} 
                        readOnly
                        className="flex-1 p-2.5 bg-white/5 border border-white/5 rounded-xl text-xs font-mono text-slate-300 select-all"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(config.whatsapp.webhookUrl, 'webhookUrl')}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        {copiedKey === 'webhookUrl' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        <span>{copiedKey === 'webhookUrl' ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Verify Token (Chave de Validação do Webhook)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={config.whatsapp.verifyToken} 
                        onChange={(e) => setConfig({ ...config, whatsapp: { ...config.whatsapp, verifyToken: e.target.value } })}
                        className="flex-1 p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(config.whatsapp.verifyToken, 'verifyToken')}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        {copiedKey === 'verifyToken' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        <span>{copiedKey === 'verifyToken' ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Regra de Envio Financeiro Automático</label>
                    <label className="flex items-center gap-3 p-3 bg-[#0b0f19] border border-white/5 rounded-xl cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.whatsapp.envioAutomaticoPix} 
                        onChange={(e) => setConfig({ ...config, whatsapp: { ...config.whatsapp, envioAutomaticoPix: e.target.checked } })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-200">Enviar Chave PIX e PDF ao receber "2ª via" ou "boleto"</span>
                    </label>
                  </div>
                </div>

                {/* Card de Teste WABA */}
                <div className="p-4 bg-[#0b0f19] rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                      <MessageCircle size={14} className="text-emerald-400" /> Diagnóstico WhatsApp Business Cloud API
                    </h4>
                    <p className="text-xs text-slate-400">
                      Verifica token de acesso permanente, qualidade do número de envio na Meta e templates HSM aprovados.
                    </p>
                    {testResults.whatsapp && (
                      <p className="text-xs font-mono text-emerald-400 mt-2 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg inline-block">
                        ✓ Número: {testResults.whatsapp.phoneNumber} • Qualidade: {testResults.whatsapp.qualidadeNumero} • {testResults.whatsapp.templatesAprovados} Templates HSM Prontos
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => runTest('whatsapp')}
                    disabled={testing.whatsapp}
                    type="button"
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-emerald-500/20 shrink-0"
                  >
                    {testing.whatsapp ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    <span>{testing.whatsapp ? 'Testando...' : 'Testar Conexão WhatsApp'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ABA 5: INTELIGÊNCIA ARTIFICIAL & GEMINI 9ROUTER */}
            {activeTab === 'ia' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                    <Bot className="text-indigo-600" size={18} />
                    Inteligência Artificial (Google Gemini via 9router)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ajuste parâmetros de linguagem natural, criatividade e instruções de sistema específicas para cada vertical de atendimento.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Modelo Primário de IA</label>
                    <select
                      value={config.ia.modeloPrimario}
                      onChange={(e) => setConfig({ ...config, ia: { ...config.ia, modeloPrimario: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      <option value="gemini-2.5-flash">gemini-2.5-flash (Recomendado - Ultra Rápido & Menor Custo)</option>
                      <option value="gemini-3.5-pro">gemini-3.5-pro (Raciocínio Técnico Profundo)</option>
                      <option value="gemini-2.5-flash">gemini-2.5-flash (Backup de Alta Disponibilidade)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Gateway de Roteamento</label>
                    <select
                      value={config.ia.provedorGateway}
                      onChange={(e) => setConfig({ ...config, ia: { ...config.ia, provedorGateway: e.target.value } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      <option value="9router">9router (Failover Automático & Rate-Limit)</option>
                      <option value="direct">Google AI Studio Direto (Server-Side)</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <span>Temperatura (Criatividade)</span>
                      <span className="text-indigo-600 font-mono font-bold">{config.ia.temperatura}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.05"
                      value={config.ia.temperatura} 
                      onChange={(e) => setConfig({ ...config, ia: { ...config.ia, temperatura: parseFloat(e.target.value) } })}
                      className="w-full accent-indigo-600 mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>Mais Preciso (0.1)</span>
                      <span>Mais Criativo (1.0)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Prompt do Sistema: Suporte Técnico & Fibra N1</label>
                      <span className="text-[11px] text-slate-400">Variáveis: {'{nome_provedor}'}, {'{sinal_optico}'}, {'{cidade}'}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={config.ia.promptSuporte}
                      onChange={(e) => setConfig({ ...config, ia: { ...config.ia, promptSuporte: e.target.value } })}
                      className="w-full p-3 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-medium text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Prompt do Sistema: Vendas & Aquisição de Clientes</label>
                      <span className="text-[11px] text-slate-400">Variáveis: {'{nome_provedor}'}, {'{planos_disponiveis}'}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={config.ia.promptVendas}
                      onChange={(e) => setConfig({ ...config, ia: { ...config.ia, promptVendas: e.target.value } })}
                      className="w-full p-3 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-medium text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Prompt do Sistema: Cobrança Humanizada & PIX</label>
                      <span className="text-[11px] text-slate-400">Variáveis: {'{nome_provedor}'}, {'{dias_atraso}'}, {'{valor}'}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={config.ia.promptCobranca}
                      onChange={(e) => setConfig({ ...config, ia: { ...config.ia, promptCobranca: e.target.value } })}
                      className="w-full p-3 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-medium text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#0b0f19] rounded-2xl border border-white/5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Gatilhos de Transbordo Humano</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      config.ia.gatilhoTransbordo === 'solicitacao_cliente' 
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                        : 'bg-[#101726] border-white/5 text-slate-400'
                    }`}>
                      <input 
                        type="radio" 
                        name="transbordo" 
                        value="solicitacao_cliente"
                        checked={config.ia.gatilhoTransbordo === 'solicitacao_cliente'}
                        onChange={() => setConfig({ ...config, ia: { ...config.ia, gatilhoTransbordo: 'solicitacao_cliente' } })}
                        className="hidden"
                      />
                      <span className="text-xs font-bold block mb-1">Sob Solicitação</span>
                      <span className="text-[11px] opacity-80 block">Transfere se o cliente pedir "atendente", "humano" ou demonstrar alta frustração.</span>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      config.ia.gatilhoTransbordo === 'apos_3_falhas' 
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                        : 'bg-[#101726] border-white/5 text-slate-400'
                    }`}>
                      <input 
                        type="radio" 
                        name="transbordo" 
                        value="apos_3_falhas"
                        checked={config.ia.gatilhoTransbordo === 'apos_3_falhas'}
                        onChange={() => setConfig({ ...config, ia: { ...config.ia, gatilhoTransbordo: 'apos_3_falhas' } })}
                        className="hidden"
                      />
                      <span className="text-xs font-bold block mb-1">Após 3 Tentativas</span>
                      <span className="text-[11px] opacity-80 block">Se a IA não resolver a dúvida após 3 mensagens consecutivas, abre ticket para a fila.</span>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      config.ia.gatilhoTransbordo === 'imediato' 
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                        : 'bg-[#101726] border-white/5 text-slate-400'
                    }`}>
                      <input 
                        type="radio" 
                        name="transbordo" 
                        value="imediato"
                        checked={config.ia.gatilhoTransbordo === 'imediato'}
                        onChange={() => setConfig({ ...config, ia: { ...config.ia, gatilhoTransbordo: 'imediato' } })}
                        className="hidden"
                      />
                      <span className="text-xs font-bold block mb-1">Apenas Copiloto</span>
                      <span className="text-[11px] opacity-80 block">A IA não responde diretamente aos clientes; apenas sugere respostas aos atendentes no Inbox.</span>
                    </label>
                  </div>
                </div>

                {/* Card de Teste IA */}
                <div className="p-4 bg-[#0b0f19] rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1">
                      <Sparkles size={14} className="text-indigo-400" /> Diagnóstico de Latência do Gateway Gemini
                    </h4>
                    <p className="text-xs text-slate-400">
                      Dispara prompt de verificação ao modelo para auditar tempo de resposta e integridade da chave.
                    </p>
                    {testResults.gemini && (
                      <p className="text-xs font-mono text-indigo-400 mt-2 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-lg inline-block">
                        ✓ Modelo: {testResults.gemini.modelo} • Latência: {testResults.gemini.latenciaMs}ms • Gateway: {testResults.gemini.provedor}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => runTest('gemini')}
                    disabled={testing.gemini}
                    type="button"
                    className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-95 text-indigo-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-indigo-500/20 shrink-0"
                  >
                    {testing.gemini ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    <span>{testing.gemini ? 'Testando...' : 'Testar Conexão IA'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ABA 6: SEGURANÇA, AUDITORIA & BACKUP */}
            {activeTab === 'seguranca' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                    <Shield className="text-rose-600" size={18} />
                    Segurança, Sessões & Logs de Auditoria
                  </h3>
                  <p className="text-xs text-slate-500">
                    Controle de políticas de acesso de operadores, bloqueio de intrusão e histórico de alterações em configurações críticas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Timeout de Inatividade da Sessão (Minutos)</label>
                    <input 
                      type="number" 
                      value={config.seguranca.sessaoTimeoutMinutos} 
                      onChange={(e) => setConfig({ ...config, seguranca: { ...config.seguranca, sessaoTimeoutMinutos: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Limite de Tentativas de Login Inválidas</label>
                    <input 
                      type="number" 
                      value={config.seguranca.limiteTentativasLogin} 
                      onChange={(e) => setConfig({ ...config, seguranca: { ...config.seguranca, limiteTentativasLogin: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Retenção de Logs no Servidor (Dias)</label>
                    <input 
                      type="number" 
                      value={config.seguranca.armazenamentoLogsDias} 
                      onChange={(e) => setConfig({ ...config, seguranca: { ...config.seguranca, armazenamentoLogsDias: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <div className="flex flex-col justify-end space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.seguranca.exigir2FAOperadores} 
                        onChange={(e) => setConfig({ ...config, seguranca: { ...config.seguranca, exigir2FAOperadores: e.target.checked } })}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-xs font-bold text-slate-200">Exigir Autenticação em 2 Fatores (2FA) para Administradores</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.seguranca.permitirAcessoExterno} 
                        onChange={(e) => setConfig({ ...config, seguranca: { ...config.seguranca, permitirAcessoExterno: e.target.checked } })}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-xs font-bold text-slate-200">Permitir Acesso Fora da Rede Local do Provedor (VPN/WAN)</span>
                    </label>
                  </div>
                </div>

                {/* Log de Auditoria */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-500" /> Registro de Auditoria Administrativa Recente
                    </h4>
                    <span className="text-[11px] text-slate-400">Imutável • Protegido contra exclusão</span>
                  </div>

                  <div className="border border-white/5 rounded-xl overflow-hidden bg-[#101726]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0b0f19] border-b border-white/5 text-slate-400 font-bold">
                        <tr>
                          <th className="py-2.5 px-4">Usuário</th>
                          <th className="py-2.5 px-4">Módulo</th>
                          <th className="py-2.5 px-4">Ação Realizada</th>
                          <th className="py-2.5 px-4">IP</th>
                          <th className="py-2.5 px-4">Horário</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-[#0b0f19]/70">
                            <td className="py-2.5 px-4 font-bold text-white">{log.usuario}</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-slate-400">{log.modulo}</span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-400">{log.detalhes}</td>
                            <td className="py-2.5 px-4 font-mono text-slate-500">{log.ip}</td>
                            <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{log.data}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ABA: ATENDIMENTO, HORÁRIOS & SLA */}
            {activeTab === 'atendimento' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                    <Clock className="text-blue-400" size={18} />
                    Horários de Atendimento, Turnos & SLA
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defina o expediente operacional do provedor, prazos máximos de resposta e o comportamento da IA fora do horário comercial.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Segunda a Sexta-Feira</label>
                    <input 
                      type="text" 
                      value={config.atendimento?.horarioSemana || "08:00 - 20:00"} 
                      onChange={(e) => setConfig({ 
                        ...config, 
                        atendimento: { ...(config.atendimento || DEFAULT_CONFIG.atendimento), horarioSemana: e.target.value } 
                      })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                      placeholder="08:00 - 20:00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Sábados</label>
                    <input 
                      type="text" 
                      value={config.atendimento?.horarioSabado || "08:00 - 14:00"} 
                      onChange={(e) => setConfig({ 
                        ...config, 
                        atendimento: { ...(config.atendimento || DEFAULT_CONFIG.atendimento), horarioSabado: e.target.value } 
                      })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                      placeholder="08:00 - 14:00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Domingos & Feriados</label>
                    <input 
                      type="text" 
                      value={config.atendimento?.horarioDomingoFeriado || "Plantão NOC Emergencial"} 
                      onChange={(e) => setConfig({ 
                        ...config, 
                        atendimento: { ...(config.atendimento || DEFAULT_CONFIG.atendimento), horarioDomingoFeriado: e.target.value } 
                      })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                      placeholder="Plantão NOC Emergencial"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      SLA Máximo de Primeira Resposta (Minutos)
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      max="120"
                      value={config.atendimento?.slaRespostaMinutos || 5} 
                      onChange={(e) => setConfig({ 
                        ...config, 
                        atendimento: { ...(config.atendimento || DEFAULT_CONFIG.atendimento), slaRespostaMinutos: Number(e.target.value) } 
                      })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Tempo limite para o primeiro atendente responder no Inbox.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      SLA de Resolução de Ticket / OS (Horas)
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      max="72"
                      value={config.atendimento?.slaResolucaoHoras || 4} 
                      onChange={(e) => setConfig({ 
                        ...config, 
                        atendimento: { ...(config.atendimento || DEFAULT_CONFIG.atendimento), slaResolucaoHoras: Number(e.target.value) } 
                      })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Meta para tabulação ou fechamento de chamado técnico no CRM.</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mensagem de Boas-Vindas (Saudação Automática)</label>
                      <span className="text-[11px] text-slate-400">Variável: {'{nome_provedor}'}</span>
                    </div>
                    <textarea
                      rows={2}
                      value={config.atendimento?.mensagemBoasVindas || DEFAULT_CONFIG.atendimento.mensagemBoasVindas}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        atendimento: { ...(config.atendimento || DEFAULT_CONFIG.atendimento), mensagemBoasVindas: e.target.value } 
                      })}
                      className="w-full p-3 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mensagem Fora do Expediente Comercial</label>
                      <span className="text-[11px] text-slate-400">Enviada automaticamente quando o cliente inicia conversa fora do horário</span>
                    </div>
                    <textarea
                      rows={3}
                      value={config.atendimento?.mensagemForaHorario || DEFAULT_CONFIG.atendimento.mensagemForaHorario}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        atendimento: { ...(config.atendimento || DEFAULT_CONFIG.atendimento), mensagemForaHorario: e.target.value } 
                      })}
                      className="w-full p-3 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#0b0f19] rounded-2xl border border-white/5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.atendimento?.permitirTransbordoNocForaHorario !== false} 
                      onChange={(e) => setConfig({ 
                        ...config, 
                        atendimento: { ...(config.atendimento || DEFAULT_CONFIG.atendimento), permitirTransbordoNocForaHorario: e.target.checked } 
                      })}
                      className="w-4 h-4 rounded text-blue-400 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Permitir Transbordo para Celular do Plantão NOC Fora do Horário</span>
                      <span className="text-[11px] text-slate-500">Se um cliente relatar rompimento de cabo ou queda em massa fora do expediente, encaminha alerta prioritário para a equipe de plantão.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ABA: MACROS E RESPOSTAS RÁPIDAS */}
            {activeTab === 'macros' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2 mb-1">
                      <Zap className="text-amber-500" size={18} />
                      Central de Macros & Respostas Rápidas (HSM)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cadastre atalhos com barra (ex: <code className="text-blue-400 font-bold">/pix</code>, <code className="text-blue-400 font-bold">/reset_onu</code>) para os operadores responderem em 1-clique no Inbox.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenNewMacro}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2  shrink-0 self-start sm:self-auto"
                  >
                    <Plus size={14} />
                    <span>Nova Resposta Rápida</span>
                  </button>
                </div>

                {/* Filtros de Categoria */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {['todos', 'Financeiro', 'Suporte', 'Vendas', 'Geral'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMacroFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap capitalize ${
                        macroFilterCategory === cat 
                          ? 'bg-blue-600 text-white ' 
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-auto font-medium hidden sm:inline">
                    {(config.respostasRapidas || []).length} macros cadastradas
                  </span>
                </div>

                {/* Lista de Macros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(config.respostasRapidas || [])
                    .filter(m => macroFilterCategory === 'todos' || m.categoria === macroFilterCategory)
                    .map((macro) => (
                      <div key={macro.id} className="p-4 bg-[#101726] rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all  flex flex-col justify-between group">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-mono font-extrabold">
                                {macro.atalho}
                              </span>
                              <h4 className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-xs">{macro.titulo}</h4>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              macro.categoria === 'Financeiro' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              macro.categoria === 'Suporte' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                              macro.categoria === 'Vendas' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-white/5 text-slate-300 border border-white/5'
                            }`}>
                              {macro.categoria}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed bg-[#0b0f19]/70 p-2.5 rounded-xl border border-slate-100 font-sans">
                            {macro.conteudo}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                          <span className="text-[10px] text-slate-400">ID: {macro.id}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditMacro(macro)}
                              className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Editar Macro"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMacro(macro.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Excluir Macro"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Variáveis Dinâmicas de Ajuda */}
                <div className="p-4 bg-blue-500/10/50 rounded-2xl border border-blue-500/20 text-xs space-y-1.5">
                  <span className="font-bold text-blue-900 block">Variáveis dinâmicas aceitas nas mensagens:</span>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                    <span className="px-2 py-0.5 bg-[#101726] border border-blue-500/20 text-blue-800 rounded">{'{nome_cliente}'}</span>
                    <span className="px-2 py-0.5 bg-[#101726] border border-blue-500/20 text-blue-800 rounded">{'{chave_pix}'}</span>
                    <span className="px-2 py-0.5 bg-[#101726] border border-blue-500/20 text-blue-800 rounded">{'{protocolo}'}</span>
                    <span className="px-2 py-0.5 bg-[#101726] border border-blue-500/20 text-blue-800 rounded">{'{nome_provedor}'}</span>
                    <span className="px-2 py-0.5 bg-[#101726] border border-blue-500/20 text-blue-800 rounded">{'{sinal_optico}'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL DE ADICIONAR / EDITAR MACRO */}
        {macroModalOpen && (
          <div className="fixed inset-0 bg-[#0b0f19]/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#101726] rounded-3xl p-6 w-full max-w-lg  border border-white/5 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Zap size={18} />
                  </span>
                  <div>
                    <h3 className="font-bold text-white font-outfit text-sm">
                      {editingMacro ? 'Editar Resposta Rápida' : 'Nova Resposta Rápida'}
                    </h3>
                    <p className="text-[11px] text-slate-500">Configuração de atalho e conteúdo pré-formatado</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMacroModalOpen(false)}
                  className="text-slate-400 hover:text-slate-300 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveMacro} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Atalho de Teclado</label>
                    <input 
                      type="text" 
                      value={formMacro.atalho} 
                      onChange={(e) => setFormMacro({ ...formMacro, atalho: e.target.value })}
                      placeholder="/pix"
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-mono font-bold text-blue-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Categoria</label>
                    <select
                      value={formMacro.categoria}
                      onChange={(e) => setFormMacro({ ...formMacro, categoria: e.target.value as any })}
                      className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    >
                      <option value="Geral">Geral</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Suporte">Suporte</option>
                      <option value="Vendas">Vendas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Título da Macro</label>
                  <input 
                    type="text" 
                    value={formMacro.titulo} 
                    onChange={(e) => setFormMacro({ ...formMacro, titulo: e.target.value })}
                    placeholder="Ex: Instruções de Pagamento PIX"
                    className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold uppercase tracking-wider text-slate-400">Conteúdo da Mensagem</label>
                    <span className="text-[10px] text-slate-400">Clique para inserir:</span>
                  </div>
                  <div className="flex gap-1.5 mb-2 font-mono text-[10px]">
                    {['{nome_cliente}', '{chave_pix}', '{protocolo}'].map((variable) => (
                      <button
                        key={variable}
                        type="button"
                        onClick={() => setFormMacro({ ...formMacro, conteudo: formMacro.conteudo + ' ' + variable })}
                        className="px-2 py-0.5 bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 rounded border border-white/5 transition-colors"
                      >
                        +{variable}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={4}
                    value={formMacro.conteudo}
                    onChange={(e) => setFormMacro({ ...formMacro, conteudo: e.target.value })}
                    placeholder="Escreva a resposta pré-definida..."
                    className="w-full p-2.5 bg-[#0b0f19] border border-white/5 rounded-xl text-xs font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setMacroModalOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    <span>Salvar Macro</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`px-5 py-3.5 text-xs font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
        active 
          ? 'border-blue-500 text-blue-400 bg-[#101726]' 
          : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function IntegrationStatusBadge({ title, sub, status, icon, latency }: { title: string; sub: string; status: 'online' | 'alerta'; icon: React.ReactNode; latency: number }) {
  return (
    <div className="bg-[#101726] p-4 rounded-xl border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#0b0f19] rounded-lg border border-white/10">
          {icon}
        </div>
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-white leading-tight">{title}</h4>
          <span className="text-[10px] text-slate-400 block mt-0.5">{sub}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {latency}ms
        </span>
      </div>
    </div>
  );
}
