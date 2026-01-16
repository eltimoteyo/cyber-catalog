# Guía: Crear Tenant de Prueba

## Opción 1: Usando Script Automático (Recomendado)

### Paso 1: Ejecutar el script
```bash
node scripts/create-test-tenant.js
```

Esto creará automáticamente un tenant llamado "Bella Sorpresa" en tu Firestore.

---

## Opción 2: Manualmente desde Firebase Console

### Paso 1: Ir a Firebase Console
1. Abre: https://console.firebase.google.com/project/cyber-catalog/firestore
2. Click en **"Iniciar colección"**

### Paso 2: Crear colección "tenants"
1. ID de colección: `tenants`
2. Click en **"Siguiente"**

### Paso 3: Agregar documento
1. ID del documento: (dejar automático o usar: `bellasorpresa`)
2. Agregar los siguientes campos:

```
Campo: name
Tipo: string
Valor: Bella Sorpresa

Campo: email
Tipo: string
Valor: contacto@bellasorpresa.pe

Campo: domain
Tipo: string
Valor: bellasorpresa.pe

Campo: subdomain
Tipo: null
Valor: null

Campo: status
Tipo: string
Valor: active

Campo: whatsapp
Tipo: string
Valor: +51999999999

Campo: colors
Tipo: map
  - primary: (string) 346 77% 50%
  - secondary: (string) 346 100% 97%

Campo: firebaseConfig
Tipo: map
  - apiKey: (string) AIzaSyAB2f4yzW_klDJrlNtnyVi387eEHSM_0r8
  - authDomain: (string) cyber-catalog.firebaseapp.com
  - projectId: (string) cyber-catalog
  - storageBucket: (string) cyber-catalog.firebasestorage.app
  - messagingSenderId: (string) 145571149256
  - appId: (string) 1:145571149256:web:6583321f194b2c19323cfd

Campo: createdAt
Tipo: timestamp
Valor: (fecha actual)

Campo: updatedAt
Tipo: timestamp
Valor: (fecha actual)
```

3. Click en **"Guardar"**

---

## Opción 3: Importar JSON

### Paso 1: Copiar este JSON
```json
{
  "name": "Bella Sorpresa",
  "email": "contacto@bellasorpresa.pe",
  "domain": "bellasorpresa.pe",
  "subdomain": null,
  "status": "active",
  "whatsapp": "+51999999999",
  "colors": {
    "primary": "346 77% 50%",
    "secondary": "346 100% 97%"
  },
  "firebaseConfig": {
    "apiKey": "AIzaSyAB2f4yzW_klDJrlNtnyVi387eEHSM_0r8",
    "authDomain": "cyber-catalog.firebaseapp.com",
    "projectId": "cyber-catalog",
    "storageBucket": "cyber-catalog.firebasestorage.app",
    "messagingSenderId": "145571149256",
    "appId": "1:145571149256:web:6583321f194b2c19323cfd"
  }
}
```

### Paso 2: Usar extensión de Firebase
1. Instalar Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Importar datos (requiere configuración adicional)

---

## Verificar que funcionó

1. Ve a: http://localhost:3000/admin
2. Deberías ver "Bella Sorpresa" en la lista de tenants
3. Status debe ser "active"

## Crear Productos de Prueba

Una vez que tengas el tenant, crea algunos productos:

### Desde Firestore Console:
1. Ir a: https://console.firebase.google.com/project/cyber-catalog/firestore
2. Crear colección: `products`
3. Agregar documento:

```json
{
  "name": "Ramo de Rosas Rojas",
  "description": "Hermoso ramo de 12 rosas rojas importadas",
  "price": 89.90,
  "category": "Flores",
  "imageUrls": [
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7"
  ],
  "featured": true,
  "createdAt": "(timestamp actual)",
  "updatedAt": "(timestamp actual)"
}
```

## URLs para Probar

Después de crear el tenant:

- **Landing**: http://localhost:3000
- **Admin Plataforma**: http://localhost:3000/admin
- **Tienda (simulada en localhost)**: http://localhost:3000/store?_domain=bellasorpresa.pe
- **Admin Tenant**: http://localhost:3000/tenant-admin?_domain=bellasorpresa.pe

## Troubleshooting

### No veo el tenant en /admin
- Verifica que el campo `status` sea "active"
- Refresca la página
- Revisa la consola del navegador

### Tenant no carga en /store
- Verifica que el `firebaseConfig` esté completo
- Confirma que el dominio sea exacto
- Revisa logs del servidor

### Imágenes no cargan
- Usa URLs públicas de imágenes
- Configura Firebase Storage
- Verifica reglas de Storage
