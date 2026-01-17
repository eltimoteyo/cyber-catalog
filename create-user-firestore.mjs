// Script para crear el usuario en Firestore
// Ejecutar: node create-user-firestore.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase Central Config
const centralFirebaseConfig = {
  apiKey: "AIzaSyCLdUPxOG1EfFv0xUr9qT_mL8PqWpbOMAw",
  authDomain: "createam-5a670.firebaseapp.com",
  projectId: "createam-5a670",
  storageBucket: "createam-5a670.firebasestorage.app",
  messagingSenderId: "849332486691",
  appId: "1:849332486691:web:12c066e50c5a78d7ae88bc"
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
