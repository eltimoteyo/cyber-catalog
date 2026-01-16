"use client";

import { useEffect, useState } from "react";
import { TenantConfig, TenantStatus } from "@/lib/types";
import { getAllTenants, updateTenantStatus, updateTenantConfig } from "@/lib/tenants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Store, 
  Check, 
  X, 
  Settings, 
  Pause,
  ExternalLink,
  ArrowLeft 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminDashboard() {
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TenantStatus | "all">("all");
  const [selectedTenant, setSelectedTenant] = useState<TenantConfig | null>(null);

  useEffect(() => {
    loadTenants();
  }, [filter]);

  async function loadTenants() {
    setLoading(true);
    try {
      const data = await getAllTenants(filter === "all" ? undefined : filter);
      setTenants(data);
    } catch (error) {
      console.error("Error loading tenants:", error);
      toast.error("Error al cargar tenants");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(tenantId: string, newStatus: TenantStatus) {
    try {
      await updateTenantStatus(tenantId, newStatus, "admin");
      toast.success(`Tenant ${newStatus === 'active' ? 'aprobado' : 'actualizado'}`);
      loadTenants();
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  }

  async function handleConfigUpdate(tenantId: string, config: Partial<TenantConfig>) {
    try {
      await updateTenantConfig(tenantId, config);
      toast.success("Configuración actualizada");
      setSelectedTenant(null);
      loadTenants();
    } catch (error) {
      toast.error("Error al actualizar configuración");
    }
  }

  const pendingCount = tenants.filter(t => t.status === 'pending').length;
  const activeCount = tenants.filter(t => t.status === 'active').length;

  if (selectedTenant) {
    return (
      <TenantConfigEditor
        tenant={selectedTenant}
        onSave={handleConfigUpdate}
        onCancel={() => setSelectedTenant(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Gestión de Tenants</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total"
            value={tenants.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <StatCard
            title="Pendientes"
            value={pendingCount}
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
            variant="warning"
          />
          <StatCard
            title="Activos"
            value={activeCount}
            active={filter === "active"}
            onClick={() => setFilter("active")}
            variant="success"
          />
          <StatCard
            title="Suspendidos"
            value={tenants.filter(t => t.status === 'suspended').length}
            active={filter === "suspended"}
            onClick={() => setFilter("suspended")}
            variant="error"
          />
        </div>

        {/* Tenants List */}
        <Card>
          <CardHeader>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>
              {filter === "all" ? "Todos los tenants" : `Tenants ${filter}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay tenants {filter !== "all" && filter}
              </div>
            ) : (
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <TenantCard
                    key={tenant.id}
                    tenant={tenant}
                    onApprove={() => handleStatusChange(tenant.id, 'active')}
                    onReject={() => handleStatusChange(tenant.id, 'rejected')}
                    onSuspend={() => handleStatusChange(tenant.id, 'suspended')}
                    onConfigure={() => setSelectedTenant(tenant)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  active, 
  onClick, 
  variant = "default" 
}: { 
  title: string; 
  value: number; 
  active: boolean; 
  onClick: () => void;
  variant?: "default" | "warning" | "success" | "error";
}) {
  const variantStyles = {
    default: "border-border",
    warning: "border-yellow-500",
    success: "border-green-500",
    error: "border-red-500",
  };

  return (
    <Card 
      className={`cursor-pointer transition-all ${active ? 'ring-2 ring-primary' : ''} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function TenantCard({ 
  tenant, 
  onApprove, 
  onReject, 
  onSuspend, 
  onConfigure 
}: {
  tenant: TenantConfig;
  onApprove: () => void;
  onReject: () => void;
  onSuspend: () => void;
  onConfigure: () => void;
}) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    suspended: "bg-red-100 text-red-800",
    rejected: "bg-gray-100 text-gray-800",
  };

  const domain = tenant.domain || `${tenant.subdomain}.createam.cloud`;

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{tenant.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[tenant.status]}`}>
              {tenant.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{tenant.email}</p>
          <a 
            href={`https://${domain}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            {domain}
            <ExternalLink className="h-3 w-3" />
          </a>
          {tenant.whatsapp && (
            <p className="text-sm text-muted-foreground mt-1">
              WhatsApp: {tenant.whatsapp}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {tenant.status === 'pending' && (
            <>
              <Button size="sm" variant="default" onClick={onApprove}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={onReject}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {tenant.status === 'active' && (
            <Button size="sm" variant="outline" onClick={onSuspend}>
              <Pause className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onConfigure}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function TenantConfigEditor({ 
  tenant, 
  onSave, 
  onCancel 
}: {
  tenant: TenantConfig;
  onSave: (tenantId: string, config: Partial<TenantConfig>) => void;
  onCancel: () => void;
}) {
  const [config, setConfig] = useState({
    logo: tenant.logo || "",
    primaryColor: tenant.colors?.primary || "",
    secondaryColor: tenant.colors?.secondary || "",
    whatsapp: tenant.whatsapp || "",
    firebaseApiKey: tenant.firebaseConfig.apiKey || "",
    firebaseAuthDomain: tenant.firebaseConfig.authDomain || "",
    firebaseProjectId: tenant.firebaseConfig.projectId || "",
    firebaseStorageBucket: tenant.firebaseConfig.storageBucket || "",
    firebaseMessagingSenderId: tenant.firebaseConfig.messagingSenderId || "",
    firebaseAppId: tenant.firebaseConfig.appId || "",
  });

  const handleSave = () => {
    onSave(tenant.id, {
      logo: config.logo,
      colors: {
        primary: config.primaryColor,
        secondary: config.secondaryColor,
      },
      whatsapp: config.whatsapp,
      firebaseConfig: {
        apiKey: config.firebaseApiKey,
        authDomain: config.firebaseAuthDomain,
        projectId: config.firebaseProjectId,
        storageBucket: config.firebaseStorageBucket,
        messagingSenderId: config.firebaseMessagingSenderId,
        appId: config.firebaseAppId,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurar {tenant.name}</CardTitle>
            <CardDescription>Personaliza la tienda de tu cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Branding */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Branding</h3>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={config.logo}
                  onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                  placeholder="https://ejemplo.com/logo.png"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color Primario (HSL)</Label>
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    placeholder="222.2 47.4% 11.2%"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color Secundario (HSL)</Label>
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    placeholder="210 40% 96.1%"
                  />
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contacto</h3>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={config.whatsapp}
                  onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                  placeholder="+51999999999"
                />
              </div>
            </div>

            {/* Firebase Config */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuración Firebase</h3>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  value={config.firebaseApiKey}
                  onChange={(e) => setConfig({ ...config, firebaseApiKey: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Auth Domain</Label>
                <Input
                  value={config.firebaseAuthDomain}
                  onChange={(e) => setConfig({ ...config, firebaseAuthDomain: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Project ID</Label>
                <Input
                  value={config.firebaseProjectId}
                  onChange={(e) => setConfig({ ...config, firebaseProjectId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Storage Bucket</Label>
                <Input
                  value={config.firebaseStorageBucket}
                  onChange={(e) => setConfig({ ...config, firebaseStorageBucket: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Messaging Sender ID</Label>
                <Input
                  value={config.firebaseMessagingSenderId}
                  onChange={(e) => setConfig({ ...config, firebaseMessagingSenderId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>App ID</Label>
                <Input
                  value={config.firebaseAppId}
                  onChange={(e) => setConfig({ ...config, firebaseAppId: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Guardar Configuración
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
