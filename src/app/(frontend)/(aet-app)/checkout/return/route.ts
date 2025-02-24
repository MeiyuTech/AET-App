import { NextRequest, NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { getStripeConfig } from '../../utils/stripe/config'

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const stripeSessionId = searchParams.get('session_id')

  const stripeConfig = await getStripeConfig()
  const stripe = new Stripe(stripeConfig.secretKey)

  if (!stripeSessionId?.length) {
    const error = `${stripeConfig.mode} mode: Missing session_id in return URL`
    console.error(error)
    return NextResponse.json({ error }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId)

    if (session.status === 'complete') {
      // Get application id from session metadata and redirect to success page with it
      const applicationId = session.metadata?.applicationId
      console.log(`${stripeConfig.mode} mode: Payment completed for application:`, applicationId)
      return NextResponse.redirect(
        new URL(`/checkout/success?applicationId=${applicationId}`, request.url)
      )
    }

    if (session.status === 'open') {
      // Here you'll likely want to head back to some pre-payment page in your checkout
      // so the user can try again
      console.log(`${stripeConfig.mode} mode: Session still open, redirecting to checkout`)
      return NextResponse.redirect(new URL('/checkout', request.url))
    }

    const error = `${stripeConfig.mode} mode: Unexpected session status: ${session.status}`
    console.error(error)
    return NextResponse.json({ error }, { status: 400 })
  } catch (error) {
    const errorMessage = `${stripeConfig.mode} mode: Error retrieving session: ${
      error instanceof Error ? error.message : 'Unknown error'
    }`
    console.error(errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
