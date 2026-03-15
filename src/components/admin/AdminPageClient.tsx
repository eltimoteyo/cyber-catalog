"use client";

import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOnlyRoute from "@/components/AdminOnlyRoute";

export default function AdminPageClient() {
  return (
    <AdminOnlyRoute>
      <AdminDashboard />
    </AdminOnlyRoute>
  );
}
