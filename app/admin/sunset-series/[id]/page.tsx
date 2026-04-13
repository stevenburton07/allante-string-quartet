import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SunsetEventForm from '@/components/forms/SunsetEventForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Edit Sunset Series Event | Admin',
};

export default async function EditSunsetEventPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch the event
  const { data: event, error } = await supabase
    .from('sunset_events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !event) {
    notFound();
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
        <h1 className="text-3xl font-bold text-primary">Edit sunset series event</h1>
        <p className="text-gray-600 mt-2">Update the event details below</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <SunsetEventForm mode="edit" event={event} />
      </div>
    </div>
  );
}
