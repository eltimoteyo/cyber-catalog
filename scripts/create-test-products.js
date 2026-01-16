// Script para crear productos de prueba en Firebase
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

const testProducts = [
  {
    name: "Ramo de Rosas Rojas Premium",
    description: "Hermoso ramo de 12 rosas rojas importadas de tallo largo, envueltas en papel de regalo elegante. Perfectas para expresar amor y admiración.",
    price: 89.90,
    category: "Flores",
    imageUrls: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800"
    ],
    featured: true,
    stock: 20
  },
  {
    name: "Peluche Oso Gigante",
    description: "Adorable oso de peluche gigante de 1 metro de altura, suave y abrazable. Ideal para regalar en ocasiones especiales.",
    price: 149.90,
    category: "Peluches",
    imageUrls: [
      "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=800"
    ],
    featured: true,
    stock: 15
  },
  {
    name: "Caja de Chocolates Gourmet",
    description: "Exquisita selección de 24 chocolates artesanales rellenos. Perfectos para los amantes del chocolate fino.",
    price: 59.90,
    category: "Chocolates",
    imageUrls: [
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800"
    ],
    featured: false,
    stock: 30
  },
  {
    name: "Ramo de Tulipanes Mixtos",
    description: "Colorido ramo de 15 tulipanes holandeses en colores variados. Frescos y vibrantes, ideales para alegrar cualquier espacio.",
    price: 69.90,
    category: "Flores",
    imageUrls: [
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800"
    ],
    featured: true,
    stock: 18
  },
  {
    name: "Globos Metalizados Corazón",
    description: "Set de 5 globos metalizados en forma de corazón. Perfectos para decorar en celebraciones románticas.",
    price: 29.90,
    category: "Globos",
    imageUrls: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800"
    ],
    featured: false,
    stock: 50
  },
  {
    name: "Orquídea en Maceta",
    description: "Elegante orquídea Phalaenopsis en maceta decorativa. Planta de larga duración que aporta sofisticación a cualquier ambiente.",
    price: 79.90,
    category: "Flores",
    imageUrls: [
      "https://images.unsplash.com/photo-1558383530-28e33769d586?w=800"
    ],
    featured: false,
    stock: 12
  },
  {
    name: "Peluche Unicornio Mágico",
    description: "Tierno peluche de unicornio con cuerno dorado y melena arcoíris. 45cm de altura, suave y mullido.",
    price: 45.90,
    category: "Peluches",
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
    featured: false,
    stock: 25
  },
  {
    name: "Caja Sorpresa Deluxe",
    description: "Caja especial que incluye: rosas, chocolates, peluche pequeño y tarjeta personalizada. ¡Todo en uno!",
    price: 179.90,
    category: "Combos",
    imageUrls: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"
    ],
    featured: true,
    stock: 10
  }
];

async function createTestProducts() {
  try {
    console.log('🔥 Creando productos de prueba...\n');

    let successCount = 0;
    for (const product of testProducts) {
      const productData = {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log(`✅ Creado: ${product.name} (ID: ${docRef.id})`);
      successCount++;
    }

    console.log(`\n🎉 ${successCount} productos creados exitosamente!`);
    console.log('\n📋 Resumen:');
    console.log(`   - ${testProducts.filter(p => p.featured).length} productos destacados`);
    console.log(`   - Categorías: ${[...new Set(testProducts.map(p => p.category))].join(', ')}`);
    console.log(`   - Total en stock: ${testProducts.reduce((sum, p) => sum + p.stock, 0)} unidades`);
    console.log('\n🌐 Ver tienda en:');
    console.log('   http://localhost:3000/store?_domain=bellasorpresa.pe');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando productos:', error);
    process.exit(1);
  }
}

createTestProducts();
