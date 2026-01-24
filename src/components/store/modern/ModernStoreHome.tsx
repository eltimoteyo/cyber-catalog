"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Coffee, Flower, Gift, Heart } from 'lucide-react';
import ModernNavbar from './ModernNavbar';
import ModernHero from './ModernHero';
import ModernCategories from './ModernCategories';
import ModernProductGrid from './ModernProductGrid';
import ModernCart from './ModernCart';
import ModernFooter from './ModernFooter';
import { TenantConfig, Product } from '@/lib/types';
import { collection, getDocs, query, where, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData, doc, getDoc } from 'firebase/firestore';
import { initTenantFirebase } from '@/lib/firebase';
import { useCart } from '@/contexts/CartContext';

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ModernStoreHomeProps {
  tenant: TenantConfig;
  domain: string;
  initialProducts?: Product[]; // Productos cargados en el servidor
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'Todo', label: 'Todo', icon: <Sparkles size={18} /> },
  { id: 'Desayunos', label: 'Desayunos', icon: <Coffee size={18} /> },
  { id: 'Flores', label: 'Flores', icon: <Flower size={18} /> },
  { id: 'Peluches', label: 'Peluches', icon: <Gift size={18} /> },
  { id: 'Globos', label: 'Globos', icon: <Heart size={18} /> },
];

