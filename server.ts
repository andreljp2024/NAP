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

  // Mock Contatos (CRM Sincronizado com SGP)
  app.get("/api/contatos", (req, res) => {
    res.json([
      { id: 1001, cpf_cnpj: "111.222.333-44", nome: "João Silva", telefone: "+55 11 99999-9999", plano: "Fibra 500MB", status_cliente: "ativo" },
      { id: 1002, cpf_cnpj: "555.666.777-88", nome: "Maria Oliveira", telefone: "+55 11 88888-8888", plano: "Fibra 1GB", status_cliente: "bloqueado" },
      { id: 1003, cpf_cnpj: "22.333.444/0001-55", nome: "Empresa XPTO Ltda", telefone: "+55 11 3333-4444", plano: "Link Dedicado 2GB", status_cliente: "ativo" },
    ]);
  });

  // 9router AI Gateway Abstraction using Gemini SDK
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

      let systemInstruction = "Você é um assistente do Núcleo de Atendimento ao Provedor (NAP). Responda de forma curta e objetiva.";
      if (vertical === "suporte") {
        systemInstruction = "Você é um assistente técnico de um provedor de internet. Diagnostique problemas técnicos de forma empática e direta. Limite a 2 frases.";
      } else if (vertical === "vendas") {
        systemInstruction = "Você é um assistente de vendas consultivo. Foque em qualificar o lead rapidamente. Limite a 2 frases.";
      } else if (vertical === "cobranca") {
        systemInstruction = "Você é um assistente de cobrança empático. Ofereça opções como PIX ou boleto. Limite a 2 frases.";
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
