import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE: Remove a subscriber
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subscriber:', error);
      return NextResponse.json(
        { error: 'Failed to delete subscriber' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Subscriber deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/newsletter/[id]:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PATCH: Update subscriber status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['active', 'unsubscribed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "active" or "unsubscribed"' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating subscriber:', error);
      return NextResponse.json(
        { error: 'Failed to update subscriber' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Subscriber updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/newsletter/[id]:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
