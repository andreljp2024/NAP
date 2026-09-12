# NAP (Núcleo de Atendimento ao Provedor) - System Instructions for AI Agents

These are the core architectural and design constraints for any AI agent interacting with the NAP codebase.

## 1. Project Context
NAP is an Omnichannel SaaS platform built for ISPs (Internet Service Providers).
It is designed to run completely isolated per ISP on its own dedicated VPS/VM infrastructure.
The core stack includes Debian 12, FreePBX 17, GenieACS (TR-069), WABA (WhatsApp Cloud API), and SGP (Billing/ERP Emulator). The NAP (Node.js backend) acts directly as the AI Voice Agent via Gemini, connecting with Asterisk via AMI/ARI.

## 2. Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React (Icons), Leaflet & React-Leaflet (GIS Mapping).
- **Backend:** Node.js, Express (running from `server.ts`).
- **PWA Portal:** Mobile-first customer portal (`/portal`) using `vite-plugin-pwa` for Service Workers, caching, Web App Manifests, push notifications, direct Webchat queues, and WebRTC Webphone for direct voice calls to the operator.
- **Build System:** Vite builds the SPA, esbuild bundles `server.ts` into a CommonJS server (`dist/server.cjs`).
- **Styling:** "Premium SaaS Dark Theme" for admin (`#0b0f19`, `#101726`), light theme for Customer PWA.
- **Auth:** Firebase Authentication with a built-in Mock Session fallback inside `AuthContext.tsx` if Firebase API fails locally.

## 3. Core Principles
- **Idioma do Assistente:** Todas as explicações, resumos, mensagens e comunicações com o usuário devem ser estritamente em **Português Brasileiro (pt-BR)**.
- **No AI Slop:** Keep the UI strictly professional. No gratuitous gradients, glowing shadows, or nested boxes. Use mathematical padding, structural borders, and refined typography.
- **Full-stack by default:** All external integrations MUST be routed through `/api/*` endpoints in `server.ts` to protect credentials. Never expose Gemini or ERP API Keys on the client side.
- **Tenant Isolation:** Although the code supports multi-tenancy, the deployment model assumes one ISP per VM for strict data privacy and telephony isolation.

## 4. Key Modules to Preserve
- **Inbox Unificado & Triagem IA:** Handles WhatsApp WABA and Webchat integrations. Inclui modo Triagem IA com o Cérebro Gemini operando como Copiloto e filtro dedicado para Handoff (transferência humano-IA).
- **Centro de Controle Operacional (NOC & GIS):** Integra dashboards em `/admin/dashboard` (Radar de técnicos, PABX) e o mapa georreferenciado `/admin/mapa-rede` que renderiza clusters dinâmicos (Leaflet) de milhares de ONTs simuladas conectadas ao TR-069.
- **CRM 360 & Kanban:** Uses Slide-over panels to show customer context and manages SGP billing operations (PIX, Unblocks).
- **GenieACS:** Dashboard for CPE telemetry (ONU Power, Uptime).
- **Portal do Cliente (PWA):** Mobile-first auto-service app (`/portal`). Features Webchat routing, invoice payments, and WebRTC Webphone.
- **Técnico de Campo (PWA) & Geolocalização:** Módulo em `/admin/campo` Mobile-First para gestão de Ordens de Serviço na rua. Conta com rastreamento GPS em tempo real transmitido para o "Radar" no dashboard administrativo.
- **Hierarquia de Usuários:** Módulo de controle de permissões em 4 níveis (Admin Geral, Operador, Técnico N1, Técnico N2) gerenciado via painel.
- **Landing Pages (`/src/pages/landing`):** Modular templates with background images and responsive design.

## 5. Development Workflow
When making changes:
1. Ensure Vite development proxy handles API routes to `server.ts`.
2. Do not modify the build scripts in `package.json` unless absolutely necessary for the Express + Vite setup. The PWA config is sensitive.
3. Test layout changes across Desktop and Mobile (especially the Portal layout, which should behave like a native iOS/Android app).
4. If modifying Login or Auth, respect the `activateMockSession()` fallback to prevent blocking devs from entering `/admin`.
