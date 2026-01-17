"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, MousePointerClick, Package, Plus, ChevronDown } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { centralDb } from '@/lib/firebase';
import { TenantConfig } from '@/lib/types';

const MOCK_METRICS = [
  { label: "Vistas Totales", value: "3.2k", trend: "+12%", icon: Eye, color: "bg-blue-50 text-blue-600" },
  { label: "Intención de Compra", value: "145", sub: "Clics WhatsApp", trend: "+8%", icon: MousePointerClick, color: "bg-green-50 text-green-600" },
  { label: "Prod. Activos", value: "24", trend: "", icon: Package, color: "bg-purple-50 text-purple-600" },
];

export default function TenantAdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [tenant, setTenant] = useState<TenantConfig | null>(null);

  useEffect(() => {
    const loadTenant = async () => {
      if (!user?.tenantId) return;
      
      try {
        const tenantDoc = await getDoc(doc(centralDb, 'tenants', user.tenantId));
        if (tenantDoc.exists()) {
          setTenant({ id: tenantDoc.id, ...tenantDoc.data() } as TenantConfig);
        }
      } catch (error) {
        console.error('Error loading tenant:', error);
      }
    };

    loadTenant();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-5 md:p-10">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h2>
            <p className="text-gray-500 font-medium text-sm mt-1">Resumen de actividad.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-gray-800">
                {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
              </span>
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                {user?.role === 'owner' ? 'Propietario' : 'Administrador'}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_METRICS.map((metric, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${metric.color} bg-opacity-10`}>
                  <metric.icon size={20} strokeWidth={2.5} />
                </div>
                {metric.trend && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    {metric.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{metric.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{metric.label}</p>
                {metric.sub && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{metric.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/tenant-admin/products/new')}
            className="bg-gradient-to-br from-gray-900 to-black text-white rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer shadow-xl shadow-gray-200"
          >
            <div className="relative z-10 flex justify-between items-center h-full">
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Crear Producto</h3>
                <p className="text-gray-400 text-sm">Agrega items al catálogo.</p>
              </div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all">
                <Plus size={24} />
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              const domain = tenant?.domain || 'localhost';
              window.open(`/store?_domain=${domain}`, '_blank');
            }}
            className="bg-white rounded-[2rem] p-8 border border-gray-100 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="relative z-10 flex justify-between items-center h-full">
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1 text-gray-900">Ver Tienda</h3>
                <p className="text-gray-400 text-sm">Revisa cómo se ve.</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:scale-110 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all">
                <Eye size={24} />
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/tenant-admin/categories')}
            className="bg-white rounded-[2rem] p-8 border border-gray-100 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="relative z-10 flex justify-between items-center h-full">
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1 text-gray-900">Gestionar Categorías</h3>
                <p className="text-gray-400 text-sm">Organiza tus productos.</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:scale-110 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                <Package size={24} />
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/tenant-admin/settings')}
            className="bg-white rounded-[2rem] p-8 border border-gray-100 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="relative z-10 flex justify-between items-center h-full">
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1 text-gray-900">Configuración</h3>
                <p className="text-gray-400 text-sm">Personaliza tu marca.</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                <ChevronDown size={24} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
