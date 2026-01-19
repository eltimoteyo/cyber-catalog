// Funciones server-side para productos (solo para uso en Server Components)
// NO importar en componentes del cliente

import * as admin from 'firebase-admin';
import { Product } from './types';
import { getTenantFirestore } from './firebase-admin';

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
    const productsCollection = db.collection('products');
    
    // Construir query paso a paso
    let query: any = productsCollection;
    
    // Aplicar filtros
    if (options?.category) {
      query = query.where('category', '==', options.category);
    }
    if (options?.featured !== undefined) {
      query = query.where('featured', '==', options.featured);
    }
    
    // Ordenar y limitar
    query = query.orderBy('createdAt', 'desc');
    if (options?.limit) {
      query = query.limit(options.limit);
    } else {
      // Límite por defecto para evitar cargar demasiados productos
      query = query.limit(50);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Product[];
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
    const docRef = db.collection('products').doc(productId);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
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
    const productsCollection = db.collection('products');
    
    let query: any = productsCollection;
    
    if (category) {
      // Si hay categoría, filtrar por categoría y ordenar
      query = query
        .where('category', '==', category)
        .orderBy('createdAt', 'desc')
        .limit(limitCount + 2); // +2 para asegurar que tengamos suficientes después de filtrar
    } else {
      // Si no hay categoría, solo ordenar por createdAt
      query = query
        .orderBy('createdAt', 'desc')
        .limit(limitCount + 2);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs
      .map((doc: admin.firestore.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }))
      .filter((p: Product) => p.id !== productId)
      .slice(0, limitCount) as Product[];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

