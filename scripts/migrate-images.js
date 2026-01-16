// Script simple para migrar imágenes de un Firebase Storage a otro
// Uso: node scripts/migrate-images.js

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Configuración del proyecto origen (actual)
const sourceServiceAccount = require('../path-to-source-service-account.json');
const sourceApp = admin.initializeApp({
  credential: admin.credential.cert(sourceServiceAccount),
  storageBucket: 'SOURCE_BUCKET.appspot.com'
}, 'source');

// Configuración del proyecto destino (nuevo)
const destServiceAccount = require('../path-to-dest-service-account.json');
const destApp = admin.initializeApp({
  credential: admin.credential.cert(destServiceAccount),
  storageBucket: 'DEST_BUCKET.appspot.com'
}, 'dest');

const sourceBucket = sourceApp.storage().bucket();
const destBucket = destApp.storage().bucket();

async function migrateImages() {
  console.log('Iniciando migración de imágenes...');
  
  try {
    // Listar todos los archivos del bucket origen
    const [files] = await sourceBucket.getFiles();
    
    console.log(`Encontrados ${files.length} archivos para migrar`);
    
    for (const file of files) {
      console.log(`Migrando: ${file.name}`);
      
      // Descargar archivo
      const tempPath = path.join(__dirname, 'temp', file.name);
      await file.download({ destination: tempPath });
      
      // Subir a nuevo bucket
      await destBucket.upload(tempPath, {
        destination: file.name,
        metadata: file.metadata
      });
      
      // Limpiar archivo temporal
      fs.unlinkSync(tempPath);
      
      console.log(`✓ Migrado: ${file.name}`);
    }
    
    console.log('Migración completada exitosamente!');
  } catch (error) {
    console.error('Error durante la migración:', error);
  }
}

// Ejecutar migración
migrateImages();
