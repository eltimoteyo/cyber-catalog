"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { getTenantByDomain } from "@/lib/tenants";
import { initTenantFirebase } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { updateProduct, uploadProductImage, deleteProductImage } from "@/lib/products";
import { Category, Product } from "@/lib/types";
import { toast } from "sonner";

export default function EditProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const domain = searchParams.get('_domain') || 'localhost';
  
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    featured: false,
  });

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, [productId, domain]);

  async function loadProduct() {
    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) return;
      
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const product = docSnap.data() as Product;
        setFormData({
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          category: product.category || "",
          featured: product.featured || false,
        });
        setExistingImages(product.imageUrls || []);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Error al cargar producto");
    } finally {
      setLoadingProduct(false);
    }
  }

  async function loadCategories() {
    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) return;
      
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const snapshot = await getDocs(collection(db, 'categories'));
      
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      
      setCategories(cats);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  function handleNewImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setNewImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeExistingImage(index: number) {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  }

  function removeNewImage(index: number) {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) throw new Error("Tenant not found");
      
      const { db, storage } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      
      // Subir nuevas imágenes
      const newImageUrls: string[] = [];
      for (const image of newImages) {
        const url = await uploadProductImage(storage, tenant.id, image);
        newImageUrls.push(url);
      }
      
      // Combinar imágenes existentes y nuevas
      const allImageUrls = [...existingImages, ...newImageUrls];
      
      // Actualizar producto
      await updateProduct(db, productId, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrls: allImageUrls,
        featured: formData.featured,
      });
      
      toast.success("Producto actualizado exitosamente");
      router.push('/tenant-admin/products');
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  }

  if (loadingProduct) {
    return <div className="text-center py-12">Cargando producto...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tenant-admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Editar Producto</h2>
          <p className="text-muted-foreground">Actualiza la información del producto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (S/.) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Sin categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imágenes</Label>
              <div className="space-y-4">
                {/* Imágenes existentes */}
                {existingImages.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Imágenes actuales:</p>
                    <div className="grid grid-cols-4 gap-4">
                      {existingImages.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                          <img src={url} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nuevas imágenes */}
                {newImagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Nuevas imágenes:</p>
                    <div className="grid grid-cols-4 gap-4">
                      {newImagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                          <img src={preview} alt={`Nueva ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Agregar más imágenes</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleNewImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Producto destacado
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Link href="/tenant-admin/products">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
