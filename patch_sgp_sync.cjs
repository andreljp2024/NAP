const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importReplacement = `
import { db } from "./src/db";
import { users, atendimentos, clientes, faturas } from "./src/db/schema";
import { eq, desc } from "drizzle-orm";
`;
code = code.replace(/import { db } from "\.\/src\/db";\nimport { users, atendimentos } from "\.\/src\/db\/schema";\nimport { eq, desc } from "drizzle-orm";/, importReplacement);
// if it fails to replace via regex (due to spacing), let's just do a string replacement
if(!code.includes("clientes, faturas")) {
  code = code.replace('import { atendimentos } from "./src/db/schema";', 'import { atendimentos, clientes, faturas } from "./src/db/schema";');
}

// 1. Rewrite app.get("/api/contatos")
const newContatos = `
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
`;

// Simple regex replace for the contatos endpoint
const contatosRegex = /app\.get\("\/api\/contatos"[\s\S]*?res\.json\(\{[\s\S]*?\}\)\);[\s\S]*?\}\)\);/;
// Actually, let's just do a clean targeted replacement.
// Find the exact block.
const contatosStart = code.indexOf('app.get("/api/contatos"');
let contatosEnd = code.indexOf('app.get("/api/sgp/faturas"');
if(contatosEnd === -1) {
    contatosEnd = code.indexOf('app.get("/api/sgp/ura/cliente"');
}
if(contatosStart > -1 && contatosEnd > -1) {
    const before = code.substring(0, contatosStart);
    // Find the end of the /api/contatos block precisely by looking for the last '  });\n\n' before contatosEnd
    let blockEnd = code.lastIndexOf('  });', contatosEnd) + 5;
    const after = code.substring(blockEnd);
    code = before + newContatos + '\n\n' + after;
}

// 2. Rewrite Webhook SGP-Sync
const syncWebhook = `
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
`;

const syncStart = code.indexOf('app.post("/api/webhooks/n8n/sgp-sync"');
const syncEnd = code.indexOf('app.post("/api/push/subscribe"');
if(syncStart > -1 && syncEnd > -1) {
    const before = code.substring(0, syncStart);
    let blockEnd = code.lastIndexOf('  });', syncEnd) + 5;
    const after = code.substring(blockEnd);
    code = before + syncWebhook + '\n\n' + after;
}

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with SGP DB Sync.");
