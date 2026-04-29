import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { formatSunsetRange } from '@/lib/format-time';
import { generateTicketQRCode } from '@/lib/qrcode-server';
import { sendEmailWithRetry } from '@/lib/email';
import TicketConfirmation from '@/emails/TicketConfirmation';

const checkoutSchema = z.object({
  eventId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email().max(320),
  customerPhone: z.string().max(30).optional().nullable(),
  compCode: z.string().max(100).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', errors: parsed.error.issues.map(e => ({ path: e.path, message: e.message })) },
        { status: 400 }
      );
    }

    const { eventId, quantity, customerName, customerEmail, customerPhone, compCode } = parsed.data;

    // Fetch event details from Supabase
    const supabase = await createClient();
    const { data: event, error: eventError } = await supabase
      .from('sunset_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is published and has available tickets
    if (!event.published) {
      return NextResponse.json(
        { error: 'Event is not available for purchase' },
        { status: 400 }
      );
    }

    const availableTickets = event.max_tickets - event.tickets_sold;
    if (quantity > availableTickets) {
      return NextResponse.json(
        { error: `Only ${availableTickets} tickets remaining` },
        { status: 400 }
      );
    }

    // Check for comp code - if valid, create free order directly
    if (compCode && compCode.trim()) {
      if (event.comp_code && event.comp_code.toUpperCase() === compCode.toUpperCase()) {
        const { nanoid } = await import('nanoid');
        const qrCode = `SUNSET:${eventId}:${nanoid(16)}`;
        const qrCodeDataUrl = await generateTicketQRCode(qrCode, eventId);

        // Create order with comp code
        const { data: order, error: orderError } = await supabase
          .from('sunset_orders')
          .insert({
            event_id: eventId,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone || null,
            amount_paid: 0,
            payment_status: 'completed',
            used_comp_code: true,
            ticket_quantity: quantity,
            qr_code: qrCode,
            qr_code_url: qrCodeDataUrl,
          })
          .select()
          .single();

        if (orderError) {
          console.error('Error creating comp order:', orderError);
          return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
          );
        }

        // Atomically increment tickets sold
        await supabase.rpc('increment_tickets_sold', {
          event_id: eventId,
          amount: quantity,
        });

        // Send confirmation email — order is already committed, so a failed
        // email must not fail the whole request.
        try {
          await sendEmailWithRetry({
            to: customerEmail,
            subject: `Your Sunset Series Tickets - ${event.title}`,
            react: TicketConfirmation({
              customerName,
              eventTitle: event.title,
              eventDate: event.event_date,
              eventTime: event.event_time,
              sunsetEndTime: event.sunset_end_time || undefined,
              rainDate: event.rain_date || undefined,
              locationAddress: event.location_address,
              locationCity: event.location_city,
              locationState: event.location_state,
              locationZip: event.location_zip,
              ticketQuantity: quantity,
              totalAmount: 0,
              orderId: order.id,
              qrCodeUrl: qrCodeDataUrl,
            }),
          });
        } catch (emailError) {
          console.error('CONFIRMATION EMAIL FAILED for comp-code sunset order', {
            orderId: order.id,
            eventId,
            customerEmail,
            error: emailError,
          });
        }

        // Return success (frontend will redirect to success page)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        return NextResponse.json({
          success: true,
          orderId: order.id,
          redirectUrl: `${appUrl}/sunset-series/success?order_id=${order.id}`
        });
      } else {
        return NextResponse.json(
          { error: 'Invalid comp code' },
          { status: 400 }
        );
      }
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${event.title} - Ticket`,
              description: `${new Date(event.event_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} · ${formatSunsetRange(event.event_time, event.sunset_end_time)}`,
            },
            unit_amount: event.ticket_price, // in cents
          },
          quantity,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        eventId: event.id,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        ticketQuantity: quantity.toString(),
      },
      success_url: `${appUrl}/sunset-series/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/sunset-series?cancelled=true`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
