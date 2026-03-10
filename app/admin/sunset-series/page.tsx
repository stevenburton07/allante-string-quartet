import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminSunsetSeriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch all sunset events
  const { data: events, error } = await supabase
    .from('sunset_events')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching sunset events:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Sunset Series Events</h1>
        <Link
          href="/admin/sunset-series/new"
          className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Create New Event
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading events. Please try again.</p>
        </div>
      )}

      {!error && (!events || events.length === 0) ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No Sunset Series events yet.</p>
          <Link
            href="/admin/sunset-series/new"
            className="text-secondary hover:text-primary font-semibold"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events?.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">
                      {event.location_city}, {event.location_state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-sm text-gray-500">{event.event_time}</div>
                    {event.rain_date && (
                      <div className="text-xs text-gray-500">
                        Rain date: {new Date(event.rain_date).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.tickets_sold} / {event.max_tickets}
                    </div>
                    <div className="text-xs text-gray-500">
                      ${(event.ticket_price / 100).toFixed(2)} each
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {event.published ? 'Published' : 'Draft'}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 capitalize">{event.status}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link
                      href={`/admin/sunset-series/${event.id}`}
                      className="text-primary hover:text-secondary"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/sunset-series/${event.id}/orders`}
                      className="text-secondary hover:text-primary"
                    >
                      Orders
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
