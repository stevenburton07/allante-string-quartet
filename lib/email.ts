import { Resend } from 'resend';

// Initialize Resend client
// Will gracefully handle missing API key for development
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM_EMAIL = 'Allante String Quartet <onboarding@resend.dev>'; // Update with your verified domain
export const TO_EMAIL = process.env.ORGANIZATION_EMAIL || 'allantestringquartet@gmail.com';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
}

/**
 * Send an email using Resend
 * Returns null if Resend is not configured (for development)
 */
export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
}: SendEmailOptions) {
  // If Resend is not configured, log instead of sending
  if (!resend) {
    console.warn('⚠️  Resend not configured. Email would be sent:', {
      to,
      subject,
      replyTo,
    });
    console.log('📧 Email content rendered (not sent)');
    return { id: 'dev-mode-email', message: 'Email logged (Resend not configured)' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
      replyTo,
    });

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Send email with retry logic
 */
export async function sendEmailWithRetry(
  options: SendEmailOptions,
  maxRetries = 3
) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendEmail(options);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Email send attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to send email after retries');
}
