# Guía de Instalación y Configuración

## 1. Instalación Inicial

```bash
# Instalar dependencias
npm install
# o
bun install
```

## 2. Configurar Firebase Central

### Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto: "createam-central"
3. Habilita Firestore Database
4. Ve a Project Settings > General
5. Copia las credenciales de configuración

### Crear Base de Datos

En Firestore, crea la colección:
```
tenants/
```

### Reglas de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tenants/{tenantId} {
      // Lectura pública para tenants activos (para que el middleware pueda leerlos)
      allow read: if resource.data.status == 'active';
      
      // Solo admin puede escribir
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 3. Configurar Variables de Entorno

Crea `.env.local`:

```env
# Firebase Central (para gestión de tenants)
NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN=createam-central.firebaseapp.com
NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID=createam-central
NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET=createam-central.appspot.com
NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID=1:123456789:web:abc123

# Dominio de la plataforma
NEXT_PUBLIC_PLATFORM_DOMAIN=createam.cloud
```

## 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Visita: http://localhost:3000

## 5. Configurar Primer Tenant (Bellasorpresa)

### a) Crear Proyecto Firebase del Tenant

1. Crea nuevo proyecto Firebase: "bellasorpresa"
2. Habilita Firestore Database
3. Copia credenciales

### b) Estructura Firestore del Tenant

```
products/
  └── {productId}/
      ├── name: "Ramo de Rosas"
      ├── description: "Hermoso ramo..."
      ├── price: 89.90
      ├── category: "Flores"
      ├── imageUrls: ["https://..."]
      ├── createdAt: timestamp
      └── updatedAt: timestamp

categories/
  └── {categoryId}/
      ├── name: "Flores"
      └── order: 1
```

### c) Registrar Tenant en Firebase Central

En Firestore de "createam-central", agrega documento en `tenants/`:

```json
{
  "name": "Bella Sorpresa",
  "email": "contacto@bellasorpresa.pe",
  "domain": "bellasorpresa.pe",
  "subdomain": null,
  "status": "active",
  "logo": "https://bellasorpresa.pe/logo.png",
  "colors": {
    "primary": "346 77% 50%",
    "secondary": "346 100% 97%"
  },
  "whatsapp": "+51999999999",
  "firebaseConfig": {
    "apiKey": "AIza...",
    "authDomain": "bellasorpresa.firebaseapp.com",
    "projectId": "bellasorpresa",
    "storageBucket": "bellasorpresa.appspot.com",
    "messagingSenderId": "123...",
    "appId": "1:123..."
  },
  "createdAt": "2026-01-16T...",
  "updatedAt": "2026-01-16T..."
}
```

## 6. Probar con Subdominios en Local

Para probar subdominios en localhost:

### Windows
Edita `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 bellasorpresa.local
127.0.0.1 tienda1.createam.local
```

Visita: http://bellasorpresa.local:3000

## 7. Deploy a Producción

### Vercel

```bash
vercel deploy
```

Configurar en Vercel:
- Agregar variables de entorno
- Configurar dominios personalizados
- Habilitar wildcard domain: `*.createam.cloud`

### Configuración DNS

#### Para createam.cloud
```
A     @           → [IP de Vercel]
CNAME www         → cname.vercel-dns.com
CNAME *           → cname.vercel-dns.com
```

#### Para dominios de clientes (ej: bellasorpresa.pe)
```
CNAME @           → cname.vercel-dns.com
CNAME www         → cname.vercel-dns.com
```

## 8. Flujo Completo

1. **Cliente se registra** en createam.cloud/registro
2. **Admin recibe notificación** (implementar)
3. **Admin va a** createam.cloud/admin
4. **Admin aprueba tenant** (cambia status a "active")
5. **Admin configura**:
   - Crea proyecto Firebase del cliente
   - Sube logo
   - Configura colores
   - Ingresa credenciales Firebase
   - Configura WhatsApp
6. **Cliente recibe notificación** (implementar)
7. **Cliente agrega productos** en su Firebase
8. **Tienda está live** en su dominio

## 9. Migrar Bellasorpresa Actual

```bash
# Desde el proyecto actual tiktok-shop-link

# 1. Exportar productos de Firebase
# Usar Firebase Console o script

# 2. Importar a nuevo Firebase
# Usar Firebase Console o script

# 3. Actualizar DNS de bellasorpresa.pe
# Apuntar a la nueva plataforma
```

## 10. Mejoras Futuras

- [ ] Autenticación admin con Firebase Auth
- [ ] Notificaciones por email
- [ ] Dashboard de analytics por tenant
- [ ] Editor visual de temas
- [ ] Gestión de productos desde admin central
- [ ] Multi-idioma
- [ ] Pasarela de pagos
- [ ] Gestión de pedidos

## Troubleshooting

### Error: Firebase not initialized
- Verifica que las variables de entorno estén configuradas
- Revisa que los dominios en Firebase Auth estén autorizados

### Error: Tenant not found
- Verifica que el tenant exista en Firestore Central
- Verifica que el status sea "active"
- Revisa las reglas de Firestore

### Subdominios no funcionan
- Verifica configuración DNS wildcard
- En desarrollo, usa /etc/hosts

## Soporte

Para soporte, contacta: soporte@createam.cloud
