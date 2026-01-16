"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, TrendingUp, Eye } from "lucide-react";
import { initTenantFirebase } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export default function TenantAdminDashboard() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('_domain') || 'localhost';
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    loading: true,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        // Aquí obtendrías el tenant del contexto o prop
        // Por ahora simulamos
        setStats({
          totalProducts: 0,
          totalCategories: 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    loadStats();
  }, [domain]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen de tu tienda
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          loading={stats.loading}
        />
        <StatCard
          title="Categorías"
          value={stats.totalCategories}
          icon={<FolderTree className="h-4 w-4 text-muted-foreground" />}
          loading={stats.loading}
        />
        <StatCard
          title="Vistas (Este mes)"
          value="0"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          description="Próximamente"
        />
        <StatCard
          title="Conversiones"
          value="0"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Próximamente"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Empieza a configurar tu tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <QuickActionCard
              title="Agregar Producto"
              description="Agrega tu primer producto"
              href="/tenant-admin/products/new"
            />
            <QuickActionCard
              title="Configurar Branding"
              description="Personaliza logo y colores"
              href="/tenant-admin/settings"
            />
            <QuickActionCard
              title="Crear Categoría"
              description="Organiza tus productos"
              href="/tenant-admin/categories"
            />
            <QuickActionCard
              title="Ver Mi Tienda"
              description="Revisa cómo se ve tu tienda"
              href="/"
              external
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  loading 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  description?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-2xl font-bold">...</div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  external = false,
}: {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="block p-4 border rounded-lg hover:bg-accent transition-colors"
    >
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </a>
  );
}
