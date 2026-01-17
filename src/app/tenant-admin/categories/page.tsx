"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Edit3, Coffee, Flower, Gift, Heart, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { initTenantFirebase, centralDb } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, getDoc, doc as firestoreDoc } from "firebase/firestore";
import { createCategory, updateCategory, deleteCategory } from "@/lib/products";
import { Category, TenantConfig } from "@/lib/types";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

function CategoriesContent() {
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [editingName, setEditingName] = useState("");
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.tenantId) {
      loadCategories();
    }
  }, [user]);

  async function loadCategories() {
    if (!user?.tenantId) return;
    
    setLoading(true);
    try {
      // Obtener configuración del tenant
      const tenantDoc = await getDoc(firestoreDoc(centralDb, 'tenants', user.tenantId));
      if (!tenantDoc.exists()) {
        toast.error("Tenant no encontrado");
        return;
      }
      
      const tenantData = { id: tenantDoc.id, ...tenantDoc.data() } as TenantConfig;
      setTenant(tenantData);
      
      const { db } = initTenantFirebase(tenantData.id, tenantData.firebaseConfig);
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
    if (!newCategory.trim() || !tenant) return;
    
    try {
      const { db } = initTenantFirebase(tenant.id, tenant.firebaseConfig);
      await createCategory(db, newCategory, categories.length);
      
      toast.success("Categoría creada");
      setNewCategory("");
      setShowModal(false);
      loadCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error al crear categoría");
    }
  }

  async function handleUpdate(categoryId: string) {
    if (!editingName.trim() || !tenant) return;
    
    try {
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
    if (!confirm("¿Estás seguro de eliminar esta categoría?") || !tenant) return;
    
    try {
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Categorías</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Organiza tus productos.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all active:scale-95"
        >
          <Plus size={18} /> <span className="hidden sm:inline">Nueva</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-semibold">Cargando categorías...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-5 rounded-[1.5rem] border border-gray-100 hover:border-rose-100 hover:shadow-lg transition-all group relative cursor-pointer">
              {editingId === cat.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-rose-500/20"
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="flex-1 bg-black text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-800 transition-all"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-rose-50 text-rose-600">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
                  <p className="text-xs font-semibold text-gray-400 mt-1">Orden: {cat.order || 0}</p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          <button 
            onClick={() => setShowModal(true)} 
            className="border-2 border-dashed border-gray-200 rounded-[1.5rem] flex flex-col items-center justify-center text-gray-400 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-500 transition-all min-h-[160px]"
          >
            <Plus size={32} className="mb-2 opacity-50" />
            <span className="text-sm font-bold">Crear Categoría</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 md:p-8 relative z-10 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">Nueva Categoría</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                  className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  placeholder="Ej: Aniversario"
                  autoFocus
                />
              </div>

              <button 
                onClick={handleCreate}
                className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-200 mt-4 active:scale-[0.98] transition-transform"
              >
                Crear Categoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <ProtectedRoute>
      <CategoriesContent />
    </ProtectedRoute>
  );
}
