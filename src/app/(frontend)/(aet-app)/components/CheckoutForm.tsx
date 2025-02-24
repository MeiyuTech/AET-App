'use client'

import { useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

import { postStripeSession } from '../utils/stripe/session'
import { STRIPE_CONFIG } from '../utils/stripe/config'

if (!STRIPE_CONFIG.publishableKey) {
  throw new Error('STRIPE_CONFIG.publishableKey is not defined in environment variables')
}

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey)

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
