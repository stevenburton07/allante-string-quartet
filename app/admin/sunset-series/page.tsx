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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Sunset series events</h1>
          <p className="text-gray-600 mt-2">Manage outdoor concert events</p>
        </div>
        <Link href="/admin/sunset-series/new">
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity">
            + Add event
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error loading events. Please try again.</p>
        </div>
      )}

      {!error && (!events || events.length === 0) ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center mb-6">
          <p className="text-gray-600 mb-4">No sunset series events yet.</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                  Tickets
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
                    <div className="text-sm text-gray-500">
                      {(() => {
                        const [hours, minutes] = event.event_time.split(':');
                        const hour = parseInt(hours);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour % 12 || 12;
                        return `${displayHour}:${minutes} ${ampm}`;
                      })()}
                    </div>
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
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        event.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : event.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link
                      href={`/admin/sunset-series/${event.id}`}
                      className="inline-block text-primary bg-transparent px-3 py-1 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-all"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/sunset-series/${event.id}/orders`}
                      className="inline-block border-2 border-primary text-primary bg-transparent px-3 py-1 rounded-lg text-sm font-semibold hover:bg-primary/10 transition-all"
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
