# 🐳 Setup Simple con tu Nginx Existente

## 📋 Paso 1: Clonar e iniciar contenedor

```bash
# Clonar proyecto
cd /var/www
git clone https://github.com/eltimoteyo/cyber-catalog.git createam-platform
cd createam-platform

# Copiar variables de entorno
cp .env.production .env

# Construir e iniciar (solo Next.js en puerto 3000)
docker-compose build
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## 📋 Paso 2: Configurar tu Nginx existente

Encuentra tu configuración de Nginx (probablemente en `/etc/nginx/sites-available/` o `/etc/nginx/conf.d/`)

### Crear archivo para createam.cloud:

```bash
nano /etc/nginx/sites-available/createam.cloud
```

Pegar:

```nginx
# HTTP - redirigir a HTTPS
server {
    listen 80;
    server_name createam.cloud www.createam.cloud;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS - Dominio principal
server {
    listen 443 ssl http2;
    server_name createam.cloud www.createam.cloud;

    ssl_certificate /etc/letsencrypt/live/createam.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/createam.cloud/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

# HTTPS - Subdominios (*.createam.cloud)
server {
    listen 443 ssl http2;
    server_name *.createam.cloud;

    ssl_certificate /etc/letsencrypt/live/createam.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/createam.cloud/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

### Activar configuración:

```bash
# Crear symlink
ln -sf /etc/nginx/sites-available/createam.cloud /etc/nginx/sites-enabled/

# Probar configuración
nginx -t

# Recargar Nginx
systemctl reload nginx
```

## 📋 Paso 3: Configurar DNS

En Hostinger: https://hpanel.hostinger.com/domains/createam.cloud/dns

```
Tipo: A | Nombre: @ | Valor: 72.62.138.112
Tipo: A | Nombre: www | Valor: 72.62.138.112
Tipo: A | Nombre: * | Valor: 72.62.138.112
```

Esperar 10-30 minutos.

## 📋 Paso 4: SSL (si no lo tienes ya)

```bash
# Instalar certbot si no está
apt install -y certbot python3-certbot-nginx

# Obtener certificado
certbot --nginx -d createam.cloud -d www.createam.cloud

# Auto-renovación ya viene configurada
```

## ✅ Verificar

```bash
# Ver contenedor
docker ps | grep createam

# Ver logs
docker logs -f createam-platform

# Probar localmente
curl http://localhost:3000

# En navegador
https://createam.cloud
```

## 🔄 Actualizar después

```bash
cd /var/www/createam-platform
git pull origin main
docker-compose build
docker-compose up -d
```

## 🐛 Troubleshooting

### Ver logs del contenedor
```bash
docker logs -f createam-platform
```

### Reiniciar contenedor
```bash
docker-compose restart
```

### Ver si el puerto 3000 responde
```bash
curl http://localhost:3000
```

### Ver logs de Nginx
```bash
tail -f /var/log/nginx/error.log
```

### Probar configuración Nginx
```bash
nginx -t
```
