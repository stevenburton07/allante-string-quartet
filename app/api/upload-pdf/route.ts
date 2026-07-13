import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteImageFromStorage } from '@/lib/storage-helpers';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const oldPdfUrl = formData.get('oldPdfUrl') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Delete old PDF if replacing (same event-images bucket, so the image
    // deletion helper works for these paths too)
    if (oldPdfUrl) {
      await deleteImageFromStorage(oldPdfUrl);
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Validate file size (50MB max). The PDF is delivered as a hosted download
    // link in the confirmation email (not an attachment), so it isn't bound by
    // email size limits — this cap just guards storage against huge uploads.
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'PDF must be less than 50MB' }, { status: 400 });
    }

    // Generate unique filename, stored under an event-pdfs/ prefix
    const fileName = `event-pdfs/${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage (reuse the event-images bucket)
    const { error } = await supabase.storage
      .from('event-images')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      console.error('PDF upload error:', error);
      return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('event-images').getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrl,
      // Preserve the original filename so the email attachment is nicely named
      filename: file.name || 'arrival-instructions.pdf',
    }, { status: 200 });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
