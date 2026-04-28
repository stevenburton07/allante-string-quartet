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
    const { orderId, concertId } = body;

    if (!orderId || !concertId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from('concert_orders')
      .select('*')
      .eq('id', orderId)
      .eq('concert_id', concertId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if already checked in
    if (order.checked_in) {
      return NextResponse.json(
        {
          error: `Already checked in at ${new Date(order.checked_in_at).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
          order,
        },
        { status: 400 }
      );
    }

    // Update order to mark as checked in
    const { data: updatedOrder, error: updateError } = await supabase
      .from('concert_orders')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to check in' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Error checking in:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check in' },
      { status: 500 }
    );
  }
}
