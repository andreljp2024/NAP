# Infraestrutura e Deploy (Docker)

O NAP (Núcleo de Atendimento ao Provedor) foi projetado sob a premissa de **isolamento por provedor (Single-Tenant)**, garantindo máxima segurança de dados, isolamento de recursos (como a fila telefônica do Asterisk) e gestão simplificada da infraestrutura.

Para atingir a melhor relação custo-benefício e manter o servidor enxuto, a estratégia escolhida é o uso do **PostgreSQL Oficial em Docker** para o nosso sistema relacional, trabalhando em conjunto com os containers obrigatórios do **GenieACS** (MongoDB e Redis).

## 1. Por que PostgreSQL Puro e não Supabase Self-Hosted?

O Supabase Self-Hosted exige subir mais de 10 containers simultâneos por VM (PostgreSQL, GoTrue, Realtime, Storage, Kong API, etc.). Considerando que a sua VM já precisa rodar serviços pesados de terceiros, a arquitetura ficaria estrangulada:

- A VM hospedará: **GenieACS** + **MongoDB** + **Redis** + **Asterisk/FreePBX** + **NAP Node.js**.
- Subir toda a stack do Supabase exigiria servidores de 8GB+ de RAM por cliente.
- Utilizando o **PostgreSQL leve (`postgres:16-alpine`)** via ORM (Prisma ou Drizzle) dentro do nosso `server.ts`, centralizamos a lógica no nosso próprio backend, diminuindo drasticamente o consumo de memória RAM (<200MB pro banco) e barateando os custos de deploy para o ISP.

## 2. Arquitetura de Containers (O `docker-compose.yml`)

Na raiz deste projeto, você encontrará o arquivo `docker-compose.yml` que orquestra todo o ecossistema. Ele é composto por 4 blocos principais:

1. **`nap-app`:** O container Node.js (frontend + backend em uma única porta `3000`), construído a partir do `Dockerfile`.
2. **`db` (PostgreSQL 16):** O banco de dados relacional oficial do sistema NAP, armazenando clientes, permissões e histórico de chamados/vendas.
3. **`mongo` e `redis`:** Bancos de dados necessários para a persistência e cache do protocolo TR-069 do GenieACS. O Redis também serve ao NAP para controle de sessões e webhooks rápidos do WhatsApp (WABA).
4. **`genieacs-*`:** O ecossistema oficial do GenieACS (CWMP, NBI, FS, UI), conversando internamente com o Mongo/Redis, expondo as portas necessárias (como a `7547` para comunicação com as ONUs).

## 3. Pré-requisitos da VM (Debian 12)

Recomendamos uma VPS com:
- **CPU:** 2 a 4 vCPUs
- **RAM:** 4GB+ 
- **SO:** Debian 12
- **Dependências de Host:** Docker, Docker Compose (o Asterisk / FreePBX geralmente é instalado "Bare Metal" diretamente no Debian por questões de drivers SIP/RTP, embora possa ser containerizado com `--network host`).

## 4. Passo a Passo do Deploy

1. **Preparação do Ambiente:**
   Acesse a VPS via SSH, clone o repositório do projeto e entre na pasta:
   ```bash
   git clone <SEU_REPOSITORIO> nap-isp
   cd nap-isp
   ```

2. **Configuração de Variáveis de Ambiente:**
   Copie o arquivo de exemplo e edite as variáveis necessárias (GEMINI_API_KEY, senhas do BD, etc):
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Subindo a Infraestrutura:**
   Suba todos os serviços em segundo plano:
   ```bash
   docker-compose up -d --build
   ```

4. **Verificando os Logs:**
   Confirme se todos os serviços subiram corretamente:
   ```bash
   docker-compose logs -f nap-app
   ```

## 5. Próximos Passos (ORM e Sincronização)
Com a infraestrutura no ar, o próximo passo do desenvolvimento do produto é **configurar o Prisma (ou Drizzle ORM)** no backend para conectar o Node.js ao PostgreSQL e criar os scripts de cronjob (`server.ts`) para espelhar os dados do ERP (SGP) para dentro deste banco.
