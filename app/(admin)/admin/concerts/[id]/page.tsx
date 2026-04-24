import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ConcertForm from '@/components/concerts/ConcertForm';
import Link from 'next/link';
import type { Concert } from '@/types/concert';

export default async function EditConcertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: concert, error } = await supabase
    .from('concerts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !concert) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/concerts"
          className="text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-3 py-1.5 text-sm inline-flex items-center mb-4"
        >
          ← Back to concerts
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Edit concert</h1>
        <p className="text-gray-600 mt-2">{concert.title}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-8">
        <ConcertForm concert={concert as Concert} isEdit />
      </div>
    </div>
  );
}
