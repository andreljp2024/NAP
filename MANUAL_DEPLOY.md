# Manual de Implantação e Deploy
## NAP - Instalação Single-Tenant (Isolada)

Este manual descreve o passo a passo para colocar a aplicação NAP (Núcleo de Atendimento ao Provedor) em produção. O projeto foi desenhado para rodar isoladamente em uma VPS para cada Provedor de Internet (ISP), garantindo segurança total dos dados (LGPD) e isolamento da rede de telefonia VoIP.

### 1. Requisitos de Infraestrutura
- **Servidor:** VPS/VM Dedicada (Recomendado: 4 vCPUs, 8GB RAM).
- **Sistema Operacional:** Debian 12 (Bookworm) ou Ubuntu 22.04 LTS.
- **Node.js:** Versão 20.x ou superior.
- **Banco de Dados:** PostgreSQL 15 ou superior.
- **Domínio:** Um domínio/subdomínio apontado para a VPS (ex: `nap.meuprovedor.com.br`) para geração de SSL (Certbot).

### 2. Instalação de Dependências Base
Logado via SSH no servidor, execute:
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 para gerenciamento do processo
sudo npm install -g pm2

# Instalar Nginx e PostgreSQL
sudo apt install -y nginx postgresql postgresql-contrib
```

### 3. Configuração do PostgreSQL
Crie o banco de dados e o usuário que o NAP utilizará:
```bash
sudo -u postgres psql
```
No console do PostgreSQL:
```sql
CREATE DATABASE nap_crm;
CREATE USER nap_user WITH ENCRYPTED PASSWORD 'senha_super_segura';
GRANT ALL PRIVILEGES ON DATABASE nap_crm TO nap_user;
ALTER DATABASE nap_crm OWNER TO nap_user;
\q
```

### 4. Deploy da Aplicação
Faça o clone do repositório da aplicação na pasta desejada (ex: `/var/www/nap`):
```bash
# Baixar código e instalar pacotes NPM
git clone https://github.com/SeuUsuario/nap.git /var/www/nap
cd /var/www/nap
npm install
```

#### 4.1. Configurar Variáveis de Ambiente (.env)
Crie o arquivo `.env` na raiz do projeto:
```env
# Banco de Dados
DATABASE_URL="postgres://nap_user:senha_super_segura@localhost:5432/nap_crm"

# SGP (ERP)
SGP_URL="https://api.sgp.net.br"
SGP_APP="SUA_CHAVE_APP_SGP"
SGP_TOKEN="SEU_TOKEN_SGP"

# IA Gemini
GEMINI_API_KEY="AIzaSy_Sua_Chave_Gemini_Aqui"

# WABA (WhatsApp)
WABA_VERIFY_TOKEN="meu_provedor_waba_secret"
WABA_ACCESS_TOKEN="EAA_TOKEN_DO_FACEBOOK"

# Outros
NODE_ENV="production"
PORT=3000
```

#### 4.2. Geração das Tabelas e Build
Execute a migração do Drizzle para construir as tabelas (`users`, `clientes`, `atendimentos`, `conversas`, etc) no Postgres:
```bash
npm run db:push
```

Faça a build de Produção (que unifica o React SPA e o Node Backend via esbuild):
```bash
npm run build
```
Isto gerará a pasta `dist/` com o frontend e o arquivo `dist/server.cjs` (backend).

### 5. Execução (PM2)
Inicie o servidor com o PM2 para que ele rode em background e reinicie automaticamente:
```bash
pm2 start dist/server.cjs --name "nap-backend"
pm2 save
pm2 startup
```

### 6. Configuração do Proxy Reverso (Nginx + SSL)
Crie a configuração do site no Nginx para repassar as requisições para a porta `3000`:
```bash
sudo nano /etc/nginx/sites-available/nap
```

Cole a configuração:
```nginx
server {
    listen 80;
    server_name nap.meuprovedor.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Repasse do IP Real
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_addrs;
    }
}
```
Ative o site e reinicie o Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/nap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Certificado SSL (Certbot)
Gere o certificado HTTPS gratuito:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d nap.meuprovedor.com.br
```

**Pronto!** O seu NAP está rodando em produção, de forma isolada, escalável e segura. O painel deve estar acessível via `https://nap.meuprovedor.com.br`.
