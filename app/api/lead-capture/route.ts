// app/api/lead-capture/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Save lead to database
    const { error } = await supabase
      .from('pdf_leads')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          name: name || null,
          source: source || 'popup_guide',
          created_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Lead capture error:', error);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead capture error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
