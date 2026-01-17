"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { centralDb } from '@/lib/firebase';
import { TenantConfig } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Upload, Save, Palette, Globe, Hash, MessageCircle, Instagram, Facebook, Music2, Loader2 } from 'lucide-react';

function SettingsContent() {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [loadingTenant, setLoadingTenant] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#E11D48');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');

  useEffect(() => {
    const loadTenant = async () => {
      if (!user?.tenantId) {
        setError('No se encontró el tenant del usuario');
        setLoadingTenant(false);
        return;
      }

      try {
        console.log('Cargando tenant:', user.tenantId);
        const tenantDoc = await getDoc(doc(centralDb, 'tenants', user.tenantId));
        
        if (!tenantDoc.exists()) {
          setError(`No se encontró el tenant: ${user.tenantId}`);
          setLoadingTenant(false);
          return;
        }

        const tenantData = { id: tenantDoc.id, ...tenantDoc.data() } as TenantConfig;
        console.log('Tenant encontrado:', tenantData);
        
        setTenant(tenantData);
        setName(tenantData.name || '');
        setDomain(tenantData.domain || '');
        setPrimaryColor(tenantData.primaryColor || '#E11D48');
        setWhatsapp(tenantData.whatsapp || '');
        setInstagram(tenantData.socialMedia?.instagram || '');
        setFacebook(tenantData.socialMedia?.facebook || '');
        setTiktok(tenantData.socialMedia?.tiktok || '');
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar tenant:', err);
        setError(err.message || 'Error al cargar el tenant');
      } finally {
        setLoadingTenant(false);
      }
    };

    loadTenant();
  }, [user]);

  const handleSave = async () => {
    if (!tenant || !user?.tenantId) {
      toast.error('No hay tenant para guardar');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(centralDb, 'tenants', user.tenantId), {
        name,
        domain,
        primaryColor,
        whatsapp,
        socialMedia: {
          instagram,
          facebook,
          tiktok,
        },
        updatedAt: new Date().toISOString(),
      });

      toast.success('Configuración guardada exitosamente');
      
      // Actualizar el estado local
      setTenant({
        ...tenant,
        name,
        domain,
        primaryColor,
        whatsapp,
        socialMedia: { instagram, facebook, tiktok },
      });
    } catch (err: any) {
      console.error('Error al guardar:', err);
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-semibold">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] p-6">
        <div className="bg-white rounded-[2rem] p-8 max-w-md text-center shadow-xl">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-24 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Configurar Branding</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Personaliza la identidad de tu tienda.</p>
          {user && (
            <div className="mt-4 flex items-center gap-2 text-xs flex-wrap">
              <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-bold">
                {user.email}
              </div>
              <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-bold">
                Tenant: {user.tenantId}
              </div>
            </div>
          )}
        </div>

        {/* Información Básica */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <Globe size={20} className="text-rose-600" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Información Básica</h2>
              <p className="text-sm text-gray-500">Nombre y dominio de tu tienda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Nombre de la Tienda</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                placeholder="Ej: Bella Sorpresa"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Dominio</label>
              <div className="relative">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl pl-10 pr-5 py-3.5 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  placeholder="mitienda.com"
                />
                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Color Primario */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Palette size={20} className="text-purple-600" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Color Primario</h2>
              <p className="text-sm text-gray-500">Define el color de tu marca</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-gray-100 shadow-sm"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Hash size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 font-mono font-bold text-gray-900 outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="#E11D48"
                />
              </div>
              <p className="text-xs text-gray-400 font-medium">Este color se usará en botones, enlaces y elementos destacados.</p>
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <MessageCircle size={20} className="text-blue-600" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Contacto y Redes Sociales</h2>
              <p className="text-sm text-gray-500">Enlaces a tus canales de comunicación</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-green-50 rounded-2xl pl-10 pr-5 py-3.5 font-semibold text-green-900 outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder-green-300"
                  placeholder="51999999999"
                />
                <MessageCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Instagram</label>
              <div className="relative">
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-pink-50 rounded-2xl pl-10 pr-5 py-3.5 font-semibold text-pink-900 outline-none focus:ring-2 focus:ring-pink-500/20 transition-all placeholder-pink-300"
                  placeholder="https://instagram.com/..."
                />
                <Instagram size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Facebook</label>
              <div className="relative">
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full bg-blue-50 rounded-2xl pl-10 pr-5 py-3.5 font-semibold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-blue-300"
                  placeholder="https://facebook.com/..."
                />
                <Facebook size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">TikTok</label>
              <div className="relative">
                <input
                  type="url"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl pl-10 pr-5 py-3.5 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-gray-500/20 transition-all placeholder-gray-300"
                  placeholder="https://tiktok.com/@..."
                />
                <Music2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="sticky bottom-6 z-20">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-2xl shadow-gray-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={22} />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
