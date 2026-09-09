import express from "express";
import path from "path";
import cors from "cors";

// We import createViteServer dynamically if not in production
let createViteServer: any;
if (process.env.NODE_ENV !== "production") {
  import("vite").then((vite) => {
    createViteServer = vite.createServer;
  });
}

async function startServer() {
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

  // Mock Kanban Deals (Support & Sales)
  app.get("/api/deals", (req, res) => {
    res.json([
      { id: 101, titulo: "Internet Lenta", estagio: "Novo Chamado", pipeline: "Suporte", contato: "João Silva", prioridade: 1 },
      { id: 102, titulo: "Nova Instalação", estagio: "Qualificado", pipeline: "Vendas", contato: "Maria Oliveira", prioridade: 2 },
    ]);
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
    
    // Mock Fallback original
    res.json([
      { id: 1001, cpf_cnpj: "111.222.333-44", nome: "João Silva", telefone: "+55 11 99999-9999", plano: "Fibra 500MB", status_cliente: "ativo" },
      { id: 1002, cpf_cnpj: "555.666.777-88", nome: "Maria Oliveira", telefone: "+55 11 88888-8888", plano: "Fibra 1GB", status_cliente: "bloqueado" },
      { id: 1003, cpf_cnpj: "22.333.444/0001-55", nome: "Empresa XPTO Ltda", telefone: "+55 11 3333-4444", plano: "Link Dedicado 2GB", status_cliente: "ativo" },
    ]);
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
        systemInstruction = "Você é um assistente técnico do NAP. Use o seguinte contexto da base de conhecimento BookStack para responder: " + bookstackContext + " Responda de forma curta e empática.";
      } else if (vertical === "vendas") {
        bookstackContext = "[RAG BookStack]: Planos atuais: 500MB por R$99,90, 700MB por R$119,90. Promoção vigente: Instalação grátis para fidelidade de 12 meses.";
        systemInstruction = "Você é um consultor de vendas do NAP. Use este contexto do BookStack: " + bookstackContext + " Seja persuasivo, simpático e conciso.";
      } else {
        bookstackContext = "[RAG BookStack]: Regras: Faturas atrasadas em 15 dias reduzem banda. PIX baixa na hora, boleto em 1 dia útil.";
        systemInstruction = "Você é um agente de cobrança do NAP. Use este contexto do BookStack: " + bookstackContext + " Seja educado e focado na solução.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: mensagem,
        config: { systemInstruction }
      });

      res.json({
        resposta: response.text,
        modelo: "gemini-3.8-flash (via 9router auth)",
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

  // Função auxiliar para integração real com SGP API
  async function fetchSGP(endpoint: string, method = "GET", body: any = null) {
    if (!SGP_URL || !SGP_APP || !SGP_TOKEN) {
      throw new Error("Credenciais do SGP não configuradas no .env");
    }
    // Conforme documentação: autenticação via headers app e token
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

  // Consultar Cliente da URA (Pesquisa Específica via CPF/CNPJ ou Telefone)
  
  // Busca SGP em tempo real (Operador)
  app.get("/api/sgp/busca", async (req, res) => {
    const { q } = req.query;
    
    // Simula tempo de resposta do ERP
    setTimeout(() => {
      if (!q || q.toString().trim() === '') {
        return res.json({ resultados: [] });
      }
      
      // Mock de resultados baseados na busca
      res.json({
        resultados: [
          {
            id: 9982,
            nome: "Maria Oliveira",
            cpf_cnpj: "123.456.789-00",
            status_cliente: "ativo",
            endereco: "Rua das Flores, 123 - Centro",
            conexao: {
              status: "online",
              uptime: "15d 2h 45m",
              ip: "177.45.2.19",
              mac: "AA:BB:CC:DD:EE:FF",
              plano: "Fibra 500MB",
              concentrador: "MikroTik-Core-01"
            },
            faturas: [
              { id: 101, vencimento: "2026-09-10", valor: 99.90, status: "pendente" },
              { id: 102, vencimento: "2026-08-10", valor: 99.90, status: "pago" },
              { id: 103, vencimento: "2026-07-10", valor: 99.90, status: "pago" }
            ]
          }
        ]
      });
    }, 800);
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


  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    // Wait until vite is imported
    while (!createViteServer) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
