import { Resend } from 'resend';

// Read env vars on demand instead of capturing at module load time. In
// Cloudflare Workers (with OpenNext), process.env is populated lazily —
// sometimes by request time rather than at module load — so a value
// captured to a top-level constant during a cold start can get stuck on
// the fallback even when the variable is perfectly set in production.
function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || 'Allante String Quartet <onboarding@resend.dev>';
}

export function getToEmail(): string {
  return process.env.ORGANIZATION_EMAIL || 'allantestringquartet@gmail.com';
}


interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
}: SendEmailOptions) {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    console.warn('⚠️  Resend not configured. Email would be sent:', {
      to,
      subject,
      replyTo,
    });
    console.log('📧 Email content rendered (not sent)');
    return { id: 'dev-mode-email', message: 'Email logged (Resend not configured)' };
  }

  const from = getFromEmail();
  if (from.includes('onboarding@resend.dev')) {
    console.warn(
      '⚠️  RESEND_FROM_EMAIL is not set. Falling back to onboarding@resend.dev, ' +
        'which only delivers to the Resend account owner.'
    );
  }

  // Construct the client per-call so the API key is read at request time,
  // not at module load. Resend's client is cheap to instantiate.
  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      react,
      replyTo,
    });

    // Resend's SDK returns { data, error } instead of throwing on API errors.
    // Without this check, a rejected send (e.g. unverified sender) returns
    // silently and the caller never knows the email didn't go out.
    if (result.error) {
      console.error('Resend rejected email:', { to, subject, from, error: result.error });
      throw new Error(`Resend error: ${result.error.message || 'unknown'}`);
    }

    return result.data;
  } catch (error) {
    console.error('Failed to send email:', { to, subject, from, error });
    throw error;
  }
}

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
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to send email after retries');
}
