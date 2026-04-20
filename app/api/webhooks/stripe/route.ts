import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { generateTicketQRCode } from '@/lib/qrcode';
import { sendEmail } from '@/lib/email';
import TicketConfirmation from '@/emails/TicketConfirmation';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing checkout session:', session.id);

    const supabase = await createClient();

    // Extract metadata from session
    const {
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      ticketQuantity,
    } = session.metadata as {
      eventId: string;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      ticketQuantity: string;
    };

    const quantity = parseInt(ticketQuantity, 10);

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('sunset_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      console.error('Event not found:', eventError);
      throw new Error('Event not found');
    }

    // Generate QR code
    const qrCodeDataUrl = await generateTicketQRCode(session.id, eventId);

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('sunset_orders')
      .insert({
        event_id: eventId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount_paid: session.amount_total || 0,
        payment_status: 'completed',
        ticket_quantity: quantity,
        qr_code: JSON.stringify({
          type: 'sunset_series_ticket',
          orderId: session.id,
          eventId,
          timestamp: Date.now(),
        }),
        qr_code_url: qrCodeDataUrl,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    // Atomically increment tickets_sold
    const { error: updateError } = await supabase.rpc('increment_tickets_sold', {
      event_id: eventId,
      amount: quantity,
    });

    if (updateError) {
      console.error('Error updating tickets_sold:', updateError);
    }

    // Send confirmation email
    await sendEmail({
      to: customerEmail,
      subject: `Your Sunset Series Tickets - ${event.title}`,
      react: TicketConfirmation({
        customerName,
        eventTitle: event.title,
        eventDate: event.event_date,
        eventTime: event.event_time,
        rainDate: event.rain_date || undefined,
        locationAddress: event.location_address,
        locationCity: event.location_city,
        locationState: event.location_state,
        locationZip: event.location_zip,
        ticketQuantity: quantity,
        totalAmount: session.amount_total || 0,
        orderId: session.id,
        qrCodeUrl: qrCodeDataUrl,
      }),
    });

    console.log('Successfully processed checkout session:', session.id);
  } catch (error) {
    console.error('Error handling checkout session:', error);
    // Don't throw error to Stripe - we've logged it and can manually retry if needed
  }
}
