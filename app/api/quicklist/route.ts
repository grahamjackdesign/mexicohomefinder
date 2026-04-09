import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

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

    if (!title || !price || !contact_name || !contact_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload images
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

    // Insert property
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
        show_on_mhf: false,
        submitted_at: new Date().toISOString(),
        site: 'mhf',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 });
    }

    // Send notification email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mexicohomefinder.com';
    const location = [neighborhood, municipality, state].filter(Boolean).join(', ');

    await resend.emails.send({
      from: 'Mexico Home Finder <hello@mexicohomefinder.com>',
      to: 'jack@brokerlink.mx',
      subject: `New Quicklist Submission: ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2C4563;">New Property Submission</h2>
          <p>A new property has been submitted via Quicklist and is awaiting your approval.</p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Title</td><td style="padding: 8px 0; font-weight: bold;">${title}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Type</td><td style="padding: 8px 0;">${listing_type} · ${property_category}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Price</td><td style="padding: 8px 0;">${currency === 'MXN' ? 'MX$' : '$'}${price.toLocaleString()} ${currency}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0;">${location || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Bedrooms</td><td style="padding: 8px 0;">${bedrooms ?? '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Bathrooms</td><td style="padding: 8px 0;">${bathrooms ?? '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Size</td><td style="padding: 8px 0;">${sqft ? `${sqft} m²` : '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Photos</td><td style="padding: 8px 0;">${imageUrls.length} uploaded</td></tr>
          </table>

          <h3 style="color: #2C4563;">Contact Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 12px 0 24px;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0;">${contact_name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">WhatsApp</td><td style="padding: 8px 0;">${contact_phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${contact_email || '—'}</td></tr>
          </table>

          ${description ? `<h3 style="color: #2C4563;">Description</h3><p style="color: #444;">${description}</p>` : ''}

          <a href="${siteUrl}/admin/quicklist" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #C85A3E; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Review in Admin →
          </a>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Quicklist API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}