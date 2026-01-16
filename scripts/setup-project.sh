#!/bin/bash

# Script para configurar el proyecto después de subirlo
# Ejecutar desde /var/www/createam-platform: bash setup-project.sh

echo "🚀 Configurando proyecto Createam Platform..."
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encuentra package.json${NC}"
    echo "Asegúrate de estar en /var/www/createam-platform"
    exit 1
fi

# 1. Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install --legacy-peer-deps

# 2. Solicitar configuración
echo ""
echo -e "${YELLOW}📝 Configuración Firebase:${NC}"
echo ""

read -p "Firebase API Key: " FIREBASE_API_KEY
read -p "Firebase Auth Domain: " FIREBASE_AUTH_DOMAIN
read -p "Firebase Project ID: " FIREBASE_PROJECT_ID
read -p "Firebase Storage Bucket: " FIREBASE_STORAGE_BUCKET
read -p "Firebase Messaging Sender ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "Firebase App ID: " FIREBASE_APP_ID

echo ""
read -p "Dominio de la plataforma (ej: createam.cloud): " PLATFORM_DOMAIN

# 3. Crear archivo .env.local
echo -e "${BLUE}📄 Creando .env.local...${NC}"
cat > .env.local << EOF
# Firebase Central (para gestión de tenants)
NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY=${FIREBASE_API_KEY}
NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID=${FIREBASE_APP_ID}

# Dominio de la plataforma
NEXT_PUBLIC_PLATFORM_DOMAIN=${PLATFORM_DOMAIN}

# Puerto
PORT=3000
EOF

echo -e "${GREEN}✅ .env.local creado${NC}"

# 4. Compilar proyecto
echo ""
echo -e "${BLUE}🔨 Compilando proyecto...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Compilación exitosa${NC}"
else
    echo -e "${RED}❌ Error en la compilación${NC}"
    exit 1
fi

# 5. Iniciar con PM2
echo ""
echo -e "${BLUE}🚀 Iniciando aplicación con PM2...${NC}"
pm2 start npm --name "createam-platform" -- start
pm2 save
pm2 startup systemd

echo ""
echo -e "${GREEN}✅ Proyecto configurado e iniciado!${NC}"
echo ""
echo "Comandos útiles:"
echo "  pm2 logs createam-platform  - Ver logs"
echo "  pm2 restart createam-platform  - Reiniciar"
echo "  pm2 stop createam-platform  - Detener"
echo ""
echo "Siguiente paso: Configurar Nginx"
echo "Ejecuta: bash /var/www/createam-platform/scripts/setup-nginx.sh"
echo ""
