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

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const agentUserId = session.metadata?.agent_user_id

    if (!userId || !agentUserId) {
      console.error('Missing metadata in Stripe session')
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // Deactivate any existing active packages
    await supabaseAdmin
      .from('listing_packages')
      .update({ active: false })
      .eq('user_id', userId)
      .eq('active', true)

    // Insert new package
    const { error } = await supabaseAdmin
      .from('listing_packages')
      .insert({
        user_id: userId,
        credits_total: 5,
        credits_used: 0,
        stripe_payment_id: session.payment_intent as string,
        active: true,
      })

    if (error) {
      console.error('Error inserting listing package:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Listing package created for user ${userId}`)
  }

  return NextResponse.json({ received: true })
}
