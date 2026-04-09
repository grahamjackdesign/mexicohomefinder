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

    // Direct lookup by email — avoids pagination issues with listUsers()
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserByEmail(email);

    console.log('check-provider: email=', email, 'user found=', !!user, 'identities=', user?.identities);

    if (error || !user) {
      // Don't reveal whether the email exists — treat as email user
      // so the reset email flow runs (Supabase handles non-existent emails gracefully)
      return NextResponse.json({ provider: 'email' });
    }

    const googleIdentity = user.identities?.find((i) => i.provider === 'google');
    const provider = googleIdentity ? 'google' : 'email';

    console.log('check-provider: resolved provider=', provider);

    return NextResponse.json({ provider });
  } catch (err) {
    console.error('check-provider error:', err);
    return NextResponse.json({ provider: 'email' });
  }
}
