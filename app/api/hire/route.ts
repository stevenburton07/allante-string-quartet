import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, TO_EMAIL } from '@/lib/email';
import HireQuoteRequest from '@/emails/HireQuoteRequest';

// Validation schema
const hireQuoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  eventType: z.enum(['wedding', 'corporate', 'party', 'other'], {
    errorMap: () => ({ message: 'Please select an event type' }),
  }),
  address: z.string().min(10, 'Please provide a complete address'),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  performerType: z.enum(['solo-violin', 'solo-viola', 'solo-cello', 'quartet'], {
    errorMap: () => ({ message: 'Please select a performer type' }),
  }),
  additionalDetails: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = hireQuoteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: validationResult.error.issues.map(err => ({
            path: err.path,
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Additional validation: end time should be after start time
    if (data.startTime >= data.endTime) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: [
            {
              path: ['endTime'],
              message: 'End time must be after start time',
            },
          ],
        },
        { status: 400 }
      );
    }

    // Validate event date is in the future
    const eventDate = new Date(data.eventDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: [
            {
              path: ['eventDate'],
              message: 'Event date must be in the future',
            },
          ],
        },
        { status: 400 }
      );
    }

    // Send email
    try {
      await sendEmail({
        to: TO_EMAIL,
        subject: `New Hire Quote Request from ${data.name}`,
        react: HireQuoteRequest(data),
        replyTo: data.email,
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json(
        {
          error: 'Failed to send email. Please try again or contact us directly.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Quote request submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
