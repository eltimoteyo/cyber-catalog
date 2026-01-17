"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { getTenantByDomain, updateTenantConfig } from "@/lib/tenants";
import { TenantConfig } from "@/lib/types";
import { toast } from "sonner";
import { uploadProductImage } from "@/lib/products";
import { initTenantFirebase } from "@/lib/firebase";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('_domain') || 'localhost';
  
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTenant, setLoadingTenant] = useState(true);
  const [error, setError] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    logo: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
  });

  useEffect(() => {
    loadTenant();
  }, [domain]);

  async function loadTenant() {
    setLoadingTenant(true);
    setError("");
    try {
      console.log('Loading tenant for domain:', domain);
      const tenantData = await getTenantByDomain(domain);
      
      if (!tenantData) {
        setError(`No se encontró tenant para el dominio: ${domain}`);
        console.error('Tenant not found for domain:', domain);
        return;
      }
      
      console.log('Tenant loaded:', tenantData);
      setTenant(tenantData);
      setFormData({
        logo: tenantData.logo || "",
        primaryColor: tenantData.colors?.primary || "222.2 47.4% 11.2%",
        secondaryColor: tenantData.colors?.secondary || "210 40% 96.1%",
        accentColor: tenantData.colors?.accent || "210 40% 96.1%",
        whatsapp: tenantData.whatsapp || "",
        instagram: tenantData.socialMedia?.instagram || "",
        facebook: tenantData.socialMedia?.facebook || "",
      });
      setLogoPreview(tenantData.logo || "");
    } catch (error) {
      console.error("Error loading tenant:", error);
      setError(`Error al cargar configuración: ${error}`);
    } finally {
      setLoadingTenant(false);
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tenant) return;
    
    setLoading(true);

    try {
      let logoUrl = formData.logo;
      
      // Subir nuevo logo si se seleccionó
      if (logoFile) {
        const { storage } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
        logoUrl = await uploadProductImage(storage, tenant.id, logoFile);
      }
      
      // Actualizar configuración del tenant
      await updateTenantConfig(tenant.id, {
        logo: logoUrl,
        colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor,
          accent: formData.accentColor,
        },
        whatsapp: formData.whatsapp,
        socialMedia: {
          instagram: formData.instagram,
          facebook: formData.facebook,
        },
      });
      
      toast.success("Configuración actualizada");
      loadTenant(); // Recargar datos
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Error al actualizar configuración");
    } finally {
      setLoading(false);
    }
  }

  if (loadingTenant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">
            Personaliza la apariencia y datos de tu tienda
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-sm text-muted-foreground mb-4">
                Dominio actual: <strong>{domain}</strong>
              </p>
              <Button onClick={loadTenant} variant="outline">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontró configuración del tenant</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Personaliza la apariencia y datos de tu tienda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Logo y colores de tu tienda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border bg-muted">
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Subir Logo</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Recomendado: PNG o SVG con fondo transparente, 200x200px
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Color Primario (HSL)</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="222.2 47.4% 11.2%"
                  />
                  <div 
                    className="w-12 h-10 rounded border" 
                    style={{ backgroundColor: `hsl(${formData.primaryColor})` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Formato HSL: "tono saturación% luminosidad%"
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Color Secundario (HSL)</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="210 40% 96.1%"
                  />
                  <div 
                    className="w-12 h-10 rounded border" 
                    style={{ backgroundColor: `hsl(${formData.secondaryColor})` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>Configura tus redes sociales y WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (con código de país)</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+51999999999"
              />
              <p className="text-xs text-muted-foreground">
                Este número se usará para el botón de compra
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@mitienda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="facebook.com/mitienda"
              />
            </div>
          </CardContent>
        </Card>

        {/* Información del Dominio */}
        <Card>
          <CardHeader>
            <CardTitle>Dominio</CardTitle>
            <CardDescription>Información de tu dominio actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Tu tienda está en:</div>
              <div className="text-lg font-semibold">
                {tenant.domain || `${tenant.subdomain}.createam.cloud`}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Para cambiar tu dominio, contacta al administrador de la plataforma
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
