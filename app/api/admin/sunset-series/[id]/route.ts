import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Get a specific event
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the event
    const { data: event, error } = await supabase
      .from('sunset_events')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error in GET /api/admin/sunset-series/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update an existing sunset event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Update the event
    const { data, error } = await supabase
      .from('sunset_events')
      .update({
        title: body.title,
        description: body.description,
        event_date: body.event_date,
        event_time: body.event_time,
        rain_date: body.rain_date || null,
        difficulty: body.difficulty,
        comp_code: body.comp_code || null,
        location_address: body.location_address,
        location_city: body.location_city,
        location_state: body.location_state,
        location_zip: body.location_zip,
        max_tickets: body.max_tickets,
        ticket_price: body.ticket_price,
        status: body.status,
        published: body.published,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in PUT /api/admin/sunset-series/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Delete a sunset event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the event (will cascade delete orders due to ON DELETE CASCADE)
    const { error } = await supabase.from('sunset_events').delete().eq('id', params.id);

    if (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/sunset-series/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
