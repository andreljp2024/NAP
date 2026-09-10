# NAP - Núcleo de Atendimento ao Provedor

Uma plataforma Full-Stack de CRM e Omnichannel desenvolvida sob medida para **Provedores de Internet (ISP)**. Foco absoluto em centralização de suporte, faturamento, operações de campo NOC/CPE e agilidade extrema no Atendimento N1.

*(Nota: O aplicativo foi desenhado para ser full-stack e seguro. Todas as chaves e requisições para LLMs, ERP e Asterisk devem ser efetuadas via API Server-Side, o sistema aciona automaticamente uma **Mock Session** local (Spoofing) para não bloquear a experiência do desenvolvedor/operador).*

## 📄 Documentação Oficial
- 📖 [PRD - Requisitos e Arquitetura do Produto](./PRD.md)
- 🚀 [Manual de Deploy em Produção](./MANUAL_DEPLOY.md)

## 📡 Roteamento Principal
- `/` - Landing Page de Aquisição (Para novos clientes contratarem planos, com seletor flutuante de temas)
- `/login` - Tela de autenticação unificada
- `/admin` - Painel Operacional SaaS (Exclusivo para o time do Provedor - Dashboards, CRM, SGP, URA)
- `/portal` - Área do Assinante PWA (Visão do cliente: 2ª via, Pix, Suporte, Webphone)

## 💡 Princípios de Design (Regras de Ouro)
1. **Sem interfaces clichês ("AI Slop"):** Nada de bordas brilhantes excessivas ou textos ilegíveis.
2. **Contraste Máximo:** Textos sobre fundos escuros (`#0b0f19`) utilizam tons opacos refinados e padding calculado. O PWA de clientes usa um tema claro acessível.
3. **Segurança Full-Stack:** Todas as integrações externas (Gemini, ERP, VoIP, etc.) são roteadas obrigatoriamente pelo `server.ts`, mantendo as chaves privadas totalmente ocultas do navegador (Client-Side).

## 🧱 Arquitetura e Módulos Entregues

### Banco de Dados: Integração e Modelagem Base (Drizzle ORM)
O backend Node.js (`server.ts`) agora está pronto para conversar com o banco PostgreSQL. 
- Foi adicionado e configurado o **Drizzle ORM** (`drizzle-orm` e `drizzle-kit`).
- Os schemas primários (Usuários, Clientes, Atendimentos, Faturas, Conversas, Mensagens) foram mapeados em `/src/db/schema.ts` para espelhar as regras de negócio de telecom.
- Os comandos de migração (`npm run db:generate` e `npm run db:push`) estão disponíveis para atualizar as tabelas.
- O sistema possui **Mock Fallback**: Se o banco de dados Postgres estiver offline (como ocorre no ambiente web), o backend intercepta a falha de conexão e ativa o fallback de "Mock" transparente em memória para não travar a UI.

### Kanban e Atendimentos (CRM 360)
- O módulo de Kanban (Painéis de Suporte, Vendas e Cobrança) lê e grava os cards (`atendimentos`) diretamente na base via PostgreSQL.
- O endpoint `/api/deals` (GET, POST, PATCH) gerencia todo o ciclo de vida.

### Sincronização Automática SGP (ERP) -> PostgreSQL
A fim de preencher as tabelas locais (e permitir a identificação de clientes no WhatsApp no futuro), foi construído um fluxo de espelhamento do ERP.
- **Webhook de Sync:** Foi configurado o endpoint `/api/webhooks/n8n/sgp-sync` para receber os eventos (criação, edição, bloqueio de clientes) do SGP, via *n8n* ou *diretamente*, executando o `UPSERT` de clientes na nossa base.
- **Leitura Híbrida (Contatos):** A rota `/api/contatos` prioriza leitura do PostgreSQL local. Se falhar, busca na API do ERP. Se a API estiver fora, lê do cache em memória.

### WhatsApp Cloud API (WABA) & Copiloto Gemini
- Foi configurado o webhook `/api/webhooks/waba/incoming` para receber os eventos oficiais de mensagens da API da Meta.
- **Triagem IA**: Quando uma mensagem entra na `fila = triagem_ia`, o backend intercepta, cruza os dados com o SGP (status do cliente, telemetria da ONU via GenieACS) e gera automaticamente o texto de resposta através da API nativa do Gemini 2.5 (`@google/genai`).
- A API `/api/conversas` expõe esses chats em formato unificado para o nosso layout Omnichannel.

### Hierarquia de Acesso (RBAC) e PWA
- O sistema conta com restrição de visibilidade para os 4 papéis base (`admin`, `operador`, `tecnico_noc`, `tecnico_campo`).
- Portal do cliente protegido por Login/Token (CPF do SGP).
