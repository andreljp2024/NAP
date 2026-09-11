# NAP - Núcleo de Atendimento ao Provedor

Uma plataforma Full-Stack de CRM e Omnichannel desenvolvida sob medida para **Provedores de Internet (ISP)**. Foco absoluto em centralização de suporte, faturamento, operações de campo NOC/CPE e agilidade extrema no Atendimento N1.

*(Nota: O aplicativo foi desenhado para ser full-stack e seguro. Todas as chaves e requisições para LLMs, ERP e Asterisk devem ser efetuadas via API Server-Side, o sistema aciona automaticamente uma **Mock Session** local (Spoofing) para não bloquear a experiência do desenvolvedor/operador).*

## 📄 Documentação Oficial
- 📱 [Guia de Compilação APK (Android)](./PWA_TO_APK.md)
- 📖 [PRD - Requisitos e Arquitetura do Produto](./PRD.md)
- 🚀 [Manual de Deploy em Produção](./MANUAL_DEPLOY.md)

## 📡 Roteamento Principal
- `/` - Landing Page de Aquisição (Para novos clientes contratarem planos, com seletor flutuante de temas)
- `/login` - Tela de autenticação unificada (com suporte a Mock Session para desenvolvimento)
- `/admin` - Painel Operacional SaaS (SuperAdmin com visão de KPIs, configurações gerais e Disaster Recovery)
- `/admin/analytics` - Painel de BI & Analytics com métricas operacionais, TMR e dados em tempo real
- `/admin/campo` - PWA Mobile-First do Técnico de Campo (Ordens de Serviço, GPS, Diagnóstico Óptico, Foto e Assinatura)
- `/portal` - Área do Assinante PWA (Visão do cliente: 2ª via, Pix, Suporte, Webphone e Webchat IA)

## 💡 Princípios de Design (Regras de Ouro)
1. **Sem interfaces clichês ("AI Slop"):** Nada de gradientes purpúreos arbitrários, bordas brilhantes excessivas ou textos ilegíveis.
2. **Contraste Máximo:** Textos sobre fundos escuros (`#0b0f19`) utilizam tons opacos refinados e padding calculado. O PWA de clientes usa um tema claro acessível.
3. **Segurança Full-Stack:** Todas as integrações externas (Gemini, ERP, VoIP, etc.) são roteadas obrigatoriamente pelo `server.ts`, mantendo as chaves privadas totalmente ocultas do navegador (Client-Side).

## 🧱 Arquitetura e Módulos Entregues

### Banco de Dados: Integração e Modelagem Base (Drizzle ORM)
O backend Node.js (`server.ts`) opera com PostgreSQL e Drizzle ORM:
- **Drizzle ORM** (`drizzle-orm` e `drizzle-kit`) configurado.
- Os schemas primários (Usuários, Clientes, Atendimentos, Faturas, Conversas, Mensagens) foram mapeados em `/src/db/schema.ts` para espelhar as regras de negócio de telecom.
- Comandos de migração (`npm run db:generate` e `npm run db:push`) disponíveis.
- **Mock Fallback Resiliente:** Se o banco de dados Postgres estiver offline ou em ambiente de desenvolvimento isolado, o backend intercepta a conexão e ativa o fallback de "Mock" transparente em memória para não travar a aplicação.

### Kanban e Atendimentos (CRM 360)
- Módulo de Kanban (Painéis de Suporte, Vendas e Cobrança) lê e grava os cards (`atendimentos`) diretamente na base via PostgreSQL.
- O endpoint `/api/deals` (GET, POST, PATCH) gerencia todo o ciclo de vida dos atendimentos.

### Sincronização Automática SGP (ERP) -> PostgreSQL
- **Webhook de Sync:** Endpoint `/api/webhooks/n8n/sgp-sync` para receber os eventos (criação, edição, bloqueio de clientes) do SGP via *n8n* ou diretamente, executando o `UPSERT` de clientes na base local.
- **Leitura Híbrida (Contatos):** Rota `/api/contatos` prioriza leitura do PostgreSQL local. Se indisponível, busca na API do ERP; em último caso, lê do cache em memória.

