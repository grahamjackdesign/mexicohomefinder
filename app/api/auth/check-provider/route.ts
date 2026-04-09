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

    // Paginate through all users to find by email
    let user = null;
    let page = 1;
    const perPage = 1000;

    while (!user) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error || !data?.users?.length) break;

      user = data.users.find((u) => u.email === email) || null;

      if (data.users.length < perPage) break; // Last page
      page++;
    }

    console.log('check-provider: email=', email, 'user found=', !!user, 'identities=', user?.identities);

    if (!user) {
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
