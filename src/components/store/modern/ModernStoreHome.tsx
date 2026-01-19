"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Coffee, Flower, Gift, Heart } from 'lucide-react';
import ModernNavbar from './ModernNavbar';
import ModernHero from './ModernHero';
import ModernCategories from './ModernCategories';
import ModernProductGrid from './ModernProductGrid';
import ModernCart from './ModernCart';
import ModernFooter from './ModernFooter';
import { TenantConfig, Product } from '@/lib/types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { initTenantFirebase } from '@/lib/firebase';

interface CartItem extends Product {
  quantity: number;
}

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false); // Ya no cargamos inicialmente si tenemos productos

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
      loadProducts();
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
    }
  }, [tenant.id, initialProducts.length]);

  // Listen for add to cart events from product detail pages
  useEffect(() => {
    const handleAddToCart = (e: Event) => {
      const customEvent = e as CustomEvent;
      handleAddProduct(customEvent.detail);
    };
    
    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, [cart]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      
      const loadedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];
      
      setProducts(loadedProducts);
      
      // Extract unique categories and create Category objects
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
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
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
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
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
        onAddToCart={handleAddProduct}
        onProductClick={handleProductClick}
      />

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
