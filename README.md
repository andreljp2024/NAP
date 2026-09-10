# NAP - Núcleo de Atendimento ao Provedor (WACRM)

Bem-vindo ao **NAP (Núcleo de Atendimento ao Provedor)**, um Ecossistema Omnichannel SaaS projetado exclusivamente para Provedores de Internet (ISPs).

## 🚀 Visão Geral do Sistema
O NAP foi concebido para unificar a operação técnica, financeira e de atendimento em uma única plataforma isolada (Tenant-Based), proporcionando segurança máxima e controle total da operação de provedores de fibra óptica.

### Módulos Principais
1. **AVA (Agente Virtual Autônoma):** Integração Full-Stack nativa com o **Google Gemini**, capaz de interpretar áudio, entender solicitações de clientes, analisar sentimentos em tempo real e disparar funções remotas no ERP (Mock SGP).
2. **Inbox Omnichannel & Triagem IA:** Caixa de entrada unificada que suporta WhatsApp (WABA), Webchat PWA e integração nativa de telefonia com Asterisk (FreePBX 17). Conta com interface de **Triagem IA** para testes de handover entre Robô e Humano.
3. **GenieACS (TR-069):** Dashboard de telemetria óptica e gerenciamento de CPEs, com leitura visual de potência (RSSI), Uptime e conectividade NBI.
4. **CRM 360 & SGP ERP (Backend):** CRM integrado com pipelines (Kanban) de vendas. Emulador do sistema de faturamento SGP para simular emissão de códigos PIX, desbloqueios em confiança, 2ª via de faturas, e viabilidade de rede.
5. **Portal do Assinante (PWA):** Aplicativo Mobile-First (Light Theme) para autoatendimento do cliente final, suportando instalação via Web Manifest, notificações Push, e roteamento de Webchat/Webphone.
6. **Aplicativo Técnico de Campo (PWA):** Módulo responsivo otimizado para celulares para gestão de Ordens de Serviço externas, integração de mapas e **transmissão de Geolocalização (GPS) em tempo real**.
7. **Hierarquia e Usuários:** Gestão de papéis do sistema (Admin, Operador, Técnicos) centralizando o envio de notificações universais Push via Web-Push.

## 🛠️ Stack Tecnológica
- **Frontend:** React 18, Vite, Tailwind CSS (Design System Anti-Slop, Dark Mode Premium SaaS no Admin, Light Mode no PWA)
- **Backend:** Node.js, Express (Build Híbrido CJS via esbuild) rodando em `server.ts`
- **Banco de Dados & Autenticação:** Firebase (Firestore NoSQL) + Firebase Auth
- **PWA:** `vite-plugin-pwa` para Service Workers e suporte a instalação offline.

## 🔧 Estrutura do Repositório
- `/src/pages`: Contém as interfaces principais (`SuperAdmin.tsx`, `Kanban.tsx`, `CRM.tsx`, `GenieACSDashboard.tsx`, `Inbox.tsx`).
- `/src/pages/landing`: Três templates de Landing Pages otimizados (Tech Dark, Gamer Vibrant, Clean Family).
- `/src/components`: Componentes reutilizáveis (Layout, PortalLayout, Webphone, Mapas, etc).
- `/server.ts`: Entry point do backend que concentra 100% das APIs seguras (`/api/gemini/*`, `/api/sgp/*`, `/api/push/*`).

## ⚙️ Inicialização
O projeto utiliza um pipeline simplificado onde o frontend e backend rodam na mesma instância, de forma otimizada para implantações em containers.

```bash
# Instalar dependências
npm install

# Rodar ambiente de desenvolvimento (Inicia backend e proxy do Vite na porta 3000)
npm run dev

# Fazer o Build de produção (Gera o SPA PWA no /dist e compila o server.ts)
npm run build

# Iniciar o servidor de produção
npm run start
```

## 🔐 Autenticação e Resiliência
O sistema suporta login via **Firebase Authentication**.
- **Usuário Padrão:** `admin` ou `admin@nap.local`
- **Senha:** `admin123`

*(Resiliência: Em ambientes de desenvolvimento sem o Auth configurado no Firebase, ou em caso de erro na API do Google, o sistema aciona automaticamente uma **Mock Session** local (Spoofing) para não bloquear a experiência do desenvolvedor/operador).*

## 📡 Roteamento Principal
- `/` - Landing Page de Aquisição (Para novos clientes contratarem planos, com seletor flutuante de temas)
- `/login` - Tela de autenticação unificada (Firebase)
- `/admin` - Painel Operacional SaaS (Exclusivo para o time do Provedor - Dashboards, CRM, SGP, URA)
- `/portal` - Área do Assinante PWA (Visão do cliente: 2ª via, Pix, Suporte, Webphone)

## 💡 Princípios de Design (Regras de Ouro)
1. Sem interfaces clichês ("AI Slop"): Nada de bordas brilhantes excessivas ou textos ilegíveis.
2. Contraste Máximo: Textos sobre fundos escuros (`#0b0f19`) utilizam tons opacos refinados e padding calculado. O PWA de clientes usa um tema claro acessível.
3. Segurança Full-Stack: Todas as integrações externas (Gemini, ERP, VoIP, etc.) são roteadas obrigatoriamente pelo `server.ts`, mantendo as chaves privadas totalmente ocultas do navegador (Client-Side).

### Hierarquia de Acesso e Perfis
O NAP conta com uma arquitetura de perfis baseada em RBAC (Role-Based Access Control). Foram definidos papéis estruturados para isolamento de funcionalidades, garantindo que cada usuário visualize apenas as ferramentas necessárias para seu dia-a-dia.

**Papéis Implementados:**
- **Administrador (`admin` / `superadmin`):** Acesso irrestrito a todos os módulos, incluindo configurações, automações e dashboards gerenciais.
- **Operador (`operador`):** Acesso central ao Inbox Unificado, CRMs, Consulta de Faturas (SGP), e Kanbans (Suporte, Vendas, Cobrança).
- **Técnico de NOC (`tecnico_noc`):** Focado em monitoramento, possui acesso ao GenieACS, Suporte Avançado, e Gestão de Operadores.
- **Técnico de Campo (`tecnico_campo`):** Direcionado para operações móveis, acessa seu portal PWA (Geolocalização, Ordens de Serviço), Caixa de Entrada (Comunicação interna) e Consulta SGP básica.

### Atualização da Hierarquia (Operadores)
Foi aplicada uma revisão na segurança de rotas (Route Protection) e na visibilidade dos menus. **Operadores** tiveram seus acessos estritamente limitados às rotas de Operação (Vendas, Cobrança, CRM, Inbox e Suporte). Todos os módulos de configuração e parâmetros sistêmicos (`/admin/dashboard`, `/admin/automacoes`, `/admin/configuracoes`, `/admin/usuarios` e `/admin/operadores`) agora são de acesso exclusivo de `admin` e `superadmin`.
