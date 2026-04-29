import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { generateTicketQRCode } from '@/lib/qrcode-server';
import { sendEmailWithRetry } from '@/lib/email';
import ConcertConfirmation from '@/emails/ConcertConfirmation';
import { formatTime12h } from '@/lib/format-time';

const registrationSchema = z.object({
  concertId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email().max(320),
  customerPhone: z.string().max(30).optional().nullable(),
  compCode: z.string().max(100).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', errors: parsed.error.issues.map(e => ({ path: e.path, message: e.message })) },
        { status: 400 }
      );
    }

    const { concertId, quantity, customerName, customerEmail, customerPhone, compCode } = parsed.data;

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

    // Generate QR code
    const qrCode = `CONCERT:${concertId}:${nanoid(16)}`;
    const qrCodeDataUrl = await generateTicketQRCode(qrCode, concertId, 'concert_ticket');

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
        qr_code_url: qrCodeDataUrl,
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

    // Atomically increment attendees count
    const { error: updateError } = await supabase.rpc('increment_attendees', {
      concert_id: concertId,
      amount: quantity,
    });

    if (updateError) {
      console.error('Error updating attendees count:', updateError);
    }

    // Parse concert date/time for display
    const concertDateString = concert.date.slice(0, 16);
    const [datePart, timePart] = concertDateString.split('T');
    const formattedTime = formatTime12h(timePart);

    // Order is already committed at this point — a failed email must not
    // fail the whole request, or the user sees an error for a registration
    // that actually succeeded.
    let emailSent = true;
    try {
      await sendEmailWithRetry({
        to: customerEmail,
        subject: `Your Concert Registration - ${concert.title}`,
        react: ConcertConfirmation({
          customerName,
          concertTitle: concert.title,
          concertDate: datePart,
          concertTime: formattedTime,
          location: concert.location,
          venue: concert.venue || undefined,
          ticketQuantity: quantity,
          totalAmount: 0,
          orderId: order.id,
          qrCodeUrl: qrCodeDataUrl,
        }),
      });
    } catch (emailError) {
      emailSent = false;
      console.error('CONFIRMATION EMAIL FAILED for concert registration', {
        orderId: order.id,
        concertId,
        customerEmail,
        error: emailError,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: emailSent
        ? 'Registration successful! Check your email for confirmation.'
        : 'Registration successful! We had trouble sending your confirmation email — please contact us if you don\'t receive it.',
      emailSent,
    });
  } catch (error) {
    console.error('Error registering for concert:', error);
    return NextResponse.json(
      { error: 'Failed to register for concert' },
      { status: 500 }
    );
  }
}
