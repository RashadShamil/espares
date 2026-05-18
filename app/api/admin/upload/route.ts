import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  // 1. Auth check — must be a logged-in user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your_service_role_key_here') {
    console.error('SUPABASE_SERVICE_ROLE_KEY is missing or not set in .env.local');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // 3. Server-side Supabase client using SERVICE ROLE key — bypasses RLS
  const supabaseAdminClient = createSupabaseAdmin(supabaseUrl, serviceRoleKey);

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      // 4. Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP and GIF are allowed.` },
          { status: 400 }
        );
      }

      // 5. Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 5 MB size limit.` },
          { status: 400 }
        );
      }

      // 6. Use a safe server-generated filename (ignore original name entirely)
      const ext = file.type.split('/')[1]; // e.g. "jpeg", "png"
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error } = await supabaseAdminClient.storage
        .from('products')
        .upload(`public/${fileName}`, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error('Supabase storage error:', error);
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
      }

      const { data: { publicUrl } } = supabaseAdminClient.storage
        .from('products')
        .getPublicUrl(`public/${fileName}`);

      imageUrls.push(publicUrl);
    }

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
