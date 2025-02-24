'use client'

import { useCallback } from 'react'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

import { postStripeSession } from '../utils/stripe/session'
import { stripePromise } from '../utils/stripe/config'

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
