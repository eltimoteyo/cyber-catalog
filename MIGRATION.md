# Script de Migración - Bellasorpresa a Createam Platform

## Paso 1: Exportar Datos del Proyecto Actual

### A. Desde Firebase Console

1. Ve a Firestore en el proyecto actual de Bellasorpresa
2. Exporta las colecciones:
   - `products`
   - `categories` (si existe)

### B. Usando Firebase CLI

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Login
firebase login

# Exportar datos
firebase firestore:export export-data --project [PROJECT_ID]
```

## Paso 2: Crear Nuevo Proyecto Firebase para Bellasorpresa

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea nuevo proyecto: "bellasorpresa-prod"
3. Habilita Firestore Database
4. Configura reglas de Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos - lectura pública
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Categorías - lectura pública
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Pedidos (futuro)
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Habilita Storage y configura CORS:

```bash
# cors.json
[
  {
    "origin": ["https://bellasorpresa.pe", "https://www.bellasorpresa.pe"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]

# Aplicar CORS
gsutil cors set cors.json gs://[YOUR-BUCKET-NAME]
```

## Paso 3: Importar Datos al Nuevo Firebase

### A. Importar desde export

```bash
firebase firestore:import export-data --project bellasorpresa-prod
```

### B. Migrar imágenes a Firebase Storage

```bash
# Script Node.js para migrar imágenes
node scripts/migrate-images.js
```

## Paso 4: Registrar Tenant en Firebase Central

En Firestore del proyecto "createam-central", agrega documento en `tenants/bellasorpresa`:

```json
{
  "name": "Bella Sorpresa",
  "email": "contacto@bellasorpresa.pe",
  "domain": "bellasorpresa.pe",
  "subdomain": null,
  "status": "active",
  "logo": "https://firebasestorage.googleapis.com/.../logo.png",
  "colors": {
    "primary": "346 77% 50%",
    "secondary": "346 100% 97%"
  },
  "whatsapp": "+51999999999",
  "firebaseConfig": {
    "apiKey": "NUEVA_API_KEY",
    "authDomain": "bellasorpresa-prod.firebaseapp.com",
    "projectId": "bellasorpresa-prod",
    "storageBucket": "bellasorpresa-prod.appspot.com",
    "messagingSenderId": "NUEVO_SENDER_ID",
    "appId": "NUEVO_APP_ID"
  },
  "createdAt": "2026-01-16T00:00:00Z",
  "updatedAt": "2026-01-16T00:00:00Z",
  "approvedAt": "2026-01-16T00:00:00Z",
  "approvedBy": "admin"
}
```

## Paso 5: Configurar DNS

### Opción A: Cambio gradual con subdominio temporal

1. Mientras configuras, usa subdominio temporal:
   ```
   CNAME beta.bellasorpresa.pe → cname.vercel-dns.com
   ```

2. Prueba: https://beta.bellasorpresa.pe

3. Una vez verificado, cambia el dominio principal:
   ```
   CNAME @ → cname.vercel-dns.com
   CNAME www → cname.vercel-dns.com
   ```

### Opción B: Cambio directo

```
# Actualizar DNS de bellasorpresa.pe
A     @   → [IP de Vercel]  (o CNAME si tu proveedor lo permite)
CNAME www → cname.vercel-dns.com
```

**⚠️ Nota**: Cambios DNS pueden tardar 24-48 horas en propagarse

## Paso 6: Verificar en Producción

1. Verifica que el sitio carga: https://bellasorpresa.pe
2. Prueba navegación de productos
3. Prueba botón de WhatsApp
4. Verifica SEO (meta tags, Open Graph)
5. Prueba desde móvil

## Paso 7: Monitoreo Post-Migración

- Configura Google Analytics (si no lo tienes)
- Configura Search Console
- Monitorea errores en Vercel Dashboard
- Revisa logs de Firebase

## Rollback (Si algo sale mal)

1. Revertir cambios DNS al servidor anterior
2. Esperar propagación DNS
3. Investigar y corregir problemas
4. Reintentar migración

## Checklist Final

- [ ] Datos exportados del Firebase actual
- [ ] Nuevo proyecto Firebase creado y configurado
- [ ] Datos importados correctamente
- [ ] Tenant registrado en Firebase Central
- [ ] DNS actualizado
- [ ] Sitio verificado en producción
- [ ] WhatsApp funcionando
- [ ] Imágenes cargando correctamente
- [ ] SEO verificado
- [ ] Google Analytics configurado

## Tiempo Estimado

- Preparación y export: 1 hora
- Configuración nuevo Firebase: 30 min
- Import de datos: 30 min
- Configuración tenant: 15 min
- Cambio DNS y pruebas: 2-24 horas (propagación)

**Total**: 1 día aproximadamente

## Soporte

Si necesitas ayuda durante la migración, contacta a tu equipo técnico.
