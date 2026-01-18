import { notFound } from "next/navigation";
import { getTenantByDomain } from "@/lib/tenants";
import ModernProductDetail from "@/components/store/modern/ModernProductDetail";
import { doc, getDoc } from "firebase/firestore";
import { initTenantFirebase } from "@/lib/firebase";
import { Product } from "@/lib/types";

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

  // Cargar el producto
  const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
  const productDoc = await getDoc(doc(db, 'products', id));
  
  if (!productDoc.exists()) {
    return notFound();
  }

  const product = {
    id: productDoc.id,
    ...productDoc.data(),
    createdAt: productDoc.data().createdAt?.toDate(),
    updatedAt: productDoc.data().updatedAt?.toDate(),
  } as Product;

  return <ModernProductDetail tenant={tenant} product={product} domain={_domain} />;
}
