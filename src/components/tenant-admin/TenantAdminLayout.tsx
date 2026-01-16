"use client";

import { TenantConfig } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  Package, 
  FolderTree, 
  Settings, 
  LogOut,
  Home,
  Palette
} from "lucide-react";

interface TenantAdminLayoutProps {
  tenant: TenantConfig;
  children: React.ReactNode;
}

export default function TenantAdminLayout({ tenant, children }: TenantAdminLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/tenant-admin", icon: Home },
    { name: "Productos", href: "/tenant-admin/products", icon: Package },
    { name: "Categorías", href: "/tenant-admin/categories", icon: FolderTree },
    { name: "Configuración", href: "/tenant-admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/tenant-admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tenant.logo && (
                <img src={tenant.logo} alt={tenant.name} className="h-8 w-8 object-contain" />
              )}
              <div>
                <h1 className="text-xl font-bold">{tenant.name}</h1>
                <p className="text-xs text-muted-foreground">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  <Store className="mr-2 h-4 w-4" />
                  Ver Tienda
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
