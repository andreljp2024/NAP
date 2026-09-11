import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MacroItem {
  id: string;
  atalho: string;
  titulo: string;
  conteudo: string;
  categoria: 'Financeiro' | 'Suporte' | 'Vendas' | 'Geral';
}

export interface PlanoLanding {
  nome: string;
  velocidade: string;
  preco: string;
  tag: string;
  wifi: string;
  streaming?: string;
}

export interface LandingPageConfig {
  templatePadrao: 1 | 2 | 3;
  tituloPrincipal: string;
  subtitulo: string;
  textoBotaoCta: string;
  whatsappVendas: string;
  telefoneVendas: string;
  mostrarBotaoPortal: boolean;
  mostrarBotaoAdmin: boolean;
  mostrarBarraFlutuante: boolean;
  plano1: PlanoLanding;
  plano2: PlanoLanding;
  plano3: PlanoLanding;
}

export type SupportedErp = 'ixc' | 'hubsoft' | 'radiusnet' | 'mksolutions' | 'ispfy' | 'mikweb' | 'sgp';

export interface ErpItemConfig {
  id: SupportedErp;
  nome: string;
  categoria: string;
  protocolo: string;
  urlBase: string;
  token?: string;
  appId?: string;
  clientId?: string;
  clientSecret?: string;
  usuarioId?: string;
  provedorId?: string;
  autoDesbloqueio48h: boolean;
  avisoSonoroInadimplente: boolean;
  habilitarConsultaRadius: boolean;
  syncIntervalMinutes: number;
  status: 'conectado' | 'desconectado' | 'alerta';
  ultimaSincronizacao?: string;
  latenciaMs?: number;
}