### WhatsApp Cloud API (WABA) & Copiloto Gemini
- Webhook `/api/webhooks/waba/incoming` para receber os eventos oficiais de mensagens da API da Meta.
- **Triagem IA**: Quando uma mensagem entra na `fila = triagem_ia`, o backend intercepta, cruza os dados com o SGP (status do cliente, telemetria da ONU via GenieACS) e gera automaticamente o texto de resposta através da API nativa do Gemini 2.5 (`@google/genai`).
- A API `/api/conversas` expõe esses chats em formato unificado para o layout Omnichannel com filtros por status e atendente.

### PWA do Cliente & Webchat IA (Omnichannel)
- **Webchat IA** diretamente no Portal do Assinante (`/portal/suporte`).
- Rota segura `/api/webchat/send`, onde o backend Node.js compõe o prompt validando o status da conexão da ONU (GenieACS) antes de repassar ao **Gemini 2.5 Flash**.
- **Unificação Omnichannel:** As conversas originadas no Webchat são inseridas no mesmo schema de banco de dados do WABA (`conversas` e `mensagens`), permitindo que o operador atenda clientes do Portal e do WhatsApp na mesma fila.

### PWA do Técnico de Campo (`/admin/campo`) & Telemetria GPS
- **Mobile-First Responsivo:** Interface otimizada para smartphones e tablets de técnicos em campo.
- **Telemetria GPS em Tempo Real:** Rastreamento contínuo de coordenadas, velocidade (km/h), bateria e status de sinal satélite transmitido ao backend via `/api/usuarios/localizacao`.
- **Trilha Tática de Atendimento:** Botões de ação integrados com notificações:
  - `1. Iniciar Rota` (notifica NOC e cliente, ativa pulso GPS)
  - `2. Cheguei` (registra horário de chegada no local)
  - `3. Executando` (inicia a intervenção técnica)
- **Diagnóstico Óptico TR-069 in loco:** Medição em tempo real da potência óptica RX da ONU via GenieACS com faixas de referência ideais (-18 a -24 dBm).
- **Comprovação Digital de OS:**
  - **Foto da Instalação:** Captura nativa da câmera do dispositivo (`capture="environment"`) para foto da CTO no poste ou ONU ligada.
  - **Assinatura Digital no Canvas:** Campo tátil de assinatura onde o cliente assina diretamente na tela com o dedo ou stylus antes da baixa da OS.
  - **Conclusão com Sincronização:** Validação do checklist e baixa automática no ERP SGP.

### Módulo de Backup & Restauração (Disaster Recovery)
- **Exportação Completa (`GET /api/backup`):** Gera um arquivo JSON unificado contendo o snapshot de todas as tabelas (Usuários, Clientes, Atendimentos, Conversas e Mensagens).
- **Restauração de Base (`POST /api/restore`):** Interface no SuperAdmin (`/admin`) para upload de arquivo `.json` com validação de integridade e recarga automática do estado.
- **Resiliência em Cache:** Mecanismo automático de fallback para backups em memória caso a conexão com o banco esteja indisponível.

### BI & Analytics Operacional
- Rota `/api/dashboard/stats` para consolidação em tempo real das métricas da operação: total de usuários, atendimentos por pipeline, volume de conversas e taxas de resolução automatizada por IA.
- Dashboards com gráficos Recharts para TMR (Tempo Médio de Resposta), resolução Humano vs. IA e NPS.

### Hierarquia de Acesso (RBAC) e PWA
- Restrição de visibilidade para os 4 papéis base (`admin`, `operador`, `tecnico_noc`, `tecnico_campo`).
- Portal do cliente protegido por Login/Token (CPF do SGP).
- PWA configurado com `manifest.json`, Service Workers e suporte a empacotamento nativo Android via APK ([ver guia](./PWA_TO_APK.md)).
