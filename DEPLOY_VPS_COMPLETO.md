# 🚀 Despliegue en VPS - Paso a Paso
# IP: 72.62.138.112
# Repositorio: https://github.com/eltimoteyo/cyber-catalog.git
# Dominio: createam.cloud

# ============================================
# CONECTAR AL VPS
# ============================================

ssh root@72.62.138.112
# Ingresar tu contraseña

# ============================================
# PASO 1: INSTALAR DEPENDENCIAS
# ============================================

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verificar
node -v
npm -v

# Instalar PM2
npm install -g pm2

# Instalar Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Instalar Git
apt install -y git

# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Crear directorios
mkdir -p /var/www
mkdir -p /backup

# Configurar Firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# ============================================
# PASO 2: CLONAR EL PROYECTO
# ============================================

cd /var/www
git clone https://github.com/eltimoteyo/cyber-catalog.git createam-platform
cd createam-platform

# ============================================
# PASO 3: CONFIGURAR EL PROYECTO
# ============================================

# Instalar dependencias
npm install --legacy-peer-deps

# Crear .env.local
nano .env.local

# Pegar esto (Ctrl+Shift+V), luego Ctrl+X, Y, Enter:
NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY=AIzaSyAB2f4yzW_klDJrlNtnyVi387eEHSM_0r8
NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN=cyber-catalog.firebaseapp.com
NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID=cyber-catalog
NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET=cyber-catalog.firebasestorage.app
NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID=145571149256
NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID=1:145571149256:web:6583321f194b2c19323cfd
NEXT_PUBLIC_PLATFORM_DOMAIN=createam.cloud
PORT=3000

# Compilar
npm run build

# Iniciar con PM2
pm2 start npm --name "createam-platform" -- start

# Guardar configuración PM2
pm2 save

# Configurar PM2 para iniciar al arrancar el sistema
pm2 startup systemd
# IMPORTANTE: Copia y ejecuta el comando que aparece

# Verificar
pm2 list
pm2 logs createam-platform

# ============================================
# PASO 4: CONFIGURAR NGINX
# ============================================

# Crear configuración para createam.cloud
nano /etc/nginx/sites-available/createam.cloud

# Pegar esto (Ctrl+Shift+V), luego Ctrl+X, Y, Enter:
server {
    listen 80;
    server_name createam.cloud www.createam.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Crear configuración para subdominios
nano /etc/nginx/sites-available/tenants.createam.cloud

# Pegar esto (Ctrl+Shift+V), luego Ctrl+X, Y, Enter:
server {
    listen 80;
    server_name *.createam.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Activar configuraciones
ln -sf /etc/nginx/sites-available/createam.cloud /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/tenants.createam.cloud /etc/nginx/sites-enabled/

# Remover configuración por defecto
rm -f /etc/nginx/sites-enabled/default

# Probar configuración
nginx -t

# Recargar Nginx
systemctl reload nginx

# ============================================
# PASO 5: PROBAR QUE FUNCIONA
# ============================================

# Desde el VPS
curl http://localhost:3000
curl http://72.62.138.112

# Desde tu navegador
http://72.62.138.112

# Deberías ver la landing page de Createam

# ============================================
# PASO 6: CONFIGURAR DNS EN HOSTINGER
# ============================================

# IR A: https://hpanel.hostinger.com/domains/createam.cloud/dns

# AGREGAR ESTOS REGISTROS:

# Registro 1:
Tipo: A
Nombre: @
Valor: 72.62.138.112
TTL: 14400

# Registro 2:
Tipo: A
Nombre: www
Valor: 72.62.138.112
TTL: 14400

# Registro 3 (para subdominios):
Tipo: A
Nombre: *
Valor: 72.62.138.112
TTL: 14400

# ESPERAR 10-30 MINUTOS

# Verificar propagación desde tu PC:
ping createam.cloud
nslookup createam.cloud

# ============================================
# PASO 7: INSTALAR SSL
# ============================================

# DESPUÉS de que el DNS esté propagado (10-30 min)

certbot --nginx -d createam.cloud -d www.createam.cloud

# Seguir las instrucciones:
# 1. Ingresa tu email
# 2. Acepta términos (Y)
# 3. Compartir email (opcional - N)

# Verificar auto-renovación
certbot renew --dry-run

# ============================================
# PASO 8: PROBAR TODO
# ============================================

# Probar URLs en el navegador:
https://createam.cloud
https://www.createam.cloud
https://createam.cloud/admin
https://createam.cloud/registro

# Ver logs
pm2 logs createam-platform

# Ver estado
pm2 list
systemctl status nginx

# ============================================
# COMANDOS ÚTILES
# ============================================

# Ver logs en tiempo real
pm2 logs createam-platform --lines 100

# Reiniciar aplicación
pm2 restart createam-platform

# Ver uso de recursos
pm2 monit
htop

# Reiniciar Nginx
systemctl restart nginx

# Ver logs de Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# ============================================
# PARA FUTURAS ACTUALIZACIONES
# ============================================

# Cuando hagas cambios en tu PC:
git add .
git commit -m "Descripción de cambios"
git push origin main

# Luego en el VPS:
cd /var/www/createam-platform
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart createam-platform

# O usa el script:
bash scripts/deploy.sh

# ============================================
# CREAR DATOS DE PRUEBA (OPCIONAL)
# ============================================

# Si quieres crear el tenant y productos de prueba:
cd /var/www/createam-platform
node scripts/create-test-tenant.js
node scripts/create-test-products.js
node scripts/create-test-categories.js

# Luego probar:
https://createam.cloud/admin

# ============================================
# TROUBLESHOOTING
# ============================================

# Si la app no inicia:
pm2 logs createam-platform
pm2 restart createam-platform

# Si Nginx da error 502:
pm2 list
systemctl status nginx
systemctl restart nginx

# Si DNS no resuelve:
dig createam.cloud
# Esperar más tiempo (hasta 48h máximo)

# Si SSL falla:
certbot certificates
certbot renew --force-renewal
systemctl reload nginx

# Ver espacio en disco:
df -h

# Ver uso de RAM:
free -h

# ============================================
# BACKUP (RECOMENDADO)
# ============================================

# Crear backup manual
tar -czf /backup/createam-$(date +%Y%m%d).tar.gz /var/www/createam-platform

# Script de backup automático
nano /etc/cron.daily/backup-createam

# Pegar:
#!/bin/bash
tar -czf /backup/createam-$(date +%Y%m%d).tar.gz /var/www/createam-platform
find /backup -name "createam-*.tar.gz" -mtime +7 -delete

# Dar permisos:
chmod +x /etc/cron.daily/backup-createam