export interface SystemConfig {
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
  landingPage: LandingPageConfig;
  erpAtivo: SupportedErp;
  erps: Record<SupportedErp, ErpItemConfig>;
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

export const DEFAULT_CONFIG: SystemConfig = {
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
  landingPage: {
    templatePadrao: 1,
    tituloPrincipal: "Conexão Ultrarrápida em Fibra Óptica para Sua Casa ou Empresa",
    subtitulo: "Internet 100% fibra simétrica com Wi-Fi 6 de alta performance, estabilidade absoluta e suporte técnico humanizado 24h por dia.",
    textoBotaoCta: "Ver Planos Disponíveis",
    whatsappVendas: "(11) 98765-4321",
    telefoneVendas: "0800 591 0000",
    mostrarBotaoPortal: true,
    mostrarBotaoAdmin: true,
    mostrarBarraFlutuante: true,
    plano1: { nome: "Fibra 400 Mega", velocidade: "400", preco: "89,90", tag: "Essencial", wifi: "Wi-Fi 5 Dual-Band Incluso", streaming: "Paramount+ Incluso" },
    plano2: { nome: "Fibra 700 Mega", velocidade: "700", preco: "119,90", tag: "Mais Popular", wifi: "Roteador Wi-Fi 6 Mesh Gigagold", streaming: "Paramount+ & Max Inclusos" },
    plano3: { nome: "Fibra 1 Giga Gamer", velocidade: "1000", preco: "159,90", tag: "Gamer / Pro", wifi: "2x Nós Mesh Wi-Fi 6 Mesh", streaming: "IP Fixo + Rota Baixa Latência" }
  },
  erpAtivo: 'ixc' as SupportedErp,
  erps: {
    ixc: {
      id: 'ixc',
      nome: 'IXC Soft (IXC Provedor)',
      categoria: 'ERP / CRM Telecom',
      protocolo: 'Webservice REST JSON v1',
      urlBase: 'https://ixc.naptelecom.com.br/webservice/v1',
      token: '12:YXBpX3Rva2VuX3NlY3JldG9faXhjXzIwMjY=',
      usuarioId: '1',
      autoDesbloqueio48h: true,
      avisoSonoroInadimplente: true,
      habilitarConsultaRadius: true,
      syncIntervalMinutes: 10,
      status: 'conectado',
      latenciaMs: 24,
      ultimaSincronizacao: new Date().toISOString()
    },
    hubsoft: {
      id: 'hubsoft',
      nome: 'Hubsoft Telecom',
      categoria: 'ERP Cloud para ISPs',
      protocolo: 'API REST v1 / v2',
      urlBase: 'https://naptelecom.hubsoft.com.br/api/v1',
      clientId: 'nap_omni_hubsoft_client',
      clientSecret: 'hub_sec_9918237498172938472918',
      autoDesbloqueio48h: true,
      avisoSonoroInadimplente: true,
      habilitarConsultaRadius: true,
      syncIntervalMinutes: 15,
      status: 'desconectado'
    },
    radiusnet: {
      id: 'radiusnet',
      nome: 'RadiusNet',
      categoria: 'ERP & AAA Radius',
      protocolo: 'REST API v2',
      urlBase: 'https://api.radiusnet.com.br/v2',
      token: 'rnet_key_99382173489127',
      provedorId: '1',
      autoDesbloqueio48h: true,
      avisoSonoroInadimplente: false,
      habilitarConsultaRadius: true,
      syncIntervalMinutes: 15,
      status: 'desconectado'
    },
    mksolutions: {
      id: 'mksolutions',
      nome: 'MK Solutions (MK-Auth / MK v2)',
      categoria: 'ERP Telecom & Financeiro',
      protocolo: 'REST / Webservice v1/v2',
      urlBase: 'https://mk.naptelecom.com.br/api/v1',
      token: 'mk_jwt_token_secret_99812',
      appId: 'NAP_MK_APP',
      autoDesbloqueio48h: true,
      avisoSonoroInadimplente: true,
      habilitarConsultaRadius: true,
      syncIntervalMinutes: 15,
      status: 'desconectado'
    },
    ispfy: {
      id: 'ispfy',
      nome: 'ISPFy',
      categoria: 'Sistema de Gestão para ISPs',
      protocolo: 'ISPFy REST API v1',
      urlBase: 'https://naptelecom.ispfy.com.br/api/v1',
      token: 'ispfy_tok_49817298371982',
      autoDesbloqueio48h: true,
      avisoSonoroInadimplente: false,
      habilitarConsultaRadius: true,
      syncIntervalMinutes: 15,
      status: 'desconectado'
    },
    mikweb: {
      id: 'mikweb',
      nome: 'MikWeb',
      categoria: 'Gerenciador MikroTik & ISP',
      protocolo: 'MikWeb API v1',
      urlBase: 'https://api.mikweb.com.br/v1',
      token: 'mikweb_token_7182947192837',
      autoDesbloqueio48h: true,
      avisoSonoroInadimplente: false,
      habilitarConsultaRadius: true,
      syncIntervalMinutes: 15,
      status: 'desconectado'
    },
    sgp: {
      id: 'sgp',
      nome: 'SGP (Sistema de Gestão de Provedores)',
      categoria: 'ERP Telecom Integrado',
      protocolo: 'REST / HTTPS v2.4',
      urlBase: 'https://api.sgp.provedor.com.br/v1',
      appId: 'NAP_SGP_PROD_991',
      token: 'sgp_sec_token_99182374981729',
      autoDesbloqueio48h: true,
      avisoSonoroInadimplente: true,
      habilitarConsultaRadius: true,
      syncIntervalMinutes: 15,
      status: 'conectado',
      latenciaMs: 31,
      ultimaSincronizacao: new Date().toISOString()
    }
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
    promptSuporte: "Você é o assistente virtual do {nome_provedor}. Atenda clientes de internet fibra óptica com empatia e precisão técnica.",
    promptVendas: "Você é consultor comercial do {nome_provedor}. Oferte planos residenciais de fibra óptica simétrica com Wi-Fi 6 Mesh.",
    promptCobranca: "Você atua no setor financeiro do {nome_provedor}. Forneça a chave PIX copia-e-cola e código de barras instantâneo.",
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
    mensagemForaHorario: "Olá! Nosso atendimento humano encerrou por hoje.",
    slaRespostaMinutos: 5,
    slaResolucaoHoras: 4,
    mensagemBoasVindas: "Olá! Seja bem-vindo à central de atendimento do {nome_provedor}.",
    permitirTransbordoNocForaHorario: true
  },
  respostasRapidas: []
};

interface ConfigContextType {
  config: SystemConfig;
  loading: boolean;
  updateConfig: (newConfig: Partial<SystemConfig>) => Promise<boolean>;
  uploadLogo: (file: File) => Promise<{ success: boolean; logoUrl?: string; error?: string }>;
  reloadConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/configuracoes');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(prev => ({
            ...prev,
            ...data.config,
            provedor: { ...prev.provedor, ...(data.config.provedor || {}) },
            landingPage: { ...prev.landingPage, ...(data.config.landingPage || {}) }
          }));
        }
      }
    } catch (err) {
      console.warn("Usando configurações padrão (offline/fallback):", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateConfig = async (newConfigData: Partial<SystemConfig>): Promise<boolean> => {
    try {
      const updated = {
        ...config,
        ...newConfigData,
        provedor: { ...config.provedor, ...(newConfigData.provedor || {}) },
        landingPage: { ...config.landingPage, ...(newConfigData.landingPage || {}) }
      };
      setConfig(updated);

      const res = await fetch('/api/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      return res.ok;
    } catch (e) {
      console.error("Falha ao salvar configurações no servidor:", e);
      return false;
    }
  };

  const uploadLogo = async (file: File): Promise<{ success: boolean; logoUrl?: string; error?: string }> => {
    return new Promise((resolve) => {
      // Validação de tipo
      if (!file.type.startsWith('image/')) {
        resolve({ success: false, error: 'Por favor, selecione um arquivo de imagem válido (PNG, SVG, JPG, WebP).' });
        return;
      }
      // Validação de tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        resolve({ success: false, error: 'A imagem deve ter no máximo 5MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/configuracoes/upload-logo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              logoData: base64Data,
              fileName: file.name
            })
          });

          if (res.ok) {
            const data = await res.json();
            const newLogo = data.logoUrl || base64Data;
            setConfig(prev => ({
              ...prev,
              provedor: { ...prev.provedor, logoUrl: newLogo }
            }));
            resolve({ success: true, logoUrl: newLogo });
          } else {
            const errData = await res.json();
            resolve({ success: false, error: errData.error || 'Falha ao salvar imagem.' });
          }
        } catch (e: any) {
          // Fallback caso rede falhe: aplica no estado local
          setConfig(prev => ({
            ...prev,
            provedor: { ...prev.provedor, logoUrl: base64Data }
          }));
          resolve({ success: true, logoUrl: base64Data });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Falha ao ler o arquivo de imagem.' });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <ConfigContext.Provider value={{ config, loading, updateConfig, uploadLogo, reloadConfig: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig deve ser utilizado dentro de um ConfigProvider');
  }
  return context;
}
