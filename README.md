# NAP - Núcleo de Atendimento ao Provedor

Uma plataforma Omnichannel Premium voltada para Provedores de Internet (ISPs), integrando atendimento, inteligência artificial e gestão em uma única interface escura (SaaS Dark Theme).

## Arquitetura do Sistema

A aplicação foi construída utilizando uma arquitetura Full-Stack:
- **Frontend:** React 18 com Vite, roteamento via `react-router-dom` e estilização estrutural utilizando Tailwind CSS.
- **Backend (API):** Servidor Node.js com Express (`server.ts`) embutido no processo de build, responsável por expor as rotas de API, gerenciar integrações simuladas/reais e servir os artefatos do frontend.
- **Design System:** Baseado no estilo "Premium SaaS Dark Theme", com cores focadas em tons profundos de azul/ardósia (`#0b0f19`) e destaques luminosos em Índigo e Esmeralda.

## Módulos Principais

### 1. Painel do Operador (Admin/Backoffice)
Acessível via rotas padrão (`/`, `/crm`, `/suporte`, `/configuracoes`).

- **Inbox Unificado:** Centraliza mensagens de WhatsApp (WABA), Webchat e outras fontes. Integra-se diretamente com a IA, gerando sugestões de resposta automáticas com base no histórico do cliente. Inclui suporte nativo para atalhos de disparo (Templates HSM) e anexos da API do WhatsApp.
- **CRM (Customer 360):** Tabela de clientes com busca inteligente. Ao clicar em um cliente, uma ficha lateral (*Slide-over*) exibe um painel 360° com histórico financeiro (SGP) e um histórico de ligações do PABX (FreePBX/Asterisk).
- **Kanban (Suporte e Vendas):** Gestão visual de chamados e leads utilizando interface de arrastar-e-soltar.
- **Ativo (Campanhas):** Módulo para disparo preditivo de Voz (Discador Asterisk) e réguas de WhatsApp baseadas em inteligência da fatura.
- **Motor Visual de Fluxos (n8n):** Interface na rota `/automacoes` que simula um canvas *node-based* do n8n para desenhar e espelhar o roteamento de webhooks e transbordo (WABA -> Agente IA -> SGP -> FreePBX).
- **Gestão de Operadores:** Módulo completo (rota `/operadores`) para criação de atendentes, com mapeamento de ramal SIP, nível de acesso, e controle Omnichannel de filas/skills.
- **CTI Reverso & Webphone:** Integração SIP (WebRTC) e painel flutuante que salta na tela via Server-Sent Events (SSE) do `server.ts` quando ocorre um *ring* no Asterisk.
- **Super Admin (White-Label):** Tela global de configurações. Habilita o "Isolamento de Tenant" permitindo a configuração do Nome do Provedor, Logotipo e Cores (White-label), bem como a configuração das Credenciais Oficiais do WhatsApp, tokens do SGP, e *Tuning* detalhado do Gateway 9router/Gemini.

### 2. Portal do Cliente (PWA)
Acessível via rota `/portal`.
- Interface otimizada para dispositivos móveis (Mobile-First) com navegação nativa inferior.
- Permite a visualização e resgate de Faturas, boletos, e códigos PIX Cópia-e-Cola.
- **Webchat Widget (IA):** Chat flutuante integrado nativamente com Inteligência Artificial para autoatendimento técnico.

## Integrações (server.ts)
O backend (`server.ts`) atua como proxy vital para manter credenciais seguras:
- `/api/ia/chat`: Rota do **9router**, utilizando SDK Gemini (`@google/genai`) para RAG simulado.
- `/api/sgp/*`: Rotas que integram nativamente via HTTP Headers o Sistema de Gestão de Provedores (SGP).
- `/api/webhooks/*`: Recebe os eventos de ligações (FreePBX) e mensagens de WhatsApp (Meta Graph API / n8n), distribuindo para o frontend via `SSE`.

## Como Testar
1. **CTI:** Em "Painel Super Admin", clique em "Simular Chamada FreePBX".
2. **Autoatendimento:** Acesse `/portal` e interaja com o chatbot flutuante azul.
3. **White-label:** No "Painel Super Admin", modifique os dados em "Identidade Visual e Dados do Provedor" para validar os formulários que sustentam a regra multi-tenant física.
