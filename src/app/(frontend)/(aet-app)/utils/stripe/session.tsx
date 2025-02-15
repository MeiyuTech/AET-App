'use server'

import { Stripe } from 'stripe'
import { getServerSideURL } from '@/utilities/getURL'
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

interface NewSessionOptions {
  priceId: string
  applicationId: string
}

export const postStripeSession = async ({ priceId, applicationId }: NewSessionOptions) => {
  try {
    const currentUrl = getServerSideURL()
    const returnUrl = `${currentUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`

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
      client_reference_id: applicationId,
      metadata: {
        applicationId: applicationId,
      },
    })

    if (!session.client_secret) {
      throw new Error('No client secret returned from Stripe')
    }

    console.log('Session created:', session)

    return {
      clientSecret: session.client_secret,
    }
  } catch (error) {
    console.error('Error creating Stripe session:', error)
    throw new Error('Failed to create payment session')
  }
}
