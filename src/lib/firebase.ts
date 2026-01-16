import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase Central (para gestión de tenants)
const centralFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID,
};

// Inicializar Firebase Central (funciona en servidor y cliente)
const apps = getApps();
const centralApp = apps.find(app => app.name === 'central') || initializeApp(centralFirebaseConfig, 'central');
const centralDb = getFirestore(centralApp);
const centralStorage = getStorage(centralApp);

export { centralApp, centralDb, centralStorage };

// Cache de Firebase por tenant
const tenantFirebaseInstances = new Map<string, {
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
}>();

/**
 * Inicializa Firebase para un tenant específico
 */
export function initTenantFirebase(tenantId: string, config: any) {
  if (typeof window === 'undefined') {
    throw new Error('Tenant Firebase can only be initialized on client side');
  }

  // Si ya existe, retornarlo
  if (tenantFirebaseInstances.has(tenantId)) {
    return tenantFirebaseInstances.get(tenantId)!;
  }

  // Inicializar nueva instancia
  const app = initializeApp(config, `tenant-${tenantId}`);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const instance = { app, db, storage };
  tenantFirebaseInstances.set(tenantId, instance);

  return instance;
}

/**
 * Obtiene la instancia Firebase de un tenant
 */
export function getTenantFirebase(tenantId: string) {
  return tenantFirebaseInstances.get(tenantId);
}

/**
 * Limpia la instancia Firebase de un tenant
 */
export function clearTenantFirebase(tenantId: string) {
  tenantFirebaseInstances.delete(tenantId);
}
