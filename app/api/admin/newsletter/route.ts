import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch all newsletter subscribers
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      );
    }

    return NextResponse.json(subscribers, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/newsletter:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
