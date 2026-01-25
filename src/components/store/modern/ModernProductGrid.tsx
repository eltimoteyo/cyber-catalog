"use client";

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Product, TenantConfig } from '@/lib/types';
import ProductSkeleton from './ProductSkeleton';
import { getPrimaryColor } from '@/lib/tenant-colors';

interface ModernProductGridProps {
  products: Product[];
  loading?: boolean;
  loadingMore?: boolean;
  activeCategory?: string;
  searchQuery?: string;
  tenant: TenantConfig;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ModernProductGrid({ 
  products, 
  loading = false,
  loadingMore = false,
  activeCategory = 'Todo',
  searchQuery = '',
  tenant,
  onProductClick, 
  onAddToCart 
}: ModernProductGridProps) {
  const primaryColor = getPrimaryColor(tenant);
  // Generar título dinámico
  const getSectionTitle = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`;
    }
    if (activeCategory === 'Todo') {
      return 'Populares Ahora';
    }
    return `${activeCategory}`;
  };

  const getSectionSubtitle = () => {
    // No mostrar cantidad cuando hay búsqueda porque solo muestra productos cargados, no el total real
    if (searchQuery) {
      return null;
    }
    if (activeCategory === 'Todo') {
      return 'Los más vendidos';
    }
    return `Explora nuestra selección de ${activeCategory.toLowerCase()}`;
  };

  return (
    <section className="container mx-auto px-4 py-6" id="productos">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-xl md:text-2xl uppercase tracking-wider">{getSectionTitle()}</h2>
          {getSectionSubtitle() && (
            <p className="text-sm text-gray-500 mt-1">{getSectionSubtitle()}</p>
          )}
        </div>
        {!searchQuery && (
          <button 
            className="text-xs md:text-sm font-bold border-b border-black pb-0.5 transition-colors uppercase"
            style={{ '--hover-color': primaryColor } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = primaryColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '';
            }}
          >
            Ver Todo
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 items-start">
        {loading && products.length === 0 ? (
          // Mostrar skeletons solo en la carga inicial
          Array.from({ length: 12 }).map((_, idx) => (
            <ProductSkeleton key={`skeleton-${idx}`} />
          ))
        ) : (
          <>
            {products.map(product => (
          <div 
            key={product.id} 
            className="group relative cursor-pointer" 
            onClick={() => onProductClick(product)}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-100 group-hover:shadow-xl transition-all duration-300">
              <Image 
                src={product.imageUrls && product.imageUrls[0] || '/placeholder.svg'} 
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                loading="lazy"
              />
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onAddToCart(product); 
                }} 
                className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 z-20"
                style={{ color: primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = primaryColor;
                }}
              >
                <Plus size={20} strokeWidth={3} />
              </button>
              {product.featured && (
                <div className="absolute top-3 left-3">
                  <span className="bg-black/80 backdrop-blur text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm">
                    Best Seller
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between items-start mb-1 gap-2">
                <h3 
                  className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 transition-colors font-body flex-1"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  {product.name}
                </h3>
                <span className="font-bold text-gray-900 text-sm whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded-md self-start">
                  S/{product.price}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                {product.category}
              </p>
            </div>
          </div>
            ))}
            {/* Skeletons para carga adicional */}
            {loadingMore && Array.from({ length: 8 }).map((_, idx) => (
              <ProductSkeleton key={`skeleton-more-${idx}`} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
