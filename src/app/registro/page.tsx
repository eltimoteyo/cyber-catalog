"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ArrowLeft } from "lucide-react";
import { registerTenant } from "@/lib/tenants";
import { toast } from "sonner";

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    wantsDomain: false,
    customDomain: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tenantId = await registerTenant({
        name: formData.businessName,
        email: formData.email,
        businessName: formData.businessName,
        phone: formData.phone,
        wantsDomain: formData.wantsDomain,
        customDomain: formData.customDomain || undefined,
      });

      toast.success("¡Solicitud enviada!", {
        description: "Revisaremos tu solicitud y te contactaremos pronto.",
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/?registered=true");
      }, 2000);
    } catch (error) {
      console.error("Error registering tenant:", error);
      toast.error("Error al enviar solicitud", {
        description: "Por favor intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Store className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">Crea tu Tienda Online</CardTitle>
            <CardDescription>
              Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del Negocio *</Label>
                <Input
                  id="businessName"
                  placeholder="Mi Tienda Online"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email de Contacto *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@mitienda.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp (con código de país) *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+51999999999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Incluye el código de país. Ej: +51 para Perú
                </p>
              </div>

              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <Label className="text-base">Tipo de Dominio</Label>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="domainType"
                      checked={!formData.wantsDomain}
                      onChange={() => setFormData({ ...formData, wantsDomain: false, customDomain: "" })}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Subdominio gratuito</div>
                      <div className="text-sm text-muted-foreground">
                        Tu tienda estará en: mitienda.createam.cloud
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="domainType"
                      checked={formData.wantsDomain}
                      onChange={() => setFormData({ ...formData, wantsDomain: true })}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Dominio personalizado</div>
                      <div className="text-sm text-muted-foreground">
                        Usa tu propio dominio (ej: mitienda.com)
                      </div>
                    </div>
                  </label>
                </div>

                {formData.wantsDomain && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="customDomain">Tu Dominio</Label>
                    <Input
                      id="customDomain"
                      placeholder="mitienda.com"
                      value={formData.customDomain}
                      onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Te ayudaremos con la configuración DNS
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Enviando..." : "Solicitar Mi Tienda"}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Al registrarte, aceptas nuestros términos y condiciones
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
