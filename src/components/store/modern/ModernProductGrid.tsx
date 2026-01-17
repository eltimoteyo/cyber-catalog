"use client";

import { Plus } from 'lucide-react';
import { Product, TenantConfig } from '@/lib/types';

interface ModernProductGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ModernProductGrid({ 
  products, 
  loading = false,
  onProductClick, 
  onAddToCart 
}: ModernProductGridProps) {
  return (
    <section className="container mx-auto px-4 py-6" id="productos">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl md:text-2xl uppercase tracking-wider">Populares Ahora</h2>
        <button className="text-xs md:text-sm font-bold border-b border-black pb-0.5 hover:text-rose-600 transition-colors uppercase">
          Ver Todo
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 items-start">
        {products.map(product => (
          <div 
            key={product.id} 
            className="group relative cursor-pointer" 
            onClick={() => onProductClick(product)}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-100 group-hover:shadow-xl transition-all duration-300">
              <img 
                src={product.imageUrls && product.imageUrls[0] || '/placeholder.svg'} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onAddToCart(product); 
                }} 
                className="absolute bottom-3 right-3 w-10 h-10 bg-white text-rose-600 rounded-full shadow-lg flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-95 z-20"
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
                <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors font-body flex-1">
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
      </div>
    </section>
  );
}
