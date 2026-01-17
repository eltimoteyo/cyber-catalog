"use client";

import { useEffect, useState, useMemo } from "react";
import { TenantConfig, Product } from "@/lib/types";
import { initTenantFirebase } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import CatalogHeader from "./CatalogHeader";
import HeroBanner from "./HeroBanner";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import Footer from "./Footer";
import SearchBar from "./SearchBar";

interface Category {
  value: string;
  label: string;
  icon: string;
}

interface StoreHomeProps {
  tenant: TenantConfig;
}

export default function StoreHome({ tenant }: StoreHomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // Inicializar Firebase del tenant
        const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);

        // Cargar productos
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Product[];

        setProducts(productsData);

        // Cargar categorías
        const categoriesRef = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesRef);

        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          value: doc.data().value,
          label: doc.data().label,
          icon: doc.data().icon,
        })) as Category[];

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tenant]);

  // Aplicar colores personalizados del tenant
  useEffect(() => {
    if (tenant.colors?.primary) {
      document.documentElement.style.setProperty(
        "--primary",
        tenant.colors.primary
      );
    }
    if (tenant.colors?.secondary) {
      document.documentElement.style.setProperty(
        "--secondary",
        tenant.colors.secondary
      );
    }
  }, [tenant.colors]);

  const filteredProducts = useMemo(() => {
    let result = selectedCategory === "all" 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader 
        tenant={tenant}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Hero Banner - All screens */}
      <HeroBanner tenant={tenant} />

      {/* Mobile: Search Bar - appears when carousel is in mobile mode */}
      <div className="md:hidden container py-1 px-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar productos..."
        />
      </div>
      
      <main className="container pt-3 pb-8 md:pt-10 md:pb-4 space-y-8 md:space-y-10 px-4" id="main-content">
        {/* Category Filter */}
        <div id="productos">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Products Section Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Nuestros Productos
          </h2>
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-xl">No se encontraron productos</p>
            <p className="mt-2">Intenta con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                tenant={tenant}
                isExpanded={expandedProductId === product.id}
                onExpand={() => setExpandedProductId(product.id)}
                onCollapse={() => setExpandedProductId(null)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer tenant={tenant} />
    </div>
  );
}
