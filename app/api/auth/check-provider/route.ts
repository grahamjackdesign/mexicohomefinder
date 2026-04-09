import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ provider: 'unknown' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.rpc('get_user_provider', {
      user_email: email,
    });

    console.log('check-provider: email=', email, 'provider=', data, 'error=', error);

    if (error || !data) {
      return NextResponse.json({ provider: 'email' });
    }

    return NextResponse.json({ provider: data });
  } catch (err) {
    console.error('check-provider error:', err);
    return NextResponse.json({ provider: 'email' });
  }
}
