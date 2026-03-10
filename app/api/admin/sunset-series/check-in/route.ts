import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Fetch the order
    const { data: order, error: fetchError } = await supabase
      .from('sunset_orders')
      .select('*')
      .eq('stripe_session_id', orderId)
      .eq('event_id', eventId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Ticket not found or invalid' },
        { status: 404 }
      );
    }

    // Check if already checked in
    if (order.checked_in) {
      return NextResponse.json(
        {
          error: `Already checked in at ${new Date(order.checked_in_at).toLocaleTimeString()}`,
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
  } catch (error: any) {
    console.error('Error in check-in:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
