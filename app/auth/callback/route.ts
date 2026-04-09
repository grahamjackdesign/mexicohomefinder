import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')

  if (!code) {
    return NextResponse.redirect(`${origin}/list-property/login?error=no_code`)
  }

  const { createServerClient } = await import('@supabase/ssr')
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !session) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${origin}/list-property/login?error=auth_failed`)
  }

  // Password recovery flow — send straight to reset password page
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/list-property/reset-password`)
  }

  const user = session.user

  const { data: existingUser } = await supabaseAdmin
    .from('agent_users')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!existingUser) {
    // New user — create agent_users row then send to onboarding
    const fullName = user.user_metadata?.name || user.user_metadata?.full_name || ''

    const { error: insertError } = await supabaseAdmin
      .from('agent_users')
      .insert({
        user_id: user.id,
        email: user.email,
        name: fullName || user.email,
        role: 'public',
        source: 'mhf-google',
      })

    if (insertError) {
      console.error('Error creating agent_user:', insertError)
    }

    return NextResponse.redirect(`${origin}/list-property/onboarding`)
  }

  // Existing user — straight to dashboard
  return NextResponse.redirect(`${origin}/list-property/dashboard`)
}
