const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importBlock = `
import { db } from "./src/db";
import { users } from "./src/db/schema";
import { eq } from "drizzle-orm";
`;

code = code.replace('import cors from "cors";', 'import cors from "cors";' + importBlock);

const loginBlock = `
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
      console.error("DB Login error:", error);
      res.status(500).json({ error: "Database offline ou erro interno." });
    }
  });
`;

code = code.replace('app.post("/api/deals"', loginBlock + '\n  app.post("/api/deals"');

fs.writeFileSync('server.ts', code);
