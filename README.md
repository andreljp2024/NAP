# NAP - Núcleo de Atendimento ao Provedor

Uma plataforma Omnichannel Premium voltada para Provedores de Internet (ISPs), integrando atendimento, inteligência artificial e gestão em uma única interface escura (SaaS Dark Theme).

## Arquitetura e Ecossistema (Isolamento por VM)

O projeto tem como proposta ser um ecossistema de atendimento que rodará de forma isolada e independente para cada provedor (Tenant) em sua própria infraestrutura (VPS/VM). A stack arquitetural validada inclui:
- **SO:** Debian 12
- **Telefonia:** FreePBX 17
- **IA de Voz:** AVA Asterisk (AI Voice Agent)
- **CRM WhatsApp:** WABA Integrado (Cloud API Oficial)
- **Gerência de CPEs:** GenieACS (TR-069)
- **Faturamento/ERP:** Integração nativa com SGP

## Módulos Principais

### 1. Painel do Operador (Admin/Backoffice)
Acessível via rotas padrão (`/`, `/crm`, `/suporte`, `/configuracoes`).

- **Login Simplificado (Firebase Spoofing):** Acesso realizado por "Usuário" (ex: `admin`, `suporte`), onde o sistema converte automaticamente para contas internas (ex: `@nap.local`) preservando a segurança do Firebase Authentication sem exigir a digitação de e-mails complexos pelos operadores.
- **Inbox Unificado:** Centraliza mensagens de WhatsApp (WABA), Webchat e outras fontes. Integra-se diretamente com a IA, gerando sugestões de resposta automáticas com base no histórico do cliente. Inclui suporte nativo para atalhos de disparo (Templates HSM) e anexos da API do WhatsApp.
- **CRM (Customer 360):** Tabela de clientes com busca inteligente. Ao clicar em um cliente, uma ficha lateral (*Slide-over*) exibe um painel 360° com histórico financeiro (SGP) e um histórico de ligações do PABX (FreePBX/Asterisk).
- **GenieACS (TR-069):** Dashboard de telemetria e gestão de CPEs em tempo real. Monitora Roteadores e ONUs, exibindo KPIs (Online/Offline), nível de sinal óptico (dBm) e qualidade de transmissão (SNR).
- **Kanban (Suporte e Vendas):** Gestão visual de chamados e leads utilizando interface de arrastar-e-soltar.
- **Ativo (Campanhas):** Módulo para disparo preditivo de Voz (Discador Asterisk) e réguas de WhatsApp baseadas em inteligência da fatura.
- **Motor Visual de Fluxos (n8n):** Interface na rota `/automacoes` que simula um canvas *node-based* do n8n para desenhar e espelhar o roteamento de webhooks e transbordo (WABA -> Agente IA -> SGP -> FreePBX).
- **Gestão de Operadores:** Módulo completo (rota `/operadores`) para criação de atendentes, com mapeamento de ramal SIP, nível de acesso, e controle Omnichannel de filas/skills.
- **CTI Reverso & Webphone:** Integração SIP (WebRTC) e painel flutuante que salta na tela via Server-Sent Events (SSE) do `server.ts` quando ocorre um *ring* no Asterisk.
- **Super Admin (White-Label):** Tela global de configurações.

### 2. Portal do Cliente (PWA)
Acessível via rota `/portal`. 
Focado na experiência Mobile-first (Progressive Web App com suporte a Notificações Push).

- **Webchat com Fila de Atendimento:** Permite contato direto com a tela do operador, caindo em uma fila após informar o tipo de atendimento desejado.
- **Webphone (Voz Direta - WebRTC):** Permite ligação de voz direta entre o cliente e o operador do NAP através do navegador, sem custo de telefonia tradicional, usando infraestrutura VoIP interna.
- **Faturas e Boletos:** Integração com SGP para 2ª via e Pix.
- **Auto-diagnóstico:** Integração transparente com GenieACS para validar conexão do roteador antes de abrir chamado.

## Integrações (server.ts)
O backend (`server.ts`) atua como proxy vital para manter credenciais seguras:
- `/api/ia/chat`: Rota do **9router**, utilizando SDK Gemini (`@google/genai`) para RAG simulado.
- `/api/sgp/*`: Rotas que integram nativamente via HTTP Headers o Sistema de Gestão de Provedores (SGP).
- `/api/webhooks/*`: Recebe os eventos de ligações (FreePBX) e mensagens de WhatsApp (Meta Graph API / n8n), distribuindo para o frontend via `SSE`.

## Como Testar
1. **CTI:** Em "Painel Super Admin", clique em "Simular Chamada FreePBX".
2. **Autoatendimento:** Acesse `/portal` e interaja com o chatbot flutuante azul.
3. **White-label:** No "Painel Super Admin", modifique os dados em "Identidade Visual e Dados do Provedor" para validar os formulários que sustentam a regra multi-tenant física.
