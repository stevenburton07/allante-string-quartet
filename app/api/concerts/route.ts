import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema
const concertSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, 'Invalid date format'),
  location: z.string().min(3, 'Location is required'),
  venue: z.string().optional(),
  ticket_link: z.string().url('Invalid URL').optional().or(z.literal('')),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_published: z.boolean(),
});

// GET /api/concerts - List all concerts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');

    let query = supabase
      .from('concerts')
      .select('*')
      .order('date', { ascending: false });

    // Filter by published status if specified
    if (published === 'true') {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ concerts: data }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch concerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch concerts' },
      { status: 500 }
    );
  }
}

// POST /api/concerts - Create new concert
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

    // Validate request body
    const validationResult = concertSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: validationResult.error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Insert concert
    const { data: concert, error } = await supabase
      .from('concerts')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ concert }, { status: 201 });
  } catch (error) {
    console.error('Failed to create concert:', error);
    return NextResponse.json(
      { error: 'Failed to create concert' },
      { status: 500 }
    );
  }
}
