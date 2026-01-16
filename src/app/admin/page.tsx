import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin - Createam Platform",
  description: "Panel de administración de tenants",
};

export default function AdminPage() {
  // TODO: Implementar autenticación real
  // Por ahora, acceso directo
  
  return <AdminDashboard />;
}
