# Arquitetura do Ecossistema NAP (Núcleo de Atendimento ao Provedor)

O NAP é um orquestrador central e painel de controle (CRM/Kanban/Omnichannel) desenvolvido em React + Node.js (Express), construído para unificar as principais ferramentas open-source e comerciais de um Provedor de Internet (ISP).

## Componentes do Ecossistema

O NAP atua como o cérebro que interliga os seguintes módulos e repositórios:

### 1. FreePBX & Asterisk (Telefonia Core)
- **Repositório Base:** [FreePBX](https://github.com/freepbx)
- **Papel no NAP:** Motor principal de telefonia IP (VoIP), filas de atendimento e rotas de entrada/saída do provedor.
- **Integração:** Envia eventos via Webhook ou AMI (Asterisk Manager Interface) para o nosso backend, disparando os pop-ups de **CTI Reverso** no painel do atendente no exato momento em que o telefone toca.

### 2. AVA - AI Voice Agent for Asterisk
- **Repositório Base:** [AVA-AI-Voice-Agent-for-Asterisk](https://github.com/hkjarral/AVA-AI-Voice-Agent-for-Asterisk)
- **Papel no NAP:** URA Cognitiva (Atendimento de Voz com IA). 
- **Integração:** Em vez de menus de "Disque 1, Disque 2", a AVA atende o cliente, converte a voz em texto (STT) e consome nossa API intermediária (Gateway 9router) que, por sua vez, consulta o **SGP** (via `/api/sgp/ura/cliente`). A IA avalia o status do cliente (ex: "Bloqueado") e gera uma resposta de voz humanizada (TTS) orientando o cliente, antes mesmo de transbordar para o humano.

### 3. WACRM (WhatsApp CRM)
- **Repositório Base:** [WACRM](https://github.com/ArnasDon/wacrm)
- **Papel no NAP:** Motor de gestão de conversas do WhatsApp.
- **Integração:** Fornece a base estrutural para o nosso **Inbox Unificado**, permitindo a distribuição de conversas do WhatsApp Oficial para as colunas do Kanban (Suporte / Vendas), com injeção de IA para sugestões automáticas de respostas.

### 4. SGP (Sistema de Gestão de Provedores)
- **Papel no NAP:** Fonte da verdade (Source of Truth) dos dados cadastrais, financeiros e contratos.
- **Integração:** Conectado via API REST oficial do SGP (usando headers `app` e `token`). O NAP faz proxy das requisições para listar clientes (Ficha 360), gerar PIX de 2ª via e baixar PDFs de boletos, garantindo que o WACRM, a URA (AVA) e o Portal do Cliente tenham os dados atualizados em tempo real.

---

## Fluxo de Dados (Exemplo de Chamada Receptiva)

1. Cliente liga para o Provedor.
2. **FreePBX** recebe a ligação e direciona para a URA Cognitiva (**AVA**).
3. A **AVA** faz uma requisição HTTP para o backend do **NAP**.
4. O **NAP** consulta a API do **SGP** informando o telefone do cliente.
5. O SGP retorna: "Cliente João Silva, Fatura Atrasada 15 dias".
6. O **Gateway 9router (IA)** do NAP formula a frase: *"Olá João, vi que sua internet está lenta por conta de uma fatura pendente, quer que eu te envie o PIX pro seu WhatsApp?"*
7. A **AVA** fala isso para o cliente. Se o cliente aceitar, o NAP dispara a integração com o **WACRM** que envia o código PIX no WhatsApp do cliente.
8. Se o cliente pedir para falar com humano, o **FreePBX** transfere a ligação. O **NAP** detecta a transferência e exibe um pop-up de CTI Reverso na tela do operador com a Ficha 360 do João Silva aberta.
