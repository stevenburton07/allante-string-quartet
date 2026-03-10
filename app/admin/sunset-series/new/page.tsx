import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Create New Sunset Series Event</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create a new Sunset Series event
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <SunsetEventForm mode="create" />
      </div>
    </div>
  );
}
