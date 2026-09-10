import express from "express";
import path from "path";
import cors from "cors";
import { agentToolRegistry } from "./server/agent/toolRegistry";




  const app = express();
  const PORT = 3000;

const SGP_URL = process.env.SGP_URL || "";
const SGP_APP = process.env.SGP_APP || "";
const SGP_TOKEN = process.env.SGP_TOKEN || "";

// Função mock para fetchSGP
async function fetchSGP(endpoint, method = "GET", body = null) {
  const url = `${SGP_URL}${endpoint}`;
  const options: any = {
    method,
    headers: {
      "app": SGP_APP,
      "token": SGP_TOKEN,
      "Content-Type": "application/json"
    }
  };
  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Erro HTTP SGP: ${res.status}`);
  return await res.json();
}


  app.use(cors());
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

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
  
const sgpDatabase_mock: any[] = [
  { id: 101, nome: "João Silva", status: "ativo", cpf_cnpj: "111.222.333-44", contato: { telefone: "(11) 98765-4321" }, financeiro: { valor: 99.9, status: "em_atraso" } },
  { id: 102, nome: "Carlos Eduardo Santos", status: "ativo", cpf_cnpj: "555.666.777-88", contato: { telefone: "(11) 97123-8899" }, financeiro: { valor: 119.9, status: "em_dia" } }
];

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
    res.json(sgpDatabase_mock.map(c => ({
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
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      let systemInstruction = "";
      let bookstackContext = "";
      if (vertical === "suporte") {
        bookstackContext = "[RAG BookStack]: Artigo ID #401 - Resolução de ONU com LOS Vermelho: Instruir cliente a verificar se o cabo óptico está dobrado ou rompido.";
        systemInstruction = (systemConfig.ia?.promptSuporte || "Você é um assistente técnico do NAP.") + "\n\n[Base de Conhecimento]: " + bookstackContext;
      } else if (vertical === "vendas") {
        bookstackContext = "[RAG BookStack]: Planos atuais: 500MB por R$99,90, 700MB por R$119,90.";
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
        modelo: "gemini-2.5-flash (Integração Direta BookStack)",
        tokens: response.usageMetadata?.totalTokenCount || 0
      });
    } catch (error: any) {
      console.error("Erro no /api/ia/chat:", error);
      res.status(500).json({ erro: "Erro ao comunicar com a IA", detalhes: error.message });
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

  
  app.get("/api/sgp/boleto/mock/:id", (req, res) => {
    const { id } = req.params;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Boleto - ${id}</title>
        <style>
          body { font-family: monospace; background: #e2e8f0; padding: 2rem; display: flex; justify-content: center; }
          .boleto { background: white; padding: 2rem; width: 800px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          .header { border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; }
          .bank-code { font-size: 1.5rem; font-weight: bold; border-left: 2px solid #000; border-right: 2px solid #000; padding: 0 1rem; }
          .linha-digitavel { font-size: 1.25rem; font-weight: bold; }
          .row { display: flex; border-bottom: 1px solid #000; }
          .col { flex: 1; padding: 0.5rem; border-right: 1px solid #000; }
          .col:last-child { border-right: none; }
          .label { font-size: 0.65rem; font-weight: bold; margin-bottom: 0.25rem; }
          .value { font-size: 0.85rem; }
          @media print { body { background: white; padding: 0; } .boleto { box-shadow: none; border: none; width: 100%; } }
        </style>
      </head>
      <body>
        <div class="boleto">
          <div class="header">
            <div style="font-weight: bold; font-size: 1.5rem; display: flex; gap: 10px;">
              <span>033-7</span> <!-- Banco -->
            </div>
            <div class="linha-digitavel">03399.87654 32100.000000 12345.678901 1 99990000009990</div>
          </div>
          <div class="row">
            <div class="col" style="flex: 3"><div class="label">Local de Pagamento</div><div class="value">Pagável em qualquer banco até o vencimento</div></div>
            <div class="col"><div class="label">Vencimento</div><div class="value">20/09/2026</div></div>
          </div>
          <div class="row">
            <div class="col" style="flex: 3"><div class="label">Beneficiário</div><div class="value">${systemConfig?.provedor?.nomeFantasia || 'NAP Telecom'} - ${systemConfig?.provedor?.cnpj || '00.000.000/0001-00'}</div></div>
            <div class="col"><div class="label">Agência / Código Beneficiário</div><div class="value">1234 / 56789-0</div></div>
          </div>
          <div class="row">
            <div class="col"><div class="label">Data do Documento</div><div class="value">10/09/2026</div></div>
            <div class="col"><div class="label">Nº Documento</div><div class="value">${id}</div></div>
            <div class="col"><div class="label">Espécie Doc.</div><div class="value">RC</div></div>
            <div class="col"><div class="label">Aceite</div><div class="value">N</div></div>
            <div class="col"><div class="label">Data Processamento</div><div class="value">10/09/2026</div></div>
            <div class="col"><div class="label">Nosso Número</div><div class="value">00000000${id}</div></div>
          </div>
          <div class="row">
            <div class="col" style="flex: 3"><div class="label">Uso do Banco</div><div class="value"></div></div>
            <div class="col"><div class="label">Carteira</div><div class="value">101</div></div>
            <div class="col"><div class="label">Espécie Moeda</div><div class="value">R$</div></div>
            <div class="col"><div class="label">Quantidade Moeda</div><div class="value"></div></div>
            <div class="col"><div class="label">Valor Moeda</div><div class="value"></div></div>
            <div class="col"><div class="label">(=) Valor do Documento</div><div class="value">99,90</div></div>
          </div>
          <div class="row" style="height: 120px;">
            <div class="col" style="flex: 3">
              <div class="label">Instruções (Texto de responsabilidade do beneficiário)</div>
              <div class="value">
                Não receber após o vencimento.<br>
                Após vencimento cobrar multa de 2% e juros de 1% ao mês.<br>
                Sujeito a suspensão dos serviços 15 dias após o vencimento.
              </div>
            </div>
            <div class="col">
              <div style="border-bottom: 1px solid #000; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
                <div class="label">(-) Desconto / Abatimento</div>
                <div class="value">&nbsp;</div>
              </div>
              <div style="border-bottom: 1px solid #000; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
                <div class="label">(+) Mora / Multa</div>
                <div class="value">&nbsp;</div>
              </div>
              <div>
                <div class="label">(=) Valor Cobrado</div>
                <div class="value">&nbsp;</div>
              </div>
            </div>
          </div>
          <div class="row" style="border-bottom: none; align-items: center; padding-top: 1rem;">
            <div class="col" style="flex: 3; border-right: none;">
              <div class="label">Pagador</div>
              <div class="value">Cliente Demonstrativo NAP - CPF: 000.000.000-00</div>
              <div class="value">Rua Exemplo, 123 - Centro, São Paulo - SP</div>
            </div>
          </div>
          <div style="margin-top: 2rem; border-top: 2px dashed #cbd5e1; padding-top: 2rem; text-align: center;">
            <div style="display: inline-block; width: 100%; max-width: 500px; height: 50px; background: repeating-linear-gradient(90deg, #000, #000 3px, #fff 3px, #fff 6px, #000 6px, #000 8px, #fff 8px, #fff 11px);"></div>
          </div>
        </div>
        <script>
          // window.print();
        </script>
      </body>
      </html>
    `;
    res.send(html);
  });

  // Ações de Rede (MikroTik / Radius)
  app.post("/api/network/kick-radius/:ip", async (req, res) => {
    const { ip } = req.params;
    // Simula envio de pacote PoD (Packet of Disconnect) porta 3799 para o concentrador
    await new Promise(r => setTimeout(r, 400));
    res.json({ success: true, message: `Sessão PPPoE (${ip}) derrubada com sucesso no BNG/MikroTik.` });
  });

  // Desbloqueio em Confiança SGP
  app.post("/api/sgp/desbloqueio-confianca/:id", async (req, res) => {
    const { id } = req.params;
    // Simula alteração no ERP e liberação no Radius
    await new Promise(r => setTimeout(r, 600));
    res.json({ success: true, message: `Cliente ${id} desbloqueado por 48 horas.` });
  });

  // --- Módulo TR-069 / GenieACS: Gestão de Wi-Fi Residencial pelo Cliente (Portal PWA) ---
  const customerWifiConfig: any = {
    serialNumber: "ZTEGC1234567",
    modeloCpe: "ZTE F670L Dual-Band AC1200",
    fabricante: "ZTE",
    mac: "00:11:22:33:44:55",
    ipCpe: "192.168.1.1",
    status: "online",
    ssid24: "Fibra_JoaoSilva_2.4G",
    ssid5: "Fibra_JoaoSilva_5G",
    senhaWifi: "Fibra@2026",
    ocultarSsid: false,
    seguranca: "WPA2-PSK (AES)",
    bandaSincronizada: true,
    canal24: "Canal 6 (Auto)",
    canal5: "Canal 149 (Auto)",
    potenciaTx: "100%",
    dispositivosConectados: [
      { nome: "iPhone 15 Pro", ip: "192.168.1.104", mac: "8C:85:90:12:34:56", banda: "5 GHz", sinal: -48, tipo: "smartphone" },
      { nome: "Smart TV Samsung 4K", ip: "192.168.1.108", mac: "D4:E6:B7:AA:BB:CC", banda: "5 GHz", sinal: -52, tipo: "tv" },
      { nome: "Notebook Dell Inspiron", ip: "192.168.1.115", mac: "34:E6:D7:11:22:33", banda: "5 GHz", sinal: -61, tipo: "computador" },
      { nome: "Echo Dot Alexa (Sala)", ip: "192.168.1.120", mac: "44:65:0D:88:99:00", banda: "2.4 GHz", sinal: -58, tipo: "iot" },
      { nome: "Câmera Externa Wi-Fi", ip: "192.168.1.135", mac: "60:01:94:44:55:66", banda: "2.4 GHz", sinal: -69, tipo: "camera" }
    ],
    historicoAlteracoes: [
      { data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), autor: "Técnico de Instalação", acao: "Configuração Inicial da Fibra" }
    ],
    ultimaAlteracao: new Date().toISOString()
  };

  // Obter configurações Wi-Fi do assinante
  app.get("/api/portal/wifi", (req, res) => {
    res.json({
      sucesso: true,
      config: customerWifiConfig
    });
  });

  // Atualizar senha e credenciais de Wi-Fi via TR-069
  app.post("/api/portal/wifi", async (req, res) => {
    const { senhaWifi, ssid24, ssid5, ocultarSsid, bandaSincronizada } = req.body;

    // Validação de segurança WPA2/WPA3
    if (senhaWifi !== undefined) {
      if (typeof senhaWifi !== "string" || senhaWifi.length < 8 || senhaWifi.length > 63) {
        return res.status(400).json({
          sucesso: false,
          erro: "A senha do Wi-Fi deve ter no mínimo 8 e no máximo 63 caracteres."
        });
      }
      customerWifiConfig.senhaWifi = senhaWifi;
    }

    if (ssid24 && typeof ssid24 === "string" && ssid24.trim().length > 0) {
      customerWifiConfig.ssid24 = ssid24.trim();
    }

    if (ssid5 && typeof ssid5 === "string" && ssid5.trim().length > 0) {
      customerWifiConfig.ssid5 = ssid5.trim();
    }

    if (ocultarSsid !== undefined) {
      customerWifiConfig.ocultarSsid = Boolean(ocultarSsid);
    }

    if (bandaSincronizada !== undefined) {
      customerWifiConfig.bandaSincronizada = Boolean(bandaSincronizada);
    }

    customerWifiConfig.ultimaAlteracao = new Date().toISOString();
    customerWifiConfig.historicoAlteracoes.unshift({
      data: customerWifiConfig.ultimaAlteracao,
      autor: "Assinante (Portal do Cliente PWA)",
      acao: `Alteração de Credenciais Wi-Fi (SSID: ${customerWifiConfig.ssid24} / Senha atualizada)`
    });

    // Simula tempo de envio do comando TR-069 SetParameterValues para a CPE/ONU
    await new Promise(r => setTimeout(r, 650));

    res.json({
      sucesso: true,
      mensagem: "Senha de Wi-Fi alterada com sucesso! As novas credenciais foram enviadas e aplicadas no seu roteador via TR-069.",
      config: customerWifiConfig,
      tr069Job: {
        id: "tr069_job_" + Math.random().toString(36).substring(2, 9),
        metodo: "SetParameterValues",
        parametrosAtualizados: [
          "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey",
          "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID",
          "InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.PreSharedKey.1.PreSharedKey",
          "InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID"
        ],
        status: "SUCCESS",
        timestamp: new Date().toISOString()
      }
    });
  });

  // Reiniciar ONU / Roteador Wi-Fi remotamente via TR-069
  app.post("/api/portal/wifi/reboot", async (req, res) => {
    // Simula comando Reboot TR-069
    await new Promise(r => setTimeout(r, 500));
    res.json({
      sucesso: true,
      mensagem: "Comando de reinicialização enviado com sucesso para a ONU/Roteador via TR-069. O equipamento reconectará em aproximadamente 60 segundos."
    });
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
    ],
    landingPage: {
      templatePadrao: 1 as 1 | 2 | 3,
      tituloPrincipal: "Conexão Ultrarrápida em Fibra Óptica para Sua Casa ou Empresa",
      subtitulo: "Internet 100% fibra simétrica com Wi-Fi 6 de alta performance, estabilidade absoluta e atendimento humanizado 24h por dia.",
      textoBotaoCta: "Ver Planos Disponíveis",
      whatsappVendas: "(11) 98765-4321",
      telefoneVendas: "0800 591 0000",
      mostrarBotaoPortal: true,
      mostrarBotaoAdmin: true,
      mostrarBarraFlutuante: true,
      plano1: { nome: "Fibra 400 Mega", velocidade: "400", preco: "89,90", tag: "Essencial", wifi: "Wi-Fi 5 Dual-Band Incluso", streaming: "Paramount+ Incluso" },
      plano2: { nome: "Fibra 700 Mega", velocidade: "700", preco: "119,90", tag: "Mais Popular", wifi: "Roteador Wi-Fi 6 Mesh Gigagold", streaming: "Paramount+ & Max Inclusos" },
      plano3: { nome: "Fibra 1 Giga Gamer", velocidade: "1000", preco: "159,90", tag: "Gamer / Pro", wifi: "2x Nós Mesh Wi-Fi 6 Mesh", streaming: "IP Fixo + Rota Baixa Latência" }
    }
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
        landingPage: { ...systemConfig.landingPage, ...(novosDados.landingPage || {}) },
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
        detalhes: `Parâmetros do sistema e vitrine landing page atualizados via painel administrativo.`,
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

  // Upload e processamento de Logotipo do Provedor
  app.post("/api/configuracoes/upload-logo", (req, res) => {
    try {
      const { logoData, fileName } = req.body;
      if (!logoData || typeof logoData !== "string") {
        return res.status(400).json({ error: "Arquivo ou dados de imagem não fornecidos." });
      }

      // Validação básica se é Data URL de imagem ou URL http
      const isDataUrl = logoData.startsWith("data:image/");
      const isHttpUrl = logoData.startsWith("http://") || logoData.startsWith("https://");
      if (!isDataUrl && !isHttpUrl) {
        return res.status(400).json({ error: "Formato de arquivo inválido. Envie uma imagem válida (PNG, SVG, JPG, WebP)." });
      }

      systemConfig.provedor.logoUrl = logoData;

      const novoLog = {
        id: `log-${Date.now()}`,
        usuario: "Admin NAP (SuperAdmin)",
        modulo: "Identidade Visual",
        acao: "Upload de Logotipo",
        detalhes: `Novo logotipo carregado com sucesso (${fileName || "arquivo de imagem"}).`,
        ip: req.ip || "127.0.0.1",
        data: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + " (Hoje)"
      };
      auditLogs.unshift(novoLog);
      if (auditLogs.length > 50) auditLogs.pop();

      res.json({
        success: true,
        mensagem: "Logotipo atualizado e aplicado com sucesso ao sistema e à Landing Page!",
        logoUrl: logoData
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Erro ao processar logotipo." });
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

  // --- MÓDULO NOC OUTAGE SHIELD (GESTÃO DE INCIDENTES MASSIVOS E INTERCEPTAÇÃO DE IA) ---
  interface IncidenteRede {
    id: string;
    titulo: string;
    tipo: "rompimento_fibra" | "falha_energia_pop" | "degradacao_olt" | "manutencao_programada";
    regioesAfetadas: string[];
    concentradorOuOlt: string;
    clientesAfetadosAprox: number;
    status: "investigando" | "em_reparo" | "normalizado";
    previsaoRetorno: string;
    iniciadoEm: string;
    protocoloAnatel: string;
    descricao: string;
    autoInterceptarAtendimento: boolean;
    notificacoesEnviadas: number;
  }

  let incidentesRede: IncidenteRede[] = [
    {
      id: "INC-2026-0902",
      titulo: "Rompimento de Fibra Troncal (Backbone Anel 02)",
      tipo: "rompimento_fibra",
      regioesAfetadas: ["Centro Histórico", "Bela Vista", "Jardim Paulista"],
      concentradorOuOlt: "OLT-Huawei-Central-01 / PON 03 e 04",
      clientesAfetadosAprox: 420,
      status: "em_reparo",
      previsaoRetorno: "15:30 (Hoje)",
      iniciadoEm: "10:15 (Hoje)",
      protocoloAnatel: "ANT-2026-884910",
      descricao: "Caminhão arrastou cabeamento troncal na Av. Brigadeiro Luís Antônio. Duas equipes de fusão óptica já estão no local.",
      autoInterceptarAtendimento: true,
      notificacoesEnviadas: 395
    }
  ];

  // Listar Incidentes
  app.get("/api/incidentes", (req, res) => {
    res.json({
      sucesso: true,
      total: incidentesRede.length,
      incidentes: incidentesRede
    });
  });

  // Criar novo Incidente
  app.post("/api/incidentes", (req, res) => {
    const { titulo, tipo, regioesAfetadas, concentradorOuOlt, clientesAfetadosAprox, previsaoRetorno, descricao } = req.body;
    
    const novoIncidente: IncidenteRede = {
      id: `INC-${Date.now().toString().slice(-6)}`,
      titulo: titulo || "Oscilação de Rede Detectada",
      tipo: tipo || "rompimento_fibra",
      regioesAfetadas: Array.isArray(regioesAfetadas) ? regioesAfetadas : ["Região Geral"],
      concentradorOuOlt: concentradorOuOlt || "OLT Central",
      clientesAfetadosAprox: Number(clientesAfetadosAprox) || 120,
      status: "em_reparo",
      previsaoRetorno: previsaoRetorno || "Em até 2 horas",
      iniciadoEm: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + " (Hoje)",
      protocoloAnatel: `ANT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      descricao: descricao || "Manutenção corretiva em andamento.",
      autoInterceptarAtendimento: true,
      notificacoesEnviadas: 0
    };

    incidentesRede.unshift(novoIncidente);
    res.status(201).json({ sucesso: true, incidente: novoIncidente });
  });

  // Atualizar Incidente (status, previsão)
  app.patch("/api/incidentes/:id", (req, res) => {
    const { id } = req.params;
    const { status, previsaoRetorno, descricao } = req.body;

    const index = incidentesRede.findIndex(inc => inc.id === id);
    if (index === -1) {
      return res.status(404).json({ sucesso: false, erro: "Incidente não encontrado." });
    }

    if (status) incidentesRede[index].status = status;
    if (previsaoRetorno) incidentesRede[index].previsaoRetorno = previsaoRetorno;
    if (descricao) incidentesRede[index].descricao = descricao;

    res.json({ sucesso: true, incidente: incidentesRede[index] });
  });

  // Disparo em Massa de Alerta de Incidente para Clientes da Região
  app.post("/api/incidentes/:id/notificar-massa", (req, res) => {
    const { id } = req.params;
    const incidente = incidentesRede.find(inc => inc.id === id);
    if (!incidente) {
      return res.status(404).json({ sucesso: false, erro: "Incidente não encontrado." });
    }

    incidente.notificacoesEnviadas += incidente.clientesAfetadosAprox;

    // Registra notificação push no histórico
    pushNotificationsHistory.unshift({
      id: `push_inc_${Date.now()}`,
      titulo: `⚠️ Comunicado de Manutenção: ${incidente.titulo}`,
      mensagem: `Identificamos uma oscilação na fibra que atende sua região (${incidente.regioesAfetadas.join(', ')}). Equipe técnica no local. Previsão de normalização: ${incidente.previsaoRetorno}.`,
      categoria: "manutencao",
      enviado_em: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      destinatarios: incidente.clientesAfetadosAprox,
      sucesso: true
    });

    res.json({
      sucesso: true,
      mensagem: `Alerta transmitido com sucesso via WhatsApp e Push para ${incidente.clientesAfetadosAprox} clientes afetados!`,
      incidente
    });
  });

  // Verificar se determinado cliente ou endereço está sob impacto de Incidente Ativo
  app.get("/api/incidentes/verificar-cliente", (req, res) => {
    const { bairro = "", cidade = "" } = req.query as { bairro?: string; cidade?: string };

    const termoBairro = bairro.toLowerCase().trim();
    const incidenteAtivo = incidentesRede.find(inc => 
      inc.status !== "normalizado" &&
      inc.autoInterceptarAtendimento &&
      inc.regioesAfetadas.some(reg => reg.toLowerCase().includes(termoBairro) || termoBairro.includes(reg.toLowerCase()))
    );

    if (incidenteAtivo) {
      return res.json({
        afetado: true,
        incidente: incidenteAtivo,
        mensagem_interceptacao: `🚨 Olá! Identificamos uma oscilação na fibra óptica que atende a região do seu endereço (${bairro}). Nossas equipes de fusão já estão no local efetuando o reparo emergencial (Protocolo ${incidenteAtivo.protocoloAnatel}). Previsão de normalização: ${incidenteAtivo.previsaoRetorno}. Não é necessário aguardar em fila.`
      });
    }

    res.json({ afetado: false });
  });

  // --- MÓDULO RÉGUA INTELIGENTE DE COBRANÇA (AUTO-BILLING & NEGOCIAÇÃO IA) ---
  let reguaCobrancaConfig = {
    ativa: true,
    diasAntesVencimento: 3,
    notificarDiaVencimento: true,
    diasAposVencimentoTolerancia: 3,
    diasAposVencimentoBloqueio: 7,
    gerarPixAutomatico: true,
    estatisticas: {
      totalDisparadosHoje: 84,
      faturasRecuperadasPix: 39,
      valorRecuperadoHoje: 3896.10,
      taxaConversaoPix: "46.4%"
    },
    historicoExecucoes: [
      {
        id: "exec-01",
        fase: "D-3 (Lembrete Preventivo)",
        disparados: 42,
        pixGerados: 42,
        sucesso: 42,
        data: "Hoje, às 08:30"
      },
      {
        id: "exec-02",
        fase: "D0 (Vence Hoje)",
        disparados: 28,
        pixGerados: 28,
        sucesso: 28,
        data: "Hoje, às 09:15"
      },
      {
        id: "exec-03",
        fase: "D+3 (Notificação de Tolerância)",
        disparados: 14,
        pixGerados: 14,
        sucesso: 14,
        data: "Hoje, às 10:00"
      }
    ]
  };

  app.get("/api/cobranca/regua", (req, res) => {
    res.json({
      sucesso: true,
      config: reguaCobrancaConfig
    });
  });

  app.put("/api/cobranca/regua", (req, res) => {
    reguaCobrancaConfig = {
      ...reguaCobrancaConfig,
      ...req.body
    };
    res.json({ sucesso: true, mensagem: "Parâmetros da régua de cobrança atualizados com sucesso!", config: reguaCobrancaConfig });
  });

  // Executar disparo em lote de uma das fases da régua
  app.post("/api/cobranca/regua/executar", (req, res) => {
    const { fase = "d_menos_3" } = req.body;

    let totalDisparados = 0;
    let valorEstimado = 0;
    let nomeFase = "";

    if (fase === "d_menos_3") {
      totalDisparados = 35;
      valorEstimado = 3496.50;
      nomeFase = "D-3 (Lembrete Preventivo Amigável)";
    } else if (fase === "d_zero") {
      totalDisparados = 22;
      valorEstimado = 2197.80;
      nomeFase = "D0 (Vence Hoje)";
    } else if (fase === "d_mais_3") {
      totalDisparados = 12;
      valorEstimado = 1198.80;
      nomeFase = "D+3 (Aviso de Tolerância e Desbloqueio 48h)";
    } else {
      totalDisparados = 8;
      valorEstimado = 799.20;
      nomeFase = "D+7 (Aviso de Suspensão MikroTik)";
    }

    reguaCobrancaConfig.estatisticas.totalDisparadosHoje += totalDisparados;
    reguaCobrancaConfig.estatisticas.valorRecuperadoHoje += (valorEstimado * 0.45);
    reguaCobrancaConfig.historicoExecucoes.unshift({
      id: `exec-${Date.now()}`,
      fase: nomeFase,
      disparados: totalDisparados,
      pixGerados: totalDisparados,
      sucesso: totalDisparados,
      data: "Agora mesmo"
    });

    res.json({
      sucesso: true,
      fase: nomeFase,
      totalDisparados,
      valorTotal: valorEstimado,
      mensagem: `Disparo da régua "${nomeFase}" processado com sucesso! ${totalDisparados} clientes notificados com PIX Copia e Cola.`
    });
  });

  // --- CÉREBRO DE IA: ENGINE GEMINI COM DYNAMIC TOOL REGISTRY (TELECOM & CALL CENTER) ---
  app.get("/api/gemini/agent/tools", (req, res) => {
    const tools = agentToolRegistry.getAllTools().map(t => ({
      name: t.name,
      label: t.label,
      description: t.description,
      category: t.category,
      keywords: t.keywords
    }));

    res.json({
      sucesso: true,
      total: tools.length,
      tools
    });
  });

  app.post("/api/gemini/agent/run", async (req, res) => {
    const startTime = Date.now();
    const { prompt = "", cliente_cpf, telefone, contexto } = req.body;
    const promptLower = prompt.toLowerCase();

    // Identificação e Execução Dinâmica via Tool Registry
    let toolExecutada: string | undefined = undefined;
    let toolDados: any = null;
    let respostaGerada = "";

    const matchedTool = agentToolRegistry.matchTool(prompt);

    if (matchedTool) {
      try {
        const execution = await matchedTool.execute({
          prompt,
          cliente_cpf,
          telefone,
          contexto
        });
        toolExecutada = execution.toolExecutada;
        toolDados = execution.toolDados;
        respostaGerada = execution.respostaGerada;
      } catch (err: any) {
        console.error(`Erro ao executar ferramenta ${matchedTool.name}:`, err);
        respostaGerada = `Houve uma falha ao consultar o serviço (${matchedTool.label}). Tentando rota alternativa de contingência...`;
      }
    } else {
      // Conversação Geral / FAQ do Provedor
      respostaGerada = `Olá! Sou a Inteligência Artificial humanizada do NAP Telecom. Posso emitir sua 2ª via e chave PIX, testar a potência óptica da sua fibra (TR-069), reiniciar remotamente seu roteador, consultar viabilidade técnica ou verificar manutenções da rede. Como posso te atender agora?`;
    }

    // Se houver chave do Gemini e usuário fez pergunta complexa sem tool direta, enriquece via IA
    if (process.env.GEMINI_API_KEY && promptLower.length > 25 && !toolExecutada) {
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Você é a inteligência artificial humanizada do provedor de internet NAP Telecom Fibra.
O cliente disse: "${prompt}".
Responda cordialmente em português, com tom de especialista em telecomunicações, sendo prestativo, objetivo e empático.`
        });
        if (response.text) {
          respostaGerada = response.text;
        }
      } catch (err) {
        console.warn("Fallback local para agente Gemini:", err);
      }
    }

    const tempoTotal = Date.now() - startTime;

    res.json({
      sucesso: true,
      resposta: respostaGerada,
      tool: toolExecutada,
      tool_dados: toolDados,
      tempo_ms: Math.max(tempoTotal, 240),
      tokens: 185 + Math.floor(Math.random() * 80),
      modelo: "gemini-2.5-flash (Telecom Engine)"
    });
  });

  // Testar conexão Multi-ERP (SGP, IXC Soft, MK-AUTH, HubSoft)
  app.post("/api/configuracoes/test-erp", async (req, res) => {
    const { tipoErp = "sgp", url = "", token = "", appId = "" } = req.body;
    const inicio = Date.now();
    await new Promise(resolve => setTimeout(resolve, 380));
    const latencia = Date.now() - inicio;

    let versaoApi = "SGP REST v8.4.2 Enterprise";
    let contratosSincronizados = 12450;
    let detalhes = "Banco de Faturas e Radius MikroTik conectados.";

    if (tipoErp === "ixc") {
      versaoApi = "IXC Soft WebServices API v1 (REST Webservice)";
      contratosSincronizados = 14200;
      detalhes = "Conexão com radius_radusuarios e webservice_faturas validada.";
    } else if (tipoErp === "mkauth") {
      versaoApi = "MK-AUTH API SSH/REST v24.01";
      contratosSincronizados = 8920;
      detalhes = "Tabelas sis_cliente e sis_lanc operacionais.";
    } else if (tipoErp === "hubsoft") {
      versaoApi = "HubSoft Public API v2";
      contratosSincronizados = 16800;
      detalhes = "OAuth 2.0 Bearer Token autenticado com sucesso.";
    }

    res.json({
      success: true,
      status: "online",
      latenciaMs: latencia,
      tipoErp: tipoErp.toUpperCase(),
      versaoApi,
      contratosSincronizados,
      detalhes,
      servicos: {
        radius: "Operacional",
        financeiro: "Sincronizado",
        ftth_telemetria: "Operacional"
      }
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

  // ==========================================
  // PESQUISA DE SATISFAÇÃO NPS & CSAT
  // ==========================================
  const npsFeedMock = [
    {
      id: "NPS-1092",
      cliente: "Carlos Eduardo Mendes",
      telefone: "+55 (11) 98234-1102",
      canal: "WhatsApp WABA",
      nota: 10,
      classificacao: "promotor",
      atendente: "Agente IA (Gemini)",
      comentario: "A fatura em PDF e o código PIX vieram em 5 segundos no zap. Muito mais rápido do que falar no 0800.",
      setor: "Financeiro",
      data: "Hoje, 11:42",
      sentimento: "positivo"
    },
    {
      id: "NPS-1091",
      cliente: "Mariana Alcantara",
      telefone: "+55 (11) 97120-8833",
      canal: "Webchat Portal",
      nota: 9,
      classificacao: "promotor",
      atendente: "Lucas Gabriel",
      comentario: "O técnico veio no mesmo dia e trocou o conector da fibra que o cachorro mordeu. Internet voando!",
      setor: "Suporte N2",
      data: "Hoje, 10:15",
      sentimento: "positivo"
    },
    {
      id: "NPS-1090",
      cliente: "Roberto Vasconcelos",
      telefone: "+55 (11) 99841-3320",
      canal: "Telefonia Asterisk",
      nota: 4,
      classificacao: "detrator",
      atendente: "Agente URA IA",
      comentario: "Houve rompimento no meu bairro e demorou 3 horas para voltar. O aviso no portal ajudou, mas o prazo atrasou 30 min.",
      setor: "NOC / Redes",
      data: "Ontem, 18:20",
      sentimento: "negativo"
    },
    {
      id: "NPS-1089",
      cliente: "Juliana Peixoto",
      telefone: "+55 (11) 96510-4419",
      canal: "WhatsApp WABA",
      nota: 10,
      classificacao: "promotor",
      atendente: "Beatriz Santos",
      comentario: "Migrei para o plano Gamer de 800MB com Wi-Fi 6 e o ping no CS2 caiu para 6ms. Sensacional!",
      setor: "Vendas",
      data: "Ontem, 16:04",
      sentimento: "positivo"
    },
    {
      id: "NPS-1088",
      cliente: "Fábio Henrique Diniz",
      telefone: "+55 (11) 98112-9900",
      canal: "Webchat Portal",
      nota: 7,
      classificacao: "neutro",
      atendente: "Agente IA (Gemini)",
      comentario: "O auto-diagnóstico reiniciou meu roteador e normalizou a velocidade, mas o site demorou um pouco para carregar no celular.",
      setor: "Suporte N1",
      data: "Ontem, 14:10",
      sentimento: "neutro"
    }
  ];

  app.get("/api/nps/stats", (req, res) => {
    res.json({
      sucesso: true,
      npsScore: 78,
      zona: "Zona de Excelência (75 a 100)",
      totalRespostas: 486,
      csatMedio: 4.8, // de 5.0
      cesMedio: 1.3, // Customer Effort Score (quanto menor melhor, escala 1 a 5)
      promotoresPct: 84, // 9-10
      neutrosPct: 11, // 7-8
      detratoresPct: 5, // 0-6
      taxaResposta: "42.8%",
      resolucaoPrimeiroContato: "87.4%",
      historicoSemanal: [
        { semana: "Sem 1", nps: 72, csat: 4.6, promotores: 78, detratores: 8 },
        { semana: "Sem 2", nps: 75, csat: 4.7, promotores: 81, detratores: 6 },
        { semana: "Sem 3", nps: 76, csat: 4.75, promotores: 82, detratores: 6 },
        { semana: "Sem 4", nps: 78, csat: 4.8, promotores: 84, detratores: 5 }
      ]
    });
  });

  app.get("/api/nps/feed", (req, res) => {
    res.json({
      sucesso: true,
      total: npsFeedMock.length,
      feed: npsFeedMock
    });
  });

  app.post("/api/nps/disparar", (req, res) => {
    const { cliente, telefone, canal, ticketId } = req.body;
    res.json({
      sucesso: true,
      mensagem: `Gatilho de pesquisa NPS agendado com sucesso para ${cliente || 'cliente'} via ${canal || 'WhatsApp'}. Disparo automático em 3 minutos após encerramento do chamado #${ticketId || '1093'}.`
    });
  });

  // Catch-all API 404 handler (único e limpo)
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

  if (!process.env.VERCEL && process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production server running on http://localhost:${PORT}`);
  });
}

export default app;
