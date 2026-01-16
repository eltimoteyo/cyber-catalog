#!/bin/bash

# Script de despliegue rápido para actualizaciones
# Ejecutar desde /var/www/createam-platform: bash deploy.sh

echo "🚀 Desplegando actualizaciones..."
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Si es repositorio Git, hacer pull
if [ -d .git ]; then
    echo -e "${BLUE}📥 Obteniendo últimos cambios de Git...${NC}"
    git pull origin main
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al obtener cambios de Git${NC}"
        exit 1
    fi
fi

# Instalar dependencias nuevas
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install --legacy-peer-deps

# Compilar proyecto
echo -e "${BLUE}🔨 Compilando proyecto...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Compilación exitosa${NC}"
else
    echo -e "${RED}❌ Error en la compilación${NC}"
    exit 1
fi

# Reiniciar aplicación
echo -e "${BLUE}🔄 Reiniciando aplicación...${NC}"
pm2 restart createam-platform

# Verificar estado
echo ""
echo -e "${BLUE}📊 Estado de la aplicación:${NC}"
pm2 list

echo ""
echo -e "${GREEN}✅ Despliegue completado!${NC}"
echo ""
echo "Ver logs: pm2 logs createam-platform"
echo ""
