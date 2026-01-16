#!/bin/bash

# Script de instalación automática para Hostinger VPS
# Ejecutar como root: bash install.sh

echo "🚀 Iniciando instalación de Createam Platform en VPS..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Actualizar sistema
echo -e "${BLUE}📦 Actualizando sistema...${NC}"
apt update && apt upgrade -y

# 2. Instalar Node.js 20 LTS
echo -e "${BLUE}📦 Instalando Node.js 20 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo -e "${GREEN}✅ Node.js instalado:${NC}"
node -v
npm -v

# 3. Instalar PM2
echo -e "${BLUE}📦 Instalando PM2...${NC}"
npm install -g pm2

# 4. Instalar Nginx
echo -e "${BLUE}📦 Instalando Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# 5. Instalar Git (si no está)
echo -e "${BLUE}📦 Instalando Git...${NC}"
apt install -y git

# 6. Instalar Certbot para SSL
echo -e "${BLUE}📦 Instalando Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# 7. Crear directorios
echo -e "${BLUE}📁 Creando directorios...${NC}"
mkdir -p /var/www
mkdir -p /backup

# 8. Configurar Firewall
echo -e "${BLUE}🔒 Configurando Firewall...${NC}"
ufw allow 22
ufw allow 80
ufw allow 443
echo "y" | ufw enable

echo ""
echo -e "${GREEN}✅ Instalación base completada!${NC}"
echo ""
echo "Siguiente paso: Subir tu proyecto a /var/www/createam-platform"
echo ""
echo "Opciones:"
echo "1. Clonar desde Git:"
echo "   cd /var/www"
echo "   git clone https://github.com/tu-usuario/createam-platform.git"
echo ""
echo "2. O subir por FTP/SFTP a /var/www/createam-platform"
echo ""
