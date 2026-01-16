"use client";

import { useEffect, useState } from "react";
import { TenantConfig, Product } from "@/lib/types";
import { initTenantFirebase } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { formatPrice, getWhatsAppLink } from "@/lib/utils";
import Link from "next/link";

interface StoreProductProps {
  tenant: TenantConfig;
  productId: string;
}

export default function StoreProduct({ tenant, productId }: StoreProductProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate(),
            updatedAt: docSnap.data().updatedAt?.toDate(),
          } as Product);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [tenant, productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Link href="/">
            <Button>Volver a la tienda</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    if (!tenant.whatsapp) return;
    const message = `Hola! Estoy interesado en: ${product.name} - ${formatPrice(product.price)}`;
    const link = getWhatsAppLink(tenant.whatsapp, message);
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80">
              <ArrowLeft className="h-5 w-5" />
              {tenant.logo && (
                <img src={tenant.logo} alt={tenant.name} className="h-8 w-8 object-contain" />
              )}
              <span className="font-semibold">{tenant.name}</span>
            </Link>
            {tenant.whatsapp && (
              <a
                href={getWhatsAppLink(tenant.whatsapp, `Hola! Tengo una consulta`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              {product.imageUrls && product.imageUrls[selectedImage] ? (
                <img
                  src={product.imageUrls[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Sin imagen
                </div>
              )}
            </div>
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.category && (
                <p className="text-muted-foreground">{product.category}</p>
              )}
            </div>

            <div className="text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {tenant.whatsapp && (
              <Button size="lg" className="w-full" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Comprar por WhatsApp
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
