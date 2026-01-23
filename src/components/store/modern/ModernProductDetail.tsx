"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, ShoppingBag, Share2, Check, Zap, Star, ArrowLeft } from 'lucide-react';
import { Product, TenantConfig } from '@/lib/types';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import { initTenantFirebase } from '@/lib/firebase';
import ModernNavbar from './ModernNavbar';
import ModernFooter from './ModernFooter';
import ModernCart from './ModernCart';
import { useCart } from '@/contexts/CartContext';

interface ModernProductDetailProps {
  productId: string;
  tenant: TenantConfig;
  domain: string;
  initialProduct?: Product; // Producto cargado en el servidor
  initialRelatedProducts?: Product[]; // Productos relacionados cargados en el servidor
}

export default function ModernProductDetail({ 
  productId, 
  tenant, 
  domain,
  initialProduct,
  initialRelatedProducts = []
}: ModernProductDetailProps) {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, getCartCount } = useCart();
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct); // Solo carga si no hay producto inicial
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(initialRelatedProducts);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Cargar producto solo si no hay producto inicial
  useEffect(() => {
    if (!initialProduct) {
      loadProduct();
    }
  }, [productId, tenant.id, initialProduct]);

  async function loadProduct() {
    try {
      setLoading(true);
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const productDoc = await getDoc(doc(db, 'products', productId));
      
      if (!productDoc.exists()) {
        router.push('/');
        return;
      }

      const productData = {
        id: productDoc.id,
        ...productDoc.data(),
        createdAt: productDoc.data().createdAt?.toDate(),
        updatedAt: productDoc.data().updatedAt?.toDate(),
      } as Product;

      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!product) return;
    setActiveImage(0);
    setQuantity(1);
    // Solo cargar productos relacionados si no hay productos iniciales
    if (initialRelatedProducts.length === 0) {
      loadRelatedProducts();
    }
  }, [product?.id, initialRelatedProducts.length]);

  const loadRelatedProducts = async () => {
    if (!product) return;
    try {
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const productsRef = collection(db, 'products');
      const q = query(productsRef, limit(5)); // +1 para asegurar que tengamos suficientes
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Product))
        .filter(p => p.id !== product.id)
        .slice(0, 4);
      
      setRelatedProducts(products);
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleGoHome = () => {
    router.push(`/`);
  };

  const handleShare = async () => {
    if (!product) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-semibold">Cargando producto...</p>
        </div>
      </div>
    );
  }

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Navbar */}
      <ModernNavbar
        tenant={tenant}
        cartCount={getCartCount()}
        onOpenCart={() => setIsCartOpen(true)}
        isScrolled={isScrolled}
        onGoHome={handleGoHome}
        isProductPage={true}
      />

      {/* Content */}
      <div className="pt-24 pb-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl animate-fade-in-up">
        {/* Botón Volver */}
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Volver</span>
        </button>

        {/* Grid Principal: 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20">
          
          {/* IZQUIERDA: Galería */}
          <div className="flex flex-col gap-4">
            {/* Imagen Principal */}
            <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-white shadow-sm border border-gray-100">
              <Image 
                src={images[activeImage]} 
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {product.featured && (
                <span className="absolute top-6 left-6 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                  ⭐ Destacado
                </span>
              )}
              <button 
                onClick={handleShare}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-rose-500 transition-all shadow-lg"
              >
                <Share2 size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${
                      activeImage === idx 
                        ? 'border-rose-500 scale-105 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name} - Vista ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DERECHA: Info del Producto */}
          <div className="flex flex-col justify-center">
            {/* Categoría */}
            <div className="mb-6">
              <span className="inline-flex items-center text-rose-600 font-black uppercase tracking-[0.2em] text-[11px] bg-rose-50 px-4 py-2 rounded-xl">
                {product.category}
              </span>
            </div>

            {/* Título */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
              {product.name}
            </h1>

            {/* Precio */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-5xl font-black text-gray-900">
                S/{product.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
                <span className="text-gray-500 font-semibold text-sm ml-2">(120)</span>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 text-base leading-relaxed mb-10">
              {product.description || 'Producto de alta calidad, perfecto para cualquier ocasión especial. Disponible para entrega inmediata.'}
            </p>

            {/* Acciones: Cantidad + Agregar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Cantidad */}
              <div className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 sm:w-44 border border-gray-200 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} strokeWidth={3} />
                </button>
                <span className="font-black text-xl w-10 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              {/* Botón Agregar */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white rounded-2xl py-5 font-black text-base hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-wide"
              >
                <ShoppingBag size={22} strokeWidth={2.5} />
                Agregar al Carrito
              </button>
            </div>
            
            {/* Garantías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-xl">
                <Check size={20} className="text-green-600" strokeWidth={3} />
                <span className="text-sm font-bold text-green-700">Stock disponible</span>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-xl">
                <Zap size={20} className="text-amber-600" strokeWidth={3} />
                <span className="text-sm font-bold text-amber-700">Entrega Express</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTOS RELACIONADOS */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Te Podría Gustar</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <div 
                  key={p.id} 
                  className="group relative cursor-pointer" 
                  onClick={() => router.push(`/product/${p.id}`)}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-100 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    <Image 
                      src={p.imageUrls && p.imageUrls[0] || '/placeholder.svg'} 
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-rose-600 transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-base font-black text-gray-900">S/{p.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart */}
      <ModernCart
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveItem}
        tenant={tenant}
      />

      {/* Footer */}
      <ModernFooter tenant={tenant} />
    </div>
  );
}
