# 📘 PRD - NAP (Núcleo de Atendimento ao Provedor)

**Versão:** 2.0 (Final)  
**Data:** 09/09/2026  
**Status:** Em Desenvolvimento 

## 1. Visão Geral do Produto

O **NAP** é uma plataforma omnichannel de atendimento com IA híbrida, projetada especificamente para **provedores de internet (ISPs)**. Ela atua como uma camada inteligente de atendimento que se integra ao sistema core de gestão (SGP) do provedor, mantendo soberania sobre os dados cadastrais dos clientes.

## 2. Princípios de Design e Proposta de Valor
- **Reduzir 70%** dos chamados repetitivos via IA (9router).
- Unificar atendimento (WhatsApp, Webchat, Telefonia) em um **Inbox Omnichannel**.
- Garantir **soberania de dados** (NAP tem banco próprio PostgreSQL).
- Autoatendimento via **PWA** do Cliente.

## 3. Arquitetura
- **Stack:** React, Next.js/Vite, Tailwind, Express, PostgreSQL, Redis.
- **Gateway de IA (9router):** Camada de abstração que unifica requisições à IA (Gemini/OpenAI) com rate limiting e fallback automático.
- **Sincronização:** SGP atua como fonte da verdade financeira; o banco do NAP (`schema.sql`) armazena contatos, logs, conversas e deals do Kanban.

## 4. Módulos do Sistema
1. **Super Admin:** Configuração global, logs de IA e integração.
2. **Admin (Supervisor):** Gestão da equipe, relatórios, intervenção em conversas.
3. **Operador:** Inbox unificado com sugestões IA (RAG), Click-to-Call, Kanban de Vendas/Suporte.
4. **Cliente (PWA):** Dashboard responsivo com geração de PIX, abertura de chamados e histórico.

## 5. IA Híbrida - Regras
- **Suporte:** IA resolve até 80%. Transborda em problemas físicos ou reclamações severas (Sentimento).
- **Vendas:** IA qualifica e encaminha o Lead para o Kanban de Vendas.
- **Cobrança:** IA age empaticamente sugerindo métodos de pagamento. 

## 6. Modelo de Banco de Dados (`schema.sql`)
Tabelas centrais estruturadas em PostgreSQL:
- `operadores`
- `contatos`
- `conversas` e `mensagens`
- `deals` e `pipelines` (Kanban)
- `configuracoes`

## 7. Roadmap Base
- [x] **Fase 1:** Base e Integração Express (Servidor).
- [x] **Fase 2:** Módulos Operador e Admin (CRM, Inbox, Kanban).
- [x] **Fase 3:** Portal do Cliente PWA.
- [x] **Fase 4:** Integração Backend de IA Híbrida via Gateway (9router).
- [ ] **Fases Subsequentes:** Testes End-to-End, Sincronização Real Webhooks, Deploy e Setup Scripts (`install.sh`).
