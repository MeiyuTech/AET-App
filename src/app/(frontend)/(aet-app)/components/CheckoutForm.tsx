'use client'

import { useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

import { postStripeSession } from '../utils/stripe/session'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export const CheckoutForm = ({
  priceId,
  applicationId,
}: {
  priceId: string
  applicationId: string
}) => {
  const fetchClientSecret = useCallback(async () => {
    const stripeResponse = await postStripeSession({
      priceId,
      applicationId,
    })
    return stripeResponse.clientSecret
  }, [priceId, applicationId])

  const options = { fetchClientSecret }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
