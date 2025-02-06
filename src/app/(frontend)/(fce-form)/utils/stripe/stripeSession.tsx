'use server'

import { Stripe } from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

interface NewSessionOptions {
  priceId: string
}

export const postStripeSession = async ({ priceId }: NewSessionOptions) => {
  try {
    console.log('Creating Stripe session with price:', priceId)
    console.log('Environment:', {
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      vercelUrl: process.env.VERCEL_URL,
      nodeEnv: process.env.NODE_ENV,
    })

    // 使用更可靠的方式构建 URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_URL || 'http://localhost:3000'

    const returnUrl = `${baseUrl}/checkout-return?session_id={CHECKOUT_SESSION_ID}`

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: returnUrl,
    })

    if (!session.client_secret) {
      console.error('Failed to create session:', session)
      throw new Error('Error initiating Stripe session')
    }

    return {
      clientSecret: session.client_secret,
    }
  } catch (error) {
    console.error('Stripe session creation error:', error)
    throw error
  }
}
