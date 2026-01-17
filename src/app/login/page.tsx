"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await loginWithEmail(email, password);
      console.log("Usuario autenticado:", userData);
      router.push("/tenant-admin");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-300 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[120px] opacity-30" />

      <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50 relative z-10">
        <div className="mb-10 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Store className="text-white" size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Gestiona tu catálogo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 font-semibold text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none placeholder-gray-300"
              placeholder="admin@tutienda.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <input 
              type="password" 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 font-semibold text-gray-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none placeholder-gray-300"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-rose-500 text-xs font-bold text-center py-2 bg-rose-50 rounded-lg">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
