import { notFound } from "next/navigation";
import { getTenantByDomain } from "@/lib/tenants";
import { getTenantProductById, getRelatedProducts } from "@/lib/products-server";
import ModernProductDetail from "@/components/store/modern/ModernProductDetail";

// Cache por 60 segundos para mejorar rendimiento
export const revalidate = 60;
export const dynamic = 'force-dynamic';

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

  // Cargar producto y productos relacionados en paralelo en el servidor
  const [product, relatedProducts] = await Promise.all([
    getTenantProductById(tenant.id, tenant.firebaseConfig, id),
    getRelatedProducts(tenant.id, tenant.firebaseConfig, id, undefined, 4),
  ]);

  if (!product) {
    return notFound();
  }

  return (
    <ModernProductDetail 
      tenant={tenant} 
      productId={id} 
      domain={_domain}
      initialProduct={product}
      initialRelatedProducts={relatedProducts}
    />
  );
}
