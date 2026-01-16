# Panel de Administración de Tenant - Guía Completa

## 🎯 Funcionalidades Implementadas

### 1. Dashboard Principal (`/tenant-admin`)
- **Estadísticas**: Total de productos, categorías, vistas y conversiones
- **Acciones Rápidas**: Shortcuts para tareas comunes
- **Vista general** del estado de la tienda

### 2. Gestión de Productos (`/tenant-admin/products`)

#### Listar Productos
- Vista de todos los productos con miniatura
- Buscador en tiempo real
- Precio, categoría y descripción visible
- Acciones: Editar y Eliminar

#### Crear Producto (`/tenant-admin/products/new`)
- **Campos**:
  - Nombre (requerido)
  - Descripción
  - Precio (requerido)
  - Categoría (selector)
  - Imágenes múltiples
  - Destacado (checkbox)
- **Upload de imágenes**: Drag & drop con preview
- **Validación**: Campos requeridos

#### Editar Producto (`/tenant-admin/products/[id]/edit`)
- Editar toda la información
- Gestionar imágenes existentes
- Agregar nuevas imágenes
- Eliminar imágenes

### 3. Gestión de Categorías (`/tenant-admin/categories`)
- **Crear categorías**: Input rápido
- **Editar**: Inline editing
- **Eliminar**: Con confirmación
- **Ordenar**: Drag & drop (visual, pendiente funcionalidad)

### 4. Configuración (`/tenant-admin/settings`)

#### Branding
- **Logo**: Upload con preview
- **Color Primario**: HSL con preview de color
- **Color Secundario**: HSL con preview de color
- **Preview en tiempo real** de colores

#### Contacto
- WhatsApp (con formato)
- Instagram
- Facebook

#### Información
- Dominio actual (solo lectura)

## 🔐 Acceso al Panel Admin

### Desde la Tienda Pública
1. Visitar la tienda: `https://mitienda.com`
2. Click en botón **"Admin"** en el header
3. Redirige a `/tenant-admin`

### Directo
- URL: `https://mitienda.com/tenant-admin`

## 📂 Estructura de Archivos

```
src/app/tenant-admin/
├── layout.tsx                    # Layout con sidebar
├── page.tsx                      # Dashboard
├── products/
│   ├── page.tsx                 # Lista de productos
│   ├── new/
│   │   └── page.tsx            # Crear producto
│   └── [id]/
│       └── edit/
│           └── page.tsx        # Editar producto
├── categories/
│   └── page.tsx                # Gestión de categorías
└── settings/
    └── page.tsx                # Configuración

src/components/tenant-admin/
└── TenantAdminLayout.tsx       # Layout component

src/lib/
└── products.ts                 # Funciones CRUD + upload
```

## 🔥 Firebase Storage - Estructura

```
products/
  └── {tenantId}/
      ├── 1234567890_imagen1.jpg
      ├── 1234567890_imagen2.png
      └── ...
```

## 🎨 Personalización de Colores

### Formato HSL
Los colores se guardan en formato HSL (Hue, Saturation, Lightness):
```
primary: "222.2 47.4% 11.2%"
```

### Aplicación
Los colores se aplican dinámicamente con CSS variables:
```css
--primary: hsl(222.2 47.4% 11.2%)
```

## 🔄 Flujo de Trabajo

### Agregar Producto
1. Click **"Nuevo Producto"**
2. Llenar formulario
3. Subir imágenes (múltiples)
4. Seleccionar categoría
5. Guardar → Las imágenes se suben a Firebase Storage
6. Producto se guarda en Firestore del tenant

### Personalizar Tienda
1. Ir a **"Configuración"**
2. Subir logo
3. Configurar colores (HSL)
4. Agregar WhatsApp
5. Guardar → Cambios se reflejan inmediatamente en Firebase Central

## ⚙️ Configuración Requerida

### 1. Firebase del Tenant
Cada tenant debe tener:
- Proyecto Firebase propio
- Firestore habilitado
- Storage habilitado
- Reglas configuradas

### 2. Reglas de Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{tenantId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Próximas Mejoras

### Autenticación
- [ ] Login por tenant
- [ ] Múltiples usuarios admin por tenant
- [ ] Roles y permisos

### Productos
- [ ] Bulk upload (CSV/Excel)
- [ ] Variantes de productos (tallas, colores)
- [ ] Stock e inventario
- [ ] Productos relacionados

### Categorías
- [ ] Subcategorías
- [ ] Ordenar con drag & drop funcional
- [ ] Imágenes de categoría

### Analytics
- [ ] Productos más vistos
- [ ] Clicks en WhatsApp
- [ ] Conversiones
- [ ] Gráficos de ventas

### Configuración
- [ ] Editor visual de temas
- [ ] Templates predefinidos
- [ ] Preview en tiempo real
- [ ] SEO settings (meta tags, etc)

### Media
- [ ] Galería de medios
- [ ] Edición de imágenes
- [ ] Optimización automática
- [ ] CDN integration

## 📱 Responsive

Todo el panel admin es completamente responsive:
- **Desktop**: Sidebar fijo
- **Tablet**: Sidebar colapsable
- **Mobile**: Menu hamburguesa

## 🐛 Troubleshooting

### Imágenes no se suben
- Verificar que Storage esté habilitado
- Revisar reglas de Storage
- Confirmar límites de tamaño

### Productos no se guardan
- Verificar credenciales Firebase
- Revisar consola de errores
- Confirmar reglas de Firestore

### Colores no se aplican
- Verificar formato HSL correcto
- Reload página para ver cambios
- Revisar CSS variables en DevTools

## 💡 Tips

1. **Imágenes**: Usar WebP para mejor rendimiento
2. **Colores**: Usar generador HSL online
3. **Categorías**: Crear antes de agregar productos
4. **Backup**: Exportar datos regularmente

## 🔗 URLs Útiles

- **Dashboard**: `/tenant-admin`
- **Productos**: `/tenant-admin/products`
- **Nuevo Producto**: `/tenant-admin/products/new`
- **Categorías**: `/tenant-admin/categories`
- **Configuración**: `/tenant-admin/settings`
- **Ver Tienda**: `/` (con botón "Ver Tienda")

---

**Nota**: Este panel es independiente del admin de la plataforma (`/admin`). Cada tenant gestiona solo su propia tienda.
