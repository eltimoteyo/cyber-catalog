"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { getTenantByDomain } from "@/lib/tenants";
import { initTenantFirebase } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { createCategory, updateCategory, deleteCategory } from "@/lib/products";
import { Category } from "@/lib/types";
import { toast } from "sonner";

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('_domain') || 'localhost';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    loadCategories();
  }, [domain]);

  async function loadCategories() {
    setLoading(true);
    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) return;
      
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      
      setCategories(cats);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newCategory.trim()) return;
    
    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) return;
      
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      await createCategory(db, newCategory, categories.length);
      
      toast.success("Categoría creada");
      setNewCategory("");
      loadCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error al crear categoría");
    }
  }

  async function handleUpdate(categoryId: string) {
    if (!editingName.trim()) return;
    
    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) return;
      
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      const category = categories.find(c => c.id === categoryId);
      await updateCategory(db, categoryId, editingName, category?.order);
      
      toast.success("Categoría actualizada");
      setEditingId(null);
      setEditingName("");
      loadCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error al actualizar categoría");
    }
  }

  async function handleDelete(categoryId: string) {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
    
    try {
      const tenant = await getTenantByDomain(domain);
      if (!tenant) return;
      
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      await deleteCategory(db, categoryId);
      
      toast.success("Categoría eliminada");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error al eliminar categoría");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
        <p className="text-muted-foreground">
          Organiza tus productos en categorías
        </p>
      </div>

      {/* Crear nueva categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Nueva Categoría</CardTitle>
          <CardDescription>Agrega una categoría para organizar tus productos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre de la categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías Existentes</CardTitle>
          <CardDescription>
            {categories.length} categoría{categories.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando categorías...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aún no tienes categorías. Crea una para empezar.
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  
                  {editingId === category.id ? (
                    <>
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(category.id)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleUpdate(category.id)}>
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 font-medium">{category.name}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(category.id);
                          setEditingName(category.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
