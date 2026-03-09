import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ConcertForm from '@/components/concerts/ConcertForm';
import Link from 'next/link';
import type { Concert } from '@/types/concert';

export default async function EditConcertPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: concert, error } = await supabase
    .from('concerts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !concert) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/concerts"
          className="text-sm text-primary hover:text-secondary transition-colors mb-4 inline-block"
        >
          ← Back to Concerts
        </Link>
        <h1 className="text-3xl font-bold text-primary">Edit Concert</h1>
        <p className="text-gray-600 mt-2">{concert.title}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <ConcertForm concert={concert as Concert} isEdit />
      </div>
    </div>
  );
}
