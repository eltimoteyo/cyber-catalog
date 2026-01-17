# Firebase User Structure

## Colección: `users`

Almacena información de los usuarios administrativos de cada tenant.

### Campos:

```typescript
{
  uid: string;              // ID del usuario de Firebase Auth
  email: string;            // Email del usuario
  tenantId: string;         // ID del tenant al que pertenece
  role: 'admin' | 'owner';  // Rol del usuario
  displayName?: string;     // Nombre para mostrar (opcional)
  createdAt: string;        // Fecha de creación (ISO string)
  updatedAt: string;        // Fecha de última actualización (ISO string)
}
```

### Ejemplo de documento:

```json
{
  "uid": "abc123xyz",
  "email": "admin@bellasorpresa.pe",
  "tenantId": "Gq4xtoalZu8hkiBum2cB",
  "role": "owner",
  "displayName": "Admin Bella Sorpresa",
  "createdAt": "2026-01-17T10:00:00.000Z",
  "updatedAt": "2026-01-17T10:00:00.000Z"
}
```

### Roles:

- **owner**: Propietario del tenant, acceso total
- **admin**: Administrador con permisos limitados

### Uso:

1. Al crear un usuario en Firebase Auth, se debe crear un documento correspondiente en `users`
2. El `uid` debe coincidir con el UID de Firebase Auth
3. El `tenantId` vincula al usuario con su tienda
4. La autenticación usa estos datos para cargar el tenant correcto

### Comandos para crear usuario de prueba:

```javascript
// En Firebase Console o con Admin SDK
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firestore';

// 1. Crear usuario en Auth
const userCredential = await createUserWithEmailAndPassword(
  auth, 
  'admin@bellasorpresa.pe', 
  'password123'
);

// 2. Crear documento en Firestore
await setDoc(doc(db, 'users', userCredential.user.uid), {
  uid: userCredential.user.uid,
  email: 'admin@bellasorpresa.pe',
  tenantId: 'Gq4xtoalZu8hkiBum2cB', // ID de Bella Sorpresa
  role: 'owner',
  displayName: 'Admin Bella Sorpresa',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
```
