// Script para crear el usuario en Firestore
// Ejecutar: node create-user-firestore.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase Central Config
const centralFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID,
};

const app = initializeApp(centralFirebaseConfig);
const db = getFirestore(app);

async function createUser() {
  const userId = 'oVlDBqvPkibPJCuA0izSRl2haJU2'; // UID del usuario de Firebase Auth
  const tenantId = 'Gq4xtoalZu8hkiBum2cB'; // ID del tenant de Bella Sorpresa

  try {
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      email: 'admin@bellasorpresa.pe',
      tenantId: tenantId,
      role: 'owner',
      displayName: 'Admin Bella Sorpresa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Usuario creado exitosamente en Firestore');
    console.log('📧 Email:', 'admin@bellasorpresa.pe');
    console.log('🔑 UID:', userId);
    console.log('🏢 Tenant ID:', tenantId);
    console.log('\nAhora puedes hacer login en la aplicación.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    process.exit(1);
  }
}

createUser();
