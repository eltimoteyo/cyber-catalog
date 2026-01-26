"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Package, Layers, Settings as SettingsIcon, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { logout } from '@/lib/auth';
import { toast } from 'sonner';

const MENU = [
  { id: 'home', icon: LayoutGrid, label: 'Inicio', path: '/tenant-admin' },
  { id: 'products', icon: Package, label: 'Productos', path: '/tenant-admin/products' },
  { id: 'categories', icon: Layers, label: 'Categorías', path: '/tenant-admin/categories' },
  { id: 'settings', icon: SettingsIcon, label: 'Ajustes', path: '/tenant-admin/settings' },
];

function TenantAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada');
      router.push('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const getActiveTab = () => {
    if (pathname === '/tenant-admin') return 'home';
    if (pathname?.startsWith('/tenant-admin/products')) return 'products';
    if (pathname?.startsWith('/tenant-admin/categories')) return 'categories';
    if (pathname?.startsWith('/tenant-admin/settings')) return 'settings';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-24 md:pb-0 md:pl-28 font-sans selection:bg-rose-500 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-28 bg-white/90 backdrop-blur-md border-r border-white/50 flex-col items-center py-8 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl mb-12 shadow-lg shadow-rose-500/30">
          B
        </div>
        <nav className="flex-1 flex flex-col gap-6 w-full px-4">
          {MENU.map(item => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all group relative
                ${activeTab === item.id 
                  ? 'text-rose-600 bg-rose-50 font-bold shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 font-medium'}
              `}
            >
              <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] mt-1.5 tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
        <button 
          onClick={handleLogout}
          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all mb-4"
        >
          <LogOut size={20} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl px-4 py-3 flex justify-between items-center z-40 shadow-2xl shadow-black/5">
        {MENU.map(item => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 transition-all duration-300
              ${activeTab === item.id ? 'text-rose-600 -translate-y-1' : 'text-gray-400'}
            `}
          >
            <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-rose-50' : 'bg-transparent'}`}>
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            </div>
          </button>
        ))}
        
        {/* Botón de Usuario en móvil */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex flex-col items-center gap-1 transition-all duration-300 text-gray-400"
          >
            <div className="p-2 rounded-xl bg-transparent">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-orange-400 flex items-center justify-center text-white font-bold text-xs">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </div>
            </div>
          </button>
          
          {/* Menú desplegable del usuario */}
          {showUserMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-800 truncate">
                  {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  {user?.role === 'owner' ? 'Propietario' : 'Administrador'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <TenantAdminLayout>{children}</TenantAdminLayout>
    </ProtectedRoute>
  );
}
