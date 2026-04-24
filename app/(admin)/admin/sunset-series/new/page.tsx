import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SunsetEventForm from '@/components/forms/SunsetEventForm';

export const metadata = {
  title: 'Create Sunset Series Event | Admin',
};

export default async function NewSunsetEventPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/sunset-series"
          className="text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-3 py-1.5 text-sm inline-flex items-center mb-4"
        >
          ← Back to sunset series
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Create new sunset series event</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create a new sunset series event
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <SunsetEventForm mode="create" />
      </div>
    </div>
  );
}
