/**
 * One-off: re-send Sunset Series ticket confirmation emails to everyone who
 * already holds a ticket for an UPCOMING event. Used after correcting the
 * "what to bring" wording (a chair is provided; attendees don't bring one).
 *
 * Re-uses the exact same template + send path as the Stripe webhook, so the
 * resent email is identical to a fresh confirmation. Past events are skipped.
 *
 * Usage (run from project root). TSX_TSCONFIG_PATH points tsx at the automatic
 * JSX runtime so the React Email template renders outside Next.js:
 *   TSX_TSCONFIG_PATH=./tsconfig.scripts.json npx tsx scripts/resend-sunset-confirmations.ts --dry-run
 *   TSX_TSCONFIG_PATH=./tsconfig.scripts.json npx tsx scripts/resend-sunset-confirmations.ts
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * RESEND_API_KEY, and a verified RESEND_FROM_EMAIL.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { sendEmailWithRetry } from '../lib/email';
import TicketConfirmation from '../emails/TicketConfirmation';

// --- minimal .env.local loader (no dotenv dependency) ---
const envPath = path.resolve('.env.local');
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const DRY_RUN = process.argv.includes('--dry-run');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const today = new Date().toISOString().slice(0, 10);

async function main() {
  console.log(DRY_RUN ? 'DRY RUN — no emails will be sent\n' : 'Resending confirmations…\n');

  // Only upcoming events — never email people whose event already happened.
  const { data: events, error: evErr } = await supabase
    .from('sunset_events')
    .select('*')
    .gte('event_date', today)
    .order('event_date');
  if (evErr) throw new Error(`events: ${evErr.message}`);

  let sent = 0;
  let failed = 0;

  for (const event of events ?? []) {
    const { data: orders, error: ordErr } = await supabase
      .from('sunset_orders')
      .select('*')
      .eq('event_id', event.id)
      .eq('payment_status', 'completed');
    if (ordErr) throw new Error(`orders for ${event.id}: ${ordErr.message}`);

    console.log(`\n${event.title} (${event.event_date}) — ${orders?.length ?? 0} ticket holders`);

    for (const order of orders ?? []) {
      const label = `  ${order.customer_email} (qty ${order.ticket_quantity})`;
      if (DRY_RUN) {
        console.log(`  would send → ${order.customer_email} (qty ${order.ticket_quantity})`);
        sent++;
        continue;
      }
      try {
        await sendEmailWithRetry({
          to: order.customer_email,
          subject: `Your Sunset Series Tickets - ${event.title}`,
          react: TicketConfirmation({
            customerName: order.customer_name,
            eventTitle: event.title,
            eventDate: event.event_date,
            eventTime: event.event_time,
            sunsetEndTime: event.sunset_end_time || undefined,
            rainDate: event.rain_date || undefined,
            arrivalInstructions: event.arrival_instructions || undefined,
            locationAddress: event.location_address,
            locationCity: event.location_city,
            locationState: event.location_state,
            locationZip: event.location_zip,
            ticketQuantity: order.ticket_quantity,
            totalAmount: order.amount_paid,
            orderId: order.stripe_session_id,
            qrCodeUrl: order.qr_code_url,
          }),
        });
        console.log(`  sent → ${order.customer_email}`);
        sent++;
        // Stay well under Resend's rate limit.
        await new Promise((r) => setTimeout(r, 700));
      } catch (e) {
        failed++;
        console.error(`  FAILED → ${order.customer_email}:`, (e as Error).message);
      }
    }
  }

  console.log(
    `\n${DRY_RUN ? 'Would send' : 'Sent'} ${sent} email(s)` +
      (failed ? `, ${failed} failed` : '') + '.'
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
