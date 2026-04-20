import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, TO_EMAIL } from '@/lib/email';
import ContactFormEmail from '@/emails/ContactFormEmail';

// Validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = contactFormSchema.safeParse(body);

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

    // Send email
    try {
      await sendEmail({
        to: TO_EMAIL,
        subject: `Contact Form: ${data.subject}`,
        react: ContactFormEmail(data),
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
        message: 'Message sent successfully',
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
