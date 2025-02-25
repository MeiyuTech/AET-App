import { NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { getServerSideURL } from '@/utilities/getURL'
import { getStripeConfig } from '../../../utils/stripe/config'

export async function POST(request: Request) {
  const stripeConfig = await getStripeConfig()
  const stripe = new Stripe(stripeConfig.secretKey)
  const currentUrl = getServerSideURL()

  try {
    const body = await request.json()
    const { amount, currency, applicationId } = body

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
      client_reference_id: applicationId || '',
      success_url: `${currentUrl}/checkout/success?applicationId=${applicationId}`,
      // cancel_url: `${currentUrl}/stripe-test`,
      metadata: {
        applicationId: applicationId || '',
      },
    })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error(`${stripeConfig.mode} payment creation error:`, error)

    // Handle Stripe errors
    if (error instanceof stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: error.message || 'Payment processing failed',
          code: error.code,
          type: error.type,
          mode: stripeConfig.mode,
        },
        { status: error.statusCode || 400 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        mode: stripeConfig.mode,
      },
      { status: 500 }
    )
  }
}
