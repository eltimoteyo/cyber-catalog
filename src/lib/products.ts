import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  Firestore 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  FirebaseStorage 
} from 'firebase/storage';
import { Product } from './types';

/**
 * Sube una imagen a Firebase Storage
 */
export async function uploadProductImage(
  storage: FirebaseStorage,
  tenantId: string,
  file: File
): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `products/${tenantId}/${filename}`);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
}

/**
 * Elimina una imagen de Firebase Storage
 */
export async function deleteProductImage(
  storage: FirebaseStorage,
  imageUrl: string
): Promise<void> {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(
  db: Firestore,
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = Timestamp.now();
  
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(
  db: Firestore,
  productId: string,
  productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const docRef = doc(db, 'products', productId);
  
  await updateDoc(docRef, {
    ...productData,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Elimina un producto
 */
export async function deleteProduct(
  db: Firestore,
  productId: string
): Promise<void> {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
}

/**
 * Crea una categoría
 */
export async function createCategory(
  db: Firestore,
  name: string,
  order?: number
): Promise<string> {
  const docRef = await addDoc(collection(db, 'categories'), {
    name,
    order: order || 0,
  });
  
  return docRef.id;
}

/**
 * Actualiza una categoría
 */
export async function updateCategory(
  db: Firestore,
  categoryId: string,
  name: string,
  order?: number
): Promise<void> {
  const docRef = doc(db, 'categories', categoryId);
  
  await updateDoc(docRef, {
    name,
    order: order || 0,
  });
}

/**
 * Elimina una categoría
 */
export async function deleteCategory(
  db: Firestore,
  categoryId: string
): Promise<void> {
  const docRef = doc(db, 'categories', categoryId);
  await deleteDoc(docRef);
}
