import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

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
          <h1 className="text-3xl font-bold text-primary">Concerts</h1>
          <p className="text-gray-600 mt-2">Manage concert events</p>
        </div>
        <Link href="/admin/concerts/new">
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity">
            + Add concert
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error loading concerts. Please try again.</p>
        </div>
      )}

      {!error && (!concerts || concerts.length === 0) ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center mb-6">
          <p className="text-gray-600 mb-4">No concerts yet.</p>
          <Link
            href="/admin/concerts/new"
            className="text-secondary hover:text-primary font-semibold"
          >
            Create your first concert
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Concert
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {concerts?.map((concert) => {
                const concertDate = new Date(concert.date);
                const isPast = concertDate < new Date();

                return (
                  <tr key={concert.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{concert.title}</div>
                      {concert.venue && (
                        <div className="text-sm text-gray-500">{concert.venue}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {concertDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {concertDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{concert.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          concert.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {concert.is_published ? 'Published' : 'Draft'}
                      </span>
                      {isPast && (
                        <div className="text-xs text-gray-500 mt-1">Past event</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/concerts/${concert.id}`}
                        className="inline-block text-primary bg-transparent px-3 py-1 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-all"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
