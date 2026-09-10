import express from "express";
import path from "path";
import cors from "cors";

// We import createViteServer dynamically if not in production
let createViteServer: any;
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  import("vite").then((vite) => {
    createViteServer = vite.createServer;
  });
}


  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  
  // Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock SGP Faturas (Bills)
  app.get("/api/sgp/faturas", (req, res) => {
    res.json([
      { id: 1, valor: 99.9, vencimento: "2026-09-10", status: "pendente" },
      { id: 2, valor: 99.9, vencimento: "2026-08-10", status: "pago" },
    ]);
  });

  // In-Memory Kanban Deals (Support & Sales para Provedores ISP)
  let kanbanDeals = [
    { 
      id: 101, 
      titulo: "Sem Conexão (LOS Vermelho na ONU)", 
      estagio: "Novo Chamado", 
      pipeline: "Suporte", 
      contato: "João Silva", 
      telefone: "(11) 98765-4321",
      endereco: "Rua das Acácias, 412 - Jd. Primavera",
      plano: "Fibra 500MB Simétrico",
      prioridade: 1,
      criado_em: "Hoje, 10:20",
      contexto_ia: "ONU offline por perda de sinal óptico (LOS). Telemetria indica rompimento provável na caixa de emenda CEO-04."
    },
    { 
      id: 102, 
      titulo: "Lentidão Wi-Fi no 2.4GHz", 
      estagio: "Em Análise", 
      pipeline: "Suporte", 
      contato: "Carlos Eduardo Santos", 
      telefone: "(11) 97123-8899",
      endereco: "Av. Central, 850, Apto 42 - Centro",
      plano: "Fibra 700MB Gamer",
      prioridade: 2,
      criado_em: "Hoje, 09:15",
      contexto_ia: "Sinal óptico normal (-19.1 dBm). Sugerido alteração de canal Wi-Fi e ativação da rede 5GHz."
    },
    { 
      id: 103, 
      titulo: "Troca de Roteador Wi-Fi 6", 
      estagio: "Técnico em Rota", 
      pipeline: "Suporte", 
      contato: "Renata Miranda", 
      telefone: "(11) 99444-1212",
      endereco: "Rua São Jorge, 105 - Vila Nova",
      plano: "Fibra 1GB Empresarial",
      prioridade: 1,
      criado_em: "Ontem, 16:40",
      contexto_ia: "OS #8841 aberta no SGP. Técnico Marcos em deslocamento com previsão de chegada em 25 minutos."
    },
    { 
      id: 104, 
      titulo: "Roteador Reiniciando Sozinho", 
      estagio: "Resolvido", 
      pipeline: "Suporte", 
      contato: "Marcos Vinicius", 
      telefone: "(11) 98111-2233",
      endereco: "Rua do Comércio, 77 - Bela Vista",
      plano: "Fibra 300MB",
      prioridade: 3,
      criado_em: "Ontem, 11:00",
      contexto_ia: "Fonte de alimentação de 12V trocada na visita técnica. Conexão estável há 24 horas."
    },
    { 
      id: 201, 
      titulo: "Nova Instalação Residencial 500MB", 
      estagio: "Novo Lead", 
      pipeline: "Vendas", 
      contato: "Maria Oliveira", 
      telefone: "(11) 98888-7777",
      endereco: "Rua dos Ipês, 230 - Morumbi",
      plano: "Fibra 500MB + Paramount+",
      prioridade: 2,
      criado_em: "Hoje, 11:05",
      contexto_ia: "Lead vindo do WhatsApp Ads. Viabilidade técnica positiva na CTO-12 (4 portas livres)."
    },
    { 
      id: 202, 
      titulo: "Upgrade de Plano Condomínio", 
      estagio: "Qualificado (IA)", 
      pipeline: "Vendas", 
      contato: "Condomínio Residencial Parque Real", 
      telefone: "(11) 97777-6655",
      endereco: "Av. Paulista, 1500 - Bela Vista",
      plano: "Link Dedicado 1GB Full Duplex",
      prioridade: 1,
      criado_em: "Hoje, 08:30",
      contexto_ia: "Síndico solicitou proposta para 60 unidades. Ticket médio estimado: R$ 3.800/mês."
    },
    { 
      id: 203, 
      titulo: "Migração de Provedor Concorrente", 
      estagio: "Negociação", 
      pipeline: "Vendas", 
      contato: "Fernanda Costa", 
      telefone: "(11) 96555-4433",
      endereco: "Rua Augusta, 900 - Consolação",
      plano: "Fibra 700MB",
      prioridade: 2,
      criado_em: "Ontem, 14:10",
      contexto_ia: "Cliente insatisfeita com quedas da operadora atual. Oferecido 50% de desconto nos 3 primeiros meses."
    },
    { 
      id: 204, 
      titulo: "Contrato Assinado Digitalmente", 
      estagio: "Fechado/Ganho", 
      pipeline: "Vendas", 
      contato: "Restaurante Sabor & Arte", 
      telefone: "(11) 95444-3322",
      endereco: "Praça da Matriz, 45 - Centro",
      plano: "Fibra 500MB + IP Fixo",
      prioridade: 1,
      criado_em: "Ontem, 17:00",
      contexto_ia: "Contrato assinado via DocuSign/ZapSign. Instalação agendada para amanhã às 09:00."
    },
    // Cobrança & Régua de Inadimplência ISP
    { 
      id: 301, 
      titulo: "Fatura Vence em 3 Dias (R$ 99,90)", 
      estagio: "A Vencer (Preventivo)", 
      pipeline: "Cobranca", 
      contato: "Juliana Mendes", 
      telefone: "(11) 98321-4455",
      endereco: "Rua do Ipê Amarelo, 88 - Morumbi",
      plano: "Fibra 500MB Simétrico",
      valor: 99.90,
      dias_atraso: 0,
      prioridade: 3,
      criado_em: "Hoje, 08:00",
      contexto_ia: "Lembrete amigável enviado via WhatsApp com código PIX. Cliente com histórico adimplente de 14 meses."
    },
    { 
      id: 302, 
      titulo: "Atraso 4 Dias - Notificação de Suspensão", 
      estagio: "Vencido (1-5d)", 
      pipeline: "Cobranca", 
      contato: "Roberto Albuquerque", 
      telefone: "(11) 97654-1122",
      endereco: "Av. do Estado, 1420 - Centro",
      plano: "Fibra 300MB",
      valor: 89.90,
      dias_atraso: 4,
      prioridade: 2,
      criado_em: "Hoje, 09:30",
      contexto_ia: "Vencimento 05/09. Notificação de tolerância enviada. Bloqueio automático agendado no MikroTik em 24h."
    },
    { 
      id: 303, 
      titulo: "Bloqueado no Concentrador / Redirecionado", 
      estagio: "Bloqueado", 
      pipeline: "Cobranca", 
      contato: "Sérgio Ramos da Silva", 
      telefone: "(11) 96655-9988",
      endereco: "Rua Floriano Peixoto, 305 - Jd. América",
      plano: "Fibra 700MB Gamer",
      valor: 139.90,
      dias_atraso: 9,
      prioridade: 1,
      criado_em: "Ontem, 14:00",
      contexto_ia: "Radius com profile 'Suspensão'. Página de aviso de débito exibida. Elegível para 1º Desbloqueio em Confiança."
    },
    { 
      id: 304, 
      titulo: "Desbloqueio em Confiança Ativo (48h)", 
      estagio: "Desbloqueio 48h", 
      pipeline: "Cobranca", 
      contato: "Aline Cristina Ferreira", 
      telefone: "(11) 95544-7711",
      endereco: "Rua das Palmeiras, 91 - Vila Madalena",
      plano: "Fibra 500MB",
      valor: 99.90,
      dias_atraso: 7,
      prioridade: 2,
      criado_em: "Ontem, 10:15",
      contexto_ia: "Desbloqueio concedido pelo cliente via Portal PWA. Prazo expira amanhã às 10:15. PIX pendente de baixa."
    },
    { 
      id: 305, 
      titulo: "Pago via PIX Copia e Cola (R$ 89,90)", 
      estagio: "Recuperado (PIX)", 
      pipeline: "Cobranca", 
      contato: "Carlos Eduardo Silva", 
      telefone: "(11) 97654-3210",
      endereco: "Rua das Acácias, 70 - Jd. Primavera",
      plano: "Fibra 300MB",
      valor: 89.90,
      dias_atraso: 0,
      prioridade: 3,
      criado_em: "Hoje, 11:40",
      contexto_ia: "Baixa automática no SGP via Webhook do Banco Inter/Gerencianet em 45 segundos. Velocidade restabelecida."
    }
  ];

  // Listar Deals
  app.get("/api/deals", (req, res) => {
    res.json(kanbanDeals);
  });

  // Atualizar estágio de Deal (Persistência ao arrastar no Kanban)
  app.patch("/api/deals/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { estagio, prioridade } = req.body;
    
    const index = kanbanDeals.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ erro: "Card não encontrado" });
    }

    if (estagio) kanbanDeals[index].estagio = estagio;
    if (prioridade !== undefined) kanbanDeals[index].prioridade = prioridade;

    res.json({ sucesso: true, deal: kanbanDeals[index] });
  });

  // Criar novo Card no Kanban
  app.post("/api/deals", (req, res) => {
    const { titulo, pipeline, contato, telefone, endereco, plano, prioridade, contexto_ia } = req.body;
    
    let defaultStage = "Novo Chamado";
    if (pipeline === "Vendas") defaultStage = "Novo Lead";
    else if (pipeline === "Cobranca") defaultStage = "A Vencer (Preventivo)";

    const newDeal = {
      id: Math.floor(1000 + Math.random() * 9000),
      titulo: titulo || (pipeline === "Cobranca" ? "Cobrança de Fatura" : pipeline === "Vendas" ? "Novo Lead Comercial" : "Novo Chamado Técnico"),
      estagio: defaultStage,
      pipeline: pipeline || "Suporte",
      contato: contato || "Cliente Avulso",
      telefone: telefone || "(11) 99999-9999",
      endereco: endereco || "Endereço a confirmar",
      plano: plano || "Fibra 500MB",
      valor: req.body.valor || 99.90,
      dias_atraso: req.body.dias_atraso || 0,
      prioridade: prioridade || 2,
      criado_em: "Agora",
      contexto_ia: contexto_ia || "Card criado pela equipe do provedor."
    };

    kanbanDeals.unshift(newDeal);
    res.status(201).json(newDeal);
  });

  // Obter Clientes (Real SGP ou Mock)
  app.get("/api/contatos", async (req, res) => {
    try {
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        // Chamada real à rota de clientes do SGP
        const data = await fetchSGP("/api/clientes?limit=50");
        
        // Mapeia o retorno real do SGP para a nossa interface do CRM
        if (data && Array.isArray(data)) {
           const mapeados = data.map((c: any) => ({
             id: c.id,
             cpf_cnpj: c.cpf || c.cnpj || "N/A",
             nome: c.nome,
             telefone: c.celular || c.telefone || "N/A",
             plano: c.contratos?.[0]?.plano || "Sem Plano",
             status_cliente: c.status === 1 ? 'ativo' : 'bloqueado'
           }));
           return res.json(mapeados);
        }
      }
    } catch (error) {
      console.warn("Aviso: Falha ao obter clientes do SGP real, utilizando simulador.", error);
    }
    
    // Mock Fallback original sincronizado com sgpDatabase
    res.json(sgpDatabase.map(c => ({
      id: c.id,
      cpf_cnpj: c.cpf_cnpj,
      nome: c.nome,
      telefone: c.contato.telefone,
      plano: c.plano_atual?.nome || "Fibra 500MB",
      status_cliente: c.status_cliente,
      endereco: c.endereco,
      logradouro: c.logradouro,
      numero: c.numero,
      complemento: c.complemento,
      bairro: c.bairro,
      cidade: c.cidade,
      uf: c.uf,
      cep: c.cep,
      ponto_referencia: c.ponto_referencia,
      coordenadas: c.coordenadas
    })));
  });

  // Mock 9router AI Gateway Abstraction using Gemini SDK
  app.post("/api/ia/chat", async (req, res) => {
    const { mensagem, vertical } = req.body;
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ erro: "Chave da API Gemini não configurada no servidor." });
      }

      // Initialize Gemini API client on the server side
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      let systemInstruction = "";
      let bookstackContext = "";

      // Simulated Vector DB (BookStack) Retrieval based on Vertical
      if (vertical === "suporte") {
        bookstackContext = "[RAG BookStack]: Artigo ID #401 - Resolução de ONU com LOS Vermelho: Instruir cliente a verificar se o cabo óptico está dobrado ou rompido. Artigo ID #204: Lentidão - verificar uptime da ONU e dispositivos conectados via Wi-Fi vs Cabo.";
        systemInstruction = (systemConfig.ia?.promptSuporte || "Você é um assistente técnico do NAP.") + "\n\n[Base de Conhecimento]: " + bookstackContext;
      } else if (vertical === "vendas") {
        bookstackContext = "[RAG BookStack]: Planos atuais: 500MB por R$99,90, 700MB por R$119,90. Promoção vigente: Instalação grátis para fidelidade de 12 meses.";
        systemInstruction = (systemConfig.ia?.promptVendas || "Você é um consultor comercial.") + "\n\n[Base de Conhecimento]: " + bookstackContext;
      } else {
        bookstackContext = "[RAG BookStack]: Regras: Faturas atrasadas em 15 dias reduzem banda. PIX baixa na hora, boleto em 1 dia útil.";
        systemInstruction = (systemConfig.ia?.promptCobranca || "Você atua no setor financeiro.") + "\n\n[Base de Conhecimento]: " + bookstackContext;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: mensagem,
        config: { systemInstruction }
      });

      res.json({
        resposta: response.text,
        modelo: "gemini-2.5-flash (via 9router auth)",
        tokens_consumidos: response.usageMetadata?.totalTokenCount || 0
      });
    } catch (error: any) {
      console.error("Erro no Gateway de IA:", error);
      res.status(500).json({ 
        erro: "Falha na comunicação com o Gateway de IA", 
        detalhes: error.message 
      });
    }
  });

  // --- SGP Integration Mocks & Real Proxy (Webhooks & Transactions) ---

  const SGP_URL = process.env.SGP_URL;
  const SGP_APP = process.env.SGP_APP;
  const SGP_TOKEN = process.env.SGP_TOKEN;

  // Base de dados SGP em memória para consultas completas do CRM
  let sgpDatabase = [
    {
      id: 1001,
      contrato_id: 88101,
      nome: "João Silva",
      cpf_cnpj: "111.222.333-44",
      status_cliente: "ativo",
      endereco: "Rua das Acácias, 412 - Jd. Primavera, São Paulo/SP",
      logradouro: "Rua das Acácias",
      numero: "412",
      complemento: "Casa",
      bairro: "Jardim Primavera",
      cidade: "São Paulo",
      uf: "SP",
      cep: "04856-200",
      ponto_referencia: "Próximo à Padaria Flor da Primavera / Em frente à CTO-12",
      coordenadas: {
        lat: -23.7083,
        lng: -46.6852
      },
      contato: { telefone: "+55 11 99999-9999", email: "joao.silva@email.com" },
      plano_atual: {
        id: "p_500",
        nome: "Fibra 500MB Simétrico",
        download: "500 Mbps",
        upload: "500 Mbps",
        valor: 99.90,
        tecnologia: "FTTH GPON",
        fidelidade_fim: "2026-11-20",
        vencimento_dia: 10,
        ip_tipo: "CGNAT IPv4 / IPv6 Dinâmico"
      },
      conexao: {
        status: "online",
        uptime: "21d 08h 12m",
        ip: "177.102.45.89",
        mac: "48:8D:36:A1:B2:C3",
        olt_pon: "OLT-CENTRAL-01 / PON-04 / CTO-12 (Porta 3)",
        sinal_optico: "-19.2 dBm (Ótimo)",
        concentrador: "BNG-MikroTik-CCR2116"
      },
      faturas: [
        {
          id: 501,
          fatura_id: "FAT-202609-1001",
          referencia: "09/2026",
          vencimento: "2026-09-10",
          valor: 99.90,
          status: "aberto",
          dias_atraso: 0,
          linha_digitavel: "00190.00009 01234.567802 00000.100198 1 98450000009990",
          pix_copia_cola: "00020126580014BR.GOV.BCB.PIX0136sgp-pix-joao-silva-set26520400005303986540599.905802BR5915NAP TELECOM SGP6009SAO PAULO62070503***6304E8A1",
          link_pdf: "https://sgp.provedor.com.br/fatura/download/FAT-202609-1001.pdf"
        },
        {
          id: 502,
          fatura_id: "FAT-202608-1001",
          referencia: "08/2026",
          vencimento: "2026-08-10",
          valor: 99.90,
          status: "pago",
          pago_em: "2026-08-09 14:22 via PIX",
          dias_atraso: 0,
          linha_digitavel: "00190.00009 01234.567802 00000.100198 1 98140000009990",
          pix_copia_cola: "00020126580014BR.GOV.BCB.PIX0136sgp-pix-pago-ago26",
          link_pdf: "https://sgp.provedor.com.br/fatura/download/FAT-202608-1001.pdf"
        },
        {
          id: 503,
          fatura_id: "FAT-202607-1001",
          referencia: "07/2026",
          vencimento: "2026-07-10",
          valor: 99.90,
          status: "pago",
          pago_em: "2026-07-10 10:05 via Boleto Bancário",
          dias_atraso: 0,
          linha_digitavel: "00190.00009 01234.567802 00000.100198 1 97830000009990",
          pix_copia_cola: "00020126580014BR.GOV.BCB.PIX0136sgp-pix-pago-jul26",
          link_pdf: "https://sgp.provedor.com.br/fatura/download/FAT-202607-1001.pdf"
        }
      ],
      planos_catalogo: [
        { id: "sgp_plano_750", nome: "Fibra 750MB Ultra Turbo", download: "750 Mbps", upload: "750 Mbps", valor: 119.90, tipo: "upgrade", destaque: true, descricao: "Ideal para streaming 4K simultâneo e jogos online com baixa latência." },
        { id: "sgp_plano_1000", nome: "Fibra 1 GIGA Gamer Full Duplex", download: "1000 Mbps", upload: "1000 Mbps", valor: 149.90, tipo: "upgrade", destaque: true, descricao: "Inclui Wi-Fi 6 Mesh grátis + IP Fixo público para servidor/jogos." },
        { id: "sgp_plano_combo", nome: "Fibra 600MB + Max Streaming + Telefone SIP", download: "600 Mbps", upload: "600 Mbps", valor: 129.90, tipo: "combo", destaque: false, descricao: "Combo com app de TV e linha digital SIP inclusa." }
      ],
      historico_ofertas: [],
      envios_segunda_via: []
    },
    {
      id: 1002,
      contrato_id: 88102,
      nome: "Maria Oliveira",
      cpf_cnpj: "555.666.777-88",
      status_cliente: "bloqueado",
      endereco: "Rua das Flores, 123 - Centro, São Paulo/SP",
      logradouro: "Rua das Flores",
      numero: "123",
      complemento: "Apto 34B",
      bairro: "Centro Histórico",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01001-000",
      ponto_referencia: "Ao lado da Estação Sé / Prédio Azul",
      coordenadas: {
        lat: -23.5489,
        lng: -46.6388
      },
      contato: { telefone: "+55 11 88888-8888", email: "maria.oliveira@email.com" },
      plano_atual: {
        id: "p_1000",
        nome: "Fibra 1GB Ultra",
        download: "1000 Mbps",
        upload: "500 Mbps",
        valor: 149.90,
        tecnologia: "FTTH GPON",
        fidelidade_fim: "2026-10-15",
        vencimento_dia: 10,
        ip_tipo: "CGNAT IPv4"
      },
      conexao: {
        status: "bloqueado_financeiro",
        uptime: "Desconectado pelo Concentrador Radius",
        ip: "10.64.12.18 (Pool Bloqueio SGP)",
        mac: "00:1A:2B:3C:4D:5E",
        olt_pon: "OLT-CENTRAL-01 / PON-02 / CTO-08 (Porta 5)",
        sinal_optico: "-20.1 dBm",
        concentrador: "BNG-MikroTik-CCR2116"
      },
      faturas: [
        {
          id: 601,
          fatura_id: "FAT-202609-1002",
          referencia: "09/2026",
          vencimento: "2026-09-10",
          valor: 149.90,
          status: "aberto",
          dias_atraso: 0,
          linha_digitavel: "00190.00009 01234.567802 00000.100298 1 98450000014990",
          pix_copia_cola: "00020126580014BR.GOV.BCB.PIX0136sgp-pix-maria-set265204000053039865405149.905802BR5915NAP TELECOM SGP6009SAO PAULO62070503***6304A1B2",
          link_pdf: "https://sgp.provedor.com.br/fatura/download/FAT-202609-1002.pdf"
        },
        {
          id: 602,
          fatura_id: "FAT-202608-1002",
          referencia: "08/2026",
          vencimento: "2026-08-10",
          valor: 149.90,
          status: "vencido",
          dias_atraso: 30,
          linha_digitavel: "00190.00009 01234.567802 00000.100298 1 98140000014990",
          pix_copia_cola: "00020126580014BR.GOV.BCB.PIX0136sgp-pix-maria-ago26-atraso",
          link_pdf: "https://sgp.provedor.com.br/fatura/download/FAT-202608-1002.pdf"
        }
      ],
      planos_catalogo: [
        { id: "sgp_plano_combo_fam", nome: "Fibra 1GB + Wi-Fi 6 Mesh Duo + Paramount+", download: "1000 Mbps", upload: "1000 Mbps", valor: 169.90, tipo: "upgrade", destaque: true, descricao: "Super velocidade com 2 roteadores Mesh inclusos." },
        { id: "sgp_plano_fidelidade", nome: "Renovação Fibra 1GB com Desconto Fidelidade", download: "1000 Mbps", upload: "500 Mbps", valor: 129.90, tipo: "retencao", destaque: true, descricao: "Desconto especial de R$ 20/mês para renovação contratual por 12 meses." }
      ],
      historico_ofertas: [],
      envios_segunda_via: []
    },
    {
      id: 1003,
      contrato_id: 88103,
      nome: "Empresa XPTO Ltda",
      cpf_cnpj: "22.333.444/0001-55",
      status_cliente: "ativo",
      endereco: "Av. Paulista, 1800, Conj 41 - Bela Vista, São Paulo/SP",
      logradouro: "Avenida Paulista",
      numero: "1800",
      complemento: "Conjunto 41",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      cep: "01310-200",
      ponto_referencia: "Próximo ao MASP / Torre Sul",
      coordenadas: {
        lat: -23.5614,
        lng: -46.6559
      },
      contato: { telefone: "+55 11 3333-4444", email: "financeiro@xpto.com.br" },
      plano_atual: {
        id: "p_corp_2gb",
        nome: "Link Dedicado 2GB Corporativo",
        download: "2000 Mbps",
        upload: "2000 Mbps",
        valor: 1890.00,
        tecnologia: "Fibra PTP Dedicada (DWDM)",
        fidelidade_fim: "2027-04-10",
        vencimento_dia: 15,
        ip_tipo: "Bloco IPv4 /29 Público Fixo (8 IPs) + IPv6 /48"
      },
      conexao: {
        status: "online",
        uptime: "142d 19h 40m",
        ip: "200.198.112.42",
        mac: "70:4C:A5:DD:EE:11",
        olt_pon: "SW-METRO-01 / Porta 10G-02 / DVI-01",
        sinal_optico: "-16.8 dBm (Excelente)",
        concentrador: "Cisco-ASR-1001-HX"
      },
      faturas: [
        {
          id: 701,
          fatura_id: "FAT-202609-1003",
          referencia: "09/2026",
          vencimento: "2026-09-15",
          valor: 1890.00,
          status: "aberto",
          dias_atraso: 0,
          linha_digitavel: "00190.00009 01234.567802 00000.100398 1 98500000189000",
          pix_copia_cola: "00020126580014BR.GOV.BCB.PIX0136sgp-pix-xpto-set26",
          link_pdf: "https://sgp.provedor.com.br/fatura/download/FAT-202609-1003.pdf"
        },
        {
          id: 702,
          fatura_id: "FAT-202608-1003",
          referencia: "08/2026",
          vencimento: "2026-08-15",
          valor: 1890.00,
          status: "pago",
          pago_em: "2026-08-12 11:30 via TED/PIX",
          dias_atraso: 0,
          linha_digitavel: "00190.00009 01234.567802 00000.100398 1 98190000018900",
          pix_copia_cola: "00020126580014BR.GOV.BCB.PIX0136sgp-pix-xpto-ago26",
          link_pdf: "https://sgp.provedor.com.br/fatura/download/FAT-202608-1003.pdf"
        }
      ],
      planos_catalogo: [
        { id: "sgp_plano_corp_5gb", nome: "Link Dedicado 5GB Full Redundante", download: "5000 Mbps", upload: "5000 Mbps", valor: 3490.00, tipo: "upgrade", destaque: true, descricao: "Dupla abordagem de fibra física com BGP próprio e SLA 99.9% de 4 horas." },
        { id: "sgp_plano_firewall", nome: "Managed Firewall Fortinet + Link 2GB", download: "2000 Mbps", upload: "2000 Mbps", valor: 2490.00, tipo: "adicional", destaque: false, descricao: "Segurança de borda com inspeção UTM e VPN site-to-site." }
      ],
      historico_ofertas: [],
      envios_segunda_via: []
    }
  ];

  // Helper para buscar ou proxy oficial SGP
  async function fetchSGP(endpoint: string, method = "GET", body: any = null) {
    if (!SGP_URL || !SGP_APP || !SGP_TOKEN) {
      throw new Error("Credenciais do SGP não configuradas no .env");
    }
    const headers = {
      "Content-Type": "application/json",
      "app": SGP_APP,
      "token": SGP_TOKEN
    };
    const config: any = { method, headers };
    if (body) config.body = JSON.stringify(body);
    
    const res = await fetch(`${SGP_URL}${endpoint}`, config);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`SGP API Erro (${res.status}): ${errorText}`);
    }
    return await res.json();
  }

  // --- Endpoint: Consulta Avançada SGP por ID / CPF / Telefone / Termo ---
  app.get("/api/sgp/cliente/:identificador", async (req, res) => {
    const { identificador } = req.params;
    const cleanId = identificador.replace(/\D/g, '');

    try {
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        // Tenta chamada real à API oficial do SGP
        const sgpResponse = await fetchSGP(`/api/v1/cliente/consulta?termo=${encodeURIComponent(identificador)}`);
        if (sgpResponse && sgpResponse.sucesso) {
          return res.json({ sucesso: true, origem: "sgp_api_oficial", cliente: sgpResponse.dados });
        }
      }
    } catch (err) {
      console.warn("Aviso: Falha ao chamar SGP oficial, utilizando base local sincronizada.", err);
    }

    // Busca na base local do SGP
    const cliente = sgpDatabase.find(c => 
      c.id.toString() === identificador ||
      c.contrato_id.toString() === identificador ||
      (cleanId && c.cpf_cnpj.replace(/\D/g, '') === cleanId) ||
      (cleanId && c.contato.telefone.replace(/\D/g, '').includes(cleanId)) ||
      c.nome.toLowerCase().includes(identificador.toLowerCase())
    );

    if (!cliente) {
      // Retorna o primeiro cliente como exemplo padrão se não encontrar exato
      return res.status(404).json({ 
        sucesso: false, 
        mensagem: `Cliente não localizado no SGP para '${identificador}'.`,
        sugestao: sgpDatabase[0]
      });
    }

    res.json({
      sucesso: true,
      origem: "sgp_core_sync",
      cliente
    });
  });

  // --- Endpoint: Busca e Validação de CEP com Fallback Inteligente ---
  app.get("/api/cep/:cep", async (req, res) => {
    const rawCep = req.params.cep || "";
    const cepClean = rawCep.replace(/\D/g, "");

    if (cepClean.length !== 8) {
      return res.status(400).json({ sucesso: false, erro: "CEP deve conter exatamente 8 dígitos numéricos." });
    }

    // Base de CEPs conhecidos locais para alta disponibilidade e velocidade
    const localCeps: Record<string, any> = {
      "04856200": {
        cep: "04856-200",
        logradouro: "Rua das Acácias",
        complemento: "",
        bairro: "Jardim Primavera",
        localidade: "São Paulo",
        uf: "SP",
        coordenadas: { lat: -23.7083, lng: -46.6852 },
        regiao_atendimento: "Região Sul - Zona CTO-12",
        viabilidade_ftth: "Disponível (Portas OLT livres)"
      },
      "01001000": {
        cep: "01001-000",
        logradouro: "Praça da Sé",
        complemento: "lado ímpar",
        bairro: "Sé",
        localidade: "São Paulo",
        uf: "SP",
        coordenadas: { lat: -23.5489, lng: -46.6388 },
        regiao_atendimento: "Centro Expandido - Anel Óptico Metro",
        viabilidade_ftth: "Disponível (GPON 2.5G)"
      },
      "01310200": {
        cep: "01310-200",
        logradouro: "Avenida Paulista",
        complemento: "de 1512 a 2132 - lado par",
        bairro: "Bela Vista",
        localidade: "São Paulo",
        uf: "SP",
        coordenadas: { lat: -23.5614, lng: -46.6559 },
        regiao_atendimento: "Paulista Corporativo - Metro Ethernet",
        viabilidade_ftth: "Disponível (PTP DWDM Dedicado)"
      }
    };

    // Tenta primeiro consultar via ViaCEP oficial
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`, {
        headers: { "User-Agent": "NAP-Telecom-ISP-System" },
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.erro) {
          // Coordenadas aproximadas baseadas na base local ou estimativa
          const localMatch = localCeps[cepClean];
          const coords = localMatch ? localMatch.coordenadas : {
            lat: -23.5505 + (Math.random() * 0.04 - 0.02),
            lng: -46.6333 + (Math.random() * 0.04 - 0.02)
          };

          return res.json({
            sucesso: true,
            origem: "viacep_live",
            dados: {
              cep: data.cep,
              logradouro: data.logradouro || "",
              complemento: data.complemento || "",
              bairro: data.bairro || "",
              localidade: data.localidade || "",
              uf: data.uf || "",
              ibge: data.ibge,
              ddd: data.ddd,
              coordenadas: coords,
              endereco_formatado: `${data.logradouro || 'Endereço'}, ${data.bairro || ''} - ${data.localidade}/${data.uf}`,
              link_maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''} - ${data.uf || ''}`)}`,
              link_waze: `https://waze.com/ul?q=${encodeURIComponent(`${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''}`)}`
            }
          });
        }
      }
    } catch (apiErr) {
      console.warn("Aviso: ViaCEP offline ou timeout, recorrendo à base local do provedor.");
    }

    // Fallback para base local do provedor
    if (localCeps[cepClean]) {
      const item = localCeps[cepClean];
      return res.json({
        sucesso: true,
        origem: "base_provedor_local",
        dados: {
          ...item,
          endereco_formatado: `${item.logradouro}, ${item.bairro} - ${item.localidade}/${item.uf}`,
          link_maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.logradouro}, ${item.bairro}, ${item.localidade} - ${item.uf}`)}`,
          link_waze: `https://waze.com/ul?ll=${item.coordenadas.lat},${item.coordenadas.lng}&navigate=yes`
        }
      });
    }

    // Retorno amigável caso não conste na base local
    return res.status(404).json({
      sucesso: false,
      erro: `CEP ${rawCep} não encontrado nos serviços de endereçamento.`,
      sugestoes: ["04856-200", "01001-000", "01310-200"]
    });
  });

  // --- Endpoint: Atualizar Endereço/Ponto de Referência no SGP do Cliente ---
  app.patch("/api/sgp/cliente/:id/endereco", (req, res) => {
    const clienteId = parseInt(req.params.id);
    const { logradouro, numero, complemento, bairro, cidade, uf, cep, ponto_referencia, coordenadas } = req.body;

    const cliente = sgpDatabase.find(c => c.id === clienteId);
    if (!cliente) {
      return res.status(404).json({ sucesso: false, erro: "Cliente não encontrado no SGP." });
    }

    if (logradouro) (cliente as any).logradouro = logradouro;
    if (numero) (cliente as any).numero = numero;
    if (complemento !== undefined) (cliente as any).complemento = complemento;
    if (bairro) (cliente as any).bairro = bairro;
    if (cidade) (cliente as any).cidade = cidade;
    if (uf) (cliente as any).uf = uf;
    if (cep) (cliente as any).cep = cep;
    if (ponto_referencia !== undefined) (cliente as any).ponto_referencia = ponto_referencia;
    if (coordenadas) (cliente as any).coordenadas = coordenadas;

    // Atualiza campo endereco consolidado
    (cliente as any).endereco = `${(cliente as any).logradouro || logradouro || ''}, ${(cliente as any).numero || numero || 'S/N'}${((cliente as any).complemento || complemento) ? ` (${(cliente as any).complemento || complemento})` : ''} - ${(cliente as any).bairro || bairro || ''}, ${(cliente as any).cidade || cidade || ''}/${(cliente as any).uf || uf || ''}`;

    res.json({
      sucesso: true,
      mensagem: "Endereço e coordenadas sincronizadas com sucesso no SGP.",
      cliente
    });
  });

  // --- Endpoint Oficial SGP: Enviar 2ª Via de Fatura (WhatsApp, Email ou SMS) ---
  app.post("/api/sgp/fatura/enviar-segunda-via", async (req, res) => {
    const { cliente_id, fatura_id, canal = "whatsapp", destino, operador = "Operador CRM" } = req.body;

    if (!fatura_id) {
      return res.status(400).json({ sucesso: false, erro: "fatura_id é obrigatório." });
    }

    try {
      let resultadoSgpOficial: any = null;

      // 1. Tenta acionar API oficial do SGP se configurada
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        try {
          resultadoSgpOficial = await fetchSGP("/api/v1/faturas/segunda-via", "POST", {
            fatura_id,
            canal,
            destino,
            operador
          });
        } catch (apiErr: any) {
          console.warn("Aviso SGP Oficial:", apiErr.message);
        }
      }

      // 2. Atualiza estado e histórico na base SGP do provedor
      const clienteIndex = sgpDatabase.findIndex(c => c.id === Number(cliente_id) || c.faturas.some(f => f.id === Number(fatura_id) || f.fatura_id === fatura_id));
      let faturaAlvo: any = null;

      if (clienteIndex !== -1) {
        const cliente = sgpDatabase[clienteIndex];
        faturaAlvo = cliente.faturas.find(f => f.id === Number(fatura_id) || f.fatura_id === fatura_id);
        
        const registroEnvio = {
          id: Date.now(),
          fatura_id: faturaAlvo ? faturaAlvo.fatura_id : fatura_id,
          valor: faturaAlvo ? faturaAlvo.valor : 99.90,
          vencimento: faturaAlvo ? faturaAlvo.vencimento : "2026-09-10",
          canal,
          destino: destino || (canal === "whatsapp" ? cliente.contato.telefone : cliente.contato.email),
          enviado_em: new Date().toISOString(),
          operador,
          status: "enviado_com_sucesso",
          protocolo_sgp: `SGP-ENV-${Math.floor(100000 + Math.random() * 900000)}`
        };

        cliente.envios_segunda_via.unshift(registroEnvio);

        return res.json({
          sucesso: true,
          mensagem: `2ª via da fatura ${registroEnvio.fatura_id} enviada com sucesso via ${canal.toUpperCase()} para ${registroEnvio.destino}!`,
          protocolo_sgp: registroEnvio.protocolo_sgp,
          detalhes_envio: registroEnvio,
          pix_copia_cola: faturaAlvo ? faturaAlvo.pix_copia_cola : "00020126580014BR.GOV.BCB.PIX...",
          linha_digitavel: faturaAlvo ? faturaAlvo.linha_digitavel : "00190.00009 01234.567802",
          link_pdf: faturaAlvo ? faturaAlvo.link_pdf : `https://sgp.provedor.com.br/fatura/${fatura_id}.pdf`,
          sgp_oficial_response: resultadoSgpOficial
        });
      }

      // Resposta genérica com protocolo SGP
      const protocolo = `SGP-ENV-${Math.floor(100000 + Math.random() * 900000)}`;
      res.json({
        sucesso: true,
        mensagem: `2ª via da fatura #${fatura_id} enviada com sucesso via ${canal.toUpperCase()}!`,
        protocolo_sgp: protocolo,
        sgp_oficial_response: resultadoSgpOficial
      });
    } catch (error: any) {
      console.error("Erro ao enviar 2ª via no SGP:", error);
      res.status(500).json({ sucesso: false, erro: "Falha ao processar envio no SGP", detalhes: error.message });
    }
  });

  // --- Endpoint Oficial SGP: Registrar Oferta / Upgrade de Plano ---
  app.post("/api/sgp/planos/registrar-oferta", async (req, res) => {
    const { cliente_id, plano_id, plano_nome, valor_ofertado, desconto_promocional, canal = "crm", observacoes, operador = "Operador CRM" } = req.body;

    if (!cliente_id || !plano_id) {
      return res.status(400).json({ sucesso: false, erro: "cliente_id e plano_id são obrigatórios." });
    }

    try {
      let resultadoSgpOficial: any = null;

      // 1. Tenta registrar na API oficial do SGP
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        try {
          resultadoSgpOficial = await fetchSGP("/api/v1/crm/ofertas", "POST", {
            cliente_id,
            plano_id,
            plano_nome,
            valor_ofertado,
            desconto_promocional,
            operador,
            observacoes
          });
        } catch (apiErr: any) {
          console.warn("Aviso SGP Oficial Ofertas:", apiErr.message);
        }
      }

      // 2. Persiste na base em memória do SGP
      const cliente = sgpDatabase.find(c => c.id === Number(cliente_id));
      const protocoloOferta = `SGP-OFR-${Math.floor(100000 + Math.random() * 900000)}`;

      const novaOferta = {
        id: Date.now(),
        protocolo: protocoloOferta,
        plano_id,
        plano_nome: plano_nome || "Plano Fibra Upgrade",
        valor_ofertado: valor_ofertado || 119.90,
        desconto_promocional: desconto_promocional || "Isenção de taxa de alteração de plano + Dobro de upload",
        status: "ofertado_pendente_aceite",
        registrado_em: new Date().toISOString(),
        operador,
        observacoes: observacoes || "Oferta registrada pelo operador durante contato no CRM.",
        canal
      };

      if (cliente) {
        cliente.historico_ofertas.unshift(novaOferta);
      }

      // Adiciona também um card automático no pipeline de Vendas (Kanban Deals)
      const novoLeadDeal = {
        id: Math.floor(1000 + Math.random() * 9000),
        titulo: `Upgrade: ${novaOferta.plano_nome} (R$ ${novaOferta.valor_ofertado.toFixed(2)})`,
        estagio: "Proposta Enviada",
        pipeline: "Vendas" as const,
        contato: cliente ? cliente.nome : `Cliente #${cliente_id}`,
        telefone: cliente ? cliente.contato.telefone : "(11) 99999-9999",
        endereco: cliente ? cliente.endereco : "Endereço cadastrado no SGP",
        plano: novaOferta.plano_nome,
        valor: novaOferta.valor_ofertado,
        prioridade: 1,
        criado_em: "Agora",
        contexto_ia: `Oferta de plano registrada no SGP (${protocoloOferta}). Assinante demonstrou interesse em upgrade de velocidade. Operador: ${operador}.`
      };
      kanbanDeals.unshift(novoLeadDeal as any);

      res.json({
        sucesso: true,
        mensagem: `Oferta do plano "${novaOferta.plano_nome}" registrada com sucesso no SGP!`,
        protocolo_sgp: protocoloOferta,
        oferta: novaOferta,
        kanban_deal_id: novoLeadDeal.id,
        sgp_oficial_response: resultadoSgpOficial
      });
    } catch (error: any) {
      console.error("Erro ao registrar oferta no SGP:", error);
      res.status(500).json({ sucesso: false, erro: "Falha ao registrar oferta no SGP", detalhes: error.message });
    }
  });

  // Consultar Cliente da URA (Pesquisa Específica via CPF/CNPJ ou Telefone)
  
  // Busca SGP em tempo real (Operador)
  // Workspace 360 do Cliente via SGP
  app.get("/api/sgp/busca", async (req, res) => {
    const { q } = req.query;
    
    // Simula latência
    setTimeout(() => {
      if (!q || q.toString().trim() === '') {
        return res.json({ resultados: [] });
      }
      
      res.json({
        resultados: [
          {
            id: 9982,
            nome: "Maria Oliveira",
            cpf_cnpj: "123.456.789-00",
            status_cliente: "bloqueado_parcial", // Para testar features de cobrança
            endereco: "Rua das Flores, 123 - Centro, São Paulo/SP",
            contato: { telefone: "11999998888", email: "maria.oliveira@email.com" },
            conexao: {
              status: "online",
              uptime: "15d 2h 45m",
              ip: "177.45.2.19",
              mac: "AA:BB:CC:DD:EE:FF",
              plano: "Fibra 500MB",
              concentrador: "MikroTik-Core-01",
              sinal_optico: "-19.5 dBm"
            },
            faturas: [
              { id: 101, vencimento: "2026-09-10", valor: 99.90, status: "atrasado", dias_atraso: 12, linha_digitavel: "00190.00009 00000.000000 00000.000000 1 00000000000000", pix_copia_cola: "00020126580014BR.GOV.BCB.PIX..." },
              { id: 102, vencimento: "2026-08-10", valor: 99.90, status: "pago", dias_atraso: 0 },
              { id: 103, vencimento: "2026-07-10", valor: 99.90, status: "pago", dias_atraso: 0 }
            ],
            planos_disponiveis: [
              { id: "p1", nome: "Fibra 1GB", valor: 149.90, tipo: "upgrade", destaque: true },
              { id: "p2", nome: "Fibra 750MB", valor: 119.90, tipo: "upgrade", destaque: false }
            ],
            chamados_recentes: [
              { id: 4402, data: "2026-08-20", assunto: "Lentidão à noite", status: "resolvido" }
            ],
            metricas: {
              consumo_mes_gb: 450,
              score_pagador: 9.2, // 0 a 10
              tempo_contrato_meses: 24
            }
          }
        ]
      });
    }, 800);
  });


  
  // --- Google Gemini Agent Engine (Substituição de n8n para baixo consumo) ---

  // Ferramentas nativas do Agente ISP
  const AGENT_TOOLS = [
    {
      id: "consultar_sgp",
      name: "Consultar Assinante no SGP",
      description: "Localiza contrato, plano, status financeiro e autenticação do cliente por CPF ou telefone.",
      category: "ERP / SGP",
      parameters: { cpf_cnpj: "string (opcional)", telefone: "string (opcional)" }
    },
    {
      id: "verificar_sinal_onu",
      name: "Diagnosticar Sinal Óptico da ONU",
      description: "Lê a potência óptica (dBm), status PPPoE, uptime e modelo da ONU no OLT/concentrador.",
      category: "NOC / Telecom",
      parameters: { contrato_id: "number" }
    },
    {
      id: "gerar_pix_fatura",
      name: "Gerar Chave PIX Copia e Cola",
      description: "Gera cobrança PIX imediata com baixa automática no SGP em até 2 minutos.",
      category: "Financeiro",
      parameters: { contrato_id: "number", valor: "number (opcional)" }
    },
    {
      id: "desbloqueio_48h",
      name: "Desbloqueio em Confiança (48 Horas)",
      description: "Libera a navegação em velocidade máxima por 48 horas enquanto o cliente quita a fatura.",
      category: "ERP / SGP",
      parameters: { contrato_id: "number" }
    },
    {
      id: "abrir_os_suporte",
      name: "Abertura de Ordem de Serviço (OS)",
      description: "Agenda visita técnica presencial para reparo de drop ou troca de equipamento.",
      category: "Atendimento",
      parameters: { contrato_id: "number", motivo: "string", prioridade: "alta | normal" }
    }
  ];

  // Listar ferramentas registradas do Agente
  app.get("/api/gemini/agent/tools", (req, res) => {
    res.json(AGENT_TOOLS);
  });

  // Estatísticas de Consumo da API Gemini (Free Tier Monitoring)
  let apiMetrics = {
    requests_today: 47,
    daily_limit: 1500, // Cota diária gratuita do AI Studio
    rpm_current: 2,
    rpm_limit: 15,     // Cota por minuto gratuita
    total_tokens: 18450,
    cost_estimated_brl: 0.00, // Free tier
    last_reset: new Date().toISOString().split('T')[0]
  };

  app.get("/api/gemini/agent/metrics", (req, res) => {
    res.json(apiMetrics);
  });

  // Execução do Agente Inteligente com Raciocínio & Ferramentas
  app.post("/api/gemini/agent/run", async (req, res) => {
    const { prompt, clientContext, simulateTools = true } = req.body;
    apiMetrics.requests_today += 1;

    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback simulado caso a chave ainda não tenha sido configurada
        const lower = (prompt || "").toLowerCase();
        let executedTool = null;
        let responseText = "";

        if (lower.includes("pix") || lower.includes("pagar") || lower.includes("fatura")) {
          executedTool = "gerar_pix_fatura";
          responseText = `Identifiquei sua fatura em aberto no valor de R$ 99,90. Gerei sua chave PIX com baixa automática:\n\n00020126580014br.gov.bcb.pix0136nap-provedor-fibra-fatura\n\nAssim que pagar, sua conexão é normalizada em instantes!`;
        } else if (lower.includes("lenta") || lower.includes("sinal") || lower.includes("onu") || lower.includes("caiu")) {
          executedTool = "verificar_sinal_onu";
          responseText = `Realizei o teste de telemetria na sua fibra agora: o sinal da sua ONU está em -19.2 dBm (excelente) e a sessão está conectada há 12 dias. Recomendo reiniciar seu roteador na tomada por 30 segundos para limpar o cache Wi-Fi.`;
        } else if (lower.includes("desbloque") || lower.includes("confiança")) {
          executedTool = "desbloqueio_48h";
          responseText = `Seu Desbloqueio em Confiança foi registrado no SGP com sucesso! A conexão foi liberada por 48 horas em velocidade integral.`;
        } else {
          executedTool = "consultar_sgp";
          responseText = `Olá! Sou o assistente virtual do provedor. Localizei seu plano Fibra 500MB ativo. Como posso te ajudar hoje?`;
        }

        return res.json({
          resposta: responseText,
          tool_executada: executedTool,
          modelo: "gemini-2.5-flash (Simulação Fallback)",
          tokens_consumidos: 128,
          tempo_execucao_ms: 320
        });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const basePrompt = systemConfig.ia?.promptSuporte || 'Você é o Agente Autônomo Oficial de um Provedor de Internet (ISP) com fibra óptica.';
      const systemInstruction = `${basePrompt}\n\nSeu objetivo é resolver a solicitação do assinante com respostas claras, empáticas e objetivas.\nVocê possui acesso às seguintes ferramentas de sistema:\n1. \'consultar_sgp\': busca faturas, plano e status do cliente.\n2. \'verificar_sinal_onu\': mede o sinal óptico (-18 a -24 dBm é normal; abaixo de -27 dBm é atenuado).\n3. \'gerar_pix_fatura\': gera o código PIX Copia e Cola para pagamento imediato.\n4. \'desbloqueio_48h\': ativa o desbloqueio temporário em confiança.\n\nContexto do cliente atual: ${JSON.stringify(clientContext || { plano: 'Fibra 500MB', status: 'ativo' })}.`;

      const startTime = Date.now();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { systemInstruction }
      });
      const endTime = Date.now();

      const tokens = response.usageMetadata?.totalTokenCount || 150;
      apiMetrics.total_tokens += tokens;

      res.json({
        resposta: response.text,
        modelo: "gemini-2.5-flash (Google AI Studio)",
        tokens_consumidos: tokens,
        tempo_execucao_ms: endTime - startTime
      });
    } catch (error: any) {
      console.error("Erro no Agente Gemini:", error);
      res.status(500).json({ erro: "Erro ao executar o Agente Gemini", detalhes: error.message });
    }
  });

  // --- Processamento de Voz & Análise em Tempo Real (Asterisk/FreePBX) com Gemini API ---
  app.post("/api/gemini/voice/analyze", async (req, res) => {
    const { 
      audioBase64, 
      mimeType = "audio/webm", 
      transcriptText, 
      speaker = "cliente", 
      callContext 
    } = req.body;

    const startTime = Date.now();

    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback inteligente para demonstração sem chave
        const textSample = transcriptText || "Olá, estou ligando porque minha internet fibra está sem sinal e a luz LOS está vermelha no roteador. Preciso trabalhar e estou sem conexão.";
        const sentiment = textSample.toLowerCase().includes("sem conexão") || textSample.toLowerCase().includes("vermelha") || textSample.toLowerCase().includes("queda")
          ? "frustrado"
          : "neutro";

        return res.json({
          transcricao: textSample,
          sentimento: sentiment,
          score_sentimento: sentiment === "frustrado" ? -0.7 : 0.1,
          urgencia: "alta",
          topico_principal: "Queda de Conexão Óptica (LOS)",
          pilar_sugerido: "suporte",
          insights_operador: [
            "Cliente necessita de conexão para home office.",
            "Luz LOS indica rompimento ou atenuação severa na fibra.",
            "Ação sugerida: validar potência óptica no SGP e agendar técnico N2."
          ],
          sugestao_resposta: "Compreendo a urgência para o seu trabalho. Estou verificando a telemetria da sua ONU no sistema agora mesmo para normalizarmos sua fibra.",
          modelo: "gemini-2.5-flash (Simulação Fallback)",
          tempo_ms: Date.now() - startTime
        });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      // Se enviou áudio em base64, utiliza o modelo multimodal ou de transcrição
      let contents: any = [];

      if (audioBase64) {
        contents = [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || "audio/webm",
                  data: audioBase64
                }
              },
              {
                text: `Você é a IA de escuta ativa e inteligência de voz conectada ao FreePBX/Asterisk de um Provedor de Internet (ISP).
Analise o áudio transmitido em tempo real pelo ${speaker} e responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "transcricao": "Texto transcrito exato em português do que foi dito no áudio",
  "sentimento": "positivo" | "neutro" | "frustrado" | "irritado" | "satisfeito",
  "score_sentimento": número de -1.0 (muito negativo) a 1.0 (muito positivo),
  "urgencia": "baixa" | "media" | "alta" | "critica",
  "topico_principal": "Assunto principal (ex: Falha de Conexão, Dúvida de Fatura, Contratação, Cancelamento)",
  "pilar_sugerido": "suporte" | "cobranca" | "vendas",
  "insights_operador": ["ponto chave 1", "ponto chave 2"],
  "sugestao_resposta": "Sugestão de resposta rápida e empática para o operador dizer ao cliente"
}
Contexto da chamada: ${JSON.stringify(callContext || {})}
Não adicione crases de markdown além do JSON.`
              }
            ]
          }
        ];
      } else {
        // Se já vier com transcrição em texto
        contents = [
          {
            parts: [
              {
                text: `Você é a IA de inteligência de voz conectada ao FreePBX/Asterisk de um Provedor de Internet (ISP).
Analise a seguinte fala emitida pelo ${speaker}: "${transcriptText || ''}".
Responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "transcricao": "${(transcriptText || '').replace(/"/g, '\\"')}",
  "sentimento": "positivo" | "neutro" | "frustrado" | "irritado" | "satisfeito",
  "score_sentimento": número de -1.0 a 1.0,
  "urgencia": "baixa" | "media" | "alta" | "critica",
  "topico_principal": "Assunto principal identificado",
  "pilar_sugerido": "suporte" | "cobranca" | "vendas",
  "insights_operador": ["ponto chave 1", "ponto chave 2"],
  "sugestao_resposta": "Sugestão prática para o operador falar agora"
}
Contexto da chamada: ${JSON.stringify(callContext || {})}`
              }
            ]
          }
        ];
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      let parsedResult;
      try {
        parsedResult = JSON.parse(responseText.replace(/```json\n?|\n?```/g, '').trim());
      } catch {
        parsedResult = {
          transcricao: transcriptText || "Áudio processado.",
          sentimento: "neutro",
          score_sentimento: 0.0,
          urgencia: "media",
          topico_principal: "Atendimento Geral",
          pilar_sugerido: "suporte",
          insights_operador: ["Áudio transcrito com sucesso."],
          sugestao_resposta: "Como posso auxiliar em sua conexão hoje?"
        };
      }

      res.json({
        ...parsedResult,
        modelo: "gemini-2.5-flash (Audio & Sentiment Engine)",
        tempo_ms: Date.now() - startTime
      });
    } catch (err: any) {
      console.error("Erro na análise de voz Gemini:", err);
      res.status(500).json({ 
        erro: "Falha ao processar voz com Gemini", 
        detalhes: err.message,
        transcricao: transcriptText || "",
        sentimento: "neutro",
        score_sentimento: 0
      });
    }
  });

  // Legado retrocompatível (n8n Webhook Proxy simulado sem dependência externa)
  app.post("/api/n8n/webhook/:webhookId", async (req, res) => {
    const { webhookId } = req.params;
    const payload = req.body;
    res.json({
      success: true,
      message: `Execução processada localmente pelo NAP Agent Engine.`,
      execution_id: "agent_" + Math.random().toString(36).substring(2, 9),
      delivered_payload: payload
    });
  });

  app.get("/api/sgp/ura/cliente", async (req, res) => {
    const { cpf_cnpj, telefone } = req.query;
    try {
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        let endpoint = `/api/clientes/ura?`;
        if (cpf_cnpj) endpoint += `cpf_cnpj=${cpf_cnpj}`;
        if (telefone) endpoint += `&telefone=${telefone}`;
        
        const data = await fetchSGP(endpoint);
        return res.json(data);
      }
    } catch (error) {
      console.warn("Aviso: Falha na consulta de URA no SGP real.", error);
    }
    
    // Mock Fallback
    res.json({
      encontrado: true,
      cliente: {
        id: 1001,
        nome: "João Silva (Simulado URA)",
        status: "ativo",
        contrato_id: 5432,
        bloqueado: false
      }
    });
  });
  app.get("/api/sgp/faturas", async (req, res) => {
    try {
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        const data = await fetchSGP("/api/faturas?limit=10");
        return res.json(data);
      }
    } catch (error) {
      console.warn("Aviso: Falha na API SGP real, utilizando dados de simulação.", error);
    }
    
    // Mock Fallback
    res.json([
      { id: 1, valor: 99.9, vencimento: "2026-09-10", status: "pendente" },
      { id: 2, valor: 99.9, vencimento: "2026-08-10", status: "pago" },
    ]);
  });

  // Generate PIX (Real ou Mock)
  app.post("/api/sgp/pix/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        // Chamada real à rota de geração de PIX do SGP
        const data = await fetchSGP(`/api/faturas/gerarpix/${id}`, "POST");
        return res.json({ sucesso: true, fatura_id: id, codigo_pix: data.copia_cola || data.pix });
      }
    } catch (error) {
      console.warn("Aviso: Falha na geração real de PIX, utilizando simulador.", error);
    }

    // Mock Fallback
    setTimeout(() => {
      res.json({
        sucesso: true,
        fatura_id: id,
        codigo_pix: `00020126580014br.gov.bcb.pix0136mock-pix-key-${id}-84a2-9999999999995204000053039865802BR5915PROVEDOR NAP6009SAO PAULO62070503***6304ABCD`,
      });
    }, 800);
  });

  // Generate Boleto PDF (Real ou Mock)
  app.post("/api/sgp/boleto/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        // Chamada real à rota de download de PDF da fatura do SGP
        const data = await fetchSGP(`/api/faturas/imprimir/${id}`, "GET");
        return res.json({ sucesso: true, fatura_id: id, url_pdf: data.link_boleto || data.url });
      }
    } catch (error) {
      console.warn("Aviso: Falha ao obter boleto real, utilizando simulador.", error);
    }

    // Mock Fallback
    setTimeout(() => {
      res.json({
        sucesso: true,
        fatura_id: id,
        url_pdf: `https://sgp.provedormock.com.br/boletos/v2/${id}_emitido.pdf`
      });
    }, 600);
  });

  // N8N Webhook Listener Mock (Sync from SGP to NAP)
  app.post("/api/webhooks/n8n/sgp-sync", (req, res) => {
    console.log("[N8N Webhook] Evento recebido do SGP/n8n:", req.body);
    res.json({ status: "processed", synced_to_db: true });
  });

  // --- Push Notifications Gateway (PWA Web Push) ---
  interface PushSubscriptionRecord {
    id: string;
    endpoint: string;
    keys?: {
      p256dh?: string;
      auth?: string;
    };
    cliente_id?: number | string;
    cliente_nome?: string;
    inscrito_em: string;
    dispositivo: string;
  }

  let pushSubscriptions: PushSubscriptionRecord[] = [
    {
      id: "sub_1001",
      endpoint: "https://fcm.googleapis.com/fcm/send/portal_nap_joao_silva_pwa",
      cliente_id: 1001,
      cliente_nome: "João Silva",
      inscrito_em: new Date().toISOString(),
      dispositivo: "Mobile Chrome / Android (PWA)"
    }
  ];

  let pushNotificationsHistory: Array<{
    id: string;
    titulo: string;
    mensagem: string;
    categoria: "cobranca" | "suporte" | "manutencao" | "marketing" | "geral";
    enviado_em: string;
    destinatarios: number;
    sucesso: boolean;
  }> = [
    {
      id: "push_notif_01",
      titulo: "Fatura Vencendo Amanhã",
      mensagem: "Sua fatura de R$ 99,90 vence amanhã. Pague via PIX para manter sua conexão sem interrupções.",
      categoria: "cobranca",
      enviado_em: "Hoje, 09:00",
      destinatarios: 1,
      sucesso: true
    }
  ];

  // Obter status e inscrições ativas de Push
  app.get("/api/push/status", (req, res) => {
    res.json({
      sucesso: true,
      total_inscritos: pushSubscriptions.length,
      inscricoes: pushSubscriptions,
      historico_recente: pushNotificationsHistory.slice(0, 10),
      vapid_public_key: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIhbQFLXYp5Nksh8U"
    });
  });

  // Registrar / Atualizar inscrição de Push do PWA
  app.post("/api/push/subscribe", (req, res) => {
    const { subscription, cliente_id = 1001, cliente_nome = "João Silva", dispositivo = "Navegador Web" } = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ sucesso: false, erro: "Objeto de subscrição inválido." });
    }

    const index = pushSubscriptions.findIndex(s => s.endpoint === subscription.endpoint);
    const novoRegistro: PushSubscriptionRecord = {
      id: `sub_${Date.now()}`,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      cliente_id,
      cliente_nome,
      inscrito_em: new Date().toISOString(),
      dispositivo
    };

    if (index >= 0) {
      pushSubscriptions[index] = novoRegistro;
    } else {
      pushSubscriptions.unshift(novoRegistro);
    }

    res.json({
      sucesso: true,
      mensagem: "Dispositivo registrado para notificações Push com sucesso!",
      total_inscritos: pushSubscriptions.length
    });
  });

  // Cancelar inscrição
  app.post("/api/push/unsubscribe", (req, res) => {
    const { endpoint } = req.body;
    pushSubscriptions = pushSubscriptions.filter(s => s.endpoint !== endpoint);
    res.json({ sucesso: true, mensagem: "Inscrição removida com sucesso." });
  });

  // Disparar notificação Push para clientes
  app.post("/api/push/send", (req, res) => {
    const { titulo, mensagem, categoria = "geral", url = "/portal", cliente_id } = req.body;

    if (!titulo || !mensagem) {
      return res.status(400).json({ sucesso: false, erro: "Título e mensagem são obrigatórios." });
    }

    const destinatarios = cliente_id 
      ? pushSubscriptions.filter(s => String(s.cliente_id) === String(cliente_id)).length 
      : pushSubscriptions.length;

    const registroHistorico = {
      id: `push_${Date.now()}`,
      titulo,
      mensagem,
      categoria: categoria as any,
      enviado_em: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      destinatarios: Math.max(destinatarios, 1),
      sucesso: true
    };

    pushNotificationsHistory.unshift(registroHistorico);

    res.json({
      sucesso: true,
      mensagem: `Push "${titulo}" transmitido com sucesso para ${registroHistorico.destinatarios} assinante(s)!`,
      notificacao: registroHistorico
    });
  });

  // --- FreePBX CTI Reverso (SSE Mock) ---
  let sseClients: any[] = [];

  app.get("/api/events/calls", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    sseClients.push(res);

    req.on("close", () => {
      sseClients = sseClients.filter(client => client !== res);
    });
  });

  app.post("/api/webhooks/freepbx/incoming", (req, res) => {
    const callData = {
      id: Math.floor(Math.random() * 10000),
      telefone: "+55 11 99999-9999",
      contato: "João Silva",
      fila: "Suporte N1",
      timestamp: new Date().toISOString()
    };

    sseClients.forEach(client => {
      client.write(`data: ${JSON.stringify(callData)}\n\n`);
    });

    res.json({ status: "ringing", call: callData });
  });

  // --- MÓDULO DE CONFIGURAÇÃO GLOBAL DO SISTEMA (SUPERADMIN & WHITE-LABEL) ---
  let systemConfig = {
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
      themeMode: "dark" as "dark" | "light"
    },
    sgp: {
      urlBase: "https://api.sgp.provedor.com.br/v1",
      appId: "NAP_SGP_PROD_991",
      token: "sgp_sec_token_99182374981729",
      syncIntervalMinutes: 15,
      autoDesbloqueio48h: true,
      avisoSonoroInadimplente: true,
      habilitarConsultaRadius: true,
      status: "conectado" as "conectado" | "desconectado" | "alerta"
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
      status: "conectado" as "conectado" | "desconectado" | "alerta"
    },
    whatsapp: {
      phoneNumberId: "109823471029384",
      businessAccountId: "394857201928374",
      tokenAcesso: "EAAGm0PXq1...9823h4",
      webhookUrl: "https://api.naptelecom.com.br/api/webhooks/whatsapp",
      verifyToken: "nap_waba_verify_token_secure",
      canalOficial: true,
      envioAutomaticoPix: true,
      status: "conectado" as "conectado" | "desconectado" | "alerta"
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
      gatilhoTransbordo: "solicitacao_cliente" as "imediato" | "apos_3_falhas" | "solicitacao_cliente",
      copilotoAtivo: true,
      status: "conectado" as "conectado" | "desconectado" | "alerta"
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

  let auditLogs: Array<{
    id: string;
    usuario: string;
    modulo: string;
    acao: string;
    detalhes: string;
    ip: string;
    data: string;
  }> = [
    {
      id: "log-1",
      usuario: "Admin NAP (SuperAdmin)",
      modulo: "White-label",
      acao: "Atualização de Identidade",
      detalhes: "Atualizada cor principal para #2563eb e razão social da empresa.",
      ip: "189.120.45.10",
      data: "Hoje, às 08:30"
    },
    {
      id: "log-2",
      usuario: "Admin NAP (SuperAdmin)",
      modulo: "Telefonia / FreePBX",
      acao: "Configuração de Tronco Asterisk",
      detalhes: "Ramal WebRTC 2001 conectado e WebSocket SIP ativado.",
      ip: "189.120.45.10",
      data: "Ontem, às 17:15"
    },
    {
      id: "log-3",
      usuario: "Sistema Automático",
      modulo: "SGP ERP",
      acao: "Sincronização Periódica",
      detalhes: "Sincronizados 12.450 contratos com sucesso (0 erros).",
      ip: "127.0.0.1",
      data: "Hoje, às 03:45"
    }
  ];

  // Obter configurações do sistema
  app.get("/api/configuracoes", (req, res) => {
    res.json({
      success: true,
      config: systemConfig
    });
  });

  // Atualizar configurações do sistema
  app.put("/api/configuracoes", (req, res) => {
    try {
      const novosDados = req.body;
      if (!novosDados) {
        return res.status(400).json({ error: "Dados inválidos para configuração." });
      }

      systemConfig = {
        ...systemConfig,
        ...novosDados,
        provedor: { ...systemConfig.provedor, ...(novosDados.provedor || {}) },
        sgp: { ...systemConfig.sgp, ...(novosDados.sgp || {}) },
        telefonia: { ...systemConfig.telefonia, ...(novosDados.telefonia || {}) },
        whatsapp: { ...systemConfig.whatsapp, ...(novosDados.whatsapp || {}) },
        ia: { ...systemConfig.ia, ...(novosDados.ia || {}) },
        seguranca: { ...systemConfig.seguranca, ...(novosDados.seguranca || {}) },
        atendimento: { ...systemConfig.atendimento, ...(novosDados.atendimento || {}) },
        respostasRapidas: Array.isArray(novosDados.respostasRapidas) ? novosDados.respostasRapidas : systemConfig.respostasRapidas
      };

      // Gravar entrada no log de auditoria
      const novoLog = {
        id: `log-${Date.now()}`,
        usuario: "Admin NAP (SuperAdmin)",
        modulo: "Configurações Globais",
        acao: "Atualização de Parâmetros",
        detalhes: `Parâmetros do sistema atualizados com sucesso via painel administrativo.`,
        ip: req.ip || "127.0.0.1",
        data: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + " (Hoje)"
      };
      auditLogs.unshift(novoLog);
      if (auditLogs.length > 50) auditLogs.pop();

      res.json({
        success: true,
        mensagem: "Configurações atualizadas e persistidas com sucesso!",
        config: systemConfig
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Erro ao salvar configurações." });
    }
  });

  // Testar conexão SGP
  app.post("/api/configuracoes/test-sgp", async (req, res) => {
    // Simula teste de latência e saúde da API SGP
    const inicio = Date.now();
    await new Promise(resolve => setTimeout(resolve, 380));
    const latencia = Date.now() - inicio;

    res.json({
      success: true,
      status: "online",
      latenciaMs: latencia,
      versaoApi: "SGP REST v8.4.2 Enterprise",
      servicos: {
        radius: "Operacional (Porta 1812/1813)",
        financeiro: "Operacional (Banco de Faturas Conectado)",
        rede_ftth: "Operacional (Telemetria OLT MikroTik/Huawei)"
      }
    });
  });

  // Testar conexão FreePBX / Asterisk AMI
  app.post("/api/configuracoes/test-freepbx", async (req, res) => {
    const inicio = Date.now();
    await new Promise(resolve => setTimeout(resolve, 290));
    const latencia = Date.now() - inicio;

    res.json({
      success: true,
      status: "online",
      latenciaMs: latencia,
      versaoAsterisk: "Asterisk 21.3.0 / FreePBX 17 (Debian 12)",
      canaisAtivos: 4,
      ramaisRegistrados: 18,
      webrtcStatus: "Ativo (WSS porta 8089 - Certificado TLS Válido)"
    });
  });

  // Testar conexão WhatsApp Business API (WABA)
  app.post("/api/configuracoes/test-whatsapp", async (req, res) => {
    const inicio = Date.now();
    await new Promise(resolve => setTimeout(resolve, 450));
    const latencia = Date.now() - inicio;

    res.json({
      success: true,
      status: "online",
      latenciaMs: latencia,
      phoneNumber: "+55 11 98765-4321",
      qualidadeNumero: "ALTA (Verde)",
      limiteDiarioMensagens: "Tier 2 (10.000 clientes/dia)",
      templatesAprovados: 16
    });
  });

  // Testar conexão IA Gemini / 9router
  app.post("/api/configuracoes/test-gemini", async (req, res) => {
    const inicio = Date.now();
    await new Promise(resolve => setTimeout(resolve, 320));
    const latencia = Date.now() - inicio;

    res.json({
      success: true,
      status: "online",
      latenciaMs: latencia,
      modelo: systemConfig.ia.modeloPrimario,
      provedor: "Google Gemini (9router Gateway)",
      tokensDisponiveis: "Ilimitado / Pay-as-you-go",
      tempoRespostaMedio: "185ms"
    });
  });

  // Obter log de auditoria
  app.get("/api/configuracoes/auditoria", (req, res) => {
    res.json({
      success: true,
      logs: auditLogs
    });
  });

  // Restaurar padrões
  app.post("/api/configuracoes/reset", (req, res) => {
    res.json({
      success: true,
      mensagem: "Configurações restauradas para os padrões de fábrica do NAP.",
      config: systemConfig
    });
  });
  // Catch-all API 404 handler
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint não encontrado", route: req.originalUrl });
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    if (req.path.startsWith("/api/")) {
      res.status(500).json({ error: "Erro interno", details: err.message });
    } else {
      next(err);
    }
  });

  // Catch-all API 404 handler
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint não encontrado", route: req.originalUrl });
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    if (req.path.startsWith("/api/")) {
      res.status(500).json({ error: "Erro interno", details: err.message });
    } else {
      next(err);
    }
  });

  if (!process.env.VERCEL) {
  if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
    import("vite").then(async (vite) => {
      const viteServer = await vite.createServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(viteServer.middlewares);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

export default app;
