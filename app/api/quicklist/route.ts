import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Admin client with service role for storage uploads
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields
    const title = formData.get('title') as string;
    const listing_type = formData.get('listing_type') as string;
    const property_category = formData.get('property_category') as string;
    const price = parseFloat(formData.get('price') as string);
    const currency = formData.get('currency') as string;
    const bedrooms = formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null;
    const bathrooms = formData.get('bathrooms') ? parseFloat(formData.get('bathrooms') as string) : null;
    const sqft = formData.get('sqft') ? parseInt(formData.get('sqft') as string) : null;
    const neighborhood = formData.get('neighborhood') as string;
    const municipality = formData.get('municipality') as string;
    const state = formData.get('state') as string;
    const description = formData.get('description') as string;
    const contact_name = formData.get('contact_name') as string;
    const contact_email = formData.get('contact_email') as string;
    const contact_phone = formData.get('contact_phone') as string;

    // Validate required fields
    if (!title || !price || !contact_name || !contact_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload images to Supabase Storage
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    for (const file of imageFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `quicklist/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/\s/g, '-')}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('properties')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        continue;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from('properties')
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        imageUrls.push(urlData.publicUrl);
      }
    }

    // Insert property record
    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert({
        title,
        listing_type,
        property_category,
        price,
        currency,
        bedrooms,
        bathrooms,
        sqft,
        neighborhood,
        municipality,
        state,
        country: 'Mexico',
        description,
        contact_name,
        contact_email,
        contact_phone,
        images: imageUrls,
        status: 'available',
        approval_status: 'pending',
        is_public_listing: true,
        show_on_mhf: false, // Only show after approval
        submitted_at: new Date().toISOString(),
        site: 'mhf',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Quicklist API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
