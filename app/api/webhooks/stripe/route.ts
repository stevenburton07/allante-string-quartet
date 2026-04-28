import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { generateTicketQRCode } from '@/lib/qrcode-server';
import { sendEmailWithRetry } from '@/lib/email';
import TicketConfirmation from '@/emails/TicketConfirmation';
import ConcertConfirmation from '@/emails/ConcertConfirmation';
import { formatTime12h } from '@/lib/format-time';
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

    const metadata = session.metadata as Record<string, string>;

    if (metadata.concertId) {
      await handleConcertCheckout(session, metadata);
    } else if (metadata.eventId) {
      await handleSunsetCheckout(session, metadata);
    } else {
      console.error('Unknown checkout type - no concertId or eventId in metadata');
    }

    console.log('Successfully processed checkout session:', session.id);
  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}

async function handleSunsetCheckout(session: Stripe.Checkout.Session, metadata: Record<string, string>) {
  const supabase = await createClient();

  const { eventId, customerName, customerEmail, customerPhone, ticketQuantity } = metadata;
  const quantity = parseInt(ticketQuantity, 10);

  const { data: event, error: eventError } = await supabase
    .from('sunset_events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    console.error('Event not found:', eventError);
    throw new Error('Event not found');
  }

  const qrCodeDataUrl = await generateTicketQRCode(session.id, eventId);

  const { error: orderError } = await supabase
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
    });

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error('Failed to create order');
  }

  const { error: updateError } = await supabase.rpc('increment_tickets_sold', {
    event_id: eventId,
    amount: quantity,
  });

  if (updateError) {
    console.error('Error updating tickets_sold:', updateError);
  }

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
        totalAmount: session.amount_total || 0,
        orderId: session.id,
        qrCodeUrl: qrCodeDataUrl,
      }),
    });
  } catch (emailError) {
    // Order is already saved — don't fail the webhook (Stripe would retry and
    // create duplicates). Log so the failure is visible for manual follow-up.
    console.error('CONFIRMATION EMAIL FAILED for sunset order', {
      sessionId: session.id,
      customerEmail,
      eventId,
      error: emailError,
    });
  }
}

async function handleConcertCheckout(session: Stripe.Checkout.Session, metadata: Record<string, string>) {
  const supabase = await createClient();

  const { concertId, customerName, customerEmail, customerPhone, ticketQuantity } = metadata;
  const quantity = parseInt(ticketQuantity, 10);

  const { data: concert, error: concertError } = await supabase
    .from('concerts')
    .select('*')
    .eq('id', concertId)
    .single();

  if (concertError || !concert) {
    console.error('Concert not found:', concertError);
    throw new Error('Concert not found');
  }

  const qrCodeDataUrl = await generateTicketQRCode(session.id, concertId);

  const { data: order, error: orderError } = await supabase
    .from('concert_orders')
    .insert({
      concert_id: concertId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      amount_paid: session.amount_total || 0,
      payment_status: 'completed',
      ticket_quantity: quantity,
      qr_code: JSON.stringify({
        type: 'concert_ticket',
        orderId: session.id,
        concertId,
        timestamp: Date.now(),
      }),
      qr_code_url: qrCodeDataUrl,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating concert order:', orderError);
    throw new Error('Failed to create concert order');
  }

  const { error: updateError } = await supabase.rpc('increment_attendees', {
    concert_id: concertId,
    amount: quantity,
  });

  if (updateError) {
    console.error('Error updating attendees count:', updateError);
  }

  const concertDateString = concert.date.slice(0, 16);
  const [datePart, timePart] = concertDateString.split('T');
  const formattedTime = formatTime12h(timePart);

  try {
    await sendEmailWithRetry({
      to: customerEmail,
      subject: `Your Concert Tickets - ${concert.title}`,
      react: ConcertConfirmation({
        customerName,
        concertTitle: concert.title,
        concertDate: datePart,
        concertTime: formattedTime,
        location: concert.location,
        venue: concert.venue || undefined,
        ticketQuantity: quantity,
        totalAmount: session.amount_total || 0,
        orderId: order.id,
        qrCodeUrl: qrCodeDataUrl,
      }),
    });
  } catch (emailError) {
    // Order is already saved — don't fail the webhook (Stripe would retry and
    // create duplicates). Log so the failure is visible for manual follow-up.
    console.error('CONFIRMATION EMAIL FAILED for concert order', {
      orderId: order.id,
      sessionId: session.id,
      customerEmail,
      concertId,
      error: emailError,
    });
  }
}
