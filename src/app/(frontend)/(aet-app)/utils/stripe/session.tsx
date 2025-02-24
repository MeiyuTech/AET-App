'use server'

import { getServerSideURL } from '@/utilities/getURL'
import { Stripe } from 'stripe'
import { getStripeConfig } from './config'

interface NewSessionOptions {
  priceId: string
  applicationId: string
}

export const postStripeSession = async ({ priceId, applicationId }: NewSessionOptions) => {
  const stripeConfig = await getStripeConfig()
  const stripe = new Stripe(stripeConfig.secretKey)

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

    console.log(`${stripeConfig.mode} session created:`, session)

    return {
      clientSecret: session.client_secret,
    }
  } catch (error) {
    console.error(`${stripeConfig.mode} error creating session:`, error)
    throw new Error('Failed to create payment session')
  }
}
