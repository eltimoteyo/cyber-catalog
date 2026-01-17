/**
 * Script para actualizar el tenant de Bella Sorpresa con las credenciales correctas
 * Ejecutar: node update-bellasorpresa-tenant.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Firebase Central
const centralFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY || "AIzaSyD-tq3p7Z8FMYoYKxVVCkISDqLDVkbRbVE",
  authDomain: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN || "cyber-catalog.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID || "cyber-catalog",
  storageBucket: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET || "cyber-catalog.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID || "816331534848",
  appId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID || "1:816331534848:web:89d6e02ecc2c01e4a21b90",
};

const app = initializeApp(centralFirebaseConfig, 'central-update');
const db = getFirestore(app);

// Configuración correcta de Bella Sorpresa
const bellaSorpresaFirebaseConfig = {
  apiKey: "AIzaSyAEDIXmFz7aLxEzQ4YemEb1eZp8ldKSm1w",
  authDomain: "createam-5a670.firebaseapp.com",
  projectId: "createam-5a670",
  storageBucket: "createam-5a670.firebasestorage.app",
  messagingSenderId: "904126614612",
  appId: "1:904126614612:web:8b1254be947c722e8d31c1",
  measurementId: "G-P3BD3PS8FL"
};

async function updateBellaSorpresaTenant() {
  try {
    console.log('🔍 Buscando tenant de Bella Sorpresa...');
    
    // Buscar tenant por dominio
    const q = query(
      collection(db, 'tenants'),
      where('domain', '==', 'bellasorpresa.pe')
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ No se encontró el tenant de Bella Sorpresa');
      return;
    }
    
    const tenantDoc = snapshot.docs[0];
    const tenantId = tenantDoc.id;
    const currentData = tenantDoc.data();
    
    console.log('✅ Tenant encontrado:', tenantId);
    console.log('📝 Nombre:', currentData.name);
    console.log('🌐 Dominio:', currentData.domain);
    
    // Actualizar con las credenciales correctas
    const updates = {
      firebaseConfig: bellaSorpresaFirebaseConfig,
      socialMedia: {
        tiktok: 'https://www.tiktok.com/@bellasorpresa.pe',
        instagram: 'https://www.instagram.com/bellasorpresa.pe',
        facebook: 'https://www.facebook.com/bellasorpresa.pe'
      },
      whatsapp: '51999999999',
      updatedAt: new Date()
    };
    
    await updateDoc(doc(db, 'tenants', tenantId), updates);
    
    console.log('✅ Tenant actualizado correctamente');
    console.log('🔥 Firebase Config:', bellaSorpresaFirebaseConfig.projectId);
    console.log('📱 Redes sociales configuradas');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateBellaSorpresaTenant();
