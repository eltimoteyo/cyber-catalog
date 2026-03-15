# 🚀 Guía de Despliegue en Hostinger VPS

## 📋 Requisitos Previos

- VPS en Hostinger con acceso SSH
- Node.js 18+ instalado
- Dominios configurados en Hostinger

---

## 1️⃣ Preparar el VPS

### Conectar por SSH
```bash
ssh root@tu-ip-del-vps
# O si tienes usuario específico:
ssh usuario@tu-ip-del-vps
```

### Instalar Node.js (si no está instalado)
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verificar instalación
node -v
npm -v
```

### Instalar PM2 (Gestor de procesos)
```bash
npm install -g pm2
```

### Instalar Nginx
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

---

## 2️⃣ Subir el Proyecto al VPS

### Opción A: Usando Git (Recomendado)

```bash
# En tu VPS
cd /var/www
git clone https://github.com/tu-usuario/createam-platform.git
cd createam-platform

# Si usas repositorio privado
git clone https://tu-token@github.com/tu-usuario/createam-platform.git
```

### Opción B: Usando FTP/SFTP

1. Comprime el proyecto localmente (sin node_modules)
2. Sube por FTP a `/var/www/createam-platform`
3. Descomprime en el servidor

---

## 3️⃣ Configurar el Proyecto

### Instalar dependencias
```bash
cd /var/www/createam-platform
npm install --legacy-peer-deps
```

### Crear archivo .env.local en el servidor
```bash
nano .env.local
```

Pegar:
```env
# Firebase Central (para gestión de tenants)
NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY=REPLACE_WITH_VALUE
NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN=REPLACE_WITH_VALUE
NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID=REPLACE_WITH_VALUE
NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET=REPLACE_WITH_VALUE
NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID=REPLACE_WITH_VALUE
NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID=REPLACE_WITH_VALUE

# Dominio de la plataforma
NEXT_PUBLIC_PLATFORM_DOMAIN=createam.cloud

