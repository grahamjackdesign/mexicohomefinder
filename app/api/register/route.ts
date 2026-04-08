import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const { name, email, phone, company_name, password, is_professional } = await req.json()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  // 2. Insert into agent_users
  const { error: insertError } = await supabaseAdmin
    .from('agent_users')
    .insert({
      user_id: userId,
      email,
      name,
      phone,
      company_name: company_name || null,
      role: is_professional ? 'agent' : 'public',
      source: 'mhf',
    })

  if (insertError) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: insertError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}