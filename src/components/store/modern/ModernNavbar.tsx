"use client";

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Instagram,
  Facebook,
  MessageCircle,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import { TenantConfig } from '@/lib/types';

const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className={className} height={size} width={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path>
  </svg>
);

interface ModernNavbarProps {
  tenant: TenantConfig;
  cartCount: number;
  onOpenCart: () => void;
  isScrolled: boolean;
  onGoHome?: () => void;
  isProductPage?: boolean;
}

export default function ModernNavbar({ 
  tenant, 
  cartCount, 
  onOpenCart, 
  isScrolled, 
  onGoHome,
  isProductPage = false 
}: ModernNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className={`fixed top-0 md:top-4 left-0 right-0 z-50 transition-all duration-300 px-0 md:px-4 flex justify-center`}>
      <div className={`
        flex items-center justify-between px-4 py-2 md:px-6 md:py-3 md:rounded-full transition-all duration-300 w-full
        ${(isScrolled || isProductPage)
          ? 'bg-white/70 backdrop-blur-md shadow-lg border-b md:border border-white/20 max-w-5xl' 
          : 'bg-transparent border-transparent max-w-7xl'
        }
      `}>
        {/* Logo / Back Button */}
        <div className="flex items-center gap-3 shrink-0 mr-2 md:mr-6">
          {isProductPage && onGoHome && (
            <button onClick={onGoHome} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft size={24} className={isProductPage ? 'text-gray-900' : (isScrolled ? 'text-gray-900' : 'text-white')} />
            </button>
          )}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onGoHome?.(); }} 
            className={`text-lg md:text-2xl tracking-tight brand-font transition-colors ${(isScrolled || isProductPage) ? 'text-gray-900' : 'text-white'}`}
          >
            <span className="md:hidden text-rose-600">
              {tenant.name.charAt(0)}
            </span>
            <span className="md:hidden">
              {tenant.name.charAt(tenant.name.indexOf(' ') + 1 || 1)}
            </span>
            <span className="hidden md:inline">
              {tenant.name.split(' ')[0]}
              <span className={(isScrolled || isProductPage) ? "text-rose-500" : "text-rose-400"}>
                {tenant.name.split(' ').slice(1).join(' ')}
              </span>
            </span>
          </a>
        </div>

        {/* Buscador */}
        <div className="flex-1 max-w-2xl relative group mx-2">
          <div className={`
            flex items-center w-full rounded-full transition-all duration-300 overflow-hidden
            ${(isScrolled || isProductPage) 
              ? 'bg-white/50 focus-within:bg-white/80 focus-within:ring-2 ring-rose-500/20' 
              : 'bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30'
            }
          `}>
            <div className={`pl-3 md:pl-4 ${(isScrolled || isProductPage) ? 'text-gray-600' : 'text-white'}`}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="¿Qué buscas hoy?" 
              className={`w-full py-2.5 px-3 bg-transparent border-none outline-none text-sm md:text-base font-medium transition-colors
                ${(isScrolled || isProductPage) ? 'text-gray-900 placeholder-gray-600' : 'text-white placeholder-white/80'}
              `}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-1">
          <div className={`hidden lg:flex items-center gap-5 border-r pr-5 mr-2 transition-colors ${(isScrolled || isProductPage) ? 'border-gray-300' : 'border-white/40'}`}>
            {tenant.socialMedia?.tiktok && (
              <a 
                href={tenant.socialMedia.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all duration-200 hover:scale-110"
              >
                <TikTokIcon 
                  size={26} 
                  className={`transition-colors ${
                    (isScrolled || isProductPage) 
                      ? 'text-gray-700 hover:text-rose-600' 
                      : 'text-white hover:text-rose-400'
                  }`}
                />
              </a>
            )}
            {tenant.socialMedia?.instagram && (
              <a 
                href={tenant.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all duration-200 hover:scale-110"
              >
                <Instagram 
                  size={26} 
                  strokeWidth={2.5}
                  className={`transition-colors ${
                    (isScrolled || isProductPage) 
                      ? 'text-gray-700 hover:text-rose-600' 
                      : 'text-white hover:text-rose-400'
                  }`}
                />
              </a>
            )}
            {tenant.socialMedia?.facebook && (
              <a 
                href={tenant.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all duration-200 hover:scale-110"
              >
                <Facebook 
                  size={26} 
                  strokeWidth={2.5}
                  className={`transition-colors ${
                    (isScrolled || isProductPage) 
                      ? 'text-gray-700 hover:text-rose-600' 
                      : 'text-white hover:text-rose-400'
                  }`}
                />
              </a>
            )}
            {tenant.whatsapp && (
              <a 
                href={`https://wa.me/${tenant.whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all duration-200 hover:scale-110"
              >
                <MessageCircle 
                  size={26} 
                  strokeWidth={2.5}
                  className={`transition-colors ${
                    (isScrolled || isProductPage) 
                      ? 'text-gray-700 hover:text-rose-600' 
                      : 'text-white hover:text-rose-400'
                  }`}
                />
              </a>
            )}
          </div>

          <div className="lg:hidden relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-full ${(isScrolled || isProductPage) ? 'text-gray-700' : 'text-white'}`}>
              <MoreVertical size={20} />
            </button>
            
            {/* Dropdown Menu for Mobile */}
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-12 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 py-3 px-4 min-w-[200px] z-50">
                  <div className="flex flex-col gap-3">
                    {tenant.socialMedia?.tiktok && (
                      <a 
                        href={tenant.socialMedia.tiktok} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <TikTokIcon size={22} className="text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">TikTok</span>
                      </a>
                    )}
                    {tenant.socialMedia?.instagram && (
                      <a 
                        href={tenant.socialMedia.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Instagram size={22} strokeWidth={2.5} className="text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Instagram</span>
                      </a>
                    )}
                    {tenant.socialMedia?.facebook && (
                      <a 
                        href={tenant.socialMedia.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Facebook size={22} strokeWidth={2.5} className="text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Facebook</span>
                      </a>
                    )}
                    {tenant.whatsapp && (
                      <a 
                        href={`https://wa.me/${tenant.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <MessageCircle size={22} strokeWidth={2.5} className="text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <button onClick={onOpenCart} className="relative p-2.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-white text-rose-600 text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm border border-gray-100">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
