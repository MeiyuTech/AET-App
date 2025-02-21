'use server'

import { getServerSideURL } from '@/utilities/getURL'
import { stripe, STRIPE_CONFIG } from './config'

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

    console.log(`${STRIPE_CONFIG.mode} session created:`, session)

    return {
      clientSecret: session.client_secret,
    }
  } catch (error) {
    console.error(`${STRIPE_CONFIG.mode} error creating session:`, error)
    throw new Error('Failed to create payment session')
  }
}
