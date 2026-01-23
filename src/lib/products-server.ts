// Funciones server-side para productos (solo para uso en Server Components)
// NO importar en componentes del cliente

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, getDocs, doc, getDoc, query, orderBy, where, limit } from 'firebase/firestore';
import { Product } from './types';

// Cache de apps de Firebase por tenant (server-side)
const tenantServerApps = new Map<string, { app: FirebaseApp; db: Firestore }>();

/**
 * Obtiene Firestore para un tenant usando SDK de cliente (server-side)
 * Los tenants solo tienen credenciales de cliente, no service account
 */
function getTenantFirestore(tenantId: string, firebaseConfig: any): Firestore {
  // Si ya existe, retornarlo
  if (tenantServerApps.has(tenantId)) {
    return tenantServerApps.get(tenantId)!.db;
  }

  // Inicializar nueva instancia
  const app = initializeApp(firebaseConfig, `server-tenant-${tenantId}`);
  const db = getFirestore(app);

  tenantServerApps.set(tenantId, { app, db });
  return db;
}

/**
 * Obtiene productos de un tenant (Server-Side con Admin SDK)
 * Optimizado con límites y caché
 */
export async function getTenantProducts(
  tenantId: string,
  firebaseConfig: any,
  options?: {
    limit?: number;
    category?: string;
    featured?: boolean;
  }
): Promise<Product[]> {
  try {
    const db = getTenantFirestore(tenantId, firebaseConfig);
    const productsCollection = collection(db, 'products');
    
    // Construir query con filtros
    let q: any;
    const limitCount = options?.limit || 50;
    
    if (options?.category) {
      q = query(
        productsCollection,
        where('category', '==', options.category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else if (options?.featured !== undefined) {
      q = query(
        productsCollection,
        where('featured', '==', options.featured),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(
        productsCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data() || {};
      return {
        id: doc.id,
        ...(data as any),
        createdAt: (data as any).createdAt?.toDate(),
        updatedAt: (data as any).updatedAt?.toDate(),
      } as Product;
    });
  } catch (error) {
    console.error('Error fetching tenant products:', error);
    return [];
  }
}

/**
 * Obtiene un producto por ID (Server-Side con Admin SDK)
 */
export async function getTenantProductById(
  tenantId: string,
  firebaseConfig: any,
  productId: string
): Promise<Product | null> {
  try {
    const db = getTenantFirestore(tenantId, firebaseConfig);
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data() || {};
    return {
      id: docSnap.id,
      ...(data as any),
      createdAt: (data as any).createdAt?.toDate(),
      updatedAt: (data as any).updatedAt?.toDate(),
    } as Product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

/**
 * Obtiene productos relacionados (Server-Side con Admin SDK)
 */
export async function getRelatedProducts(
  tenantId: string,
  firebaseConfig: any,
  productId: string,
  category?: string,
  limitCount: number = 4
): Promise<Product[]> {
  try {
    const db = getTenantFirestore(tenantId, firebaseConfig);
    const productsCollection = collection(db, 'products');
    
    let q: any;
    
    if (category) {
      // Si hay categoría, filtrar por categoría y ordenar
      q = query(
        productsCollection,
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount + 2)
      );
    } else {
      // Si no hay categoría, solo ordenar por createdAt
      q = query(
        productsCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount + 2)
      );
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs
      .map(doc => {
        const data = doc.data() || {};
        return {
          id: doc.id,
          ...(data as any),
          createdAt: (data as any).createdAt?.toDate(),
          updatedAt: (data as any).updatedAt?.toDate(),
        } as Product;
      })
      .filter((p: Product) => p.id !== productId)
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

