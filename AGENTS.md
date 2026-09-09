# NAP (Núcleo de Atendimento ao Provedor) - System Instructions for AI Agents

These are the core architectural and design constraints for any AI agent interacting with the NAP codebase.

## 1. Project Context
NAP is an Omnichannel SaaS platform built for ISPs (Internet Service Providers).
It integrates billing (SGP), telephony (FreePBX/Asterisk), WhatsApp (WABA), workflows (n8n), and AI intelligence (Gemini via 9router).
The architecture is Multi-tenant/White-label, intended to run independently in Debian 12 environments alongside a PBX.

## 2. Tech Stack
- **Frontend:** React 18, Vite, React Router DOM, Tailwind CSS, Lucide React (Icons).
- **Backend:** Node.js, Express (running from `server.ts`).
- **Build System:** Vite builds the SPA, esbuild bundles `server.ts` into a CommonJS server (`dist/server.cjs`).
- **Styling:** "Premium SaaS Dark Theme". Primary backgrounds (`#0b0f19`, `#101726`), accents (Indigo-500, Emerald-400).

## 3. Core Principles
- **No AI Slop:** Keep the UI strictly professional. No gratuitous gradients, glowing shadows, or nested boxes. Use mathematical padding and typography.
- **Full-stack by default:** All external integrations (SGP, Gemini, WhatsApp APIs, Webhooks) MUST be routed through `/api/*` endpoints in `server.ts` to protect credentials.
- **Tenant Isolation:** Configuration variables (Theme color, Logo, API Keys, Prompts) are managed in the `SuperAdmin` module and should be passed dynamically, maintaining tenant isolation.

## 4. Key Modules to Preserve
- **Inbox Unificado:** Handles WhatsApp WABA and Webchat. Contains Macro templates (HSM) and attachments.
- **CRM 360:** Uses Slide-over panels to show customer context (SGP billing + FreePBX call history).
- **Automacoes (n8n):** A visual CSS/SVG node graph simulating n8n logic.
- **Portal do Cliente (PWA):** Mobile-first auto-service app (`/portal`).

## 5. Development Workflow
When making changes:
1. Ensure Vite development proxy handles API routes to `server.ts`.
2. Do not modify the build scripts in `package.json` unless absolutely necessary for the Express + Vite setup.
3. Test layout changes across Desktop and Mobile (especially the Portal layout).
