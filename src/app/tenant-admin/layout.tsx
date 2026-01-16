import { getTenantByDomain } from "@/lib/tenants";
import { redirect } from "next/navigation";
import TenantAdminLayout from "@/components/tenant-admin/TenantAdminLayout";

export default async function Layout({ 
  children, 
  searchParams 
}: { 
  children: React.ReactNode;
  searchParams?: Promise<{ _domain?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const domain = params._domain || 'localhost';

  // Obtener configuración del tenant
  const tenant = await getTenantByDomain(domain);

  if (!tenant || tenant.status !== 'active') {
    redirect('/');
  }

  // TODO: Implementar autenticación - verificar que el usuario tiene permisos para este tenant

  return <TenantAdminLayout tenant={tenant}>{children}</TenantAdminLayout>;
}
