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

  // If not authenticated, render without admin nav (for login page)
  // Middleware handles redirects
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <AdminNav />
      <main className="py-4 sm:py-8 pb-0">{children}</main>
    </div>
  );
}
