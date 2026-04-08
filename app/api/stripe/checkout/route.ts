import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Get agent_user to confirm they exist
    const { data: agentUser, error } = await supabaseAdmin
      .from('agent_users')
      .select('id, email, name')
      .eq('user_id', userId)
      .single()

    if (error || !agentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'mxn',
      line_items: [
        {
          price: process.env.MHF_LISTING_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer_email: agentUser.email,
      metadata: {
        user_id: userId,
        agent_user_id: agentUser.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/list-property/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/list-property/dashboard?payment=cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
