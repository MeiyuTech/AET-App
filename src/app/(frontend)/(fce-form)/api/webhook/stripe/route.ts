import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { createClient } from '../../../utils/supabase/server'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new NextResponse('No signature', { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    const client = await createClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // 更新支付状态
        const { error } = await client
          .from('fce_applications')
          .update({
            status: 'processing',
            payment_status: 'paid',
            payment_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .eq('id', session.client_reference_id)

        if (error) {
          console.error('Error updating application:', error)
          return new NextResponse('Error updating application', { status: 500 })
        }

        // TODO: 发送确认邮件
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        // 更新支付状态为过期
        const { error } = await client
          .from('fce_applications')
          .update({
            payment_status: 'expired',
          })
          .eq('id', session.client_reference_id)

        if (error) {
          console.error('Error updating application:', error)
          return new NextResponse('Error updating application', { status: 500 })
        }
        break
      }
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new NextResponse('Webhook error', { status: 400 })
  }
}
