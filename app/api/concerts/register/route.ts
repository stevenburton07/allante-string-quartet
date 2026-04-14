import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { concertId, quantity, customerName, customerEmail, customerPhone, compCode } = body;

    if (!concertId || !quantity || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch concert details from Supabase
    const supabase = await createClient();
    const { data: concert, error: concertError } = await supabase
      .from('concerts')
      .select('*')
      .eq('id', concertId)
      .single();

    if (concertError || !concert) {
      return NextResponse.json(
        { error: 'Concert not found' },
        { status: 404 }
      );
    }

    // Check if concert is published
    if (!concert.is_published) {
      return NextResponse.json(
        { error: 'Concert is not available for registration' },
        { status: 400 }
      );
    }

    // Check available seats
    const availableSeats = concert.max_attendees - concert.attendees_count;
    if (quantity > availableSeats) {
      return NextResponse.json(
        { error: `Only ${availableSeats} seats remaining` },
        { status: 400 }
      );
    }

    // Validate comp code if provided
    let usedCompCode = false;
    if (compCode && compCode.trim()) {
      if (concert.comp_code && concert.comp_code.toUpperCase() === compCode.toUpperCase()) {
        usedCompCode = true;
      } else {
        return NextResponse.json(
          { error: 'Invalid comp code' },
          { status: 400 }
        );
      }
    }

    // For non-free concerts without valid comp code, reject
    if (concert.ticket_price > 0 && !usedCompCode) {
      return NextResponse.json(
        { error: 'This concert requires payment. Use the payment flow.' },
        { status: 400 }
      );
    }

    // Generate QR code data
    const qrCode = `CONCERT:${concertId}:${nanoid(16)}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('concert_orders')
      .insert({
        concert_id: concertId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        amount_paid: 0,
        payment_status: 'completed',
        used_comp_code: usedCompCode,
        ticket_quantity: quantity,
        qr_code: qrCode,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Update attendees count
    const { error: updateError } = await supabase
      .from('concerts')
      .update({ attendees_count: concert.attendees_count + quantity })
      .eq('id', concertId);

    if (updateError) {
      console.error('Error updating attendees count:', updateError);
    }

    // TODO: Send confirmation email with QR code

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Registration successful! Check your email for confirmation.'
    });
  } catch (error: any) {
    console.error('Error registering for concert:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register for concert' },
      { status: 500 }
    );
  }
}
