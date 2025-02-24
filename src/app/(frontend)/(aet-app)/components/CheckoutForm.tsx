'use client'

import { useCallback } from 'react'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { postStripeSession } from '../utils/stripe/session'
import { stripePublishableKey } from '../utils/stripe/config.client'
export const CheckoutForm = ({
  priceId,
  applicationId,
}: {
  priceId: string
  applicationId: string
}) => {
  if (!stripePublishableKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY is not set')
  }
  const stripePromise = loadStripe(stripePublishableKey)

  // Elegantly fetch the client secret in a synchronous function
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
