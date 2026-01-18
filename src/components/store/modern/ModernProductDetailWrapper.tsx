"use client";

import ModernProductDetail from './ModernProductDetail';
import { TenantConfig } from '@/lib/types';

interface ModernProductDetailWrapperProps {
  tenant: TenantConfig;
  domain: string;
  productId: string;
}

export default function ModernProductDetailWrapper({ tenant, domain, productId }: ModernProductDetailWrapperProps) {
  return <ModernProductDetail productId={productId} tenant={tenant} domain={domain} />;
}
