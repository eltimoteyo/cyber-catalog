// Script para crear categorías de prueba en Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAB2f4yzW_klDJrlNtnyVi387eEHSM_0r8",
  authDomain: "cyber-catalog.firebaseapp.com",
  projectId: "cyber-catalog",
  storageBucket: "cyber-catalog.firebasestorage.app",
  messagingSenderId: "145571149256",
  appId: "1:145571149256:web:6583321f194b2c19323cfd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testCategories = [
  {
    name: "Flores",
    description: "Hermosas flores frescas para toda ocasión",
    order: 1,
    active: true
  },
  {
    name: "Peluches",
    description: "Adorables peluches de todos los tamaños",
    order: 2,
    active: true
  },
  {
    name: "Chocolates",
    description: "Deliciosos chocolates gourmet",
    order: 3,
    active: true
  },
  {
    name: "Globos",
    description: "Globos decorativos para celebraciones",
    order: 4,
    active: true
  },
  {
    name: "Combos",
    description: "Combos especiales con múltiples productos",
    order: 5,
    active: true
  }
];

async function createTestCategories() {
  try {
    console.log('🔥 Creando categorías de prueba...\n');

    let successCount = 0;
    for (const category of testCategories) {
      const categoryData = {
        ...category,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      console.log(`✅ Creada: ${category.name} (ID: ${docRef.id})`);
      successCount++;
    }

    console.log(`\n🎉 ${successCount} categorías creadas exitosamente!`);
    console.log('\n📋 Categorías disponibles:');
    testCategories.forEach(cat => {
      console.log(`   ${cat.order}. ${cat.name} - ${cat.description}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando categorías:', error);
    process.exit(1);
  }
}

createTestCategories();
