"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { initTenantFirebase } from '@/lib/firebase';
import ModernProductDetail from './ModernProductDetail';
import { TenantConfig, Product } from '@/lib/types';

interface ModernProductDetailWrapperProps {
  tenant: TenantConfig;
  domain: string;
  productId: string;
}

export default function ModernProductDetailWrapper({ tenant, domain, productId }: ModernProductDetailWrapperProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId, tenant.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(false);
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);
      
      if (!productSnap.exists()) {
        setError(true);
        return;
      }
      
      const productData = {
        id: productSnap.id,
        ...productSnap.data(),
        createdAt: productSnap.data().createdAt?.toDate(),
        updatedAt: productSnap.data().updatedAt?.toDate(),
      } as Product;
      
      setProduct(productData);

      // Update metadata dynamically
      if (typeof window !== 'undefined') {
        document.title = `${productData.name} | ${tenant.name}`;
        
        // Update Open Graph meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', `${productData.name} | ${tenant.name}`);
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && productData.description) {
          ogDescription.setAttribute('content', productData.description);
        }
        
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && productData.imageUrls?.[0]) {
          ogImage.setAttribute('content', productData.imageUrls[0]);
        }
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-gray-600 mb-8">Este producto no existe o fue eliminado.</p>
          <a 
            href={`/store?_domain=${domain}`}
            className="bg-rose-600 text-white px-6 py-3 rounded-full hover:bg-rose-700 transition-colors"
          >
            Volver a la tienda
          </a>
        </div>
      </div>
    );
  }

  return <ModernProductDetail product={product} tenant={tenant} domain={domain} />;
}
