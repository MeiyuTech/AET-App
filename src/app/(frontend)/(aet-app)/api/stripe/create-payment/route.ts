import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency } = body

    // Create inline price and checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Custom Payment',
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating payment:', error)

    // Handle Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: error.message || 'Payment processing failed',
          code: error.code,
          type: error.type,
        },
        { status: error.statusCode || 400 }
      )
    }

    // Handle other errors
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