# Puerto (opcional, por defecto 3000)
PORT=3000
```

Guardar con `Ctrl+X`, luego `Y`, luego `Enter`

### Compilar el proyecto
```bash
npm run build
```

---

## 4️⃣ Ejecutar con PM2

### Iniciar la aplicación
```bash
pm2 start npm --name "createam-platform" -- start
```

### Configurar PM2 para auto-inicio
```bash
pm2 startup systemd
pm2 save
```

### Comandos útiles de PM2
```bash
pm2 list                  # Ver aplicaciones
pm2 logs createam-platform # Ver logs
pm2 restart createam-platform # Reiniciar
pm2 stop createam-platform    # Detener
pm2 delete createam-platform  # Eliminar
```

---

## 5️⃣ Configurar Nginx como Reverse Proxy

### Crear configuración para createam.cloud
```bash
nano /etc/nginx/sites-available/createam.cloud
```

Pegar:
```nginx
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
```

### Crear configuración para subdominios (*.createam.cloud)
```bash
nano /etc/nginx/sites-available/tenants.createam.cloud
```

Pegar:
```nginx
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
```

### Crear configuración para bellasorpresa.pe
```bash
nano /etc/nginx/sites-available/bellasorpresa.pe
```

Pegar:
```nginx
server {
    listen 80;
    server_name bellasorpresa.pe www.bellasorpresa.pe;

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
```

### Activar las configuraciones
```bash
ln -s /etc/nginx/sites-available/createam.cloud /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/tenants.createam.cloud /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/bellasorpresa.pe /etc/nginx/sites-enabled/

# Probar configuración
nginx -t

# Recargar Nginx
systemctl reload nginx
```

---

## 6️⃣ Configurar DNS en Hostinger

### Para createam.cloud (Plataforma Principal)

En el panel de Hostinger:

1. **Registro A**
   - Tipo: `A`
   - Nombre: `@`
   - Valor: `IP_DE_TU_VPS`
   - TTL: `14400`

2. **Registro A para www**
   - Tipo: `A`
   - Nombre: `www`
   - Valor: `IP_DE_TU_VPS`
   - TTL: `14400`

3. **Registro A wildcard (para subdominios)**
   - Tipo: `A`
   - Nombre: `*`
   - Valor: `IP_DE_TU_VPS`
   - TTL: `14400`

### Para bellasorpresa.pe (Tenant)

1. **Registro A**
   - Tipo: `A`
   - Nombre: `@`
   - Valor: `IP_DE_TU_VPS`
   - TTL: `14400`

2. **Registro A para www**
   - Tipo: `A`
   - Nombre: `www`
   - Valor: `IP_DE_TU_VPS`
   - TTL: `14400`

---

## 7️⃣ Instalar SSL (HTTPS)

### Instalar Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### Obtener certificados SSL

**Para createam.cloud:**
```bash
certbot --nginx -d createam.cloud -d www.createam.cloud
```

**Para bellasorpresa.pe:**
```bash
certbot --nginx -d bellasorpresa.pe -d www.bellasorpresa.pe
```

**Para subdominios (opcional si los usas):**
```bash
# Solo si ya tienes un subdominio específico configurado
certbot --nginx -d tienda1.createam.cloud
```

### Auto-renovación
```bash
# Probar renovación
certbot renew --dry-run

# Agregar cron job para auto-renovación (ya viene por defecto)
crontab -e
# Agregar: 0 3 * * * certbot renew --quiet
```

---

## 8️⃣ Configurar Firewall

```bash
# Permitir SSH, HTTP y HTTPS
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## 9️⃣ Script de Despliegue Automático

Crear script para futuras actualizaciones:

```bash
nano /var/www/deploy.sh
```

Pegar:
```bash
#!/bin/bash
cd /var/www/createam-platform
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart createam-platform
echo "✅ Despliegue completado!"
```

Hacer ejecutable:
```bash
chmod +x /var/www/deploy.sh
```

Usar con:
```bash
/var/www/deploy.sh
```

---

## 🔟 Verificar que Todo Funciona

### 1. Verificar Next.js
```bash
pm2 logs createam-platform
# Deberías ver: "Ready on http://localhost:3000"
```

### 2. Verificar Nginx
```bash
systemctl status nginx
# Debe estar "active (running)"
```

### 3. Probar los dominios
```bash
curl http://localhost:3000  # Debe responder
curl http://tu-ip-vps       # Debe responder
curl http://createam.cloud  # Debe responder (después de DNS propagado)
```

### 4. Probar en navegador
- https://createam.cloud → Landing page
- https://createam.cloud/admin → Admin plataforma
- https://bellasorpresa.pe → Tienda Bella Sorpresa
- https://tienda1.createam.cloud → Tienda con subdominio

---

## 🔄 Flujo de Actualización

Cuando hagas cambios:

```bash
# 1. En tu PC local
git add .
git commit -m "Nuevos cambios"
git push

# 2. En el VPS
ssh root@tu-ip
/var/www/deploy.sh
```

---

## 🐛 Solución de Problemas

### La aplicación no inicia
```bash
pm2 logs createam-platform
# Ver errores
```

### Nginx muestra error 502
```bash
# Verificar que Next.js esté corriendo
pm2 list
# Si no está, iniciarlo
pm2 start npm --name "createam-platform" -- start
```

### DNS no resuelve
```bash
# Verificar DNS
dig createam.cloud
nslookup createam.cloud

# Puede tomar hasta 48 horas propagar
```

### SSL no funciona
```bash
# Renovar certificados
certbot renew --force-renewal
systemctl reload nginx
```

### Ver logs de Nginx
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 📊 Monitoreo

### Ver uso de recursos
```bash
htop          # Uso de CPU/RAM
df -h         # Espacio en disco
pm2 monit     # Monitor de PM2
```

### Backup automático (recomendado)
```bash
# Crear script de backup
nano /var/www/backup.sh
```

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
tar -czf /backup/createam-$TIMESTAMP.tar.gz /var/www/createam-platform
# Mantener solo últimos 7 backups
find /backup -name "createam-*.tar.gz" -mtime +7 -delete
```

---

## 🎯 URLs Finales

Después de completar todo:

- **Plataforma**: https://createam.cloud
- **Admin Plataforma**: https://createam.cloud/admin
- **Registro**: https://createam.cloud/registro
- **Tienda Bella Sorpresa**: https://bellasorpresa.pe
- **Subdominio ejemplo**: https://tienda.createam.cloud

---

## ✅ Checklist Final

- [ ] Node.js instalado en VPS
- [ ] PM2 instalado y configurado
- [ ] Nginx instalado y configurado
- [ ] Proyecto subido al VPS
- [ ] .env.local configurado
- [ ] npm build exitoso
- [ ] Aplicación corriendo en PM2
- [ ] DNS configurados en Hostinger
- [ ] SSL instalado con Certbot
- [ ] Firewall configurado
- [ ] Dominios probados y funcionando
- [ ] Backup configurado

---

## 📞 Contacto y Soporte

Si tienes problemas, revisa:
1. Logs de PM2: `pm2 logs`
2. Logs de Nginx: `/var/log/nginx/error.log`
3. Estado de servicios: `systemctl status nginx`
