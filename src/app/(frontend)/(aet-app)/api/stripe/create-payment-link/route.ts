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
    const {
      amount,
      currency = 'usd',
      applicationId,
      description = 'Customized Service Payment',
    } = body

    // Calculate Stripe Fee (2.9% + $0.30)
    const totalAmount = (amount + 0.3) / (1 - 0.029)
    const stripeFee = totalAmount - amount

    // Convert amount to cents and ensure it's a valid integer
    const unitAmount = Math.round(totalAmount * 100)

    // Create a product if needed
    const product = await stripe.products.create({
      name: description,
      description: `Price: ${amount.toFixed(2)} + Stripe Fee: ${stripeFee.toFixed(2)}`,
      metadata: {
        applicationId: applicationId || '',
      },
    })

    // Create a price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: unitAmount,
      currency: currency,
    })

    // Create payment link parameters
    const paymentLinkParams: Stripe.PaymentLinkCreateParams = {
      payment_method_types: ['card', 'alipay', 'us_bank_account'],
      // // ACH Direct Debit payment is only available for  Stripe Checkout
      // payment_method_options: {
      //   us_bank_account: {
      //     setup_future_usage: 'on_session',
      //   },
      // },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${currentUrl}/checkout/success?applicationId=${applicationId}`,
        },
      },
      metadata: {
        applicationId: applicationId || '',
      },
      restrictions: {
        completed_sessions: {
          limit: 1,
        },
      },
    }

    // Create the payment link
    const paymentLink = await stripe.paymentLinks.create(paymentLinkParams)

    return NextResponse.json({
      url: paymentLink.url,
      id: paymentLink.id,
      active: paymentLink.active,
    })
  } catch (error) {
    console.error(`${stripeConfig.mode} payment link creation error:`, error)

    // Handle Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: error.message || 'Payment link creation failed',
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
