import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Event Orders | Admin',
};

export default async function EventOrdersPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch event
  const { data: event, error: eventError } = await supabase
    .from('sunset_events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (eventError || !event) {
    notFound();
  }

  // Fetch all orders for this event
  const { data: orders, error: ordersError } = await supabase
    .from('sunset_orders')
    .select('*')
    .eq('event_id', params.id)
    .order('created_at', { ascending: false });

  const totalOrders = orders?.length || 0;
  const totalTickets = orders?.reduce((sum, order) => sum + order.ticket_quantity, 0) || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + (order.amount_paid || 0), 0) || 0;
  const checkedInCount = orders?.filter((order) => order.checked_in).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/sunset-series"
            className="text-sm text-secondary hover:text-primary mb-2 inline-block"
          >
            ← Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-primary">{event.title}</h1>
          <p className="text-gray-600 mt-1">
            {new Date(event.event_date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            at {event.event_time}
          </p>
        </div>
        <Link
          href={`/admin/sunset-series/${params.id}/check-in`}
          className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Check-In Scanner
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-primary">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
          <p className="text-3xl font-bold text-primary">{totalTickets}</p>
          <p className="text-xs text-gray-500 mt-1">
            {event.max_tickets - event.tickets_sold} remaining
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Checked In</p>
          <p className="text-3xl font-bold text-primary">{checkedInCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalOrders > 0
              ? `${Math.round((checkedInCount / totalOrders) * 100)}%`
              : '0%'}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-primary">All Orders</h2>
        </div>

        {ordersError && (
          <div className="p-6">
            <p className="text-red-600">Error loading orders. Please try again.</p>
          </div>
        )}

        {!ordersError && (!orders || orders.length === 0) ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No orders yet for this event.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders?.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.customer_email}</div>
                      {order.customer_phone && (
                        <div className="text-sm text-gray-500">{order.customer_phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.ticket_quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${(order.amount_paid / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.checked_in
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.checked_in ? '✓ Checked In' : 'Not Checked In'}
                      </span>
                      {order.checked_in && order.checked_in_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(order.checked_in_at).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
