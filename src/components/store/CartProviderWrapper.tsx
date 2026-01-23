"use client";

import { CartProvider } from "@/contexts/CartContext";
import { TenantConfig } from "@/lib/types";

interface CartProviderWrapperProps {
  tenant: TenantConfig;
  children: React.ReactNode;
}

export default function CartProviderWrapper({ tenant, children }: CartProviderWrapperProps) {
  return (
    <CartProvider tenantId={tenant.id}>
      {children}
    </CartProvider>
  );
}
