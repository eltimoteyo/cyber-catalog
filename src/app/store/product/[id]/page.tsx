import { notFound } from "next/navigation";
import { getTenantByDomain } from "@/lib/tenants";
import ModernProductDetail from "@/components/store/modern/ModernProductDetail";

interface StoreProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ _domain?: string }>;
}

export default async function StoreProductPage({ params, searchParams }: StoreProductPageProps) {
  const { id } = await params;
  const { _domain } = await searchParams;

  if (!_domain) {
    return notFound();
  }

  const tenant = await getTenantByDomain(_domain);

  if (!tenant || tenant.status !== 'active') {
    return notFound();
  }

  return <ModernProductDetail tenant={tenant} productId={id} domain={_domain} />;
}
