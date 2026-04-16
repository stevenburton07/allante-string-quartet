import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import NewsletterWelcome from '@/emails/NewsletterWelcome';

const subscribeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email } = validation.data;
    const supabase = await createClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate unsubscribed user
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            name: name,
            subscribed_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error reactivating subscriber:', updateError);
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          );
        }

        // Send welcome email
        try {
          await sendEmail({
            to: email,
            subject: 'Welcome to the Allante String Quartet Newsletter!',
            react: NewsletterWelcome({ name }),
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the subscription if email fails
        }

        return NextResponse.json(
          { message: 'Welcome back! Your subscription has been reactivated.' },
          { status: 200 }
        );
      }
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ name, email, status: 'active' }]);

    if (insertError) {
      console.error('Error inserting subscriber:', insertError);
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to the Allante String Quartet Newsletter!',
        react: NewsletterWelcome({ name }),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json(
      { message: 'Thank you for subscribing to our newsletter!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in newsletter subscribe:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
