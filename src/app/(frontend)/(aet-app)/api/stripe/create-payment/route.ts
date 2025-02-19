import { NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG } from '../../../utils/stripe/config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency } = body

    // Convert amount to cents and ensure it's a valid integer
    const unitAmount = Math.round(amount * 100)

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
            unit_amount: unitAmount, // Use rounded integer amount
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
    console.error(`${STRIPE_CONFIG.mode} payment creation error:`, error)

    // Handle Stripe errors
    if (error instanceof stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: error.message || 'Payment processing failed',
          code: error.code,
          type: error.type,
          mode: STRIPE_CONFIG.mode,
        },
        { status: error.statusCode || 400 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        mode: STRIPE_CONFIG.mode,
      },
      { status: 500 }
    )
  }
}
