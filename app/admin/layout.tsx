import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated (unless on login page)
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <AdminNav />
      <main className="py-8">{children}</main>
    </div>
  );
}
