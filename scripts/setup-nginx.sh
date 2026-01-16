#!/bin/bash

# Script para configurar Nginx
# Ejecutar como root: bash setup-nginx.sh

echo "🌐 Configurando Nginx..."
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Solicitar dominios
echo -e "${YELLOW}📝 Configuración de dominios:${NC}"
echo ""
read -p "Dominio principal de la plataforma (ej: createam.cloud): " PLATFORM_DOMAIN
read -p "¿Quieres configurar un dominio de tenant? (s/n): " CONFIG_TENANT

# Configurar dominio principal
echo ""
echo -e "${BLUE}📄 Configurando ${PLATFORM_DOMAIN}...${NC}"

cat > /etc/nginx/sites-available/${PLATFORM_DOMAIN} << EOF
server {
    listen 80;
    server_name ${PLATFORM_DOMAIN} www.${PLATFORM_DOMAIN};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Configurar subdominios wildcard
cat > /etc/nginx/sites-available/tenants.${PLATFORM_DOMAIN} << EOF
server {
    listen 80;
    server_name *.${PLATFORM_DOMAIN};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Activar configuraciones
ln -sf /etc/nginx/sites-available/${PLATFORM_DOMAIN} /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/tenants.${PLATFORM_DOMAIN} /etc/nginx/sites-enabled/

# Configurar tenant si se solicitó
if [ "$CONFIG_TENANT" = "s" ] || [ "$CONFIG_TENANT" = "S" ]; then
    echo ""
    read -p "Dominio del tenant (ej: bellasorpresa.pe): " TENANT_DOMAIN
    
    echo -e "${BLUE}📄 Configurando ${TENANT_DOMAIN}...${NC}"
    
    cat > /etc/nginx/sites-available/${TENANT_DOMAIN} << EOF
server {
    listen 80;
    server_name ${TENANT_DOMAIN} www.${TENANT_DOMAIN};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    ln -sf /etc/nginx/sites-available/${TENANT_DOMAIN} /etc/nginx/sites-enabled/
fi

# Probar configuración
echo ""
echo -e "${BLUE}🔍 Probando configuración de Nginx...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Configuración correcta${NC}"
    
    # Recargar Nginx
    echo -e "${BLUE}🔄 Recargando Nginx...${NC}"
    systemctl reload nginx
    
    echo ""
    echo -e "${GREEN}✅ Nginx configurado correctamente!${NC}"
    echo ""
    echo -e "${YELLOW}Siguiente paso: Instalar SSL${NC}"
    echo ""
    echo "Para ${PLATFORM_DOMAIN}:"
    echo "  certbot --nginx -d ${PLATFORM_DOMAIN} -d www.${PLATFORM_DOMAIN}"
    
    if [ "$CONFIG_TENANT" = "s" ] || [ "$CONFIG_TENANT" = "S" ]; then
        echo ""
        echo "Para ${TENANT_DOMAIN}:"
        echo "  certbot --nginx -d ${TENANT_DOMAIN} -d www.${TENANT_DOMAIN}"
    fi
    
    echo ""
    echo -e "${YELLOW}📋 Configuración DNS necesaria en Hostinger:${NC}"
    echo ""
    echo "Para ${PLATFORM_DOMAIN}:"
    echo "  Tipo A | @ | IP_DE_TU_VPS"
    echo "  Tipo A | www | IP_DE_TU_VPS"
    echo "  Tipo A | * | IP_DE_TU_VPS (para subdominios)"
    
    if [ "$CONFIG_TENANT" = "s" ] || [ "$CONFIG_TENANT" = "S" ]; then
        echo ""
        echo "Para ${TENANT_DOMAIN}:"
        echo "  Tipo A | @ | IP_DE_TU_VPS"
        echo "  Tipo A | www | IP_DE_TU_VPS"
    fi
else
    echo -e "${RED}❌ Error en la configuración de Nginx${NC}"
    exit 1
fi

echo ""
