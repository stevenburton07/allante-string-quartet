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

// GET /api/concerts/[id] - Get single concert
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('concerts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ concert: data }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch concert:', error);
    return NextResponse.json(
      { error: 'Concert not found' },
      { status: 404 }
    );
  }
}

// PUT /api/concerts/[id] - Update concert
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

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

    // Update concert
    const { data: concert, error } = await supabase
      .from('concerts')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ concert }, { status: 200 });
  } catch (error) {
    console.error('Failed to update concert:', error);
    return NextResponse.json(
      { error: 'Failed to update concert' },
      { status: 500 }
    );
  }
}

// DELETE /api/concerts/[id] - Delete concert
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase.from('concerts').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Concert deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete concert:', error);
    return NextResponse.json(
      { error: 'Failed to delete concert' },
      { status: 500 }
    );
  }
}
