"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getTenantByDomain } from "@/lib/tenants";
import { initTenantFirebase } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = searchParams.get('_domain') || 'localhost';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tenantId, setTenantId] = useState<string>("");

  useEffect(() => {
    loadProducts();
  }, [domain]);

  async function loadProducts() {
    setLoading(true);
    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) return;
      
      setTenantId(tenant.id);
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];
      
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) return;
      
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      await deleteDoc(doc(db, 'products', productId));
      
      toast.success("Producto eliminado");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar producto");
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
          <p className="text-muted-foreground">
            Gestiona el catálogo de tu tienda
          </p>
        </div>
        <Link href="/tenant-admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando productos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No se encontraron productos" : "Aún no tienes productos"}
              </p>
              {!searchQuery && (
                <Link href="/tenant-admin/products/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Primer Producto
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProductRow({ 
  product, 
  onDelete 
}: { 
  product: Product; 
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {product.imageUrls && product.imageUrls[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            Sin imagen
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{product.name}</h4>
        {product.description && (
          <p className="text-sm text-muted-foreground truncate">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-4 mt-1">
          <span className="text-sm font-medium text-primary">
            {formatPrice(product.price)}
          </span>
          {product.category && (
            <span className="text-xs px-2 py-1 bg-secondary rounded-full">
              {product.category}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/tenant-admin/products/${product.id}/edit`}>
          <Button size="sm" variant="outline">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(product.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
