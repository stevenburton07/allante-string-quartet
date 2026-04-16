import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Export newsletter subscribers as CSV
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameter for status filter (optional)
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status'); // 'active' or 'all'

    let query = supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (statusFilter === 'active') {
      query = query.eq('status', 'active');
    }

    const { data: subscribers, error } = await query;

    if (error) {
      console.error('Error fetching subscribers for export:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      );
    }

    // Generate CSV
    const headers = ['Name', 'Email', 'Status', 'Subscribed At'];
    const csvRows = [headers.join(',')];

    subscribers?.forEach((subscriber) => {
      const row = [
        `"${subscriber.name}"`,
        `"${subscriber.email}"`,
        subscriber.status,
        new Date(subscriber.subscribed_at).toLocaleString(),
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/newsletter/export:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