export default function ModernStoreHome({ tenant, domain, initialProducts = [] }: ModernStoreHomeProps) {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, getCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load products and categories solo si no hay productos iniciales
  useEffect(() => {
    if (initialProducts.length === 0) {
      loadProducts(true);
    } else {
      // Extraer categorías de los productos iniciales
      const uniqueCategoryNames = Array.from(new Set(initialProducts.map(p => p.category).filter(Boolean)));
      const categoryObjects: Category[] = [
        { id: 'Todo', label: 'Todo', icon: <Sparkles size={18} /> },
        ...uniqueCategoryNames.map(name => ({
          id: name,
          label: name,
          icon: getCategoryIcon(name)
        }))
      ];
      setCategories(categoryObjects);
      // Si hay productos iniciales, preparar para cargar más
      setHasMore(initialProducts.length >= 12);
    }
  }, [tenant.id, initialProducts.length]);

  // Listen for add to cart events from product detail pages
  useEffect(() => {
    const handleAddToCart = (e: Event) => {
      const customEvent = e as CustomEvent;
      const product = customEvent.detail.product;
      const quantity = customEvent.detail.quantity || 1;
      addToCart(product, quantity);
      setIsCartOpen(true);
    };
    
    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, [addToCart]);

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const productsRef = collection(db, 'products');
      
      let q;
      if (activeCategory === 'Todo') {
        if (lastVisible) {
          q = query(productsRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(12));
        } else {
          // Si no hay lastVisible, usar el último producto actual como referencia
          const currentProducts = activeCategory === 'Todo' ? products : products.filter(p => p.category === activeCategory);
          if (currentProducts.length === 0) {
            setHasMore(false);
            return;
          }
          // Necesitamos obtener el documento desde Firebase para usarlo como startAfter
          const lastProduct = currentProducts[currentProducts.length - 1];
          const lastDocRef = doc(db, 'products', lastProduct.id);
          const lastDocSnap = await getDoc(lastDocRef);
          if (lastDocSnap.exists()) {
            q = query(productsRef, orderBy('createdAt', 'desc'), startAfter(lastDocSnap), limit(12));
          } else {
            q = query(productsRef, orderBy('createdAt', 'desc'), limit(12));
          }
        }
      } else {
        if (lastVisible) {
          q = query(
            productsRef,
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(12)
          );
        } else {
          const currentProducts = products.filter(p => p.category === activeCategory);
          if (currentProducts.length === 0) {
            setHasMore(false);
            return;
          }
          const lastProduct = currentProducts[currentProducts.length - 1];
          const lastDocRef = doc(db, 'products', lastProduct.id);
          const lastDocSnap = await getDoc(lastDocRef);
          if (lastDocSnap.exists()) {
            q = query(
              productsRef,
              where('category', '==', activeCategory),
              orderBy('createdAt', 'desc'),
              startAfter(lastDocSnap),
              limit(12)
            );
          } else {
            q = query(
              productsRef,
              where('category', '==', activeCategory),
              orderBy('createdAt', 'desc'),
              limit(12)
            );
          }
        }
      }
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setHasMore(false);
        return;
      }
      
      const loadedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];
      
      setProducts(prev => [...prev, ...loadedProducts]);
      
      // Guardar último documento visible para paginación
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastVisible(lastDoc);
      
      // Si hay menos de 12 productos, no hay más
      if (snapshot.docs.length < 12) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadProducts = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setProducts([]);
        setLastVisible(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const productsRef = collection(db, 'products');
      
      let q;
      if (activeCategory === 'Todo') {
        if (lastVisible && !reset) {
          q = query(productsRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(12));
        } else {
          q = query(productsRef, orderBy('createdAt', 'desc'), limit(12));
        }
      } else {
        if (lastVisible && !reset) {
          q = query(
            productsRef,
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(12)
          );
        } else {
          q = query(
            productsRef,
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc'),
            limit(12)
          );
        }
      }
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setHasMore(false);
        return;
      }
      
      const loadedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];
      
      if (reset) {
        setProducts(loadedProducts);
      } else {
        setProducts(prev => [...prev, ...loadedProducts]);
      }
      
      // Guardar último documento visible para paginación
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastVisible(lastDoc);
      
      // Si hay menos de 12 productos, no hay más
      if (snapshot.docs.length < 12) {
        setHasMore(false);
      }
      
      // Extract unique categories and create Category objects (solo en reset)
      if (reset) {
        const uniqueCategoryNames = Array.from(new Set(loadedProducts.map(p => p.category).filter(Boolean)));
        const categoryObjects: Category[] = [
          { id: 'Todo', label: 'Todo', icon: <Sparkles size={18} /> },
          ...uniqueCategoryNames.map(name => ({
            id: name,
            label: name,
            icon: getCategoryIcon(name)
          }))
        ];
        setCategories(categoryObjects);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Recargar productos cuando cambia la categoría (solo si no hay productos iniciales)
  useEffect(() => {
    if (initialProducts.length > 0 && activeCategory === 'Todo') {
      // Si hay productos iniciales y categoría es "Todo", solo filtrar localmente
      setLastVisible(null);
      setHasMore(initialProducts.length >= 12); // Permitir cargar más si hay 12 o más iniciales
      return;
    }
    // Si no hay productos iniciales o cambió la categoría, recargar desde Firebase
    if (initialProducts.length === 0) {
      loadProducts(true);
    }
  }, [activeCategory]);

  // Infinite scroll con IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          if (initialProducts.length > 0 && activeCategory === 'Todo') {
            loadMoreProducts();
          } else {
            loadProducts(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadingMore, activeCategory, initialProducts.length]);

  const getCategoryIcon = (categoryName: string) => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('desayuno')) return <Coffee size={18} />;
    if (lowerName.includes('flor')) return <Flower size={18} />;
    if (lowerName.includes('peluch')) return <Gift size={18} />;
    if (lowerName.includes('globo')) return <Heart size={18} />;
    return <Sparkles size={18} />;
  };

  const handleAddProduct = (product: Product) => {
    const quantity = (product as any).quantity || 1;
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    // Navegar a /product/[id] - el middleware se encargará de reescribir internamente
    router.push(`/product/${product.id}`);
  };

  const filteredProducts = activeCategory === 'Todo'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <ModernNavbar
        tenant={tenant}
        cartCount={getCartCount()}
        onOpenCart={() => setIsCartOpen(true)}
        isScrolled={isScrolled}
        onGoHome={handleGoHome}
        isProductPage={false}
      />

      {/* Hero */}
      <ModernHero />

      {/* Categories */}
      <ModernCategories
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Products Grid */}
      <ModernProductGrid
        products={filteredProducts}
        loading={loading}
        loadingMore={loadingMore}
        onAddToCart={handleAddProduct}
        onProductClick={handleProductClick}
      />
      
      {/* Trigger para infinite scroll */}
      {hasMore && <div ref={loadMoreRef} className="h-20" />}

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
