import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add your Stripe API keys to .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { eventId, quantity, customerName, customerEmail, customerPhone } = body;

    if (!eventId || !quantity || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
              })} at ${event.event_time}`,
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
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
