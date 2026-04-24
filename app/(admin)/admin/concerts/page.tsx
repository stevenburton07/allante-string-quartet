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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Concerts</h1>
          <p className="text-gray-600 mt-2">Manage concert events</p>
        </div>
        <Link href="/admin/concerts/new" className="w-full sm:w-auto">
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity w-full sm:w-auto">
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
            className="inline-block text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-all"
          >
            Create your first concert
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="sm:hidden space-y-3">
            {concerts?.map((concert) => {
              const concertDateString = concert.date.slice(0, 16);
              const [datePart, timePart] = concertDateString.split('T');
              const [year, month, day] = datePart.split('-');
              const [hour, minute] = timePart.split(':');
              const concertDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
              const isPast = concertDate < new Date();

              return (
                <div key={concert.id} className="bg-white rounded-lg shadow p-4 space-y-4">
                  <div className="flex justify-between items-start gap-6">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{concert.title}</p>
                      {concert.venue && <p className="text-sm text-gray-500">{concert.venue}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
                          concert.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : concert.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : concert.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {concert.status ? concert.status.charAt(0).toUpperCase() + concert.status.slice(1) : 'Draft'}
                      </span>
                      {isPast && concert.status !== 'completed' && <span className="text-xs text-gray-500">Past event</span>}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {concertDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}{' '}
                      at {concertDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </p>
                    <p>{concert.location}</p>
                    <p>
                      {concert.attendees_count}/{concert.max_attendees} attendees
                      {' · '}
                      {concert.ticket_price === 0 ? 'Free' : `$${(concert.ticket_price / 100).toFixed(2)}`}
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <Link
                      href={`/admin/concerts/${concert.id}`}
                      className="flex-1 text-center text-primary bg-transparent px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-all"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/concerts/${concert.id}/orders`}
                      className="flex-1 text-center border-2 border-primary text-primary bg-transparent px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-all"
                    >
                      Orders
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table view */}
          <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
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
                    Attendees
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
                  const concertDateString = concert.date.slice(0, 16);
                  const [datePart, timePart] = concertDateString.split('T');
                  const [year, month, day] = datePart.split('-');
                  const [hour, minute] = timePart.split(':');
                  const concertDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
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
                        <div className="text-sm text-gray-900">
                          {concert.attendees_count} / {concert.max_attendees}
                        </div>
                        <div className="text-xs text-gray-500">
                          {concert.ticket_price === 0 ? 'Free' : `$${(concert.ticket_price / 100).toFixed(2)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            concert.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : concert.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : concert.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {concert.status ? concert.status.charAt(0).toUpperCase() + concert.status.slice(1) : 'Draft'}
                        </span>
                        {isPast && concert.status !== 'completed' && (
                          <div className="text-xs text-gray-500 mt-1">Past event</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <Link
                          href={`/admin/concerts/${concert.id}`}
                          className="inline-block text-primary bg-transparent px-3 py-1 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-all"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/concerts/${concert.id}/orders`}
                          className="inline-block border-2 border-primary text-primary bg-transparent px-3 py-1 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-all"
                        >
                          Orders
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
