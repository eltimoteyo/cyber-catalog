import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

const tenantApps = new Map<string, { app: FirebaseApp; db: Firestore }>();

interface TenantFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getTenantDbFromConfig(tenantId: string, firebaseConfig: TenantFirebaseConfig): Firestore {
  const existing = tenantApps.get(tenantId);
  if (existing) {
    return existing.db;
  }

  const app = initializeApp(firebaseConfig, `tenant-server-${tenantId}`);
  const db = getFirestore(app);

  tenantApps.set(tenantId, { app, db });
  return db;
}
