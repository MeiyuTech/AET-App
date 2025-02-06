import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import { Stripe } from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const stripeSessionId = searchParams.get('session_id')

    // Add logging
    console.log('Stripe Session ID:', stripeSessionId)

    if (!stripeSessionId?.length) {
      console.log('No session ID provided')
      return NextResponse.redirect(new URL('/shop', request.url))
    }

    const session = await stripe.checkout.sessions.retrieve(stripeSessionId)

    // Add logging
    console.log('Session status:', session.status)

    if (session.status === 'complete') {
      return NextResponse.redirect(new URL('/checkout/success', request.url))
    }

    if (session.status === 'open') {
      return NextResponse.redirect(new URL('/checkout', request.url))
    }

    // Default fallback
    return NextResponse.redirect(new URL('/shop', request.url))
  } catch (error) {
    // Add error logging
    console.error('Checkout return error:', error)

    // Return error response instead of redirect for debugging
    return NextResponse.json(
      { error: 'Something went wrong processing the checkout' },
      { status: 500 }
    )
  }
}
