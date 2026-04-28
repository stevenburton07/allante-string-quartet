import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Create a new sunset event
export async function POST(request: NextRequest) {
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

    // Insert the new event
    const { data, error } = await supabase
      .from('sunset_events')
      .insert([
        {
          title: body.title,
          description: body.description,
          event_date: body.event_date,
          event_time: body.event_time,
          sunset_end_time: body.sunset_end_time || null,
          rain_date: body.rain_date || null,
          difficulty: body.difficulty,
          comp_code: body.comp_code || null,
          image_url: body.image_url || null,
          image_orientation: body.image_orientation || null,
          location_address: body.location_address,
          location_city: body.location_city,
          location_state: body.location_state,
          location_zip: body.location_zip,
          arrival_instructions: body.arrival_instructions || null,
          max_tickets: body.max_tickets,
          ticket_price: body.ticket_price,
          status: body.status,
          published: body.published,
          tickets_sold: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/sunset-series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
