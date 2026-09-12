#!/bin/bash
# ==============================================================================
# NAP (Núcleo de Atendimento ao Provedor) - Script Autônomo de Deploy
# OS Suportado: Debian 12 (Bookworm)
# ==============================================================================
set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}       Instalador Autônomo NAP Omnichannel          ${NC}"
echo -e "${BLUE}====================================================${NC}"

# 1. Checagem de Privilégios (Root)
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERRO] Este script precisa ser executado como root.${NC}"
  echo -e "Utilize: sudo ./deploy.sh ou acesse com 'su -'"
  exit 1
fi

echo -e "${GREEN}[OK] Privilégios de root detectados.${NC}\n"

# 2. Coleta de Informações (Interativo)
read -p "Digite o domínio para o painel NAP (ex: painel.provedor.com.br): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}[ERRO] O domínio não pode ficar vazio.${NC}"
    exit 1
fi

read -p "Deseja configurar o Asterisk 20 nativamente agora? (s/n): " INSTALL_ASTERISK

# 3. Atualização e Dependências Base
echo -e "\n${YELLOW}[1/6] Atualizando pacotes e instalando dependências base...${NC}"
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git build-essential ufw nginx certbot python3-certbot-nginx logrotate

# 4. Instalação do Node.js (v20 LTS) e PM2
echo -e "\n${YELLOW}[2/6] Configurando Node.js 20 LTS e PM2...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

# 5. Instalação do Asterisk 20 (Opcional, mas recomendado)
if [[ "$INSTALL_ASTERISK" =~ ^[Ss]$ ]]; then
    echo -e "\n${YELLOW}[3/6] Compilando e Instalando Asterisk 20 LTS (Isso pode demorar alguns minutos)...${NC}"
    apt-get install -y libjansson-dev libxml2-dev uuid-dev libsqlite3-dev libnewt-dev libssl-dev libncurses5-dev subversion libedit-dev sqlite3
    
    cd /usr/src
    if [ ! -d "asterisk-20.9.0" ]; then
        wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-20-current.tar.gz
        tar zxvf asterisk-20-current.tar.gz
        cd asterisk-20.*/
        
        contrib/scripts/get_mp3_source.sh
        contrib/scripts/install_prereq install
        
        ./configure --with-jansson --with-pjproject-bundled > /dev/null
        make -j$(nproc) > /dev/null
        make install > /dev/null
        make config > /dev/null
        ldconfig
    else
        echo -e "${GREEN}[OK] Asterisk já encontrado no sistema.${NC}"
    fi
    
    systemctl enable asterisk
    systemctl start asterisk
    
    # Volta para a pasta do NAP
    cd - > /dev/null
else
    echo -e "\n${YELLOW}[3/6] Pulando instalação do Asterisk 20...${NC}"
fi

# 6. Build da Aplicação NAP
echo -e "\n${YELLOW}[4/6] Configurando e Compilando a Aplicação NAP...${NC}"
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${GREEN}[OK] Arquivo .env gerado a partir do .env.example.${NC}"
fi

npm install
npm run build

# 7. Configuração do PM2 (Daemon)
echo -e "\n${YELLOW}[5/6] Iniciando o serviço no PM2...${NC}"
pm2 stop nap-backend 2>/dev/null || true
pm2 start dist/server.cjs --name "nap-backend"
pm2 save
pm2 startup | grep "sudo" | bash || true

# 8. Configuração Nginx e SSL
echo -e "\n${YELLOW}[6/6] Configurando Nginx Reverso e SSL (Let's Encrypt)...${NC}"
cat > /etc/nginx/sites-available/nap <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

ln -sf /etc/nginx/sites-available/nap /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo -e "${YELLOW}Emitindo certificado SSL...${NC}"
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos -m admin@${DOMAIN} || echo -e "${RED}[AVISO] Falha ao emitir SSL. Verifique se o DNS de ${DOMAIN} aponta para este servidor.${NC}"

# 9. Firewall (UFW)
echo -e "\n${YELLOW}Configurando Regras de Firewall (UFW)...${NC}"
ufw allow 'OpenSSH'
ufw allow 'Nginx Full'
# ufw allow 5060/udp # Descomentar para abrir porta SIP (apenas para IPs confiáveis)
echo "y" | ufw enable

echo -e "\n${BLUE}====================================================${NC}"
echo -e "${GREEN}DEPLOY DO NÚCLEO CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${BLUE}====================================================${NC}"
echo -e "O servidor backend e o painel base foram provisionados."
echo -e ""
echo -e "${YELLOW}>> PRÓXIMO PASSO OBRIGATÓRIO <<${NC}"
echo -e "Acesse a interface web para finalizar a configuração do sistema:"
echo -e "${GREEN}👉 https://${DOMAIN}/setup${NC}"
echo -e ""
echo -e "Na interface web você poderá:"
echo -e "  1. Definir o Usuário Admin e Senha."
echo -e "  2. Configurar IPs da Rede Local e Validação de Domínio."
echo -e "  3. Instalar o GenieACS (TR-069) de forma 100% visual."
echo -e "  4. Conectar seu Banco de Dados (SGP)."
echo -e "====================================================\n"
