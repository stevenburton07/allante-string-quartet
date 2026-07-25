import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Guard for admin Server Components: returns the signed-in user, or redirects
 * to the login page.
 *
 * Middleware already redirects unauthenticated traffic away from /admin, but it
 * is a single point of failure — Next.js has shipped several middleware-bypass
 * advisories, and the admin layout deliberately does not redirect (it renders
 * the login page through the same layout). Any admin page that reads data
 * server-side should call this so the check does not depend on middleware alone.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return user;
}
