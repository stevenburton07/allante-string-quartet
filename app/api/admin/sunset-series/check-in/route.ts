import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getErrorMessage } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, eventId } = body;

    if (!orderId || !eventId) {
      return NextResponse.json({ error: 'Missing orderId or eventId' }, { status: 400 });
    }

    // Paid tickets encode the Stripe session id; comp tickets encode a
    // "SUNSET:<id>:<nanoid>" string stored in qr_code and have no session id.
    // Look up by whichever column the scanned value belongs to. (Mirrors the
    // concerts check-in route, which already handled this.)
    const isCompTicket = orderId.startsWith('SUNSET:');
    const baseQuery = supabase
      .from('sunset_orders')
      .select('*')
      .eq('event_id', eventId);

    const { data: order, error: fetchError } = await (isCompTicket
      ? baseQuery.eq('qr_code', orderId)
      : baseQuery.eq('stripe_session_id', orderId)
    ).single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Ticket not found or invalid' },
        { status: 404 }
      );
    }

    // A refunded or unpaid order must not open the door. Comp tickets are
    // written as 'completed' with amount_paid 0, so free guests are unaffected.
    if (order.payment_status !== 'completed') {
      return NextResponse.json(
        {
          error: `This ticket is not valid for entry — the order is marked "${order.payment_status}".`,
          order,
        },
        { status: 400 }
      );
    }

    // Check if already checked in
    if (order.checked_in) {
      return NextResponse.json(
        {
          error: `Already checked in at ${new Date(order.checked_in_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
          order,
        },
        { status: 400 }
      );
    }

    // Mark as checked in
    const { data: updatedOrder, error: updateError } = await supabase
      .from('sunset_orders')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq('id', order.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating check-in status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update check-in status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error in check-in:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Internal server error') },
      { status: 500 }
    );
  }
}
