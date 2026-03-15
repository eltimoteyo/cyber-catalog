// Script para crear tenant de prueba en Firebase
const admin = require('firebase-admin');

// Inicializar Firebase Admin con las credenciales
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID,
};

// Para usar Firebase Admin, necesitarás una service account key
// Pero podemos usar el cliente web directamente
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createTestTenant() {
  try {
    console.log('🔥 Creando tenant de prueba...\n');

    const tenantData = {
      name: "Bella Sorpresa",
      email: "contacto@bellasorpresa.pe",
      domain: "bellasorpresa.pe",
      subdomain: null,
      status: "active",
      logo: "https://firebasestorage.googleapis.com/v0/b/cyber-catalog.appspot.com/o/logos%2Fbellasorpresa-logo.png?alt=media",
      colors: {
        primary: "346 77% 50%",
        secondary: "346 100% 97%",
        accent: "346 50% 60%"
      },
      whatsapp: "+51999999999",
      instagram: "@bellasorpresa",
      facebook: "facebook.com/bellasorpresa",
      // Firebase config del tenant (usa el mismo por ahora para pruebas)
      firebaseConfig: {
        apiKey: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      approvedAt: Timestamp.now(),
      approvedBy: "admin"
    };

    const docRef = await addDoc(collection(db, 'tenants'), tenantData);
    
    console.log('✅ Tenant creado exitosamente!');
    console.log('📝 ID:', docRef.id);
    console.log('🏪 Nombre:', tenantData.name);
    console.log('🌐 Dominio:', tenantData.domain);
    console.log('📊 Estado:', tenantData.status);
    console.log('\n🎉 Ahora puedes:');
    console.log('   1. Visitar: http://localhost:3000/admin');
    console.log('   2. Ver el tenant en la lista');
    console.log('   3. Configurarlo desde el panel admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando tenant:', error);
    process.exit(1);
  }
}

createTestTenant();
