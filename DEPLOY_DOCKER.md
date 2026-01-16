# 🐳 Despliegue con Docker en VPS

## 📋 Comandos para ejecutar en tu VPS

### 1️⃣ Conectar al VPS
```bash
ssh root@72.62.138.112
```

### 2️⃣ Instalar Docker
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install -y docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### 3️⃣ Clonar el proyecto
```bash
cd /var/www
git clone https://github.com/eltimoteyo/cyber-catalog.git createam-platform
cd createam-platform
```

### 4️⃣ Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.production .env

# Editar si es necesario (ya tiene los valores correctos)
nano .env
```

### 5️⃣ Construir y ejecutar con Docker
```bash
# Construir imagen
docker-compose build

# Iniciar contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 6️⃣ Configurar DNS en Hostinger
Ve a: https://hpanel.hostinger.com/domains/createam.cloud/dns

Agregar estos registros:
```
Tipo: A | Nombre: @ | Valor: 72.62.138.112
Tipo: A | Nombre: www | Valor: 72.62.138.112
Tipo: A | Nombre: * | Valor: 72.62.138.112
```

Esperar 10-30 minutos para propagación.

### 7️⃣ Instalar SSL con Certbot
```bash
# Detener Nginx temporalmente
docker-compose stop nginx

# Instalar Certbot
apt install -y certbot

# Obtener certificados
certbot certonly --standalone -d createam.cloud -d www.createam.cloud

# Reiniciar todo
docker-compose up -d
```

### 8️⃣ Verificar
```bash
# Ver contenedores corriendo
docker ps

# Probar
curl http://localhost:3000
```

En navegador:
- http://72.62.138.112
- https://createam.cloud (después de DNS + SSL)

---

## 🔄 Comandos útiles

### Ver logs
```bash
docker-compose logs -f app
docker-compose logs -f nginx
```

### Reiniciar
```bash
docker-compose restart
```

### Detener
```bash
docker-compose down
```

### Actualizar después de cambios
```bash
cd /var/www/createam-platform
git pull origin main
docker-compose build
docker-compose up -d
```

### Ver uso de recursos
```bash
docker stats
```

### Limpiar imágenes viejas
```bash
docker system prune -a
```

---

## 🚀 Actualización automática

Crear script:
```bash
nano /var/www/createam-platform/update.sh
```

Contenido:
```bash
#!/bin/bash
cd /var/www/createam-platform
git pull origin main
docker-compose build
docker-compose up -d
docker system prune -f
echo "✅ Actualización completada"
```

Dar permisos:
```bash
chmod +x /var/www/createam-platform/update.sh
```

Usar:
```bash
/var/www/createam-platform/update.sh
```

---

## 🐛 Troubleshooting

### Contenedor no inicia
```bash
docker-compose logs app
docker-compose restart app
```

### Puerto ocupado
```bash
# Ver qué usa el puerto 3000
lsof -i :3000
# Detener y reiniciar
docker-compose down
docker-compose up -d
```

### SSL no funciona
```bash
# Verificar certificados
ls -la /etc/letsencrypt/live/createam.cloud/
# Reiniciar Nginx
docker-compose restart nginx
```

### Ver dentro del contenedor
```bash
docker exec -it createam-platform sh
```
