# 🚀 Guía Rápida de Despliegue en Hostinger VPS

## 📋 Pasos Rápidos

### 1. Conectarse al VPS por SSH

```bash
ssh root@tu-ip-vps
# O con usuario específico
ssh usuario@tu-ip-vps
```

### 2. Ejecutar instalación base

```bash
# Descargar script de instalación
curl -o install.sh https://raw.githubusercontent.com/tu-repo/scripts/install-vps.sh

# O copiar desde tu PC y pegar
nano install.sh
# Pegar contenido, Ctrl+X, Y, Enter

# Dar permisos y ejecutar
chmod +x install.sh
bash install.sh
```

**Lo que instala automáticamente:**
- ✅ Node.js 20 LTS
- ✅ PM2 (gestor de procesos)
- ✅ Nginx (servidor web)
- ✅ Certbot (para SSL)
- ✅ Firewall configurado

---

### 3. Subir el proyecto

**Opción A: Git (Recomendado)**

```bash
cd /var/www
git clone https://github.com/tu-usuario/createam-platform.git
cd createam-platform
```

**Opción B: Comprimir y subir**

En tu PC:
```bash
# Comprimir proyecto (sin node_modules)
cd d:\PROJECTS\bellasorpresa\createam-platform
tar -czf createam-platform.tar.gz --exclude=node_modules --exclude=.next .
```

Subir por FTP a `/var/www/` y descomprimir en VPS:
```bash
cd /var/www
mkdir createam-platform
tar -xzf createam-platform.tar.gz -C createam-platform
cd createam-platform
```

---

### 4. Copiar scripts al VPS

Asegúrate de que estos scripts estén en `/var/www/createam-platform/scripts/`:
- `setup-project.sh`
- `setup-nginx.sh`
- `deploy.sh`

Darles permisos:
```bash
cd /var/www/createam-platform
chmod +x scripts/*.sh
```

---

### 5. Configurar el proyecto

```bash
cd /var/www/createam-platform
bash scripts/setup-project.sh
```

Te pedirá:
- Firebase API Key
- Firebase Auth Domain
- Firebase Project ID
- Firebase Storage Bucket
- Firebase Messaging Sender ID
- Firebase App ID
- Dominio de la plataforma

**Datos para usar:**
```
Firebase API Key: AIzaSyAB2f4yzW_klDJrlNtnyVi387eEHSM_0r8
Firebase Auth Domain: cyber-catalog.firebaseapp.com
Firebase Project ID: cyber-catalog
Firebase Storage Bucket: cyber-catalog.firebasestorage.app
Firebase Messaging Sender ID: 145571149256
Firebase App ID: 1:145571149256:web:6583321f194b2c19323cfd
Dominio de la plataforma: createam.cloud
```

---

### 6. Configurar Nginx

```bash
bash scripts/setup-nginx.sh
```

Te pedirá:
- Dominio principal (ej: createam.cloud)
- Si quieres configurar un tenant (ej: bellasorpresa.pe)

---

### 7. Configurar DNS en Hostinger

En el panel de Hostinger, para cada dominio:

**createam.cloud:**
| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | IP_DE_TU_VPS | 14400 |
| A | www | IP_DE_TU_VPS | 14400 |
| A | * | IP_DE_TU_VPS | 14400 |

**bellasorpresa.pe:**
| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | IP_DE_TU_VPS | 14400 |
| A | www | IP_DE_TU_VPS | 14400 |

⏰ Esperar 10-30 minutos para que propague el DNS

---

### 8. Instalar SSL (después de que DNS propague)

```bash
# Para el dominio principal
certbot --nginx -d createam.cloud -d www.createam.cloud

# Para el tenant
certbot --nginx -d bellasorpresa.pe -d www.bellasorpresa.pe
```

---

## ✅ Verificar que funciona

```bash
# Ver estado de la aplicación
pm2 list
pm2 logs createam-platform

# Ver estado de Nginx
systemctl status nginx

# Probar desde el navegador
curl http://localhost:3000
```

**URLs finales:**
- https://createam.cloud → Landing
- https://createam.cloud/admin → Admin plataforma
- https://bellasorpresa.pe → Tienda

---

## 🔄 Para futuras actualizaciones

Simplemente ejecuta:

```bash
cd /var/www/createam-platform
bash scripts/deploy.sh
```

---

## 🐛 Comandos útiles

```bash
# Ver logs en tiempo real
pm2 logs createam-platform

# Reiniciar aplicación
pm2 restart createam-platform

# Ver uso de recursos
pm2 monit

# Reiniciar Nginx
systemctl restart nginx

# Ver logs de Nginx
tail -f /var/log/nginx/error.log
```

---

## 📞 Si algo falla

1. **La app no inicia:**
   ```bash
   pm2 logs createam-platform
   ```

2. **Error 502 en Nginx:**
   ```bash
   pm2 restart createam-platform
   systemctl restart nginx
   ```

3. **DNS no resuelve:**
   ```bash
   dig createam.cloud
   # Esperar más tiempo (hasta 48h)
   ```

4. **SSL falla:**
   ```bash
   certbot renew --force-renewal
   ```
