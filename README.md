# 📘 NAP (Núcleo de Atendimento ao Provedor) - WACRM

**Versão:** 2.0 (Em Desenvolvimento - AI Studio)
**Stack:** React 19, Vite, Tailwind CSS v4, Node.js (Express), TypeScript

O **NAP** é uma plataforma omnichannel de atendimento com IA híbrida, projetada especificamente para **provedores de internet (ISPs)**. Atua como uma camada inteligente de atendimento que se integra ao sistema core de gestão (SGP) do provedor.

## 🚀 Status Atual da Implementação

As seguintes fases do PRD foram implementadas estruturalmente no ambiente atual:

- ✅ **Fase 1: Base Full-Stack** 
  - Servidor Express em Node.js (`server.ts`) servindo APIs e middleware do Vite.
  - Banco de Dados modelado (`src/db/schema.sql`) com políticas de soberania de dados do provedor.
- ✅ **Fase 2: Módulos Operador + Admin**
  - **Inbox Unificado:** Interface de chat para os operadores, preparada para receber mensagens via Webchat/WhatsApp.
  - **CRM:** Tabela de clientes mockada e preparada para sincronização via SGP.
  - **Kanban (Suporte e Vendas):** Pipelines visuais e interativos (Drag & Drop em potencial) para tickets e leads.
  - **Super Admin:** Dashboard para gerir integrações (SGP, FreePBX, Meta) e tunar prompts da IA (9router).
- ✅ **Fase 3: Portal do Cliente (PWA)**
  - Interface separada (Mobile-first) focada no cliente final (Autoatendimento).
  - Módulos: Dashboard (Status da Conexão), Faturas (Emissão de PIX/Boleto), Suporte (Meus Chamados), Conta (Dados).
- ✅ **Fase 4: Integração de IA Híbrida (9router)**
  - Abstração Server-Side configurada no Express (`/api/ia/chat`) usando o SDK `@google/genai` (Gemini API) como motor backend de RAG para sugerir respostas baseadas na vertical (Suporte, Cobrança, Vendas).

## 🗺️ Estrutura de Rotas (URLs)

O sistema possui dois ambientes (roteamentos) principais:

### 1. Painel Administrativo / Operador (Root `/`)
- `/` - Inbox Unificado (Atendimento)
- `/suporte` - Kanban de Suporte Técnico
- `/vendas` - Kanban de Vendas
- `/crm` - Base de Clientes (Sincronizada com SGP)
- `/configuracoes` - Painel Super Admin (Tuning de IA, Integrações)

### 2. Portal do Cliente PWA (`/portal`)
- `/portal` - Dashboard do Cliente (Status da conexão, faturas pendentes)
- `/portal/faturas` - Histórico financeiro e 2ª via (PIX/Boleto)
- `/portal/suporte` - Histórico de chamados abertos
- `/portal/conta` - Gestão de dados pessoais e de acesso

## 🏗️ Estrutura de Diretórios Principal

```
/
├── server.ts                 # Ponto de entrada do Servidor Node.js/Express (Full-stack)
├── package.json              # Configuração de scripts e dependências (inclui Vite + esbuild)
├── /src
│   ├── App.tsx               # Roteador Principal (React Router)
│   ├── main.tsx              # Ponto de entrada do React
│   ├── types.ts              # Tipagens globais de TypeScript (Interfaces de Domínio)
│   ├── /components           # Componentes reutilizáveis (ex: Layout do Admin, PortalLayout)
│   ├── /pages                # Views da aplicação (Inbox, CRM, Kanban, Portal)
│   └── /db
│       └── schema.sql        # Esquema do Banco de Dados Relacional (PostgreSQL)
```

## 📜 Comandos Disponíveis (Scripts)

- `npm run dev` - Roda o servidor Node.js com o middleware do Vite para HMR (Hot-Module-Replacement).
- `npm run build` - Faz o build de produção do frontend (Vite) e faz o bundle do backend via `esbuild` gerando `dist/server.cjs`.
- `npm start` - Inicializa o projeto empacotado para produção rodando o arquivo gerado em `dist/`.

## 🔒 Variáveis de Ambiente Necessárias (`.env`)

- `GEMINI_API_KEY`: Necessária para rodar as sugestões de IA integradas via abstração do 9router.
- `APP_URL`: URL onde o applet é hospedado.

---
*Documentação atualizada pelo Dev Sênior AI (Gemini) com base no PRD v2.0.*
