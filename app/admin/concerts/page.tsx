import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ConcertListItem from '@/components/concerts/ConcertListItem';

export default async function ConcertsListPage() {
  const supabase = await createClient();

  const { data: concerts, error } = await supabase
    .from('concerts')
    .select('*')
    .order('date', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Concerts</h1>
          <p className="text-gray-600 mt-2">View and edit all concert events</p>
        </div>
        <Link href="/admin/concerts/new">
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity">
            + Add Concert
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-700">Failed to load concerts. Please try again.</p>
        </div>
      )}

      {!concerts || concerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No concerts yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first concert event</p>
          <Link href="/admin/concerts/new">
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity">
              Create First Concert
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {concerts.map((concert) => (
            <ConcertListItem key={concert.id} concert={concert} />
          ))}
        </div>
      )}
    </div>
  );
}
