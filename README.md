# Createam Platform - Multi-Tenant E-commerce

Plataforma SaaS para crear tiendas online personalizadas con dominio propio o subdominio.

## 🚀 Características

- ✅ **Multi-tenant**: Múltiples tiendas con una sola instalación
- ✅ **Dominios personalizados**: Cada tenant puede usar su propio dominio
- ✅ **Subdominios**: Opción de subdominio gratuito (*.createam.cloud)
- ✅ **Personalización**: Logo, colores y branding por tenant
- ✅ **Firebase por tenant**: Cada tienda tiene su propia base de datos
- ✅ **SEO optimizado**: Server-Side Rendering con Next.js
- ✅ **Admin unificado**: Panel de administración centralizado
- ✅ **Auto-registro**: Los clientes pueden solicitar su tienda
- ✅ **Integración WhatsApp**: Ventas directas por WhatsApp

## 🏗️ Arquitectura

### Plataforma Principal
- **createam.cloud/** - Landing page
- **createam.cloud/registro** - Auto-registro de clientes
- **createam.cloud/admin** - Panel admin para gestionar tenants

### Tenants
- **bellasorpresa.pe/** - Tienda con dominio propio
- **tienda.createam.cloud/** - Tienda con subdominio

## 📦 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **UI**: Shadcn/UI + Tailwind CSS
- **Database**: Firebase (Central + por Tenant)
- **Hosting**: Vercel / Netlify
- **TypeScript**: Type-safe

## 🛠️ Instalación

1. Clonar el repositorio
```bash
git clone [repository-url]
cd createam-platform
```

2. Instalar dependencias
```bash
npm install
# o
bun install
```

3. Configurar variables de entorno
```bash
cp .env.local.example .env.local
```

Editar `.env.local` con tus credenciales de Firebase Central:
```env
NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN=tu-auth-domain
NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID=tu-app-id
NEXT_PUBLIC_PLATFORM_DOMAIN=createam.cloud
```

4. Ejecutar en desarrollo
```bash
npm run dev
```

## 🔥 Configuración Firebase

### Firebase Central
Crea un proyecto Firebase para gestionar los tenants:

```
tenants/
  └── {tenantId}/
      ├── name: string
      ├── email: string
      ├── domain: string (opcional)
      ├── subdomain: string (opcional)
      ├── status: "pending" | "active" | "suspended" | "rejected"
      ├── logo: string (URL)
      ├── colors: { primary, secondary }
      ├── whatsapp: string
      ├── firebaseConfig: { ... }
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

### Firebase por Tenant
Cada tenant tiene su propio proyecto Firebase:

```
products/
  └── {productId}/
      ├── name: string
      ├── description: string
      ├── price: number
      ├── category: string
      ├── imageUrls: string[]
      └── createdAt: timestamp

categories/
  └── {categoryId}/
      ├── name: string
      └── order: number
```

## 🌐 Configuración de Dominios

### Para Subdominios
1. Configurar DNS wildcard: `*.createam.cloud` apuntando a tu servidor
2. El middleware detectará automáticamente el subdominio

### Para Dominios Personalizados
1. Cliente configura DNS: `CNAME` apuntando a tu plataforma
2. Agregar dominio en configuración del tenant
3. El middleware detectará el dominio personalizado

## 📝 Flujo de Trabajo

1. **Cliente se registra** en createam.cloud/registro
2. **Solicitud queda pendiente** (status: "pending")
3. **Admin revisa y aprueba** desde el panel admin
4. **Admin configura**:
   - Logo y colores
   - Credenciales Firebase del cliente
   - Dominio o subdominio
5. **Tenant activo** (status: "active")
6. **Cliente agrega productos** en su Firebase
7. **Tienda disponible** en el dominio configurado

## 🚀 Deploy

### Vercel
```bash
vercel deploy
```

Configurar variables de entorno en Vercel Dashboard.

### Netlify
```bash
netlify deploy --prod
```

## 🔐 Seguridad

- [ ] Implementar autenticación admin (Firebase Auth)
- [ ] Validar configuraciones Firebase
- [ ] Rate limiting en API routes
- [ ] Validación de dominios
- [ ] CORS configurado correctamente

## 📄 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir cambios mayores.
