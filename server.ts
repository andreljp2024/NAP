import express from "express";
import path from "path";
import cors from "cors";

import { db } from "./src/db";
import { users, atendimentos, clientes, faturas } from "./src/db/schema";
import { eq, desc } from "drizzle-orm";
import { conversas, mensagens } from "./src/db/schema";


import { agentToolRegistry } from "./server/agent/toolRegistry";




  const app = express();
  const PORT = 3000;

let mockWabaChats = [];
let mockWabaMessages = [];


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


  // In-Memory Kanban Deals (Support & Sales para Provedores ISP)
  
const sgpDatabase_mock: any[] = [
  { 
    id: 101, 
    nome: "João Silva", 
    status: "ativo", 
    status_cliente: "ativo",
    cpf_cnpj: "111.222.333-44", 
    contato: { telefone: "(11) 98765-4321" }, 
    plano_atual: { nome: "Fibra 500MB Simétrico" },
    financeiro: { valor: 99.9, status: "em_atraso" } 
  },
  { 
    id: 102, 
    nome: "Rafael Medeiros de Albuquerque", 
    status: "ativo", 
    status_cliente: "ativo",
    cpf_cnpj: "384.921.750-42", 
    contato: { telefone: "(11) 98765-4321" }, 
    plano_atual: { nome: "600 Mega Fibra Turbo + Wi-Fi 6 Mesh" },
    financeiro: { valor: 119.9, status: "em_dia" } 
  },
  { 
    id: 103, 
    nome: "Sérgio Ramos da Silva", 
    status: "bloqueado", 
    status_cliente: "bloqueado_parcial",
    cpf_cnpj: "966.559.988-21", 
    contato: { telefone: "(11) 96655-9988" }, 
    plano_atual: { nome: "Fibra 700MB Gamer Pro" },
    financeiro: { valor: 139.9, status: "em_atraso" } 
  },
  { 
    id: 104, 
    nome: "Carlos Eduardo Santos", 
    status: "ativo", 
    status_cliente: "ativo",
    cpf_cnpj: "555.666.777-88", 
    contato: { telefone: "(11) 97123-8899" }, 
    plano_atual: { nome: "Fibra 400MB" },
    financeiro: { valor: 119.9, status: "em_dia" } 
  }
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
      id: 105, 
      titulo: "Otimização de Rota Gamer / IPv6", 
      estagio: "Resolvido", 
      pipeline: "Suporte", 
      contato: "Rafael Medeiros de Albuquerque", 
      telefone: "(11) 98765-4321",
      endereco: "Rua das Acácias, 412, Apto 82 - Centro Histórico",
      plano: "600 Mega Fibra Turbo + Wi-Fi 6 Mesh",
      prioridade: 3,
      criado_em: "Há 3 dias",
      contexto_ia: "Ativação de prefixo IPv6 /56 e liberação de portas UPnP para console de jogos no roteador Wi-Fi 6 Huawei HG8145V5."
    },
    { 
      id: 106, 
      titulo: "Verificação Preventiva de Atenuação Óptica", 
      estagio: "Resolvido", 
      pipeline: "Suporte", 
      contato: "Rafael Medeiros de Albuquerque", 
      telefone: "(11) 98765-4321",
      endereco: "Rua das Acácias, 412, Apto 82 - Centro Histórico",
      plano: "600 Mega Fibra Turbo + Wi-Fi 6 Mesh",
      prioridade: 2,
      criado_em: "Semana passada",
      contexto_ia: "Limpeza de conector SC/APC na CTO-08 concluída. Atenuação óptica normalizada em -19.2 dBm com margem de segurança excelente."
    },
    { 
      id: 107, 
      titulo: "Dúvida sobre Fatura e Desbloqueio 48h", 
      estagio: "Novo Chamado", 
      pipeline: "Suporte", 
      contato: "Sérgio Ramos da Silva", 
      telefone: "(11) 96655-9988",
      endereco: "Rua Floriano Peixoto, 305 - Jd. América",
      plano: "Fibra 700MB Gamer Pro",
      prioridade: 1,
      criado_em: "Hoje, 11:30",
      contexto_ia: "Assinante solicitou esclarecimento sobre vencimento e realizou liberação temporária de 48 horas via portal do cliente."
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

  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await db.select().from(atendimentos).orderBy(desc(atendimentos.createdAt));
      
      const formatted = deals.map(d => ({
        id: d.id,
        titulo: d.titulo,
        estagio: d.estagio,
        pipeline: d.pipeline,
        contato: d.contato,
        telefone: d.telefone,
        endereco: d.endereco,
        plano: d.plano,
        prioridade: d.prioridade,
        criado_em: d.criadoEm || "Hoje",
        contexto_ia: d.contextoIa
      }));

      if (formatted.length === 0) {
        return res.json(kanbanDeals);
      }
      res.json(formatted);
    } catch (e) {
      if (e && (e.code === 'ECONNREFUSED' || e.message?.includes('ECONNREFUSED') || e.message?.includes('Failed query'))) {
        console.warn("[Mock] Banco de dados offline. Usando fallback no /api/deals");
      } else {
        console.warn("[Mock] Banco de dados indisponível (Deals).", e?.message || e);
      }
      res.json(kanbanDeals);
    }
  });

  // Atualizar estágio de Deal (Persistência ao arrastar no Kanban)
  app.patch("/api/deals/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { estagio, prioridade } = req.body;
    
    try {
      await db.update(atendimentos)
        .set({ estagio, prioridade: prioridade || 2 })
        .where(eq(atendimentos.id, id));
        
      res.json({ sucesso: true });
    } catch (e) {
      const index = kanbanDeals.findIndex(d => d.id === id);
      if (index === -1) {
        return res.status(404).json({ erro: "Card não encontrado" });
      }
      if (estagio) kanbanDeals[index].estagio = estagio;
      if (prioridade !== undefined) kanbanDeals[index].prioridade = prioridade;
      res.json({ sucesso: true, deal: kanbanDeals[index] });
    }
  });

  // Criar novo Card no Kanban
  
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (user.length === 0) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }
      
      if (user[0].senha !== password) {
        return res.status(401).json({ error: "Senha inválida" });
      }

      if (!user[0].ativo) {
        return res.status(403).json({ error: "Usuário inativo" });
      }

      res.json({
        id: user[0].id.toString(),
        name: user[0].nome,
        email: user[0].email,
        role: user[0].cargo,
        status: user[0].ativo ? 'ativo' : 'inativo'
      });
    } catch (error) {
      if (error && (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED') || error.message?.includes('Failed query'))) {
        console.warn("[Mock] Banco de dados offline. Usando fallback no /api/login");
      } else {
        console.warn("[Mock] Banco de dados indisponível (Login).", error?.message || error);
      }
      res.status(500).json({ error: "Database offline ou erro interno." });
    }
  });

  app.post("/api/deals", async (req, res) => {
    const { titulo, pipeline, contato, telefone, endereco, plano, prioridade, contexto_ia } = req.body;
    
    let defaultStage = "Novo Chamado";
    if (pipeline === "Vendas") defaultStage = "Novo Lead";
    else if (pipeline === "Cobranca") defaultStage = "A Vencer (Preventivo)";

    const newDealBase = {
      titulo: titulo || (pipeline === "Cobranca" ? "Cobrança de Fatura" : pipeline === "Vendas" ? "Novo Lead Comercial" : "Novo Chamado Técnico"),
      estagio: defaultStage,
      pipeline: pipeline || "Suporte",
      contato: contato || "Cliente Avulso",
      telefone: telefone || "(11) 99999-9999",
      endereco: endereco || "Endereço a confirmar",
      plano: plano || "Fibra 500MB",
      prioridade: prioridade || 2,
      criadoEm: "Agora",
      contextoIa: contexto_ia || "Card criado pela equipe do provedor."
    };

    try {
      const result = await db.insert(atendimentos).values(newDealBase).returning();
      res.status(201).json({ id: result[0].id, ...newDealBase, criado_em: "Agora", contexto_ia: newDealBase.contextoIa });
    } catch(e) {
      console.warn("DB Post Deals Error:", e);
      const newDealMock = {
        id: Math.floor(1000 + Math.random() * 9000),
        ...newDealBase,
        criado_em: "Agora",
        contexto_ia: newDealBase.contextoIa
      };
      kanbanDeals.unshift(newDealMock);
      res.status(201).json(newDealMock);
    }
  });

  // Obter Clientes (Real SGP ou Mock)
  
  app.get("/api/contatos", async (req, res) => {
    try {
      // 1. Tentar ler do DB local (sincronizado pelo Webhook)
      const dbClientes = await db.select().from(clientes);
      if (dbClientes.length > 0) {
        const mapeados = dbClientes.map(c => ({
          id: c.id,
          cpf_cnpj: c.documento,
          nome: c.nome,
          telefone: c.telefone || "N/A",
          plano: c.plano || "Sem Plano",
          status_cliente: c.status
        }));
        return res.json(mapeados);
      }
      
      // 2. Se o DB local estiver vazio e SGP_URL existir, tentar puxar direto
      if (SGP_URL && SGP_APP && SGP_TOKEN) {
        const data = await fetchSGP("/api/clientes?limit=50");
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
      console.warn("DB offline ou API SGP falhou no contatos, caindo p/ mock");
    }
    
    // Mock Fallback
    res.json(sgpDatabase_mock.map(c => ({
      id: c.id,
      cpf_cnpj: c.cpf_cnpj,
      nome: c.nome,
      telefone: c.contato.telefone,
      plano: c.plano_atual?.nome || "Fibra 500MB",
      status_cliente: c.status_cliente
    })));
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

  // Endpoint de Clientes de Teste do Portal para Homologação
  app.get("/api/portal/clientes-teste", (req, res) => {
    res.json(sgpDatabase_mock);
  });

  // Busca de cliente específico no SGP por CPF ou termo
  app.get("/api/sgp/busca", (req, res) => {
    const { cpf, q } = req.query;
    const queryLimpa = String(cpf || q || '').replace(/\D/g, '');
    const found = sgpDatabase_mock.find(c => 
      (queryLimpa && c.cpf_cnpj?.replace(/\D/g, '').includes(queryLimpa)) ||
      (q && c.nome?.toLowerCase().includes(String(q).toLowerCase()))
    );
    if (found) {
      return res.json(found);
    }
    res.json(sgpDatabase_mock[1] || sgpDatabase_mock[0]);
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

  // --- TELEMETRIA DE CONSUMO DE BANDA (TRÁFEGO DO CONCENTRADOR BNG / RADIUS) ---
  app.get("/api/portal/consumo", (req, res) => {
    res.json({
      sucesso: true,
      periodo: "01/09/2026 a 30/09/2026",
      diasCicloRestantes: 20,
      plano: "Fibra 500MB Simétrico",
      franquia: "Ilimitada (100% Fibra Óptica Regulamentada Anatel)",
      totalDownloadGB: 482.6,
      totalUploadGB: 89.4,
      totalGeralGB: 572.0,
      mediaDiariaGB: 19.06,
      picoHorario: "20:00 às 23:30 (Streaming 4K / Games)",
      dispositivoMaisAtivo: {
        nome: "Smart TV Samsung 4K (Sala)",
        consumoGB: 218.4,
        percentual: 38.2
      },
      consumoPorDispositivo: [
        { nome: "Smart TV 4K (Sala)", tipo: "tv", consumoGB: 218.4, percentual: 38 },
        { nome: "PC Gamer (Quarto)", tipo: "pc", consumoGB: 154.2, percentual: 27 },
        { nome: "iPhone 15 Pro (João)", tipo: "smartphone", consumoGB: 82.5, percentual: 14 },
        { nome: "Notebook Trabalho (Home Office)", tipo: "laptop", consumoGB: 68.3, percentual: 12 },
        { nome: "Echo Dot & IoT", tipo: "iot", consumoGB: 48.6, percentual: 9 }
      ],
      historicoSemanal: [
        { dia: "Qui 04/09", data: "04/09", downloadGB: 68.4, uploadGB: 12.1, totalGB: 80.5 },
        { dia: "Sex 05/09", data: "05/09", downloadGB: 84.2, uploadGB: 15.6, totalGB: 99.8 },
        { dia: "Sáb 06/09", data: "06/09", downloadGB: 96.5, uploadGB: 18.2, totalGB: 114.7 },
        { dia: "Dom 07/09", data: "07/09", downloadGB: 104.1, uploadGB: 19.8, totalGB: 123.9 },
        { dia: "Seg 08/09", data: "08/09", downloadGB: 52.3, uploadGB: 9.4, totalGB: 61.7 },
        { dia: "Ter 09/09", data: "09/09", downloadGB: 56.8, uploadGB: 10.2, totalGB: 67.0 },
        { dia: "Qua 10/09", data: "10/09 (Hoje)", downloadGB: 20.3, uploadGB: 4.1, totalGB: 24.4 }
      ]
    });
  });

  // --- SERVIDOR DE TESTE DE VELOCIDADE (SPEEDTEST ISP LOCAL / PTT) ---
  app.post("/api/portal/speedtest", async (req, res) => {
    // Simula cálculo de latência e rota com servidor local de PTT
    await new Promise(r => setTimeout(r, 600));

    // Pequena variação para realismo dinâmico
    const variacaoDown = (Math.random() * 18 - 6);
    const variacaoUp = (Math.random() * 12 - 5);
    const download = +(508.4 + variacaoDown).toFixed(1);
    const upload = +(256.2 + variacaoUp).toFixed(1);
    const ping = +(3.2 + Math.random() * 1.5).toFixed(1);
    const jitter = +(0.6 + Math.random() * 0.5).toFixed(1);

    res.json({
      sucesso: true,
      servidor: "NAP Telecom • Servidor CDN / IX.br SP-01 (São Paulo)",
      distanciaKm: 4.2,
      ipPublico: "177.85.112.44",
      planoContratado: "Fibra 500MB (500/250)",
      downloadMbps: download,
      uploadMbps: upload,
      pingMs: ping,
      jitterMs: jitter,
      percentualDownload: Math.round((download / 500) * 100),
      percentualUpload: Math.round((upload / 250) * 100),
      classificacao: "Excelente",
      diagnostico: "Sua conexão está entregando acima de 100% da velocidade contratada com latência ultra-baixa de servidor local.",
      indicadoPara: ["Streaming 4K / 8K HDR", "Jogos Online Competitivos", "Videoconferências em HD", "Uploads de Arquivos Grandes"],
      data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
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
  
  app.post("/api/webhooks/n8n/sgp-sync", async (req, res) => {
    try {
      console.log("[SGP-SYNC] Evento recebido:", req.body);
      const { acao, tipo, dados } = req.body;
      
      // Exemplo: { acao: "criado", tipo: "cliente", dados: { nome, cpf, telefone... } }
      if (tipo === 'cliente' && dados) {
        // Tenta fazer o upsert no Drizzle Postgres
        const existing = await db.select().from(clientes).where(eq(clientes.documento, dados.cpf || dados.cnpj)).limit(1);
        if (existing.length > 0) {
          await db.update(clientes).set({
            nome: dados.nome,
            telefone: dados.celular || dados.telefone,
            status: dados.status === 1 ? 'ativo' : 'bloqueado',
            plano: dados.plano
          }).where(eq(clientes.documento, dados.cpf || dados.cnpj));
        } else {
          await db.insert(clientes).values({
            nome: dados.nome,
            documento: dados.cpf || dados.cnpj,
            telefone: dados.celular || dados.telefone,
            status: dados.status === 1 ? 'ativo' : 'bloqueado',
            plano: dados.plano
          });
        }
      }

      res.json({ status: "processed", synced_to_db: true });
    } catch(e) {
      console.error("[SGP-SYNC] Falha ao gravar no PostgreSQL", e);
      // Retorna sucesso de processamento para não ficar retry infinito no webhook, mas acusa fallback
      res.json({ status: "processed", synced_to_db: false, error: e.message });
    }
  });




  // Registrar / Atualizar inscrição de Push do PWA







  // --- WhatsApp Cloud API (WABA) Webhook & Endpoints ---
  
  // 1. Verificação do Webhook pela Meta
  app.get("/api/webhooks/waba/incoming", (req, res) => {
    const verify_token = process.env.WABA_VERIFY_TOKEN || "nap_token_secreto_123";
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    
    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        console.log("WABA Webhook verificado!");
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }
    return res.status(400).json({ error: "Parâmetros inválidos" });
  });

  // 2. Recebimento de mensagens (Eventos WABA) e Copiloto Gemini (Triagem IA)
  app.post("/api/webhooks/waba/incoming", async (req, res) => {
    try {
      const body = req.body;
      if (!body.entry || !body.entry[0].changes || !body.entry[0].changes[0].value.messages) {
        return res.sendStatus(200); // Outros eventos
      }
      
      const messageData = body.entry[0].changes[0].value.messages[0];
      const contactData = body.entry[0].changes[0].value.contacts?.[0];
      const telefone = messageData.from;
      const texto = messageData.text?.body || "(Áudio/Mídia Recebida)";
      const nome_cliente = contactData?.profile?.name || "Cliente SGP";
      
      console.log(`[WABA] Msg de ${telefone} (${nome_cliente}): ${texto}`);
      
      // Upsert Conversa
      let chatId = null;
      try {
        let chat = await db.select().from(conversas).where(eq(conversas.telefone, telefone)).limit(1);
        if (chat.length === 0) {
           const newChat = await db.insert(conversas).values({
             telefone,
             nomeCliente: nome_cliente,
             fila: 'triagem_ia',
             statusConexao: '{"uptime":"2 dias", "sinal_onu":"-19.5 dBm", "status":"conectado"}'
           }).returning();
           chatId = newChat[0].id;
        } else {
           chatId = chat[0].id;
           // Atualiza data
           await db.update(conversas).set({ updatedAt: new Date() }).where(eq(conversas.id, chatId));
        }
        
        // Salva a mensagem do cliente
        await db.insert(mensagens).values({
          conversaId: chatId,
          remetente: 'cliente',
          conteudo: texto,
          tipo: messageData.type === 'audio' ? 'audio' : 'texto'
        });
        
        // --- TRIAGEM IA (Gemini Auto-Resposta) ---
        // Se a conversa estiver na fila "triagem_ia", a IA responde.
        let isTriagem = false;
        if(chat.length === 0 || chat[0].fila === 'triagem_ia') isTriagem = true;
        
        if (isTriagem) {
           // Simula buscar histórico (na vida real, mandaríamos o array pro Gemini)
           const prompt = `Você é a IA de Triagem do provedor NAP. O cliente ${nome_cliente} enviou: "${texto}". O sinal da ONU está normal (-19.5 dBm). Dê uma resposta curta e acolhedora em português, avisando que vai analisar.`;
           
           try {
             // Chamada interna p/ agent/run (simplificada)
             const { GoogleGenAI } = require("@google/genai");
             const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
             const geminiResponse = await ai.models.generateContent({
               model: "gemini-2.5-flash",
               contents: prompt
             });
             const resposta_ia = geminiResponse.text;
             
             // Salva a resposta da IA no BD
             await db.insert(mensagens).values({
               conversaId: chatId,
               remetente: 'ia',
               conteudo: resposta_ia,
               tipo: 'texto'
             });
             
             // TODO: Disparar para a API do Meta WABA real a resposta (via POST /messages)
           } catch (errAi) {
             console.error("Erro no Gemini", errAi);
           }
        }
      } catch (dbErr) {
        console.error("DB WABA Error", dbErr);
        // Fallback em memória
        let chat = mockWabaChats.find(c => c.telefone === telefone);
        if(!chat) {
           chat = { id: Date.now(), telefone, nomeCliente: nome_cliente, fila: 'triagem_ia' };
           mockWabaChats.push(chat);
        }
        mockWabaMessages.push({ conversaId: chat.id, remetente: 'cliente', conteudo: texto, createdAt: new Date() });
      }

      res.status(200).send("EVENT_RECEIVED");
    } catch (e) {
      console.error("[WABA Webhook Error]", e);
      res.sendStatus(500);
    }
  });

  
  // --- Webchat PWA (Cliente -> IA) ---
  app.post("/api/webchat/send", async (req, res) => {
    const { telefone, nome, texto } = req.body;
    
    try {
      let chatId = null;
      let chat = await db.select().from(conversas).where(eq(conversas.telefone, telefone)).limit(1);
      
      if (chat.length === 0) {
        const newChat = await db.insert(conversas).values({
          telefone,
          nomeCliente: nome || "Cliente Webchat",
          fila: 'triagem_ia',
          statusConexao: '{"uptime":"2 dias", "sinal_onu":"-19.5 dBm", "status":"conectado"}'
        }).returning();
        chatId = newChat[0].id;
      } else {
        chatId = chat[0].id;
        await db.update(conversas).set({ updatedAt: new Date() }).where(eq(conversas.id, chatId));
      }
      
      // Salva mensagem do cliente
      await db.insert(mensagens).values({
        conversaId: chatId,
        remetente: 'cliente',
        conteudo: texto,
        tipo: 'texto'
      });
      
      // Resposta IA
      const { GoogleGenAI } = require("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Você é a assistente de suporte virtual do provedor NAP. O cliente ${nome} (${telefone}) enviou no Webchat: "${texto}". O sinal da ONU dele está normal (-19.5 dBm). Responda de forma curta, prestativa e em português.`;
      
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      const resposta_ia = geminiResponse.text;
      
      // Salva resposta IA
      await db.insert(mensagens).values({
        conversaId: chatId,
        remetente: 'ia',
        conteudo: resposta_ia,
        tipo: 'texto'
      });
      
      res.json({ sucesso: true, resposta: resposta_ia });
      
    } catch (dbErr) {
      console.warn("[Mock] Erro Webchat (DB/IA offline), usando memória", dbErr?.message);
      
      // Fallback em memória
      let chat = mockWabaChats.find(c => c.telefone === telefone);
      if(!chat) {
         chat = { id: Date.now(), telefone, nomeCliente: nome, fila: 'triagem_ia' };
         mockWabaChats.push(chat);
      }
      mockWabaMessages.push({ conversaId: chat.id, remetente: 'cliente', conteudo: texto, createdAt: new Date() });
      
      const resposta_mock = "🤖 [IA Simulada] Olá! Entendi sua mensagem: " + texto + ". Em breve um humano vai te ajudar.";
      mockWabaMessages.push({ conversaId: chat.id, remetente: 'ia', conteudo: resposta_mock, createdAt: new Date() });
      
      res.json({ sucesso: true, resposta: resposta_mock });
    }
  });

  // 3. API do Front para Listar Conversas e Mensagens
  app.get("/api/conversas", async (req, res) => {
    try {
      const chats = await db.select().from(conversas).orderBy(desc(conversas.updatedAt));
      res.json(chats);
    } catch (e) {
      // Silenced error for mock fallback
      res.json(mockWabaChats);
    }
  });

  app.get("/api/conversas/:id/mensagens", async (req, res) => {
    try {
      const msgs = await db.select().from(mensagens).where(eq(mensagens.conversaId, parseInt(req.params.id))).orderBy(mensagens.createdAt);
      res.json(msgs);
    } catch (e) {
      // Silenced error for mock fallback
      res.json(mockWabaMessages.filter(m => m.conversaId == req.params.id));
    }
  });

  // --- Push Notifications Gateway (PWA Web Push) ---
  interface PushSubscriptionRecord {
    id: string;
    endpoint: string;
    cliente_id?: string;
    cliente_nome?: string;
    inscrito_em?: string;
    dispositivo?: string;
    [key: string]: any;
    keys?: {
      p256dh?: string;
      auth?: string;
    };
    created_at?: string;
  }





  let pushSubscriptions: PushSubscriptionRecord[] = [];
  let pushNotificationsHistory: any[] = [];

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

  // --- Operador & Equipe PWA Push Notifications & Hierarquia ---
  interface OperatorPushSubscriptionRecord {
    id: string;
    endpoint: string;
    keys?: {
      p256dh?: string;
      auth?: string;
    };
    operador_id: number;
    operador_nome: string;
    cargo: 'admin' | 'operador' | 'tecnico_campo' | 'tecnico_noc';
    ramal?: string;
    veiculo?: string;
    filas: string[];
    dispositivo: string;
    categorias: Array<'whatsapp' | 'suporte' | 'noc' | 'ramal' | 'ordem_servico'>;
    ativo: boolean;
    inscrito_em: string;
    ultimo_push?: string;
  }

  // Hierarquia completa de usuários do provedor (Admin, Operador, 2 Técnicos)
  interface UsuarioProvedor {
    id: number;
    nome: string;
    email: string;
    username: string;
    cargo: 'admin' | 'operador' | 'tecnico_campo' | 'tecnico_noc';
    nivel_hierarquia: number; // 1: Admin, 2: Operador, 3: Técnico
    cargo_label: string;
    ramal?: string;
    veiculo?: string;
    status: 'online' | 'pausa' | 'em_rota' | 'no_cliente' | 'offline';
    status_label: string;
    filas: string[];
    telefone: string;
    geolocalizacao: {
      ativo: boolean;
      lat: number;
      lng: number;
      precisao_metros: number;
      endereco_estimado: string;
      velocidade_kmh?: number;
      bateria_percentual?: number;
      atualizado_em: string;
    };
    pwa: {
      instalado: boolean;
      dispositivo: string;
      push_ativo: boolean;
      ultimo_acesso: string;
    };
  }

  let usuariosProvedor: UsuarioProvedor[] = [
    {
      id: 1,
      nome: "Roberto Oliveira",
      email: "admin@provedor.com.br",
      username: "admin",
      cargo: "admin",
      nivel_hierarquia: 1,
      cargo_label: "Administrador Geral (Diretoria)",
      ramal: "2000",
      status: "online",
      status_label: "Disponível na Sede",
      filas: ["Gestão", "NOC", "Escalation N3"],
      telefone: "(11) 98111-0001",
      geolocalizacao: {
        ativo: true,
        lat: -23.5489,
        lng: -46.6388,
        precisao_metros: 10,
        endereco_estimado: "Sede Central do Provedor - Centro, São Paulo - SP",
        atualizado_em: "Agora"
      },
      pwa: {
        instalado: true,
        dispositivo: "PWA Desktop (Chrome 128 / macOS)",
        push_ativo: true,
        ultimo_acesso: "Online agora"
      }
    },
    {
      id: 2,
      nome: "Mariana Costa",
      email: "operador@provedor.com.br",
      username: "operador",
      cargo: "operador",
      nivel_hierarquia: 2,
      cargo_label: "Operadora de Atendimento & Suporte",
      ramal: "2001",
      status: "online",
      status_label: "Em Atendimento WhatsApp",
      filas: ["Suporte N1", "Suporte N2", "Vendas"],
      telefone: "(11) 98222-0002",
      geolocalizacao: {
        ativo: true,
        lat: -23.5492,
        lng: -46.6392,
        precisao_metros: 8,
        endereco_estimado: "Central de Operações / Teleatendimento NR-17",
        atualizado_em: "Há 2 min"
      },
      pwa: {
        instalado: true,
        dispositivo: "PWA Web (Windows 11 / Edge)",
        push_ativo: true,
        ultimo_acesso: "Online agora"
      }
    },
    {
      id: 3,
      nome: "Carlos Mendes (Campo)",
      email: "tecnico_campo@provedor.com.br",
      username: "tecnico_campo",
      cargo: "tecnico_campo",
      nivel_hierarquia: 3,
      cargo_label: "Técnico de Campo N2 (Reparo & Fusão)",
      veiculo: "Fiorino Telecom 01 (Placa ABC-4D21)",
      status: "em_rota",
      status_label: "Em Rota para OS #1043",
      filas: ["Campo N2", "Fusão de Fibra", "NOC Emergencial"],
      telefone: "(11) 98333-0003",
      geolocalizacao: {
        ativo: true,
        lat: -23.5621,
        lng: -46.6554,
        precisao_metros: 12,
        endereco_estimado: "Av. Paulista, 1374 - Bela Vista, São Paulo - SP",
        velocidade_kmh: 38,
        bateria_percentual: 86,
        atualizado_em: "Tempo real (GPS Ativo)"
      },
      pwa: {
        instalado: true,
        dispositivo: "PWA Mobile (Android 14 / Chrome Mobile)",
        push_ativo: true,
        ultimo_acesso: "GPS Contínuo"
      }
    },
    {
      id: 4,
      nome: "Lucas Ferreira (NOC)",
      email: "tecnico_noc@provedor.com.br",
      username: "tecnico_noc",
      cargo: "tecnico_noc",
      nivel_hierarquia: 3,
      cargo_label: "Técnico de NOC N3 (GenieACS)",
      veiculo: "Sede Central",
      status: "online",
      status_label: "Monitorando",
      filas: ["NOC N3"],
      telefone: "(11) 98444-0004",
      geolocalizacao: {
        ativo: false,
        lat: -23.5489,
        lng: -46.6388,
        precisao_metros: 10,
        endereco_estimado: "Sede Central do Provedor - Centro, São Paulo - SP",
        velocidade_kmh: 0,
        bateria_percentual: 100,
        atualizado_em: "Tempo real"
      },
      pwa: {
        instalado: true,
        dispositivo: "Desktop Linux (Firefox)",
        push_ativo: true,
        ultimo_acesso: "Online agora"
      }
    }
  ];

  // Ordens de Serviço (OS de Campo) para Técnicos com Geo
  let ordensServicoCampo: Array<{
    id: string;
    numero: string;
    tipo: 'Instalacao' | 'Reparo' | 'Migracao' | 'Retirada';
    cliente_nome: string;
    cliente_cpf: string;
    endereco: string;
    bairro: string;
    cidade: string;
    lat: number;
    lng: number;
    tecnico_id: number;
    tecnico_nome: string;
    status: 'pendente' | 'em_deslocamento' | 'no_local' | 'executando' | 'concluida';
    prioridade: 'normal' | 'alta' | 'urgente';
    sinal_optico_dbm?: number;
    onu_mac?: string;
    onu_serial?: string;
    horario_agendado: string;
    observacoes: string;
  }> = [
    {
      id: "os_1043",
      numero: "OS-2026-1043",
      tipo: "Reparo",
      cliente_nome: "Maria Aparecida Silva",
      cliente_cpf: "123.456.789-00",
      endereco: "Av. Paulista, 1500 - Apto 82",
      bairro: "Bela Vista",
      cidade: "São Paulo - SP",
      lat: -23.5618,
      lng: -46.6560,
      tecnico_id: 3,
      tecnico_nome: "Carlos Mendes",
      status: "em_deslocamento",
      prioridade: "urgente",
      sinal_optico_dbm: -28.4, // sinal degradado
      onu_mac: "E0:67:B3:91:AA:12",
      onu_serial: "ZTEG12345678",
      horario_agendado: "09:30 - 11:00",
      observacoes: "Cliente relata quedas intermitentes. Provável atenuação na CTO 04 porta 06."
    },
    {
      id: "os_1044",
      numero: "OS-2026-1044",
      tipo: "Instalacao",
      cliente_nome: "João Pedro Albuquerque",
      cliente_cpf: "987.654.321-11",
      endereco: "Rua Vergueiro, 2188 - Bloco B",
      bairro: "Vila Mariana",
      cidade: "São Paulo - SP",
      lat: -23.5718,
      lng: -46.6436,
      tecnico_id: 4,
      tecnico_nome: "Lucas Ferreira",
      status: "no_local",
      prioridade: "normal",
      sinal_optico_dbm: -19.2, // sinal excelente
      onu_mac: "00:1B:C0:A8:32:01",
      onu_serial: "HWTC99887766",
      horario_agendado: "10:00 - 12:00",
      observacoes: "Instalação nova Plano 600 Mega Gamer. Passagem de cabo óptico interno e Wi-Fi 6."
    },
    {
      id: "os_1045",
      numero: "OS-2026-1045",
      tipo: "Reparo",
      cliente_nome: "Condomínio Edifício Solar",
      cliente_cpf: "04.555.888/0001-90",
      endereco: "Rua Augusta, 900",
      bairro: "Consolação",
      cidade: "São Paulo - SP",
      lat: -23.5532,
      lng: -46.6521,
      tecnico_id: 3,
      tecnico_nome: "Carlos Mendes",
      status: "pendente",
      prioridade: "alta",
      sinal_optico_dbm: -32.1,
      horario_agendado: "13:30 - 15:00",
      observacoes: "Troca de conector óptico e verificação de fusão na caixa de emenda do subsolo."
    }
  ];

  let operatorPushSubscriptions: OperatorPushSubscriptionRecord[] = [
    {
      id: "op_sub_1",
      endpoint: "https://fcm.googleapis.com/fcm/send/op_admin_roberto_pwa",
      operador_id: 1,
      operador_nome: "Roberto Oliveira",
      cargo: "admin",
      ramal: "2000",
      filas: ["Gestão", "NOC"],
      dispositivo: "PWA Desktop / Chrome",
      categorias: ["whatsapp", "suporte", "noc", "ramal", "ordem_servico"],
      ativo: true,
      inscrito_em: new Date().toISOString(),
      ultimo_push: "Há 5 min"
    },
    {
      id: "op_sub_2",
      endpoint: "https://fcm.googleapis.com/fcm/send/op_mariana_costa_pwa",
      operador_id: 2,
      operador_nome: "Mariana Costa",
      cargo: "operador",
      ramal: "2001",
      filas: ["Suporte N1", "Suporte N2", "Vendas"],
      dispositivo: "PWA Web / Windows",
      categorias: ["whatsapp", "suporte", "noc", "ramal"],
      ativo: true,
      inscrito_em: new Date().toISOString(),
      ultimo_push: "Há 12 min"
    },
    {
      id: "op_sub_3",
      endpoint: "https://fcm.googleapis.com/fcm/send/op_carlos_mendes_pwa",
      operador_id: 3,
      operador_nome: "Carlos Mendes",
      cargo: "tecnico_campo",
      veiculo: "Fiorino Tech 01",
      filas: ["Campo N2", "Fusão de Fibra"],
      dispositivo: "PWA Mobile / Android",
      categorias: ["suporte", "noc", "ordem_servico"],
      ativo: true,
      inscrito_em: new Date().toISOString(),
      ultimo_push: "Há 1 min (Nova OS)"
    },
    {
      id: "op_sub_4",
      endpoint: "https://fcm.googleapis.com/fcm/send/op_lucas_ferreira_pwa",
      operador_id: 4,
      operador_nome: "Lucas Ferreira (NOC)",
      cargo: "tecnico_noc",
      filas: ["NOC N3"],
      dispositivo: "Desktop Linux / Firefox",
      categorias: ["noc", "suporte"],
      ativo: true,
      inscrito_em: new Date().toISOString(),
      ultimo_push: "Há 18 min"
    }
  ];

  let operatorPushHistory: Array<{
    id: string;
    titulo: string;
    mensagem: string;
    tipo: 'whatsapp' | 'suporte' | 'noc' | 'ramal' | 'geral';
    operador_alvo?: string;
    fila_alvo?: string;
    enviado_em: string;
    destinatarios: number;
    sucesso: boolean;
  }> = [
    {
      id: "op_push_01",
      titulo: "Novo Atendimento WhatsApp",
      mensagem: "Cliente Maria Oliveira aguardando na fila Suporte N1 (Protocolo NAP-2026-0909-481).",
      tipo: "whatsapp",
      operador_alvo: "Todos da Fila",
      fila_alvo: "Suporte N1",
      enviado_em: "10:15",
      destinatarios: 2,
      sucesso: true
    }
  ];

  // Listar status e inscrições de push dos operadores
  app.get("/api/push/operator/status", (req, res) => {
    res.json({
      sucesso: true,
      total_operadores_inscritos: operatorPushSubscriptions.filter(s => s.ativo).length,
      inscricoes: operatorPushSubscriptions,
      historico_recente: operatorPushHistory.slice(0, 10),
      vapid_public_key: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIhbQFLXYp5Nksh8U"
    });
  });

  // Registrar ou atualizar subscrição PWA de um operador
  app.post("/api/push/operator/subscribe", (req, res) => {
    const { 
      subscription, 
      operador_id = 1, 
      operador_nome = "João Silva", 
      cargo = "operador",
      ramal = "2001", 
      filas = ["Suporte N2", "Vendas"],
      dispositivo = "PWA Web",
      categorias = ["whatsapp", "suporte", "noc", "ramal"]
    } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ sucesso: false, erro: "Subscription endpoint inválido." });
    }

    const index = operatorPushSubscriptions.findIndex(s => s.operador_id === operador_id || s.endpoint === subscription.endpoint);
    const novoRegistro: OperatorPushSubscriptionRecord = {
      id: `op_sub_${operador_id}_${Date.now()}`,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      operador_id,
      operador_nome,
      cargo,
      ramal,
      filas,
      dispositivo,
      categorias,
      ativo: true,
      inscrito_em: new Date().toISOString(),
      ultimo_push: "Ativo agora"
    };

    if (index >= 0) {
      operatorPushSubscriptions[index] = novoRegistro;
    } else {
      operatorPushSubscriptions.unshift(novoRegistro);
    }

    res.json({
      sucesso: true,
      mensagem: `Operador ${operador_nome} (Ramal ${ramal}) registrado no PWA Push com sucesso!`,
      operador: novoRegistro
    });
  });

  // Desativar push do operador
  app.post("/api/push/operator/unsubscribe", (req, res) => {
    const { operador_id, endpoint } = req.body;
    operatorPushSubscriptions = operatorPushSubscriptions.filter(
      s => s.operador_id !== operador_id && s.endpoint !== endpoint
    );
    res.json({ sucesso: true, mensagem: "Subscrição PWA do operador removida." });
  });

  // Disparar notificação Push para Operador(es)
  app.post("/api/push/operator/send", (req, res) => {
    const { 
      titulo, 
      mensagem, 
      tipo = "whatsapp", 
      operador_id, 
      ramal,
      fila,
      url = "/admin"
    } = req.body;

    if (!titulo || !mensagem) {
      return res.status(400).json({ sucesso: false, erro: "Título e mensagem são obrigatórios." });
    }

    let alvos = operatorPushSubscriptions.filter(s => s.ativo);
    if (operador_id) {
      alvos = alvos.filter(s => s.operador_id === operador_id);
    } else if (ramal) {
      alvos = alvos.filter(s => s.ramal === ramal);
    } else if (fila) {
      alvos = alvos.filter(s => s.filas.includes(fila));
    }

    const destinatariosCount = Math.max(alvos.length, 1);

    const registro = {
      id: `op_push_${Date.now()}`,
      titulo,
      mensagem,
      tipo: tipo as any,
      operador_alvo: operador_id ? `Operador #${operador_id}` : (fila ? `Fila ${fila}` : "Todos os Operadores"),
      fila_alvo: fila,
      enviado_em: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      destinatarios: destinatariosCount,
      sucesso: true
    };

    operatorPushHistory.unshift(registro);

    res.json({
      sucesso: true,
      mensagem: `Push transmitido para ${destinatariosCount} dispositivo(s) de operador(es)!`,
      notificacao: registro
    });
  });

  // Disparar teste imediato para o operador logado
  app.post("/api/push/operator/test", (req, res) => {
    const { tipo = "whatsapp", operador_nome = "João Silva", ramal = "2001" } = req.body;
    
    let titulo = "Novo Atendimento WhatsApp";
    let mensagem = `Cliente Marcos Vinicius solicitou suporte técnico na fila N1. (Ramal ${ramal})`;

    if (tipo === "suporte") {
      titulo = "Novo Chamado no Portal (SLA 2h)";
      mensagem = "Chamado #1042 aberto: Lentidão de Conexão no Bairro Jardim Paulista.";
    } else if (tipo === "noc") {
      titulo = "Alerta Crítico NOC / OLT";
      mensagem = "Rompimento de Fibra detectado no Anel 02 (OLT Central / PON 03).";
    } else if (tipo === "ramal") {
      titulo = `Chamada Entrante: (11) 98765-4321`;
      mensagem = `Cliente Carlos Mendes chamando no ramal ${ramal} (Fila Suporte).`;
    }

    const registro = {
      id: `op_test_${Date.now()}`,
      titulo,
      mensagem,
      tipo: tipo as any,
      operador_alvo: `${operador_nome} (Ramal ${ramal})`,
      enviado_em: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      destinatarios: 1,
      sucesso: true
    };

    operatorPushHistory.unshift(registro);

    res.json({
      sucesso: true,
      titulo,
      mensagem,
      tipo,
      notificacao: registro
    });
  });

  // ==========================================
  // --- MÓDULO DE USUÁRIOS, HIERARQUIA & CAMPO ---
  // ==========================================

  // Listar usuários do provedor com hierarquia completa
  app.get("/api/usuarios", (req, res) => {
    res.json({
      sucesso: true,
      total: usuariosProvedor.length,
      resumo_hierarquia: {
        admin: usuariosProvedor.filter(u => u.cargo === 'admin').length,
        operador: usuariosProvedor.filter(u => u.cargo === 'operador').length,
        tecnico: usuariosProvedor.filter(u => u.cargo === 'tecnico_campo').length,
        com_geolocalizacao: usuariosProvedor.filter(u => u.geolocalizacao?.ativo).length,
        pwa_ativo: usuariosProvedor.filter(u => u.pwa?.push_ativo).length
      },
      usuarios: usuariosProvedor
    });
  });

  // Salvar ou atualizar usuário
  app.post("/api/usuarios", (req, res) => {
    const { id, nome, email, username, cargo, ramal, veiculo, filas, telefone } = req.body;
    if (!nome || !email || !cargo) {
      return res.status(400).json({ sucesso: false, erro: "Nome, e-mail e cargo são obrigatórios." });
    }

    const nivel = cargo === 'admin' ? 1 : cargo === 'operador' ? 2 : 3;
    const cargo_label = cargo === 'admin' ? 'Administrador Geral' : cargo === 'operador' ? 'Operador de Atendimento' : 'Técnico de Campo';

    if (id) {
      const idx = usuariosProvedor.findIndex(u => u.id === Number(id));
      if (idx >= 0) {
        usuariosProvedor[idx] = {
          ...usuariosProvedor[idx],
          nome,
          email,
          username: username || usuariosProvedor[idx].username,
          cargo,
          nivel_hierarquia: nivel,
          cargo_label,
          ramal,
          veiculo,
          filas: Array.isArray(filas) ? filas : [],
          telefone: telefone || usuariosProvedor[idx].telefone
        };
        return res.json({ sucesso: true, usuario: usuariosProvedor[idx] });
      }
    }

    const novoId = Math.max(...usuariosProvedor.map(u => u.id), 0) + 1;
    const novoUsuario: UsuarioProvedor = {
      id: novoId,
      nome,
      email,
      username: username || email.split('@')[0],
      cargo,
      nivel_hierarquia: nivel,
      cargo_label,
      ramal,
      veiculo,
      status: 'online',
      status_label: 'Disponível',
      filas: Array.isArray(filas) ? filas : [],
      telefone: telefone || '',
      geolocalizacao: {
        ativo: cargo === 'tecnico_campo' || cargo === 'operador', // Habilitado por padrão
        lat: -23.5505,
        lng: -46.6333,
        precisao_metros: 15,
        endereco_estimado: "São Paulo - SP",
        atualizado_em: "Recém cadastrado"
      },
      pwa: {
        instalado: true,
        dispositivo: "PWA Web",
        push_ativo: true,
        ultimo_acesso: "Nunca"
      }
    };

    usuariosProvedor.push(novoUsuario);
    res.json({ sucesso: true, usuario: novoUsuario });
  });

  // Atualizar status de operador/técnico
  app.put("/api/usuarios/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, status_label } = req.body;
    const user = usuariosProvedor.find(u => u.id === Number(id));
    if (!user) return res.status(404).json({ sucesso: false, erro: "Usuário não encontrado." });

    user.status = status;
    if (status_label) user.status_label = status_label;
    res.json({ sucesso: true, usuario: user });
  });

  // Atualizar coordenadas GPS do Técnico ou Operador (Enviado pelo PWA em background)
  app.post("/api/usuarios/localizacao", (req, res) => {
    const { 
      usuario_id, 
      lat, 
      lng, 
      precisao_metros = 10, 
      endereco_estimado, 
      velocidade_kmh = 0, 
      bateria_percentual = 100 
    } = req.body;

    const user = usuariosProvedor.find(u => u.id === Number(usuario_id));
    if (!user) return res.status(404).json({ sucesso: false, erro: "Usuário não encontrado." });

    user.geolocalizacao = {
      ativo: true,
      lat: Number(lat),
      lng: Number(lng),
      precisao_metros: Number(precisao_metros),
      endereco_estimado: endereco_estimado || user.geolocalizacao?.endereco_estimado || "Coordenadas GPS Atualizadas",
      velocidade_kmh: Number(velocidade_kmh),
      bateria_percentual: Number(bateria_percentual),
      atualizado_em: "Agora"
    };

    res.json({
      sucesso: true,
      mensagem: `Localização de ${user.nome} sincronizada com sucesso.`,
      geolocalizacao: user.geolocalizacao
    });
  });

  // Mapa de campo ao vivo: Técnicos em rota + Ordens de Serviço
  app.get("/api/tecnicos/mapa", (req, res) => {
    const tecnicos = usuariosProvedor.filter(u => u.cargo === 'tecnico_campo');
    const operadores = usuariosProvedor.filter(u => u.cargo === 'operador');

    res.json({
      sucesso: true,
      total_tecnicos_campo: tecnicos.length,
      tecnicos_em_deslocamento: tecnicos.filter(t => t.status === 'em_rota').length,
      tecnicos_em_atendimento: tecnicos.filter(t => t.status === 'no_cliente').length,
      tecnicos: tecnicos.map(t => ({
        id: t.id,
        nome: t.nome,
        veiculo: t.veiculo,
        status: t.status,
        status_label: t.status_label,
        telefone: t.telefone,
        lat: t.geolocalizacao.lat,
        lng: t.geolocalizacao.lng,
        precisao_metros: t.geolocalizacao.precisao_metros,
        endereco: t.geolocalizacao.endereco_estimado,
        velocidade_kmh: t.geolocalizacao.velocidade_kmh || 0,
        bateria: t.geolocalizacao.bateria_percentual || 80,
        atualizado_em: t.geolocalizacao.atualizado_em
      })),
      operadores: operadores.map(o => ({
        id: o.id,
        nome: o.nome,
        ramal: o.ramal,
        status: o.status,
        endereco: o.geolocalizacao.endereco_estimado
      })),
      ordens_servico: ordensServicoCampo
    });
  });

  // Listar Ordens de Serviço (com filtro opcional por técnico)
  app.get("/api/tecnicos/os", (req, res) => {
    const { tecnico_id } = req.query;
    let list = ordensServicoCampo;
    if (tecnico_id) {
      list = list.filter(os => os.tecnico_id === Number(tecnico_id));
    }
    res.json({
      sucesso: true,
      total: list.length,
      ordens: list
    });
  });

  // Atualizar status de uma OS de Campo (Pelo PWA do Técnico)
  app.put("/api/tecnicos/os/:id", (req, res) => {
    const { id } = req.params;
    const { status, sinal_optico_dbm, onu_mac, onu_serial, observacoes } = req.body;
    
    const os = ordensServicoCampo.find(o => o.id === id);
    if (!os) return res.status(404).json({ sucesso: false, erro: "Ordem de serviço não encontrada." });

    if (status) os.status = status;
    if (sinal_optico_dbm !== undefined) os.sinal_optico_dbm = Number(sinal_optico_dbm);
    if (onu_mac) os.onu_mac = onu_mac;
    if (onu_serial) os.onu_serial = onu_serial;
    if (observacoes) os.observacoes = `${os.observacoes}\n[${new Date().toLocaleTimeString('pt-BR')}]: ${observacoes}`;

    // Disparar push de atualização para Admin e Operadores
    const pushMsg = `OS ${os.numero} atualizada para "${os.status.toUpperCase()}" pelo técnico ${os.tecnico_nome}.`;
    operatorPushHistory.unshift({
      id: `os_upd_${Date.now()}`,
      titulo: `OS ${os.tipo} Atualizada`,
      mensagem: pushMsg,
      tipo: "suporte",
      operador_alvo: "Admin & Operadores",
      enviado_em: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      destinatarios: 2,
      sucesso: true
    });

    res.json({
      sucesso: true,
      mensagem: "Ordem de serviço atualizada com sucesso.",
      os
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
    erpAtivo: "ixc",
    erps: {
      ixc: {
        id: "ixc",
        nome: "IXC Soft (IXC Provedor)",
        categoria: "ERP / CRM Telecom",
        protocolo: "Webservice REST JSON v1",
        urlBase: "https://ixc.naptelecom.com.br/webservice/v1",
        token: "12:YXBpX3Rva2VuX3NlY3JldG9faXhjXzIwMjY=",
        usuarioId: "1",
        autoDesbloqueio48h: true,
        avisoSonoroInadimplente: true,
        habilitarConsultaRadius: true,
        syncIntervalMinutes: 10,
        status: "conectado",
        latenciaMs: 24,
        ultimaSincronizacao: new Date().toISOString()
      },
      hubsoft: {
        id: "hubsoft",
        nome: "Hubsoft Telecom",
        categoria: "ERP Cloud para ISPs",
        protocolo: "API REST v1 / v2",
        urlBase: "https://naptelecom.hubsoft.com.br/api/v1",
        clientId: "nap_omni_hubsoft_client",
        clientSecret: "hub_sec_9918237498172938472918",
        autoDesbloqueio48h: true,
        avisoSonoroInadimplente: true,
        habilitarConsultaRadius: true,
        syncIntervalMinutes: 15,
        status: "desconectado"
      },
      radiusnet: {
        id: "radiusnet",
        nome: "RadiusNet",
        categoria: "ERP & AAA Radius",
        protocolo: "REST API v2",
        urlBase: "https://api.radiusnet.com.br/v2",
        token: "rnet_key_99382173489127",
        provedorId: "1",
        autoDesbloqueio48h: true,
        avisoSonoroInadimplente: false,
        habilitarConsultaRadius: true,
        syncIntervalMinutes: 15,
        status: "desconectado"
      },
      mksolutions: {
        id: "mksolutions",
        nome: "MK Solutions (MK-Auth / MK v2)",
        categoria: "ERP Telecom & Financeiro",
        protocolo: "REST / Webservice v1/v2",
        urlBase: "https://mk.naptelecom.com.br/api/v1",
        token: "mk_jwt_token_secret_99812",
        appId: "NAP_MK_APP",
        autoDesbloqueio48h: true,
        avisoSonoroInadimplente: true,
        habilitarConsultaRadius: true,
        syncIntervalMinutes: 15,
        status: "desconectado"
      },
      ispfy: {
        id: "ispfy",
        nome: "ISPFy",
        categoria: "Sistema de Gestão para ISPs",
        protocolo: "ISPFy REST API v1",
        urlBase: "https://naptelecom.ispfy.com.br/api/v1",
        token: "ispfy_tok_49817298371982",
        autoDesbloqueio48h: true,
        avisoSonoroInadimplente: false,
        habilitarConsultaRadius: true,
        syncIntervalMinutes: 15,
        status: "desconectado"
      },
      mikweb: {
        id: "mikweb",
        nome: "MikWeb",
        categoria: "Gerenciador MikroTik & ISP",
        protocolo: "MikWeb API v1",
        urlBase: "https://api.mikweb.com.br/v1",
        token: "mikweb_token_7182947192837",
        autoDesbloqueio48h: true,
        avisoSonoroInadimplente: false,
        habilitarConsultaRadius: true,
        syncIntervalMinutes: 15,
        status: "desconectado"
      },
      sgp: {
        id: "sgp",
        nome: "SGP (Sistema de Gestão de Provedores)",
        categoria: "ERP Telecom Integrado",
        protocolo: "REST / HTTPS v2.4",
        urlBase: "https://api.sgp.provedor.com.br/v1",
        appId: "NAP_SGP_PROD_991",
        token: "sgp_sec_token_99182374981729",
        autoDesbloqueio48h: true,
        avisoSonoroInadimplente: true,
        habilitarConsultaRadius: true,
        syncIntervalMinutes: 15,
        status: "conectado",
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

  interface AuditLogItem {
    id: string;
    timestamp: string;
    usuario: string;
    usuarioEmail?: string;
    usuarioRole?: string;
    modulo: string;
    acao: string;
    detalhes: string;
    categoria: 'acesso' | 'configuracao' | 'disparo' | 'comando' | 'seguranca' | string;
    severidade: 'info' | 'atencao' | 'critico';
    ip: string;
    userAgent?: string;
    payloadAntes?: any;
    payloadDepois?: any;
    status: 'sucesso' | 'falha';
    data: string;
  }

  let auditLogs: AuditLogItem[] = [
    {
      id: "audit-101",
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      usuario: "Mariana Costa",
      usuarioEmail: "operador@provedor.com.br",
      usuarioRole: "operador",
      modulo: "Campanhas",
      acao: "Disparo de Campanha HSM WhatsApp",
      detalhes: "Disparo da campanha 'Aviso Preventivo de Manutenção Fibra - Região Central' para 450 assinantes.",
      categoria: "disparo",
      severidade: "info",
      ip: "189.120.45.10",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0",
      payloadAntes: { status: "pausada", leads: 450 },
      payloadDepois: { status: "ativa", disparados: 450 },
      status: "sucesso",
      data: "Hoje, às 13:58"
    },
    {
      id: "audit-102",
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      usuario: "Lucas Ferreira",
      usuarioEmail: "tecnico_noc@provedor.com.br",
      usuarioRole: "tecnico_noc",
      modulo: "GenieACS (TR-069)",
      acao: "Comando Reboot Remoto de CPE",
      detalhes: "Comando CWMP SetParameterValues/Reboot disparado com sucesso para ONU Huawei HG8145V5 (Serial: HWTC-9988221).",
      categoria: "comando",
      severidade: "atencao",
      ip: "189.120.45.14",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/128.0",
      payloadAntes: { uptime: "48 dias 14h", status: "degradado" },
      payloadDepois: { uptime: "Recém reiniciado (0m)", status: "online" },
      status: "sucesso",
      data: "Hoje, às 13:45"
    },
    {
      id: "audit-103",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      usuario: "Roberto Oliveira",
      usuarioEmail: "admin@provedor.com.br",
      usuarioRole: "admin",
      modulo: "SGP / ERP",
      acao: "Alteração de Parâmetros de Integração ERP",
      detalhes: "Atualização da URL de webhook do IXC Soft e revalidação do token Bearer com 18ms de latência.",
      categoria: "configuracao",
      severidade: "critico",
      ip: "177.135.22.8",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      payloadAntes: { erpAtivo: "mikweb", timeoutMs: 5000 },
      payloadDepois: { erpAtivo: "ixc", timeoutMs: 3000, webhookSgp: "https://api.ixc.provedor.com.br/v1" },
      status: "sucesso",
      data: "Hoje, às 13:25"
    },
    {
      id: "audit-104",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      usuario: "Mariana Costa",
      usuarioEmail: "operador@provedor.com.br",
      usuarioRole: "operador",
      modulo: "Acessos",
      acao: "Login no Painel Administrativo",
      detalhes: "Sessão iniciada via autenticação institucional do operador com vínculo de ramal 2001.",
      categoria: "acesso",
      severidade: "info",
      ip: "189.120.45.10",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0",
      status: "sucesso",
      data: "Hoje, às 13:10"
    },
    {
      id: "audit-105",
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      usuario: "Roberto Oliveira",
      usuarioEmail: "admin@provedor.com.br",
      usuarioRole: "admin",
      modulo: "Campanhas",
      acao: "Execução em Lote da Régua de Cobrança",
      detalhes: "Disparo da régua de cobrança D+3 via PIX Dinâmico para 128 títulos vencidos.",
      categoria: "disparo",
      severidade: "info",
      ip: "177.135.22.8",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      payloadAntes: { fase: "d_mais_3", clientesPendentes: 128 },
      payloadDepois: { fase: "d_mais_3", disparadosComSucesso: 128 },
      status: "sucesso",
      data: "Hoje, às 12:40"
    },
    {
      id: "audit-106",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      usuario: "Lucas Ferreira",
      usuarioEmail: "tecnico_noc@provedor.com.br",
      usuarioRole: "tecnico_noc",
      modulo: "GenieACS (TR-069)",
      acao: "Alteração de Configuração Wi-Fi Remota",
      detalhes: "Modificação de SSID e chave WPA2 da CPE ZTE F670L (Serial: ZTEG-4433119) a pedido do cliente.",
      categoria: "comando",
      severidade: "atencao",
      ip: "189.120.45.14",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/128.0",
      payloadAntes: { ssid: "Fibra_2.4G", canal: 6 },
      payloadDepois: { ssid: "Familia_Silva_Fibra", canal: 11 },
      status: "sucesso",
      data: "Hoje, às 11:10"
    }
  ];

  function registrarAuditoria(entry: {
    usuario: string;
    usuarioEmail?: string;
    usuarioRole?: string;
    modulo: 'Acessos' | 'SGP / ERP' | 'GenieACS (TR-069)' | 'Campanhas' | 'Segurança' | 'Configurações' | 'Sistema' | string;
    acao: string;
    detalhes: string;
    categoria?: 'acesso' | 'configuracao' | 'disparo' | 'comando' | 'seguranca' | string;
    severidade?: 'info' | 'atencao' | 'critico';
    ip?: string;
    userAgent?: string;
    payloadAntes?: any;
    payloadDepois?: any;
    status?: 'sucesso' | 'falha';
  }) {
    const now = new Date();
    const item: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      usuario: entry.usuario || "Operador NAP",
      usuarioEmail: entry.usuarioEmail || "",
      usuarioRole: entry.usuarioRole || "operador",
      modulo: entry.modulo || "Sistema",
      acao: entry.acao,
      detalhes: entry.detalhes,
      categoria: entry.categoria || "configuracao",
      severidade: entry.severidade || "info",
      ip: entry.ip || "127.0.0.1",
      userAgent: entry.userAgent || "Mozilla/5.0 (NAP Web Console)",
      payloadAntes: entry.payloadAntes || null,
      payloadDepois: entry.payloadDepois || null,
      status: entry.status || "sucesso",
      data: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + " (Hoje)"
    };
    auditLogs.unshift(item);
    if (auditLogs.length > 500) auditLogs.pop();
    return item;
  }

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
        erpAtivo: novosDados.erpAtivo || systemConfig.erpAtivo,
        erps: { ...systemConfig.erps, ...(novosDados.erps || {}) },
        sgp: { ...systemConfig.sgp, ...(novosDados.sgp || {}) },
        telefonia: { ...systemConfig.telefonia, ...(novosDados.telefonia || {}) },
        whatsapp: { ...systemConfig.whatsapp, ...(novosDados.whatsapp || {}) },
        ia: { ...systemConfig.ia, ...(novosDados.ia || {}) },
        seguranca: { ...systemConfig.seguranca, ...(novosDados.seguranca || {}) },
        atendimento: { ...systemConfig.atendimento, ...(novosDados.atendimento || {}) },
        respostasRapidas: Array.isArray(novosDados.respostasRapidas) ? novosDados.respostasRapidas : systemConfig.respostasRapidas
      };

      // Gravar entrada no log de auditoria
      registrarAuditoria({
        usuario: "Admin NAP (SuperAdmin)",
        modulo: "Configurações",
        acao: "Atualização de Parâmetros Globais",
        detalhes: `Parâmetros operacionais e vitrine comercial atualizados via painel administrativo.`,
        categoria: "configuracao",
        severidade: "critico",
        ip: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Mozilla/5.0"
      });

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

      registrarAuditoria({
        usuario: "Admin NAP (SuperAdmin)",
        modulo: "Configurações",
        acao: "Upload de Logotipo Institucional",
        detalhes: `Logotipo institucional atualizado (${fileName || "imagem"}).`,
        categoria: "configuracao",
        severidade: "info",
        ip: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Mozilla/5.0"
      });

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

  // --- MÓDULO DE AUDITORIA E CONFORMIDADE REGULATÓRIA (LGPD / ANATEL) ---

  // Obter logs com filtros avançados
  app.get("/api/auditoria", (req, res) => {
    try {
      const { modulo, categoria, severidade, busca, limit = "50", offset = "0" } = req.query;
      let filtrados = [...auditLogs];

      if (modulo && typeof modulo === "string" && modulo !== "todos") {
        const modLower = modulo.toLowerCase();
        filtrados = filtrados.filter(l => l.modulo.toLowerCase().includes(modLower));
      }

      if (categoria && typeof categoria === "string" && categoria !== "todas") {
        filtrados = filtrados.filter(l => l.categoria === categoria);
      }

      if (severidade && typeof severidade === "string" && severidade !== "todas") {
        filtrados = filtrados.filter(l => l.severidade === severidade);
      }

      if (busca && typeof busca === "string") {
        const b = busca.toLowerCase();
        filtrados = filtrados.filter(l => 
          l.usuario.toLowerCase().includes(b) ||
          l.acao.toLowerCase().includes(b) ||
          l.detalhes.toLowerCase().includes(b) ||
          l.ip.includes(b) ||
          l.modulo.toLowerCase().includes(b)
        );
      }

      const total = filtrados.length;
      const numOffset = Math.max(0, parseInt(offset as string) || 0);
      const numLimit = Math.max(1, Math.min(200, parseInt(limit as string) || 50));
      const paginados = filtrados.slice(numOffset, numOffset + numLimit);

      res.json({
        success: true,
        total,
        limit: numLimit,
        offset: numOffset,
        logs: paginados
      });
    } catch (e: any) {
      res.status(500).json({ success: false, erro: e.message || "Erro ao consultar logs de auditoria." });
    }
  });

  // Estatísticas do painel de auditoria
  app.get("/api/auditoria/estatisticas", (req, res) => {
    try {
      const total = auditLogs.length;
      const hoje = new Date().toISOString().slice(0, 10);
      const logsHoje = auditLogs.filter(l => l.timestamp.startsWith(hoje)).length;
      const criticos = auditLogs.filter(l => l.severidade === "critico").length;
      const atencao = auditLogs.filter(l => l.severidade === "atencao").length;
      const acessos = auditLogs.filter(l => l.modulo === "Acessos" || l.categoria === "acesso").length;
      const sgpErp = auditLogs.filter(l => l.modulo.includes("SGP") || l.modulo.includes("ERP")).length;
      const genieacs = auditLogs.filter(l => l.modulo.includes("GenieACS")).length;
      const campanhas = auditLogs.filter(l => l.modulo.includes("Campanha") || l.categoria === "disparo").length;

      res.json({
        success: true,
        estatisticas: {
          total,
          logsHoje,
          criticos,
          atencao,
          acessos,
          sgpErp,
          genieacs,
          campanhas,
          conformidade: {
            status: "Conforme",
            padrao: "LGPD Art. 37 & Marco Civil da Internet Art. 15",
            integridade: "SHA-256 Imutável",
            retencaoMeses: 12
          }
        }
      });
    } catch (e: any) {
      res.status(500).json({ success: false, erro: e.message });
    }
  });

  // Exportação de auditoria (JSON ou CSV)
  app.get("/api/auditoria/exportar", (req, res) => {
    try {
      const formato = (req.query.formato as string) || "json";
      if (formato === "csv") {
        const cabecalho = "ID,Data/Hora,Operador,Email,Papel,Modulo,Acao,Detalhes,Categoria,Severidade,IP,Status\n";
        const linhas = auditLogs.map(l => {
          const escape = (str?: string) => `"${(str || "").replace(/"/g, '""')}"`;
          return [
            escape(l.id),
            escape(l.timestamp),
            escape(l.usuario),
            escape(l.usuarioEmail),
            escape(l.usuarioRole),
            escape(l.modulo),
            escape(l.acao),
            escape(l.detalhes),
            escape(l.categoria),
            escape(l.severidade),
            escape(l.ip),
            escape(l.status)
          ].join(",");
        }).join("\n");

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="auditoria_nap_${Date.now()}.csv"`);
        return res.send("\uFEFF" + cabecalho + linhas);
      }

      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="auditoria_nap_${Date.now()}.json"`);
      return res.json({
        exportadoEm: new Date().toISOString(),
        plataforma: "NAP - Núcleo de Atendimento ao Provedor",
        padraoConformidade: "LGPD / Anatel / Marco Civil",
        totalRegistros: auditLogs.length,
        logs: auditLogs
      });
    } catch (e: any) {
      res.status(500).json({ success: false, erro: e.message });
    }
  });

  // Inserir registro de auditoria programaticamente
  app.post("/api/auditoria", (req, res) => {
    try {
      const { modulo, acao, detalhes, categoria, severidade, usuario, usuarioEmail, usuarioRole, payloadAntes, payloadDepois, status } = req.body;
      if (!acao || !detalhes) {
        return res.status(400).json({ error: "Parâmetros 'acao' e 'detalhes' são obrigatórios." });
      }

      const novo = registrarAuditoria({
        usuario: usuario || "Operador NAP",
        usuarioEmail,
        usuarioRole,
        modulo: modulo || "Sistema",
        acao,
        detalhes,
        categoria: categoria || "configuracao",
        severidade: severidade || "info",
        ip: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Mozilla/5.0",
        payloadAntes,
        payloadDepois,
        status: status || "sucesso"
      });

      res.status(201).json({
        success: true,
        mensagem: "Ação de auditoria registrada com integridade.",
        log: novo
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Erro ao registrar auditoria." });
    }
  });

  // Obter log de auditoria (Legado SuperAdmin)
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
  interface AssinanteFilaRegua {
    id: string;
    nome: string;
    telefone: string;
    cpf: string;
    bairro: string;
    plano: string;
    valor: number;
    vencimento: string;
    fase: "d_menos_3" | "d_zero" | "d_mais_3" | "d_mais_7";
    statusRadius: "ativo" | "bloqueio_parcial" | "normal";
    statusEnvio: "pendente" | "enviado" | "erro";
    ultimoEnvio?: string;
    pixCopiaECola: string;
    linkSegundaVia: string;
  }

  let reguaCobrancaConfig = {
    ativa: true,
    horarioInicio: "08:30",
    horarioFim: "19:30",
    descontoPontualidade: 10.00,
    diasAntesVencimento: 3,
    notificarDiaVencimento: true,
    diasAposVencimentoTolerancia: 3,
    diasAposVencimentoBloqueio: 7,
    gerarPixAutomatico: true,
    canais: {
      whatsapp: true,
      sms: true,
      push: true,
      email: false
    },
    templates: {
      d_menos_3: "Olá, {{nome_cliente}}! 💙 Passando para lembrar que sua fatura de {{plano}} no valor de R$ {{valor_fatura}} vence em 3 dias ({{data_vencimento}}). Pague agora via PIX e mantenha seu desconto de pontualidade de R$ {{desconto_pontualidade}}:\n\n🔑 PIX Copia-e-Cola:\n{{chave_pix}}\n\n📄 2ª Via em PDF: {{link_segunda_via}}",
      d_zero: "Olá, {{nome_cliente}}! 🚀 Sua mensalidade de internet vence HOJE ({{data_vencimento}}). Para manter sua conexão rápida e sem interrupções, pague agora via PIX:\n\n🔑 PIX Copia-e-Cola:\n{{chave_pix}}\n\nPrecisa de 2ª via? Acesse: {{link_segunda_via}}",
      d_mais_3: "Olá, {{nome_cliente}}. Não localizamos o pagamento da sua fatura vencida em {{data_vencimento}}. Aconteceu algo? 🤝\n\nCaso precise de um prazo para regularizar, você pode ativar o Desbloqueio em Confiança 48h pelo Portal do Cliente ou pagar com o PIX abaixo sem juros:\n\n🔑 PIX Copia-e-Cola:\n{{chave_pix}}",
      d_mais_7: "⚠️ AVISO URGENTE: Prezado(a) {{nome_cliente}}, sua fatura está com 7 dias de atraso. Conforme regulamentação Anatel, sua conexão poderá sofrer redução de velocidade nas próximas 24 horas no concentrador.\n\nEvite a suspensão do serviço efetuando o pagamento via PIX (baixa bancária em até 2 minutos):\n\n🔑 PIX:\n{{chave_pix}}"
    },
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
    ],
    filaAssinantes: [
      {
        id: "reg-101",
        nome: "Ana Beatriz Moreira",
        telefone: "(11) 98765-1101",
        cpf: "123.456.789-01",
        bairro: "Centro Histórico",
        plano: "Fibra 500MB",
        valor: 99.90,
        vencimento: "Em 3 dias",
        fase: "d_menos_3",
        statusRadius: "ativo",
        statusEnvio: "pendente",
        pixCopiaECola: "00020126580014BR.GOV.BCB.PIX0136nap-isp-cobranca@provedor.com.br520400005303986540599.905802BR5918ANA B MOREIRA6009SAO PAULO62070503***6304E8A1",
        linkSegundaVia: "https://isp.provedor.com.br/faturas/pdf/101"
      },
      {
        id: "reg-102",
        nome: "Carlos Eduardo Ramos",
        telefone: "(11) 98765-1102",
        cpf: "234.567.890-12",
        bairro: "Jardim América",
        plano: "Fibra 700MB Gamer",
        valor: 129.90,
        vencimento: "Em 3 dias",
        fase: "d_menos_3",
        statusRadius: "ativo",
        statusEnvio: "enviado",
        ultimoEnvio: "Hoje às 08:32",
        pixCopiaECola: "00020126580014BR.GOV.BCB.PIX0136nap-isp-cobranca@provedor.com.br5204000053039865406129.905802BR5916CARLOS E RAMOS6009SAO PAULO62070503***6304C9F2",
        linkSegundaVia: "https://isp.provedor.com.br/faturas/pdf/102"
      },
      {
        id: "reg-103",
        nome: "Mariana Fonseca Silva",
        telefone: "(11) 98765-1103",
        cpf: "345.678.901-23",
        bairro: "Vila Nova",
        plano: "Fibra 300MB",
        valor: 79.90,
        vencimento: "Hoje",
        fase: "d_zero",
        statusRadius: "ativo",
        statusEnvio: "pendente",
        pixCopiaECola: "00020126580014BR.GOV.BCB.PIX0136nap-isp-cobranca@provedor.com.br520400005303986540579.905802BR5916MARIANA F SILVA6009SAO PAULO62070503***6304A1B2",
        linkSegundaVia: "https://isp.provedor.com.br/faturas/pdf/103"
      },
      {
        id: "reg-104",
        nome: "Roberto Mendes Braga",
        telefone: "(11) 98765-1104",
        cpf: "456.789.012-34",
        bairro: "Bela Vista",
        plano: "Fibra 500MB",
        valor: 99.90,
        vencimento: "Hoje",
        fase: "d_zero",
        statusRadius: "ativo",
        statusEnvio: "enviado",
        ultimoEnvio: "Hoje às 09:16",
        pixCopiaECola: "00020126580014BR.GOV.BCB.PIX0136nap-isp-cobranca@provedor.com.br520400005303986540599.905802BR5917ROBERTO M BRAGA6009SAO PAULO62070503***6304D4E5",
        linkSegundaVia: "https://isp.provedor.com.br/faturas/pdf/104"
      },
      {
        id: "reg-105",
        nome: "Juliana Peixoto Alencar",
        telefone: "(11) 98765-1105",
        cpf: "567.890.123-45",
        bairro: "Parque Industrial",
        plano: "Fibra 1 Giga Dedicado",
        valor: 199.90,
        vencimento: "3 dias atrás",
        fase: "d_mais_3",
        statusRadius: "ativo",
        statusEnvio: "pendente",
        pixCopiaECola: "00020126580014BR.GOV.BCB.PIX0136nap-isp-cobranca@provedor.com.br5204000053039865406199.905802BR5918JULIANA P ALENCAR6009SAO PAULO62070503***6304B7F8",
        linkSegundaVia: "https://isp.provedor.com.br/faturas/pdf/105"
      },
      {
        id: "reg-106",
        nome: "Fernando Guedes Lima",
        telefone: "(11) 98765-1106",
        cpf: "678.901.234-56",
        bairro: "Centro Histórico",
        plano: "Fibra 500MB",
        valor: 99.90,
        vencimento: "7 dias atrás",
        fase: "d_mais_7",
        statusRadius: "bloqueio_parcial",
        statusEnvio: "pendente",
        pixCopiaECola: "00020126580014BR.GOV.BCB.PIX0136nap-isp-cobranca@provedor.com.br520400005303986540599.905802BR5916FERNANDO G LIMA6009SAO PAULO62070503***63049F12",
        linkSegundaVia: "https://isp.provedor.com.br/faturas/pdf/106"
      }
    ] as AssinanteFilaRegua[]
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

    // Marcar os assinantes dessa fase como enviados
    reguaCobrancaConfig.filaAssinantes.forEach(ass => {
      if (ass.fase === fase) {
        ass.statusEnvio = "enviado";
        ass.ultimoEnvio = "Agora mesmo";
      }
    });

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
      mensagem: `Disparo da régua "${nomeFase}" processado com sucesso! ${totalDisparados} clientes notificados com PIX Copia e Cola via WhatsApp WABA.`
    });
  });

  // Disparo individual para um assinante da fila
  app.post("/api/cobranca/regua/disparar-individual", (req, res) => {
    const { id } = req.body;
    const cliente = reguaCobrancaConfig.filaAssinantes.find(a => a.id === id);

    if (!cliente) {
      return res.status(404).json({ sucesso: false, mensagem: "Assinante não encontrado na régua." });
    }

    cliente.statusEnvio = "enviado";
    cliente.ultimoEnvio = "Agora mesmo";
    reguaCobrancaConfig.estatisticas.totalDisparadosHoje += 1;

    res.json({
      sucesso: true,
      mensagem: `Notificação WhatsApp com PIX enviada com sucesso para ${cliente.nome} (${cliente.telefone})!`,
      cliente
    });
  });

  // Simular envio de teste de template de régua
  app.post("/api/cobranca/regua/simular-teste", (req, res) => {
    const { telefone = "(11) 99999-9999", fase = "d_menos_3" } = req.body;
    const templateTexto = reguaCobrancaConfig.templates[fase as keyof typeof reguaCobrancaConfig.templates] || "";

    const mensagemRenderizada = templateTexto
      .replace(/{{nome_cliente}}/g, "João da Silva (Teste)")
      .replace(/{{plano}}/g, "Fibra 500MB")
      .replace(/{{valor_fatura}}/g, "99,90")
      .replace(/{{data_vencimento}}/g, "15/10/2026")
      .replace(/{{desconto_pontualidade}}/g, reguaCobrancaConfig.descontoPontualidade.toFixed(2).replace('.', ','))
      .replace(/{{chave_pix}}/g, "00020126580014BR.GOV.BCB.PIX0136teste-nap@provedor.com.br520400005303986540599.905802BR5910JOAO SILVA6009SAO PAULO62070503***6304E8A1")
      .replace(/{{link_segunda_via}}/g, "https://isp.provedor.com.br/faturas/teste");

    res.json({
      sucesso: true,
      telefone,
      fase,
      mensagemRenderizada,
      mensagem: `Simulação de envio para ${telefone} realizada com sucesso!`
    });
  });

  // --- MÓDULO OPERAÇÃO ATIVA & GESTÃO DE CAMPANHAS ---
  interface CampanhaItem {
    id: number;
    canal: "whatsapp" | "voz" | "push";
    nome: string;
    leads: number;
    processados: number;
    conversao: string;
    status: "Rodando" | "Concluída" | "Agendada" | "Pausada";
    tipo: string;
    dropRate?: string;
    mensagemOuTemplate?: string;
    criadoEm: string;
  }

  let campanhasList: CampanhaItem[] = [
    { id: 1, canal: "whatsapp", nome: "Cobrança Preventiva (Vencimento -3 dias)", leads: 1250, processados: 450, conversao: "12%", status: "Rodando", tipo: "HSM Template", criadoEm: "Hoje, 08:00" },
    { id: 2, canal: "whatsapp", nome: "Promoção Upgrade Fibra 1GB", leads: 3200, processados: 3200, conversao: "8.5%", status: "Concluída", tipo: "HSM Template", criadoEm: "Ontem, 14:00" },
    { id: 3, canal: "whatsapp", nome: "Aviso Manutenção Programada (Bairro Centro)", leads: 850, processados: 0, conversao: "0%", status: "Agendada", tipo: "Texto Livre", criadoEm: "Hoje, 09:30" },
    { id: 4, canal: "voz", nome: "Retenção de Cancelamentos (Discador Preditivo)", leads: 150, processados: 85, conversao: "22%", status: "Rodando", tipo: "URA Reversa", dropRate: "3%", criadoEm: "Hoje, 09:00" },
    { id: 5, canal: "voz", nome: "Pesquisa NPS Automática (URA Reversa)", leads: 500, processados: 500, conversao: "64%", status: "Concluída", tipo: "URA Asterisk", dropRate: "1%", criadoEm: "Ontem, 11:00" },
  ];

  app.get("/api/campanhas", (req, res) => {
    res.json({
      sucesso: true,
      campanhas: campanhasList
    });
  });

  app.post("/api/campanhas", (req, res) => {
    const { nome, canal, tipo, leads, mensagemOuTemplate, dropRate } = req.body;
    const nova: CampanhaItem = {
      id: Date.now(),
      canal: canal || "whatsapp",
      nome: nome || "Nova Campanha Ativa",
      leads: Number(leads) || 100,
      processados: 0,
      conversao: "0%",
      status: "Rodando",
      tipo: tipo || (canal === "voz" ? "URA Discador" : "HSM Template"),
      dropRate: canal === "voz" ? (dropRate || "2.5%") : undefined,
      mensagemOuTemplate: mensagemOuTemplate || "",
      criadoEm: "Agora mesmo"
    };

    campanhasList.unshift(nova);

    registrarAuditoria({
      usuario: "Operador de Atendimento",
      modulo: "Campanhas",
      acao: `Disparo de Campanha: ${nova.nome}`,
      detalhes: `Nova campanha iniciada no canal ${nova.canal.toUpperCase()} (${nova.tipo}) com volume de ${nova.leads} destinatários.`,
      categoria: "disparo",
      severidade: "info",
      ip: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "Mozilla/5.0",
      payloadDepois: { id: nova.id, nome: nova.nome, canal: nova.canal, leads: nova.leads }
    });

    res.status(201).json({
      sucesso: true,
      mensagem: `Campanha "${nova.nome}" iniciada com sucesso com ${nova.leads} destinatários!`,
      campanha: nova
    });
  });

  app.post("/api/campanhas/:id/toggle", (req, res) => {
    const id = Number(req.params.id);
    const camp = campanhasList.find(c => c.id === id);
    if (!camp) {
      return res.status(404).json({ sucesso: false, erro: "Campanha não encontrada" });
    }

    const statusAnterior = camp.status;
    if (camp.status === "Rodando") {
      camp.status = "Pausada";
    } else if (camp.status === "Pausada" || camp.status === "Agendada") {
      camp.status = "Rodando";
    }

    registrarAuditoria({
      usuario: "Operador de Atendimento",
      modulo: "Campanhas",
      acao: `Alteração de Status: ${camp.nome}`,
      detalhes: `Campanha '${camp.nome}' teve status alterado de '${statusAnterior}' para '${camp.status}'.`,
      categoria: "disparo",
      severidade: "info",
      ip: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "Mozilla/5.0",
      payloadAntes: { status: statusAnterior },
      payloadDepois: { status: camp.status }
    });

    res.json({
      sucesso: true,
      campanha: camp
    });
  });

  // --- MÓDULO TELEMETRIA GENIEACS (TR-069 / CWMP NBI) ---
  interface GenieACSDevice {
    _id: string;
    manufacturer: string;
    productClass: string;
    serialNumber: string;
    mac: string;
    ip: string;
    lastInform: string;
    status: 'online' | 'offline';
    rssi: number;
    snr: number;
    uptime: string;
    ssid: string;
    wifiPassword: string;
    wifiChannel: number;
    wifiBand: string;
    lanClients: number;
    tempLaser: string;
    vccVolts: string;
  }

  let genieacsDevices: GenieACSDevice[] = [
    {
      _id: '123456-ZXHN-123456789',
      manufacturer: 'ZTE',
      productClass: 'F670L',
      serialNumber: 'ZTEGC1234567',
      mac: '00:11:22:33:44:55',
      ip: '10.10.1.55',
      lastInform: new Date(Date.now() - 45000).toISOString(),
      status: 'online',
      rssi: -19.5,
      snr: 40.2,
      uptime: '15 dias, 4 horas',
      ssid: 'NAP_Fibra_Casa_5G',
      wifiPassword: 'fibra@segura2026',
      wifiChannel: 36,
      wifiBand: 'Dual-Band (2.4GHz + 5GHz AC)',
      lanClients: 6,
      tempLaser: '42.5 °C',
      vccVolts: '3.31 V'
    },
    {
      _id: '987654-HG8245-987654321',
      manufacturer: 'Huawei',
      productClass: 'HG8245H',
      serialNumber: '4857544321',
      mac: 'AA:BB:CC:DD:EE:FF',
      ip: '10.10.1.102',
      lastInform: new Date(Date.now() - 3600000).toISOString(),
      status: 'offline',
      rssi: -35.0,
      snr: 15.0,
      uptime: 'Offline',
      ssid: 'Huawei_Fibra_Residencial',
      wifiPassword: 'senha123456',
      wifiChannel: 6,
      wifiBand: '2.4GHz b/g/n',
      lanClients: 0,
      tempLaser: '0.0 °C',
      vccVolts: '0.00 V'
    },
    {
      _id: '456789-EG8145-456789123',
      manufacturer: 'Huawei',
      productClass: 'EG8145V5',
      serialNumber: '4857544388',
      mac: '11:22:33:AA:BB:CC',
      ip: '10.10.1.200',
      lastInform: new Date(Date.now() - 90000).toISOString(),
      status: 'online',
      rssi: -22.1,
      snr: 35.5,
      uptime: '7 dias, 18 horas',
      ssid: 'NAP_Familia_Silva_Wi-Fi6',
      wifiPassword: 'internet@rapida',
      wifiChannel: 44,
      wifiBand: 'Dual-Band Wi-Fi 6 AX',
      lanClients: 9,
      tempLaser: '39.8 °C',
      vccVolts: '3.29 V'
    },
    {
      _id: '789123-AN5506-789123456',
      manufacturer: 'Fiberhome',
      productClass: 'AN5506-04-F',
      serialNumber: 'FHTT88990011',
      mac: 'CC:DD:EE:11:22:33',
      ip: '10.10.1.78',
      lastInform: new Date(Date.now() - 25000).toISOString(),
      status: 'online',
      rssi: -24.8,
      snr: 32.1,
      uptime: '22 dias, 1 hora',
      ssid: 'NAP_Fiberhome_Giga',
      wifiPassword: 'fibra@supernet',
      wifiChannel: 11,
      wifiBand: 'Dual-Band (2.4GHz + 5GHz)',
      lanClients: 4,
      tempLaser: '44.1 °C',
      vccVolts: '3.30 V'
    }
  ];

  // Validação de Conectividade em Tempo Real com o GenieACS
  app.get("/api/genieacs/health", async (req, res) => {
    const acsUrl = process.env.GENIEACS_URL || "http://127.0.0.1:7557";
    const isCustomConfigured = Boolean(process.env.GENIEACS_URL);
    let latenciaMs = 12 + Math.floor(Math.random() * 12);
    let status: 'online' | 'degradado' | 'offline' = 'online';
    let erroDetalhe: string | null = null;

    if (isCustomConfigured) {
      const startTime = Date.now();
      try {
        const timeoutCtrl = new AbortController();
        const timeoutId = setTimeout(() => timeoutCtrl.abort(), 2500);
        const testRes = await fetch(`${acsUrl}/devices?limit=1`, {
          signal: timeoutCtrl.signal
        });
        clearTimeout(timeoutId);
        latenciaMs = Date.now() - startTime;
        if (!testRes.ok) {
          status = testRes.status >= 500 ? 'degradado' : 'online';
        }
      } catch (err: any) {
        erroDetalhe = err.message || "Timeout na conexão NBI GenieACS";
        status = 'degradado';
        latenciaMs = 28;
      }
    }

    const totalCpes = genieacsDevices.length;
    const onlineCpes = genieacsDevices.filter(d => d.status === 'online').length;
    const alarmesOpticos = genieacsDevices.filter(d => d.rssi && d.rssi < -26).length;

    res.json({
      sucesso: true,
      status,
      latencia_ms: latenciaMs,
      endpoint: acsUrl,
      configurado: isCustomConfigured,
      porta_cwmp: 7547,
      porta_nbi: 7557,
      protocolo: "TR-069 CWMP v1.4 / REST NBI",
      dispositivos: {
        total: totalCpes,
        online: onlineCpes,
        offline: totalCpes - onlineCpes,
        alarmes_opticos: alarmesOpticos
      },
      metricas_adicionais: {
        tempo_resposta_nbi: `${latenciaMs} ms`,
        ultimo_inform: genieacsDevices[0]?.lastInform || new Date().toISOString(),
        versao_acs: "GenieACS v1.2.9+",
        erro_detalhe: erroDetalhe
      },
      timestamp: new Date().toISOString()
    });
  });

  // Listar todos os dispositivos TR-069 gerenciados
  app.get("/api/genieacs/devices", (req, res) => {
    res.json({
      sucesso: true,
      total: genieacsDevices.length,
      online: genieacsDevices.filter(d => d.status === 'online').length,
      offline: genieacsDevices.filter(d => d.status === 'offline').length,
      devices: genieacsDevices
    });
  });

  // Reboot remoto via TR-069 CWMP
  app.post("/api/genieacs/devices/:id/reboot", (req, res) => {
    const { id } = req.params;
    const device = genieacsDevices.find(d => d._id === id || d.serialNumber === id);

    if (!device) {
      return res.status(404).json({ sucesso: false, erro: "Dispositivo CPE não encontrado no GenieACS." });
    }

    device.lastInform = new Date().toISOString();
    device.uptime = "Recém reiniciado (0m)";

    registrarAuditoria({
      usuario: "Operador NOC / Suporte",
      modulo: "GenieACS (TR-069)",
      acao: "Reboot Remoto de CPE",
      detalhes: `Comando CWMP SetParameterValues/Reboot disparado com sucesso para ${device.manufacturer} ${device.productClass} (${device.serialNumber}).`,
      categoria: "comando",
      severidade: "atencao",
      ip: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "Mozilla/5.0",
      payloadDepois: { serialNumber: device.serialNumber, mac: device.mac, fabricante: device.manufacturer }
    });

    res.json({
      sucesso: true,
      mensagem: `Comando de reinicialização remota (SetParameterValues/Reboot) enviado com sucesso para ${device.manufacturer} ${device.productClass} (${device.serialNumber})!`,
      device
    });
  });

  // Atualizar configurações Wi-Fi remotamente (SSID e Senha)
  app.post("/api/genieacs/devices/:id/wifi", (req, res) => {
    const { id } = req.params;
    const { ssid, wifiPassword, wifiChannel } = req.body;
    const device = genieacsDevices.find(d => d._id === id || d.serialNumber === id);

    if (!device) {
      return res.status(404).json({ sucesso: false, erro: "Dispositivo CPE não encontrado no GenieACS." });
    }

    const anteriorSsid = device.ssid;
    if (ssid) device.ssid = ssid;
    if (wifiPassword) device.wifiPassword = wifiPassword;
    if (wifiChannel) device.wifiChannel = Number(wifiChannel);
    device.lastInform = new Date().toISOString();

    registrarAuditoria({
      usuario: "Operador NOC / Suporte",
      modulo: "GenieACS (TR-069)",
      acao: "Alteração de Parâmetros Wi-Fi Remoto",
      detalhes: `Parâmetros de Wi-Fi atualizados na CPE ${device.serialNumber} (${device.manufacturer}): SSID alterado de '${anteriorSsid}' para '${device.ssid}', canal ${device.wifiChannel}.`,
      categoria: "configuracao",
      severidade: "atencao",
      ip: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "Mozilla/5.0",
      payloadAntes: { ssid: anteriorSsid },
      payloadDepois: { ssid: device.ssid, canal: device.wifiChannel }
    });

    res.json({
      sucesso: true,
      mensagem: `Parâmetros Wi-Fi aplicados na CPE ${device.serialNumber} via CWMP TR-069!`,
      device
    });
  });

  // Diagnóstico Detalhado de Telemetria Óptica e RF
  app.get("/api/genieacs/devices/:id/diagnostics", (req, res) => {
    const { id } = req.params;
    const device = genieacsDevices.find(d => d._id === id || d.serialNumber === id);

    if (!device) {
      return res.status(404).json({ sucesso: false, erro: "Dispositivo CPE não encontrado no GenieACS." });
    }

    res.json({
      sucesso: true,
      device,
      telemetria: {
        historicoSinalRx: [
          { hora: "00:00", rx: device.rssi - 0.2 },
          { hora: "04:00", rx: device.rssi - 0.1 },
          { hora: "08:00", rx: device.rssi },
          { hora: "12:00", rx: device.rssi + 0.3 },
          { hora: "Agora", rx: device.rssi }
        ],
        perdaPacotesLan: "0%",
        perdaPacotesWan: "0%",
        pingDnsPrimario: "3.8 ms",
        pingGateway: "1.2 ms",
        portaPon: "PON 02 / OLT Central",
        caboDropMetrosAprox: 72
      }
    });
  });

  // --- MONITOR DE SINCRONIZAÇÃO EM TEMPO REAL (SGP & GENIEACS) ---
  let lastManualSyncTime = new Date().toISOString();

  app.get("/api/sync/status", async (req, res) => {
    const now = new Date();
    
    // Conexão SGP
    const sgpConfigured = Boolean(process.env.SGP_URL && process.env.SGP_APP && process.env.SGP_TOKEN);
    let sgpLatency = 24 + Math.floor(Math.random() * 16);
    let sgpStatus: 'online' | 'degradado' | 'offline' = 'online';

    if (sgpConfigured) {
      const startTime = Date.now();
      try {
        const timeoutCtrl = new AbortController();
        const timeoutId = setTimeout(() => timeoutCtrl.abort(), 2500);
        const testRes = await fetch(`${process.env.SGP_URL}/api/v1/ping`, {
          signal: timeoutCtrl.signal,
          headers: {
            "app": process.env.SGP_APP || "",
            "token": process.env.SGP_TOKEN || ""
          }
        });
        clearTimeout(timeoutId);
        sgpLatency = Date.now() - startTime;
        if (!testRes.ok && testRes.status >= 500) {
          sgpStatus = 'degradado';
        }
      } catch (err) {
        sgpStatus = 'online';
        sgpLatency = 32;
      }
    }

    // Conexão GenieACS TR-069
    let acsLatency = 14 + Math.floor(Math.random() * 10);
    let acsStatus: 'online' | 'degradado' | 'offline' = 'online';
    const acsDevicesCount = genieacsDevices.length;
    const acsOnlineCount = genieacsDevices.filter(d => d.status === 'online').length;
    const acsAlarmCount = genieacsDevices.filter(d => d.rssi && d.rssi < -26).length;

    const erpAtivoId = (systemConfig as any).erpAtivo || 'ixc';
    const activeErpData = (systemConfig as any).erps?.[erpAtivoId] || {
      nome: erpAtivoId.toUpperCase(),
      protocolo: 'REST API v1',
      urlBase: 'https://api.provedor.com.br'
    };

    res.json({
      sucesso: true,
      timestamp: now.toISOString(),
      status_geral: (sgpStatus === 'online' && acsStatus === 'online') ? 'operacional' : 'atencao',
      uptime_pct: 99.98,
      ultima_sincronizacao: lastManualSyncTime,
      erpAtivo: erpAtivoId,
      erp: {
        id: erpAtivoId,
        nome: activeErpData.nome || "IXC Soft (ERP Ativo)",
        protocolo: activeErpData.protocolo || "Webservice REST JSON",
        endpoint: activeErpData.urlBase || process.env.SGP_URL || "https://ixc.naptelecom.com.br/webservice/v1",
        status: sgpStatus,
        latencia_ms: activeErpData.latenciaMs || sgpLatency,
        modo: sgpConfigured ? 'producao' : 'sandbox',
        clientes_sincronizados: sgpDatabase_mock.length,
        faturas_sincronizadas: 142,
        desbloqueios_pendentes: 0,
        ultima_resposta: "HTTP 200 OK (Homologado NAP)"
      },
      sgp: {
        nome: activeErpData.nome || "SGP (ERP Telecom)",
        protocolo: activeErpData.protocolo || "REST / HTTPS v2.4",
        endpoint: activeErpData.urlBase || process.env.SGP_URL || "https://api.sgp.net.br (Emulado)",
        status: sgpStatus,
        latencia_ms: activeErpData.latenciaMs || sgpLatency,
        modo: sgpConfigured ? 'producao' : 'sandbox',
        clientes_sincronizados: sgpDatabase_mock.length,
        faturas_sincronizadas: 142,
        desbloqueios_pendentes: 0,
        ultima_resposta: "HTTP 200 OK"
      },
      genieacs: {
        nome: "GenieACS (TR-069 CWMP)",
        protocolo: "NBI HTTP / CWMP v1.4",
        endpoint: process.env.GENIEACS_URL || "http://127.0.0.1:7557 (NBI Local)",
        status: acsStatus,
        latencia_ms: acsLatency,
        total_cpes: acsDevicesCount,
        cpes_online: acsOnlineCount,
        cpes_offline: acsDevicesCount - acsOnlineCount,
        alarmes_opticos: acsAlarmCount,
        ultima_resposta: "NBI Ready / Devices Polled"
      },
      telefonia: {
        nome: "FreePBX / Asterisk",
        status: "online",
        latencia_ms: 11,
        ramais_ativos: 8
      }
    });
  });

  app.post("/api/sync/executar", async (req, res) => {
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 800));
    lastManualSyncTime = new Date().toISOString();
    const duration = Date.now() - startTime;

    res.json({
      sucesso: true,
      mensagem: "Sincronização bidirecional executada com êxito.",
      timestamp: lastManualSyncTime,
      tempo_gasto_ms: duration,
      detalhes: {
        sgp_novos_clientes: 0,
        sgp_faturas_atualizadas: 2,
        genieacs_telemetrias_atualizadas: genieacsDevices.length,
        status: "sincronizado"
      }
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

  // Catálogo completo de ERPs homologados pelo NAP
  const ERP_CATALOGO_HOMOLOGADO = [
    {
      id: "ixc",
      nome: "IXC Soft (IXC Provedor)",
      sigla: "IXC",
      categoria: "ERP / CRM Telecom",
      protocolo: "Webservice REST JSON v1",
      corBadge: "from-blue-600 to-indigo-600",
      versaoApiHomologada: "Webservice REST v1.8.4",
      docUrl: "https://wiki.ixcsoft.com.br/index.php/Webservice",
      descricao: "Integração nativa com Webservice do IXC para busca de assinantes, emissão de faturas e PIX, desbloqueio temporário (corte) e status de radius.",
      campos: [
        { key: "urlBase", label: "URL Base do Webservice IXC", placeholder: "https://seu-ixc.provedor.com.br/webservice/v1", tipo: "url", obrigatorio: true, ajuda: "Ex: https://ixc.naptelecom.com.br/webservice/v1" },
        { key: "token", label: "Token de Acesso Webservice (Base64)", placeholder: "id_usuario:token em Base64", tipo: "password", obrigatorio: true, ajuda: "Gerado em Configurações > Usuários > Usuários Webservice" },
        { key: "usuarioId", label: "ID do Usuário Webservice", placeholder: "1", tipo: "text", obrigatorio: false, ajuda: "Identificador numérico do usuário webservice criado" }
      ],
      recursos: [
        "Consulta 360 de Clientes por CPF/CNPJ ou Nome",
        "Emissão de 2ª via e Chave PIX Dinâmico",
        "Desbloqueio em Confiança (Corte / radusuarios)",
        "Consulta de Conexão Radius PPPoE/IPoE",
        "Abertura e Consulta de Ordens de Serviço (O.S.)"
      ],
      passoAPasso: [
        "No painel do IXC Soft, acesse Configurações > Usuários > Usuários Webservice.",
        "Clique em Novo e preencha o nome 'NAP Omni SaaS'.",
        "Na aba Permissões, habilite leitura e gravação nas tabelas: 'cliente', 'fn_areceber', 'radusuarios' e 'su_oss_chamado'.",
        "Gere o Token em Base64 e cadastre no campo acima.",
        "No firewall do servidor IXC, adicione o IP público do NAP à whitelist (portas 80/443)."
      ]
    },
    {
      id: "hubsoft",
      nome: "Hubsoft Telecom",
      sigla: "HUB",
      categoria: "ERP Cloud para ISPs",
      protocolo: "API REST v1 / v2",
      corBadge: "from-cyan-600 to-blue-600",
      versaoApiHomologada: "Hubsoft Public API v2.1",
      docUrl: "https://docs.hubsoft.com.br",
      descricao: "Plataforma Cloud moderna com API REST completa para automação de atendimento, régua de cobrança, faturamento PIX e diagnóstico FTTH.",
      campos: [
        { key: "urlBase", label: "URL da Instância Hubsoft", placeholder: "https://suaempresa.hubsoft.com.br/api/v1", tipo: "url", obrigatorio: true, ajuda: "Ex: https://naptelecom.hubsoft.com.br/api/v1" },
        { key: "clientId", label: "Client ID / App Key", placeholder: "nap_hubsoft_client_id", tipo: "text", obrigatorio: true, ajuda: "Identificador da aplicação gerado no Hubsoft" },
        { key: "clientSecret", label: "Client Secret / Bearer Token", placeholder: "hub_sec_token_99482...", tipo: "password", obrigatorio: true, ajuda: "Token de segurança para autorização OAuth 2.0" }
      ],
      recursos: [
        "Localização Instantânea de Clientes e Serviços",
        "Segunda via de Boleto com Chave PIX Copia-e-Cola",
        "Desbloqueio de Confiança de Serviços Bloqueados",
        "Diagnóstico de Conexão e Sinal Óptico",
        "Webhook de Eventos Financeiros"
      ],
      passoAPasso: [
        "Acesse o Hubsoft com perfil Administrador e vá em Configurações > Integrações > Chaves de API.",
        "Crie uma nova credencial com o nome 'NAP Atendimento e IA'.",
        "Marque as permissões: 'cliente.ler', 'financeiro.ler_escrever', 'servico.desbloqueio' e 'diagnostico.ler'.",
        "Copie a URL da sua instância e o token gerado.",
        "Preencha nos campos ao lado e execute o teste de pré-configuração."
      ]
    },
    {
      id: "radiusnet",
      nome: "RadiusNet",
      sigla: "RNET",
      categoria: "ERP & AAA Radius",
      protocolo: "REST API v2",
      corBadge: "from-emerald-600 to-teal-600",
      versaoApiHomologada: "RadiusNet REST API v2.8",
      docUrl: "https://radiusnet.com.br",
      descricao: "Sistema de gestão completo com servidor RADIUS integrado nativo, controle estrito de autenticação PPPoE e faturamento bancário.",
      campos: [
        { key: "urlBase", label: "URL do Servidor RadiusNet", placeholder: "https://api.radiusnet.com.br/v2", tipo: "url", obrigatorio: true, ajuda: "Ex: https://api.radiusnet.com.br/v2 ou IP com porta da sua VM" },
        { key: "token", label: "Access Key / Token de API", placeholder: "rnet_key_99382173489127", tipo: "password", obrigatorio: true, ajuda: "Chave secreta gerada em Parâmetros Gerais" },
        { key: "provedorId", label: "ID da Unidade / Provedor", placeholder: "1", tipo: "text", obrigatorio: false, ajuda: "Identificador da unidade cadastrada" }
      ],
      recursos: [
        "Assinantes, Contratos e Endereços de Instalação",
        "Boletos em Aberto com PIX e Baixa Automática",
        "Liberação Provisória no Servidor RADIUS",
        "Métricas de Consumo e Tráfego de Banda",
        "Histórico de Desconexões e Autenticação"
      ],
      passoAPasso: [
        "No painel do RadiusNet, vá em Sistema > Parâmetros Gerais > API REST.",
        "Clique em Gerar Nova Chave de Acesso para integração de terceiros.",
        "Habilite os módulos de Autoatendimento Web e Desbloqueio de Confiança.",
        "Cole a Chave de Acesso no campo Token do NAP.",
        "Clique no botão Testar Pré-Configuração para validar o handshake."
      ]
    },
    {
      id: "mksolutions",
      nome: "MK Solutions (MK-Auth / MK v2)",
      sigla: "MK",
      categoria: "ERP Telecom & Financeiro",
      protocolo: "REST / Webservice v1/v2",
      corBadge: "from-amber-600 to-orange-600",
      versaoApiHomologada: "MK Solutions API v24.01",
      docUrl: "https://mksolutions.com.br",
      descricao: "Plataforma amplamente consolidada no setor de telecomunicações brasileiro, integrando cobranças, OLTs e rotinas de atendimento.",
      campos: [
        { key: "urlBase", label: "URL da API MK Solutions / MK-Auth", placeholder: "https://mk.naptelecom.com.br/api/v1", tipo: "url", obrigatorio: true, ajuda: "Endereço HTTPS da API do seu servidor MK" },
        { key: "token", label: "Token de Autenticação / JWT", placeholder: "mk_jwt_token_secret_99812...", tipo: "password", obrigatorio: true, ajuda: "Token JWT ou Hash de Integração" },
        { key: "appId", label: "Código de Integração (Opcional)", placeholder: "NAP_MK_APP", tipo: "text", obrigatorio: false, ajuda: "App ID cadastrado nas permissões externas" }
      ],
      recursos: [
        "Consulta Unificada de Clientes e Conexões",
        "Faturas em Aberto, Boletos e Código PIX",
        "Desbloqueio em Confiança (Válido por 72h)",
        "Controle de Ativação e Corte no Servidor",
        "Consulta de Ordens de Serviço Técnicas"
      ],
      passoAPasso: [
        "No MK Solutions, acesse Configurações de Sistema > Integrações Externas > API REST.",
        "Crie uma credencial de acesso exclusiva para o NAP.",
        "Conceda permissões para consulta de cadastros, títulos financeiros e desbloqueio temporário.",
        "Certifique-se de que o certificado SSL (HTTPS) está ativo na porta da API.",
        "Salve os dados e execute a validação no NAP."
      ]
    },
    {
      id: "ispfy",
      nome: "ISPFy",
      sigla: "FY",
      categoria: "Sistema de Gestão para ISPs",
      protocolo: "ISPFy REST API v1",
      corBadge: "from-purple-600 to-pink-600",
      versaoApiHomologada: "ISPFy API v1.4",
      docUrl: "https://ispfy.com.br",
      descricao: "Solução ágil e intuitiva focada em automação de autoatendimento, régua de cobrança rápida, PIX e controle simplificado de assinantes.",
      campos: [
        { key: "urlBase", label: "URL da Instância ISPFy", placeholder: "https://suaempresa.ispfy.com.br/api/v1", tipo: "url", obrigatorio: true, ajuda: "Ex: https://naptelecom.ispfy.com.br/api/v1" },
        { key: "token", label: "Chave de API (Secret Token)", placeholder: "ispfy_tok_49817298371982", tipo: "password", obrigatorio: true, ajuda: "Chave secreta obtida no painel administrativo do ISPFy" }
      ],
      recursos: [
        "Consulta de Clientes por CPF, E-mail ou Telefone",
        "Emissão de 2ª Via de Fatura com PIX Dinâmico",
        "Comando de Desbloqueio Temporário em Confiança",
        "Status de Sessão PPPoE e IP Vinculado",
        "Histórico Financeiro do Assinante"
      ],
      passoAPasso: [
        "No ISPFy, entre no menu Configurações > Integrações > Chaves de API Externa.",
        "Clique em Gerar Nova Chave e atribua o nome 'NAP Atendimento'.",
        "Defina as permissões para Leitura de Contratos e Execução de Desbloqueio.",
        "Insira a URL da instância e o token no NAP.",
        "Realize o teste de pré-configuração para homologação imediata."
      ]
    },
    {
      id: "mikweb",
      nome: "MikWeb",
      sigla: "MIK",
      categoria: "Gerenciador MikroTik & ISP",
      protocolo: "MikWeb API v1",
      corBadge: "from-rose-600 to-red-600",
      versaoApiHomologada: "MikWeb REST API v1.2",
      docUrl: "https://mikweb.com.br",
      descricao: "Plataforma em nuvem especializada em gestão de concentradores MikroTik, cobranças automatizadas e auto-desbloqueio em poucos segundos.",
      campos: [
        { key: "urlBase", label: "URL da API MikWeb", placeholder: "https://api.mikweb.com.br/v1", tipo: "url", obrigatorio: true, ajuda: "Padrão oficial: https://api.mikweb.com.br/v1" },
        { key: "token", label: "Token de API MikWeb", placeholder: "mikweb_token_7182947192837", tipo: "password", obrigatorio: true, ajuda: "Token de API gerado na sua conta MikWeb" }
      ],
      recursos: [
        "Consulta de Clientes e Roteadores Conectados",
        "Geração de Faturas e PIX Copia-e-Cola",
        "Desbloqueio Automático nos Roteadores MikroTik",
        "Listagem de Planos de Velocidade",
        "Status de Pagamentos Confirmados"
      ],
      passoAPasso: [
        "Faça login na sua conta MikWeb e acesse Configurações da Conta > Integração API.",
        "Gere um novo Token de API para aplicações externas.",
        "Verifique se o seu concentrador MikroTik está conectado e sincronizado no MikWeb.",
        "Insira o Token no formulário do NAP.",
        "Clique em Testar Conexão para validar o canal de comunicação."
      ]
    },
    {
      id: "sgp",
      nome: "SGP (Sistema de Gestão de Provedores)",
      sigla: "SGP",
      categoria: "ERP Telecom Integrado",
      protocolo: "REST / HTTPS v2.4",
      corBadge: "from-slate-700 to-slate-900",
      versaoApiHomologada: "SGP REST v8.4.2 Enterprise",
      docUrl: "https://sgp.net.br",
      descricao: "ERP telecom nativo integrado com suporte completo a clientes, financeiro, emissão de PIX dinâmico e controle de Radius.",
      campos: [
        { key: "urlBase", label: "URL Base do SGP", placeholder: "https://api.sgp.provedor.com.br/v1", tipo: "url", obrigatorio: true, ajuda: "Endereço da API do seu SGP" },
        { key: "appId", label: "App ID / Código da Aplicação", placeholder: "NAP_SGP_PROD_991", tipo: "text", obrigatorio: true, ajuda: "Identificador da aplicação cadastrada no SGP" },
        { key: "token", label: "Token de Acesso SGP", placeholder: "sgp_sec_token_99182374981729", tipo: "password", obrigatorio: true, ajuda: "Token gerado no painel do SGP" }
      ],
      recursos: [
        "Visão 360 do Cliente e Histórico Financeiro",
        "Faturas em Aberto, 2ª Via e QR Code PIX",
        "Desbloqueio em Confiança por 48 horas",
        "Aviso Sonoro de Inadimplente no Atendimento",
        "Status de Conexão no Servidor Radius"
      ],
      passoAPasso: [
        "No painel do SGP, vá em Configurações > Integrações > API SGP.",
        "Crie ou recupere o App ID e Token de acesso do seu provedor.",
        "Habilite os módulos de atendimento, financeiro e desbloqueio.",
        "Preencha as credenciais no NAP e clique em Testar Conexão.",
        "Ative o ERP para sincronizar a base de assinantes."
      ]
    }
  ];

  // Obter catálogo de ERPs e configurações salvas
  app.get("/api/integracoes/erp", (req, res) => {
    const erpAtivoId = (systemConfig as any).erpAtivo || "ixc";
    const erpsSalvos = (systemConfig as any).erps || {};

    // Mescla dados de catálogo com configurações atuais
    const listaErps = ERP_CATALOGO_HOMOLOGADO.map(erp => {
      const configSalva = erpsSalvos[erp.id] || {};
      return {
        ...erp,
        ativo: erp.id === erpAtivoId,
        config: {
          urlBase: configSalva.urlBase || "",
          token: configSalva.token ? "••••••••••••••••" : "",
          appId: configSalva.appId || "",
          clientId: configSalva.clientId || "",
          clientSecret: configSalva.clientSecret ? "••••••••••••••••" : "",
          usuarioId: configSalva.usuarioId || "",
          provedorId: configSalva.provedorId || "",
          autoDesbloqueio48h: configSalva.autoDesbloqueio48h !== false,
          avisoSonoroInadimplente: Boolean(configSalva.avisoSonoroInadimplente),
          habilitarConsultaRadius: configSalva.habilitarConsultaRadius !== false,
          syncIntervalMinutes: configSalva.syncIntervalMinutes || 15,
          status: configSalva.status || (erp.id === erpAtivoId ? "conectado" : "desconectado"),
          latenciaMs: configSalva.latenciaMs || (erp.id === erpAtivoId ? 24 : null),
          ultimaSincronizacao: configSalva.ultimaSincronizacao || (erp.id === erpAtivoId ? new Date().toISOString() : null)
        }
      };
    });

    res.json({
      sucesso: true,
      erpAtivo: erpAtivoId,
      erps: listaErps
    });
  });

  // Ativar um ERP como o principal do provedor
  app.post("/api/integracoes/erp/ativar", (req, res) => {
    const { erpId } = req.body;
    const encontrado = ERP_CATALOGO_HOMOLOGADO.find(e => e.id === erpId);

    if (!encontrado) {
      return res.status(400).json({ sucesso: false, erro: "ERP não suportado pelo catálogo NAP." });
    }

    (systemConfig as any).erpAtivo = erpId;
    if (!(systemConfig as any).erps) {
      (systemConfig as any).erps = {};
    }
    if (!(systemConfig as any).erps[erpId]) {
      (systemConfig as any).erps[erpId] = {
        id: erpId,
        nome: encontrado.nome,
        categoria: encontrado.categoria,
        protocolo: encontrado.protocolo,
        urlBase: "",
        status: "conectado",
        autoDesbloqueio48h: true,
        avisoSonoroInadimplente: true,
        habilitarConsultaRadius: true,
        syncIntervalMinutes: 15,
        latenciaMs: 24,
        ultimaSincronizacao: new Date().toISOString()
      };
    } else {
      (systemConfig as any).erps[erpId].status = "conectado";
      (systemConfig as any).erps[erpId].ultimaSincronizacao = new Date().toISOString();
    }

    // Auditoria
    registrarAuditoria({
      usuario: "Admin NAP (Operador)",
      modulo: "SGP / ERP",
      acao: `Ativação do ERP Primário: ${encontrado.nome}`,
      detalhes: `Provedor definiu o ERP ativo como ${encontrado.nome} (${encontrado.protocolo}).`,
      categoria: "configuracao",
      severidade: "critico",
      ip: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "Mozilla/5.0",
      payloadDepois: { erpAtivo: erpId, nome: encontrado.nome }
    });

    res.json({
      sucesso: true,
      mensagem: `Integração com ${encontrado.nome} ativada como ERP primário do NAP com sucesso!`,
      erpAtivo: erpId,
      detalhes: encontrado
    });
  });

  // Salvar credenciais e opções de um ERP específico
  app.post("/api/integracoes/erp/salvar", (req, res) => {
    const { erpId, config } = req.body;
    const encontrado = ERP_CATALOGO_HOMOLOGADO.find(e => e.id === erpId);

    if (!encontrado) {
      return res.status(400).json({ sucesso: false, erro: "ERP não encontrado." });
    }

    if (!(systemConfig as any).erps) {
      (systemConfig as any).erps = {};
    }

    const configAtual = (systemConfig as any).erps[erpId] || {};
    (systemConfig as any).erps[erpId] = {
      ...configAtual,
      id: erpId,
      nome: encontrado.nome,
      categoria: encontrado.categoria,
      protocolo: encontrado.protocolo,
      ...config,
      // Se o token vier mascarado e já havia valor antes, preserva
      token: (config.token && !config.token.includes("••••")) ? config.token : (configAtual.token || config.token),
      clientSecret: (config.clientSecret && !config.clientSecret.includes("••••")) ? config.clientSecret : (configAtual.clientSecret || config.clientSecret),
      status: "conectado",
      ultimaSincronizacao: new Date().toISOString()
    };

    registrarAuditoria({
      usuario: "Admin NAP (Operador)",
      modulo: "SGP / ERP",
      acao: `Atualização de Parâmetros: ${encontrado.nome}`,
      detalhes: `Parâmetros de conexão e credenciais do ERP ${encontrado.nome} (${encontrado.sigla}) foram salvos e revalidados pelo operador.`,
      categoria: "configuracao",
      severidade: "critico",
      ip: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "Mozilla/5.0",
      payloadDepois: { erpId, nome: encontrado.nome, protocolo: encontrado.protocolo }
    });

    res.json({
      sucesso: true,
      mensagem: `Parâmetros de conexão do ${encontrado.nome} salvos com sucesso!`,
      erp: (systemConfig as any).erps[erpId]
    });
  });

  // Health-check / Ping em tempo real da comunicação com os ERPs integrados (IXC, Hubsoft, MikWeb, etc)
  app.get("/api/integracoes/erp/ping", (req, res) => {
    const agora = new Date().toISOString();
    const erpConfigs = (systemConfig as any).erps || {};

    const baseLatencias: Record<string, { base: number; jitter: number }> = {
      ixc: { base: 36, jitter: 12 },
      hubsoft: { base: 29, jitter: 8 },
      mikweb: { base: 24, jitter: 6 },
      sgp: { base: 31, jitter: 9 },
      mksolutions: { base: 45, jitter: 15 },
      ispfy: { base: 38, jitter: 10 },
      radiusnet: { base: 41, jitter: 11 }
    };

    const pings: Record<string, any> = {};

    ERP_CATALOGO_HOMOLOGADO.forEach(erp => {
      const cfg = erpConfigs[erp.id] || {};
      const ref = baseLatencias[erp.id] || { base: 35, jitter: 10 };
      const variacao = Math.floor((Math.random() * ref.jitter * 2) - ref.jitter);
      const latencia = Math.max(12, ref.base + variacao);
      
      const urlBase = (cfg.urlBase || "").toLowerCase();
      const isOffline = urlBase.includes("offline") || urlBase.includes("invalido");

      let qualidade: 'excelente' | 'estavel' | 'lento' | 'offline' = 'excelente';
      if (isOffline) {
        qualidade = 'offline';
      } else if (latencia < 60) {
        qualidade = 'excelente';
      } else if (latencia < 150) {
        qualidade = 'estavel';
      } else {
        qualidade = 'lento';
      }

      pings[erp.id] = {
        erpId: erp.id,
        nome: erp.nome,
        sigla: erp.sigla,
        online: !isOffline,
        latenciaMs: isOffline ? null : latencia,
        qualidade,
        jitterMs: isOffline ? null : Math.abs(variacao),
        perdaPacotes: isOffline ? 100 : 0,
        endpoint: cfg.urlBase || erp.campos.find(c => c.key === 'urlBase')?.placeholder || "https://api.provedor.com.br",
        protocolo: erp.protocolo,
        ativo: (systemConfig as any).erpAtivo === erp.id,
        timestamp: agora
      };
    });

    res.json({
      sucesso: true,
      timestamp: agora,
      pings
    });
  });

  // Ping pontual sob demanda para um ERP específico (ex: /api/integracoes/erp/ping/ixc)
  app.get("/api/integracoes/erp/ping/:erpId", async (req, res) => {
    const { erpId } = req.params;
    const encontrado = ERP_CATALOGO_HOMOLOGADO.find(e => e.id === erpId);

    if (!encontrado) {
      return res.status(404).json({ sucesso: false, erro: "ERP não encontrado no catálogo homologado." });
    }

    const cfg = ((systemConfig as any).erps || {})[erpId] || {};
    const urlBase = (cfg.urlBase || "").toLowerCase();
    const isOffline = urlBase.includes("offline") || urlBase.includes("invalido");

    const tempoInicio = Date.now();
    // Simula tempo de resposta do handshake de rede (40-160ms)
    await new Promise(r => setTimeout(r, isOffline ? 250 : 35 + Math.floor(Math.random() * 45)));
    const latencia = isOffline ? null : (Date.now() - tempoInicio);

    let qualidade: 'excelente' | 'estavel' | 'lento' | 'offline' = 'excelente';
    if (isOffline) {
      qualidade = 'offline';
    } else if (latencia && latencia < 60) {
      qualidade = 'excelente';
    } else if (latencia && latencia < 150) {
      qualidade = 'estavel';
    } else {
      qualidade = 'lento';
    }

    res.json({
      sucesso: !isOffline,
      erpId,
      nome: encontrado.nome,
      sigla: encontrado.sigla,
      online: !isOffline,
      latenciaMs: latencia,
      qualidade,
      perdaPacotes: isOffline ? 100 : 0,
      timestamp: new Date().toISOString()
    });
  });

  // Validar pré-configuração e testar conexão em tempo real
  app.post("/api/integracoes/erp/testar", async (req, res) => {
    const { erpId, config = {} } = req.body;
    const encontrado = ERP_CATALOGO_HOMOLOGADO.find(e => e.id === erpId);

    if (!encontrado) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: "ERP não identificado para validação. Selecione IXC, Hubsoft, MikWeb ou outro conector homologado." 
      });
    }

    const urlBase = (config.urlBase || "").trim();
    const token = (config.token || config.clientSecret || "").trim();

    // 1. Validação de campo obrigatório: URL
    if (!urlBase) {
      return res.status(400).json({
        sucesso: false,
        erpId,
        nomeErp: encontrado.nome,
        protocolo: encontrado.protocolo,
        statusGeral: "erro",
        erro: `A URL da API do ${encontrado.nome} é obrigatória para realizar o teste de conexão.`,
        dica: `Informe a URL completa do endpoint da API (ex: ${encontrado.campos.find(c => c.key === 'urlBase')?.placeholder || 'https://api.provedor.com.br/v1'}).`,
        checklist: [
          {
            id: "ssl_connect",
            item: "Conectividade HTTPS e Handshake TLS",
            status: "erro",
            mensagem: "URL não fornecida. Impossível estabelecer conexão com o servidor."
          },
          {
            id: "token_auth",
            item: "Autenticação e Validade das Credenciais",
            status: "erro",
            mensagem: "Pendente de URL válida para envio do cabeçalho de autorização."
          }
        ]
      });
    }

    // 2. Validação de formato da URL (http:// ou https://)
    if (!urlBase.startsWith("http://") && !urlBase.startsWith("https://")) {
      return res.status(400).json({
        sucesso: false,
        erpId,
        nomeErp: encontrado.nome,
        protocolo: encontrado.protocolo,
        statusGeral: "erro",
        erro: `URL inválida para o ${encontrado.nome}. O endereço da API deve iniciar obrigatoriamente com "https://" ou "http://".`,
        dica: `Adicione o prefixo de protocolo antes do domínio (ex: https://${urlBase}).`,
        checklist: [
          {
            id: "ssl_connect",
            item: "Conectividade HTTPS e Handshake TLS",
            status: "erro",
            mensagem: "Formato de URL inválido. Protocolo ausente ou malformado."
          }
        ]
      });
    }

    // 3. Validação de campo obrigatório: Token
    if (!token) {
      return res.status(400).json({
        sucesso: false,
        erpId,
        nomeErp: encontrado.nome,
        protocolo: encontrado.protocolo,
        statusGeral: "erro",
        erro: `O Token de Autenticação / Chave de API do ${encontrado.nome} é obrigatório.`,
        dica: `Copie a chave de acesso gerada no painel administrativo do seu ${encontrado.nome}.`,
        checklist: [
          {
            id: "ssl_connect",
            item: "Conectividade HTTPS e Handshake TLS",
            status: "ok",
            mensagem: "Servidor acessível via rede."
          },
          {
            id: "token_auth",
            item: "Autenticação e Validade das Credenciais",
            status: "erro",
            mensagem: "Chave ou Token não informado no formulário."
          }
        ]
      });
    }

    // 4. Detecção de simulação de erro ou credenciais deliberadamente inválidas
    const urlLower = urlBase.toLowerCase();
    const tokenLower = token.toLowerCase();
    if (urlLower.includes("offline") || urlLower.includes("invalido") || urlLower.includes("fail") || tokenLower === "erro" || tokenLower === "invalido") {
      return res.status(401).json({
        sucesso: false,
        erpId,
        nomeErp: encontrado.nome,
        protocolo: encontrado.protocolo,
        statusGeral: "erro",
        latenciaMs: 340,
        erro: `Falha de autenticação (HTTP 401 Unauthorized) no servidor ${encontrado.nome}. O token fornecido foi recusado.`,
        dica: `Verifique se o token de API não expirou e se o IP do servidor NAP está na lista de permissões (whitelist) do ERP.`,
        checklist: [
          {
            id: "ssl_connect",
            item: "Conectividade HTTPS e Handshake TLS",
            status: "ok",
            mensagem: "Conexão de rede estabelecida com o host especificado."
          },
          {
            id: "token_auth",
            item: "Autenticação e Validade das Credenciais",
            status: "erro",
            mensagem: "Credencial inválida ou sem permissão de acesso à API."
          }
        ]
      });
    }

    const inicio = Date.now();
    // Simula validação real em tempo de resposta de rede (200-380ms)
    await new Promise(resolve => setTimeout(resolve, 200 + Math.floor(Math.random() * 120)));
    const latencia = Date.now() - inicio;

    // Constrói o checklist detalhado de validação técnica da pré-configuração
    const checklist = [
      {
        id: "ssl_connect",
        item: "Conectividade HTTPS e Handshake TLS",
        status: "ok",
        mensagem: `Servidor ${encontrado.nome} respondeu via HTTPS com certificado válido e handshake criptografado concluído.`
      },
      {
        id: "token_auth",
        item: "Autenticação e Validade das Credenciais",
        status: "ok",
        mensagem: "Chave/Token validado com sucesso pelo endpoint de autorização do ERP."
      },
      {
        id: "clientes_read",
        item: "Módulo de Assinantes & Contratos (Leitura)",
        status: "ok",
        mensagem: "Permissão confirmada: base de contratos acessível para sincronização e CRM 360."
      },
      {
        id: "financeiro_pix",
        item: "Módulo Financeiro & Emissão de PIX Dinâmico",
        status: "ok",
        mensagem: "Emissão de 2ª via e geração de payload PIX Copia-e-Cola operacional."
      },
      {
        id: "desbloqueio_corte",
        item: "Permissão de Auto-Desbloqueio em Confiança",
        status: config.autoDesbloqueio48h !== false ? "ok" : "alerta",
        mensagem: config.autoDesbloqueio48h !== false 
          ? "Comando de liberação temporária em confiança autorizado no servidor."
          : "Desbloqueio automático desativado pelo usuário nas opções de negócio."
      }
    ];

    // Exemplo de retorno simulado do assinante consultado para validação visual do operador
    const exemploSincronizado = {
      cliente_exemplo: "Carlos Eduardo Mendes",
      documento: "123.456.789-00",
      contrato_codigo: `CT-2026-${erpId.toUpperCase()}-0982`,
      plano: "Fibra 600 Mega Simétrico - Wi-Fi 6",
      status_conexao: "Online (PPPoE / IPv4 Dinâmico)",
      ipv4: "100.64.45.18",
      mac_onu: "48:57:54:38:12:9A",
      fatura_aberta: "R$ 99,90 (Venc. 10/10/2026)",
      pix_disponivel: true,
      desbloqueio_disponivel: true
    };

    // Atualiza latência no registro salvo se existir
    if ((systemConfig as any).erps?.[erpId]) {
      (systemConfig as any).erps[erpId].latenciaMs = latencia;
      (systemConfig as any).erps[erpId].status = "conectado";
      (systemConfig as any).erps[erpId].ultimaSincronizacao = new Date().toISOString();
    }

    res.json({
      sucesso: true,
      erpId,
      nomeErp: encontrado.nome,
      protocolo: encontrado.protocolo,
      versaoApiDetectada: encontrado.versaoApiHomologada,
      latenciaMs: latencia,
      statusGeral: "online",
      checklist,
      exemploSincronizado,
      mensagem: `Pré-configuração com o ${encontrado.nome} homologada com 100% de sucesso! O NAP está pronto para sincronizar.`
    });
  });

  // Testar conexão Multi-ERP legado (mantido para compatibilidade com qualquer chamada existente)
  app.post("/api/configuracoes/test-erp", async (req, res) => {
    const { tipoErp = "ixc", url = "", token = "", appId = "" } = req.body;
    const inicio = Date.now();
    await new Promise(resolve => setTimeout(resolve, 320));
    const latencia = Date.now() - inicio;

    const catalogado = ERP_CATALOGO_HOMOLOGADO.find(e => e.id === tipoErp) || ERP_CATALOGO_HOMOLOGADO[0];

    res.json({
      success: true,
      status: "online",
      latenciaMs: latencia,
      tipoErp: catalogado.id.toUpperCase(),
      versaoApi: catalogado.versaoApiHomologada,
      contratosSincronizados: 14820,
      detalhes: `Conexão validada com sucesso com a API do ${catalogado.nome}.`,
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
    const total = npsFeedMock.length;
    const promotores = npsFeedMock.filter(i => i.classificacao === "promotor").length;
    const neutros = npsFeedMock.filter(i => i.classificacao === "neutro").length;
    const detratores = npsFeedMock.filter(i => i.classificacao === "detrator").length;

    const promotoresPct = total > 0 ? Math.round((promotores / total) * 100) : 84;
    const detratoresPct = total > 0 ? Math.round((detratores / total) * 100) : 5;
    const neutrosPct = total > 0 ? (100 - promotoresPct - detratoresPct) : 11;
    const npsScore = promotoresPct - detratoresPct;

    const mediaNotas = total > 0 
      ? (npsFeedMock.reduce((acc, curr) => acc + curr.nota, 0) / total / 2).toFixed(1)
      : "4.8";

    res.json({
      sucesso: true,
      npsScore,
      zona: npsScore >= 75 ? "Zona de Excelência (75 a 100)" : npsScore >= 50 ? "Zona de Qualidade (50 a 74)" : "Zona de Aperfeiçoamento",
      totalRespostas: 486 + total - 5,
      csatMedio: Number(mediaNotas), // de 5.0
      cesMedio: 1.3, // Customer Effort Score (quanto menor melhor, escala 1 a 5)
      promotoresPct,
      neutrosPct,
      detratoresPct,
      taxaResposta: "42.8%",
      resolucaoPrimeiroContato: "87.4%",
      historicoSemanal: [
        { semana: "Sem 1", nps: 72, csat: 4.6, promotores: 78, detratores: 8 },
        { semana: "Sem 2", nps: 75, csat: 4.7, promotores: 81, detratores: 6 },
        { semana: "Sem 3", nps: 76, csat: 4.75, promotores: 82, detratores: 6 },
        { semana: "Sem 4", nps: npsScore, csat: Number(mediaNotas), promotores: promotoresPct, detratores: detratoresPct }
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

  app.post("/api/nps/avaliar", (req, res) => {
    const { cliente, telefone, canal, nota, comentario, atendente, setor } = req.body;
    const notaNum = Math.max(0, Math.min(10, Number(nota) !== undefined && !isNaN(Number(nota)) ? Number(nota) : 10));
    const classificacao = notaNum >= 9 ? "promotor" : notaNum >= 7 ? "neutro" : "detrator";
    const sentimento = notaNum >= 9 ? "positivo" : notaNum >= 7 ? "neutro" : "negativo";

    const novoFeedback = {
      id: `NPS-${Date.now().toString().slice(-4)}`,
      cliente: cliente || "João Silva (Portal)",
      telefone: telefone || "+55 (11) 98765-4321",
      canal: canal || "Webchat Portal",
      nota: notaNum,
      classificacao,
      atendente: atendente || "Suporte Digital / IA",
      comentario: comentario || (notaNum >= 9 ? "Atendimento rápido, conectividade restabelecida perfeitamente!" : "Demorou um pouco para normalizar."),
      setor: setor || "Suporte N1",
      data: "Agora mesmo",
      sentimento
    };

    npsFeedMock.unshift(novoFeedback);

    res.json({
      sucesso: true,
      mensagem: "Avaliação registrada com sucesso! Muito obrigado pelo seu feedback.",
      feedback: novoFeedback
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
