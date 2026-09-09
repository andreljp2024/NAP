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
- **Inbox Unificado:** Centraliza mensagens de WhatsApp, Webchat e outras fontes.
- **Kanban (Suporte e Vendas):** Gestão visual de chamados e leads utilizando interface de arrastar-e-soltar (drag and drop).
- **CRM:** Tabela de clientes com busca inteligente, status de conexão (Radius/MikroTik simulado) e informações rápidas de contratos.
- **CTI Reverso (FreePBX):** Um componente global que escuta eventos em tempo real via SSE (Server-Sent Events). Quando uma chamada entra no PABX, um alerta visual salta na tela do operador, permitindo abrir a ficha do cliente instantaneamente.
- **Super Admin:** Painel de configuração global, monitoramento de integrações (SGP, 9router) e ajuste fino (tuning) dos prompts do LLM.

### 2. Portal do Cliente (PWA)
Acessível via rota `/portal`.
- Interface otimizada para dispositivos móveis (Mobile-First) com menu de navegação inferior estilo aplicativo móvel nativo.
- Funcionalidades: Visualização de plano ativo, faturas (com fluxos de visualização de PIX copia-e-cola e boletos), suporte técnico (chamados).
- **Webchat Widget (IA):** Um chat flutuante persistente integrado nativamente com Inteligência Artificial para o autoatendimento e triagem primária (nível 1).

## Integrações de API e Mocks (server.ts)

O servidor backend contém rotas preparadas arquiteturalmente para integrações reais (com suporte à chaves em `.env`), mas atualmente opera com *Mocks* e *Fallbacks* inteligentes para permitir testes do produto sem depender de infraestrutura externa imediata:

- `POST /api/ia/chat`: Simula o gateway **9router**, utilizando o SDK oficial do Gemini (`@google/genai`) para responder aos clientes simulando a consulta em uma base de conhecimento (BookStack).
- `GET /api/sgp/*`: Simula os endpoints vitais do ERP **SGP** para busca de faturas, geração de linha digitável/QR Code PIX e dados de identificação do cliente na URA.
- `GET /api/events/calls`: Endpoint SSE (Server-Sent Events) que mantém uma conexão unidirecional aberta com o frontend para injetar chamadas ativas em tempo real.
- `POST /api/webhooks/freepbx/incoming`: Simula o recebimento do webhook do FreePBX/Asterisk. Ao acionado, dispara o evento SSE para a interface de tela do operador instantaneamente.

## Como Testar as Funcionalidades de Demonstração

1. **Simular Chamada Recebida (CTI):** No menu lateral, navegue até a tela "Ajustes da IA" (Super Admin) e clique no botão verde "Simular Chamada FreePBX". Observe o card de atendimento flutuante surgir na tela instantaneamente, não importa em qual página você esteja.
2. **Autoatendimento com IA:** Navegue até o Portal do Cliente (`/portal`), abra o ícone flutuante de chat azul no canto inferior direito e envie uma mensagem simulando uma queixa (ex: "Minha internet está caindo muito").
3. **Fluxos de Tarefas:** Navegue até "Kanban Suporte" ou "Kanban Vendas" e mova os cards (tickets/negociações) de um lado para o outro para ver o comportamento de estado das colunas.
