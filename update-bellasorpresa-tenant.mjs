/**
 * Script para actualizar el tenant de Bella Sorpresa con las credenciales correctas
 * Ejecutar: node update-bellasorpresa-tenant.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Firebase Central
const centralFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID,
};

const app = initializeApp(centralFirebaseConfig, 'central-update');
const db = getFirestore(app);

// Configuración correcta de Bella Sorpresa
const bellaSorpresaFirebaseConfig = {
  apiKey: process.env.BELLASORPRESA_FIREBASE_API_KEY,
  authDomain: process.env.BELLASORPRESA_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.BELLASORPRESA_FIREBASE_PROJECT_ID,
  storageBucket: process.env.BELLASORPRESA_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.BELLASORPRESA_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.BELLASORPRESA_FIREBASE_APP_ID,
  measurementId: process.env.BELLASORPRESA_FIREBASE_MEASUREMENT_ID,
};

async function updateBellaSorpresaTenant() {
  try {
    console.log('🔍 Buscando tenant de Bella Sorpresa...');
    
    // Buscar tenant por dominio
    let q = query(
      collection(db, 'tenants'),
      where('domain', '==', 'bellasorpresa.pe')
    );
    
    let snapshot = await getDocs(q);
    
    // Si no se encuentra por dominio, buscar por nombre
    if (snapshot.empty) {
      console.log('⚠️  No se encontró por dominio, buscando por nombre...');
      q = query(
        collection(db, 'tenants')
      );
      snapshot = await getDocs(q);
      
      // Buscar por nombre que contenga "Bella" o "bellasorpresa"
      const matchingDoc = snapshot.docs.find(doc => {
        const data = doc.data();
        const name = (data.name || '').toLowerCase();
        return name.includes('bella') || name.includes('bellasorpresa');
      });
      
      if (matchingDoc) {
        snapshot = { docs: [matchingDoc], empty: false };
      }
    }
    
    if (snapshot.empty) {
      console.log('❌ No se encontró el tenant de Bella Sorpresa');
      console.log('💡 Asegúrate de que el tenant exista en Firestore');
      return;
    }
    
    const tenantDoc = snapshot.docs[0];
    const tenantId = tenantDoc.id;
    const currentData = tenantDoc.data();
    
    console.log('✅ Tenant encontrado:', tenantId);
    console.log('📝 Nombre:', currentData.name);
    console.log('🌐 Dominio:', currentData.domain || '(no configurado)');
    console.log('🔗 Subdominio:', currentData.subdomain || '(no configurado)');
    console.log('📊 Status:', currentData.status || '(no configurado)');
    
    // Actualizar con las credenciales correctas
    const updates = {
      firebaseConfig: bellaSorpresaFirebaseConfig,
      subdomain: 'bellasorpresa', // IMPORTANTE: Configurar subdominio para bellasorpresa.createam.cloud
      status: 'active', // Asegurar que esté activo
      socialMedia: {
        tiktok: 'https://www.tiktok.com/@bellasorpresa.pe',
        instagram: 'https://www.instagram.com/bellasorpresa.pe',
        facebook: 'https://www.facebook.com/bellasorpresa.pe'
      },
      whatsapp: '51999999999',
      updatedAt: new Date()
    };
    
    await updateDoc(doc(db, 'tenants', tenantId), updates);
    
    console.log('\n✅ Tenant actualizado correctamente');
    console.log('🔥 Firebase Config:', bellaSorpresaFirebaseConfig.projectId);
    console.log('🔗 Subdominio configurado: bellasorpresa');
    console.log('📊 Status: active');
    console.log('📱 Redes sociales configuradas');
    console.log('\n💡 Ahora deberías poder acceder a: https://bellasorpresa.createam.cloud/');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateBellaSorpresaTenant();
