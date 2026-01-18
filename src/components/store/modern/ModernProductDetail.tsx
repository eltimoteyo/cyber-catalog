"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, ShoppingBag, Share2, Check, Zap, Star, ArrowLeft } from 'lucide-react';
import { Product, TenantConfig } from '@/lib/types';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { initTenantFirebase } from '@/lib/firebase';
import ModernNavbar from './ModernNavbar';
import ModernFooter from './ModernFooter';
import ModernCart from './ModernCart';

interface CartItem extends Product {
  quantity: number;
}

interface ModernProductDetailProps {
  product: Product;
  tenant: TenantConfig;
  domain: string;
}

export default function ModernProductDetail({ product, tenant, domain }: ModernProductDetailProps) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    loadRelatedProducts();
  }, [product.id]);

  const loadRelatedProducts = async () => {
    try {
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const productsRef = collection(db, 'products');
      const q = query(productsRef, limit(4));
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
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleGoHome = () => {
    router.push(`/`);
  };

  const handleShare = async () => {
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

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <ModernNavbar
        tenant={tenant}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isScrolled={isScrolled}
        onGoHome={handleGoHome}
        isProductPage={true}
      />

      {/* Content */}
      <div className="pt-24 pb-20 container mx-auto px-4 animate-fade-in-up">
        {/* Botón Volver */}
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver a la tienda</span>
        </button>

        {/* Grid Principal: 2 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          
          {/* IZQUIERDA: Galería */}
          <div className="flex flex-col gap-4">
            {/* Imagen Principal */}
            <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  Best Seller
                </span>
              )}
            </div>
            
            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      activeImage === idx 
                        ? 'ring-2 ring-rose-500 ring-offset-2 opacity-100' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DERECHA: Info del Producto */}
          <div className="flex flex-col justify-center">
            {/* Breadcrumb / Categoría */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-rose-500 font-bold uppercase tracking-widest text-xs bg-rose-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900 leading-tight mb-4 uppercase">
              {product.name}
            </h1>

            {/* Precio y Rating */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900 bg-gray-50 px-4 py-1 rounded-xl">
                S/{product.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                <Star size={16} fill="currentColor" />
                <span className="text-gray-500 font-medium ml-1">4.9 (120 reviews)</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="prose prose-sm text-gray-500 mb-8 leading-relaxed">
              <p>{product.description || 'Producto de alta calidad disponible para entrega inmediata.'}</p>
            </div>

            {/* Selector de Opciones */}
            <div className="mb-8">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-wide block mb-3">
                Opciones Disponibles
              </span>
              <div className="flex flex-wrap gap-3">
                {['Estándar', 'Premium (+S/20)', 'Deluxe (+S/50)'].map((opt, i) => (
                  <button 
                    key={i} 
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      i === 0 
                        ? 'border-rose-500 text-rose-600 bg-rose-50' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Acciones: Cantidad + Agregar */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              {/* Cantidad */}
              <div className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-3 sm:w-40">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="p-1 hover:text-rose-600 transition-colors disabled:opacity-30"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="p-1 hover:text-rose-600 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Botón Agregar */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white rounded-full py-4 font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <ShoppingBag size={20} />
                Agregar al Carrito
              </button>
            </div>
            
            {/* Garantías */}
            <div className="flex items-center gap-6 mt-8 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <Check size={14} className="text-green-500" /> Stock disponible
              </span>
              <span className="flex items-center gap-1">
                <Zap size={14} className="text-yellow-500" /> Entrega Express
              </span>
            </div>
          </div>
        </div>

        {/* PRODUCTOS RECOMENDADOS */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold uppercase tracking-wider">Te podría gustar</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map(p => (
                <div 
                  key={p.id} 
                  className="group relative cursor-pointer" 
                  onClick={() => router.push(`/products/${p.id}`)}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-100 group-hover:shadow-lg transition-all duration-300">
                    <img 
                      src={p.imageUrls && p.imageUrls[0] || '/placeholder.svg'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={p.name}
                    />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-xs font-bold text-gray-500">S/{p.price}</span>
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
