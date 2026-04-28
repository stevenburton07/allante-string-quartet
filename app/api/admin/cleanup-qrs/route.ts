import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteQRCodesForEvent } from '@/lib/storage-helpers';

const RETENTION_DAYS = 30;

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cutoffIso = new Date(
      Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    const [concertsResult, sunsetResult] = await Promise.all([
      supabase.from('concerts').select('id').lt('date', cutoffIso),
      supabase.from('sunset_events').select('id').lt('event_date', cutoffIso),
    ]);

    if (concertsResult.error || sunsetResult.error) {
      console.error('Error querying past events:', {
        concertsError: concertsResult.error,
        sunsetError: sunsetResult.error,
      });
      return NextResponse.json(
        { error: 'Failed to query past events' },
        { status: 500 }
      );
    }

    const eventIds = [
      ...(concertsResult.data || []).map((e) => e.id),
      ...(sunsetResult.data || []).map((e) => e.id),
    ];

    let totalDeleted = 0;
    for (const eventId of eventIds) {
      totalDeleted += await deleteQRCodesForEvent(eventId);
    }

    return NextResponse.json({
      success: true,
      eventsScanned: eventIds.length,
      filesDeleted: totalDeleted,
      retentionDays: RETENTION_DAYS,
    });
  } catch (error) {
    console.error('Error during QR cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to clean up QR codes' },
      { status: 500 }
    );
  }
}
