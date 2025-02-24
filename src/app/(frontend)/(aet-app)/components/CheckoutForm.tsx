'use client'

import { useCallback } from 'react'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { postStripeSession } from '../utils/stripe/session'
import { getStripeConfig } from '../utils/stripe/config'

export const CheckoutForm = ({
  priceId,
  applicationId,
}: {
  priceId: string
  applicationId: string
}) => {
  // Elegantly fetch the client secret in a synchronous function
  const fetchClientSecret = useCallback(async () => {
    const stripeResponse = await postStripeSession({
      priceId,
      applicationId,
    })
    return stripeResponse.clientSecret
  }, [priceId, applicationId])

  const options = { fetchClientSecret }

  const fetchStripePromise = useCallback(async () => {
    const stripeConfig = await getStripeConfig()
    const stripePromise = loadStripe(stripeConfig.publishableKey)
    return stripePromise
  }, [])

  const stripePromise = fetchStripePromise()

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
