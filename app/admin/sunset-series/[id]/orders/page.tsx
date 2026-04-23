import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import CopyEmailsButton from '@/components/admin/CopyEmailsButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Event Orders | Admin',
};

export default async function EventOrdersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    .eq('id', id)
    .single();

  if (eventError || !event) {
    notFound();
  }

  // Fetch all orders for this event
  const { data: orders, error: ordersError } = await supabase
    .from('sunset_orders')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false });

  const totalOrders = orders?.length || 0;
  const totalTickets = orders?.reduce((sum, order) => sum + order.ticket_quantity, 0) || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + (order.amount_paid || 0), 0) || 0;
  const checkedInCount = orders?.filter((order) => order.checked_in).length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href="/admin/sunset-series"
            className="text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-3 py-1.5 text-sm inline-flex items-center mb-2"
          >
            ← Back to sunset series
          </Link>
          <h1 className="text-3xl font-bold text-primary">{event.title}</h1>
          <p className="text-gray-600 mt-1">
            {new Date(event.event_date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            at {(() => {
              const [hours, minutes] = event.event_time.split(':');
              const hour = parseInt(hours);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour % 12 || 12;
              return `${displayHour}:${minutes} ${ampm}`;
            })()}
          </p>
        </div>
        <Link
          href={`/admin/sunset-series/${id}/check-in`}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity flex-shrink-0"
        >
          Check-in scanner
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total orders</p>
          <p className="text-3xl font-bold text-primary">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total tickets</p>
          <p className="text-3xl font-bold text-primary">{totalTickets}</p>
          <p className="text-xs text-gray-500 mt-1">
            {event.max_tickets - event.tickets_sold} remaining
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total revenue</p>
          <p className="text-3xl font-bold text-primary">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Checked in</p>
          <p className="text-3xl font-bold text-primary">
            {totalOrders > 0
              ? `${Math.round((checkedInCount / totalOrders) * 100)}%`
              : '0%'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {checkedInCount} checked in
          </p>
        </div>
      </div>

      {/* Copy Emails Button */}
      <div className="flex justify-end">
        <CopyEmailsButton
          emails={orders?.map((order) => order.customer_email) || []}
          label="Copy Attendee Emails"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-primary">All orders</h2>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Purchase date
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
                        {order.checked_in ? '✓ Checked in' : 'Not checked in'}
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
    </div>
  );
}
