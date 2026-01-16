# 🚀 Inicio Rápido - Createam Platform

## Comenzar en 5 Minutos

### 1. Instalar Dependencias

```bash
npm install
# o
bun install
```

### 2. Configurar Firebase Central

Crea `.env.local`:

```env
NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID=123456
NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID=1:123456:web:abc123
NEXT_PUBLIC_PLATFORM_DOMAIN=createam.cloud
```

### 3. Ejecutar

```bash
npm run dev
```

Visita: http://localhost:3000

## 📁 Estructura del Proyecto

```
createam-platform/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── page.tsx           # Landing page
│   │   ├── registro/          # Formulario registro
│   │   ├── login/             # Login admin
│   │   ├── admin/             # Panel admin
│   │   └── store/             # Storefront tenants
│   ├── components/
│   │   ├── ui/                # Componentes Shadcn
│   │   ├── admin/             # Componentes admin
│   │   └── store/             # Componentes tienda
│   └── lib/
│       ├── firebase.ts        # Config Firebase
│       ├── tenants.ts         # Lógica tenants
│       ├── types.ts           # TypeScript types
│       └── utils.ts           # Utilidades
├── middleware.ts              # Detección tenant
└── package.json
```

## 🎯 Próximos Pasos

### Desarrollo Local

1. **Probar Landing**: http://localhost:3000
2. **Probar Registro**: http://localhost:3000/registro
3. **Probar Admin**: http://localhost:3000/admin

### Configurar Primer Tenant

1. Crea proyecto Firebase para el tenant
2. Agrega documento en Firestore Central:
   ```
   tenants/tenant-id
   ```
3. Configura dominio en `/etc/hosts`:
   ```
   127.0.0.1 mitienda.local
   ```
4. Visita: http://mitienda.local:3000

### Deploy

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod
```

## 📚 Documentación Completa

- [README.md](README.md) - Documentación completa
- [SETUP.md](SETUP.md) - Guía de instalación detallada
- [MIGRATION.md](MIGRATION.md) - Migrar Bellasorpresa
- [TODO.md](TODO.md) - Mejoras pendientes

## 🆘 Problemas Comunes

### Error: Firebase not initialized
```bash
# Verifica .env.local
cat .env.local
```

### Error: Module not found
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Subdominios no funcionan en local
```bash
# Editar /etc/hosts (Mac/Linux) o C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 mitienda.local
```

## 💡 Tips

- Usa `bun` en lugar de `npm` para instalar más rápido
- Revisa logs en tiempo real: `npm run dev`
- Para producción, siempre usa variables de entorno

## 🔗 Enlaces Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Firebase Central configurado
- [ ] Al menos un tenant de prueba
- [ ] DNS configurado (producción)
- [ ] Dominio verificado en Vercel/Netlify

---

¿Dudas? Revisa la [documentación completa](README.md) o contacta al equipo.
