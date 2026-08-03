import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { resolveCode } from '@/lib/pricing';

/**
 * Tells the purchase form what a typed code does before the buyer commits:
 * a free comp ticket, a percentage off, or nothing.
 *
 * This is a convenience for quoting a total — it is NOT the gate. Both
 * checkout routes re-resolve the code themselves before charging anything.
 */
const validateSchema = z.object({
  eventType: z.enum(['concert', 'sunset']),
  eventId: z.string().uuid(),
  code: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = validateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { eventType, eventId, code } = parsed.data;

    const supabase = await createClient();
    const table = eventType === 'concert' ? 'concerts' : 'sunset_events';

    // Select the whole row rather than naming the discount columns: if this
    // ships before migration 014 runs, a named-column query would fail
    // outright and take existing comp codes down with it. With `*`, the
    // discount fields simply come back undefined and comp codes keep working.
    const { data: event, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', eventId)
      .single();

    if (error || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const resolution = resolveCode(code, event);

    // Deliberately does not echo back the configured codes — only what the
    // submitted one is worth.
    return NextResponse.json({
      kind: resolution.kind,
      percent: resolution.percent,
      unitPrice: resolution.unitPrice,
    });
  } catch (error) {
    console.error('Error validating code:', error);
    return NextResponse.json({ error: 'Failed to validate code' }, { status: 500 });
  }
}
