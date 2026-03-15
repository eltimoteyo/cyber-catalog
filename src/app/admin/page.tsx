import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPageClient from "@/components/admin/AdminPageClient";
import { getSessionCookieName, verifyPlatformAdminSessionCookie } from '@/lib/server/admin-auth';

export const metadata = {
  title: "Admin - Createam Platform",
  description: "Panel de administración de tenants",
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getSessionCookieName())?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  const authResult = await verifyPlatformAdminSessionCookie(sessionCookie);
  if (!authResult.ok) {
    redirect('/login');
  }

  return <AdminPageClient />;
}
