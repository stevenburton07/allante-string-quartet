import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const checkoutSchema = z.object({
  concertId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email().max(320),
  customerPhone: z.string().max(30).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', errors: parsed.error.issues.map(e => ({ path: e.path, message: e.message })) },
        { status: 400 }
      );
    }

    const { concertId, quantity, customerName, customerEmail, customerPhone } = parsed.data;

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

    // Check if concert is published and has available seats
    if (!concert.is_published) {
      return NextResponse.json(
        { error: 'Concert is not available for purchase' },
        { status: 400 }
      );
    }

    const availableSeats = concert.max_attendees - concert.attendees_count;
    if (quantity > availableSeats) {
      return NextResponse.json(
        { error: `Only ${availableSeats} seats remaining` },
        { status: 400 }
      );
    }

    // Check if concert has a price
    if (concert.ticket_price === 0) {
      return NextResponse.json(
        { error: 'This concert is free. Use the registration flow.' },
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
              name: `${concert.title} - Ticket`,
              description: `${new Date(concert.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} at ${new Date(concert.date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}`,
            },
            unit_amount: concert.ticket_price, // in cents
          },
          quantity,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        concertId: concert.id,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        ticketQuantity: quantity.toString(),
      },
      success_url: `${appUrl}/concerts/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/concerts?cancelled=true`,
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
