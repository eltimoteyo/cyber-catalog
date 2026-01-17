"use client";

import { useState } from 'react';
import { Sparkles, Coffee, Flower, Gift, Heart } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'Todo', icon: <Sparkles size={18} /> },
  { id: 'desayunos', label: 'Desayunos', icon: <Coffee size={18} /> },
  { id: 'flores', label: 'Flores', icon: <Flower size={18} /> },
  { id: 'peluches', label: 'Peluches', icon: <Gift size={18} /> },
  { id: 'globos', label: 'Globos', icon: <Heart size={18} /> },
];

interface ModernCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: Category[];
}

export default function ModernCategories({ 
  activeCategory, 
  onCategoryChange,
  categories = CATEGORIES 
}: ModernCategoriesProps) {
  return (
    <div className="py-6 container mx-auto px-4">
      <h2 className="text-xl text-gray-900 font-bold tracking-tight mb-6">Explorar</h2>
      <div className="flex gap-3 overflow-x-auto py-4 px-4 -mx-4 scrollbar-hide snap-x">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => onCategoryChange(cat.id)} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap snap-start border ${
              activeCategory === cat.id 
                ? 'bg-rose-600 border-rose-600 text-white shadow-lg scale-105' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-600'
            }`}
          >
            <span className={activeCategory === cat.id ? "text-white" : "text-gray-400 group-hover:text-rose-500"}>
              {cat.icon}
            </span>
            <span className="text-sm font-bold tracking-wide">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
