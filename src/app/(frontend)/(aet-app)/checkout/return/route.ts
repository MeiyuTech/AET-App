import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { Stripe } from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)

  const stripeSessionId = searchParams.get('session_id')

  if (!stripeSessionId?.length) return redirect('/shop')

  const session = await stripe.checkout.sessions.retrieve(stripeSessionId)

  if (session.status === 'complete') {
    // Get application id from session metadata and redirect to success page with it
    const applicationId = session.metadata?.applicationId
    return redirect(`/checkout/success?applicationId=${applicationId}`)
  }

  if (session.status === 'open') {
    // Here you'll likely want to head back to some pre-payment page in your checkout
    // so the user can try again
    return redirect(`/checkout`)
  }

  return redirect('/shop')
}
