"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TenantConfig, Product } from "@/lib/types";
import { initTenantFirebase } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getWhatsAppLink } from "@/lib/utils";

interface StoreHomeProps {
  tenant: TenantConfig;
}

export default function StoreHome({ tenant }: StoreHomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        // Inicializar Firebase del tenant
        const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);

        // Cargar productos
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Product[];

        setProducts(productsData);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [tenant]);

  // Aplicar colores personalizados del tenant
  useEffect(() => {
    if (tenant.colors?.primary) {
      document.documentElement.style.setProperty(
        "--primary",
        tenant.colors.primary
      );
    }
    if (tenant.colors?.secondary) {
      document.documentElement.style.setProperty(
        "--secondary",
        tenant.colors.secondary
      );
    }
  }, [tenant.colors]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tenant.logo && (
                <img
                  src={tenant.logo}
                  alt={tenant.name}
                  className="h-10 w-10 object-contain"
                />
              )}
              <h1 className="text-2xl font-bold">{tenant.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              {tenant.whatsapp && (
                <a
                  href={getWhatsAppLink(tenant.whatsapp, `Hola! Tengo una consulta sobre ${tenant.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              )}
              <Link href="/tenant-admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-muted to-background py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Bienvenido a {tenant.name}
          </h2>
          <p className="text-xl text-muted-foreground">
            Descubre nuestros productos
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p className="text-xl">Aún no hay productos disponibles</p>
              <p className="mt-2">Pronto agregaremos nuevos artículos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  tenant={tenant}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {tenant.name}. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">
            Powered by <a href="https://createam.cloud" className="text-primary hover:underline">Createam</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, tenant }: { product: Product; tenant: TenantConfig }) {
  const handleWhatsAppClick = () => {
    if (!tenant.whatsapp) return;

    const message = `Hola! Estoy interesado en: ${product.name} - ${formatPrice(product.price)}`;
    const link = getWhatsAppLink(tenant.whatsapp, message);
    window.open(link, "_blank");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden bg-muted">
        {product.imageUrls && product.imageUrls[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {tenant.whatsapp && (
            <Button size="sm" onClick={handleWhatsAppClick}>
              <MessageCircle className="mr-1 h-4 w-4" />
              Comprar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
