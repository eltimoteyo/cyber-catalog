"use client";

import { Settings, Zap, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import { TenantConfig } from '@/lib/types';

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 448 512" fill="currentColor">
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
  </svg>
);

interface ModernFooterProps {
  tenant: TenantConfig;
}

export default function ModernFooter({ tenant }: ModernFooterProps) {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-20 rounded-t-[2.5rem]">
      <div className="container mx-auto px-6">
        {/* Brand Name + Social Icons - Horizontal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Left: Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 brand-font">
              {tenant.name.split(' ')[0]}
              <span className="text-rose-500">{tenant.name.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-gray-400 text-base">
              Creando momentos inolvidables.
            </p>
          </div>
          
          {/* Right: Social Icons - Large */}
          <div className="flex gap-6">
            <a 
              href={tenant.socialMedia?.tiktok || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gray-800 rounded-full hover:bg-black hover:scale-110 transition-all text-white flex items-center justify-center shadow-lg"
            >
              <TikTokIcon size={28} />
            </a>
            <a 
              href={tenant.socialMedia?.instagram || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gray-800 rounded-full hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:scale-110 transition-all text-white flex items-center justify-center shadow-lg"
            >
              <Instagram size={28} />
            </a>
            <a 
              href={tenant.socialMedia?.facebook || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gray-800 rounded-full hover:bg-blue-600 hover:scale-110 transition-all text-white flex items-center justify-center shadow-lg"
            >
              <Facebook size={28} />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 w-full mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {tenant.name}.</p>
          <div className="flex items-center gap-6">
            <Link href="/tenant-admin" className="flex items-center gap-1 hover:text-white transition-colors">
              <Settings size={14} /> Admin
            </Link>
            <span className="flex items-center gap-1">
              Powered by <span className="font-bold text-gray-300 flex items-center gap-0.5">
                <Zap size={10} className="text-yellow-400 fill-current" /> Createam
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
