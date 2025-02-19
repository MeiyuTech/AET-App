import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { createClient } from '../../../utils/supabase/server'
import { stripe, STRIPE_CONFIG } from '../../../utils/stripe/config'

// Validate environment variables
if (!STRIPE_CONFIG.webhookSecret) {
  throw new Error(`Stripe ${STRIPE_CONFIG.mode} webhook secret is not configured`)
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  // 添加调试日志
  console.log('Webhook called with:', {
    hasSignature: !!signature,
    bodyLength: body.length,
    mode: STRIPE_CONFIG.mode,
    webhookSecret: !!STRIPE_CONFIG.webhookSecret, // 只记录是否存在，不记录实际值
  })

  if (!signature) {
    console.error('Missing stripe-signature header')
    return new NextResponse('No signature', { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_CONFIG.webhookSecret)

    console.log(`Processing ${STRIPE_CONFIG.mode} webhook event:`, event.type)

    const client = await createClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Session data:', {
          client_reference_id: session.client_reference_id,
          payment_intent: session.payment_intent,
        })

        if (!session.client_reference_id) {
          console.error('No client_reference_id in session')
          return new NextResponse('Missing client_reference_id', { status: 400 })
        }

        const { data: existingApp } = await client
          .from('fce_applications')
          .select('status, payment_status')
          .eq('id', session.client_reference_id)
          .single()

        console.log('Current application state:', existingApp)

        const { error } = await client
          .from('fce_applications')
          .update({
            status: 'processing',
            payment_status: 'paid',
            payment_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .eq('id', session.client_reference_id)

        if (error) {
          console.error('Error updating application:', {
            error,
            currentState: existingApp,
            attemptedUpdate: {
              status: 'processing',
              payment_status: 'paid',
            },
          })
          return new NextResponse(`Error updating application: ${error.message}`, { status: 500 })
        }

        const { data: updatedApp } = await client
          .from('fce_applications')
          .select('status, payment_status')
          .eq('id', session.client_reference_id)
          .single()

        console.log('Update result:', {
          before: existingApp,
          after: updatedApp,
          changes: {
            statusChanged: existingApp?.status !== updatedApp?.status,
            paymentStatusChanged: existingApp?.payment_status !== updatedApp?.payment_status,
          },
        })

        return new NextResponse('Webhook processed', { status: 200 })
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Expired session data:', {
          client_reference_id: session.client_reference_id,
        })

        if (!session.client_reference_id) {
          console.error('No client_reference_id in session')
          return new NextResponse('Missing client_reference_id', { status: 400 })
        }

        const { error, data } = await client
          .from('fce_applications')
          .update({
            payment_status: 'expired',
          })
          .eq('id', session.client_reference_id)
          .select()
          .single()

        if (error) {
          console.error('Error updating expired application:', error)
          return new NextResponse(`Error updating expired application: ${error.message}`, {
            status: 500,
          })
        }

        console.log('Successfully updated expired application:', data)
        break
      }

      default: {
        console.log(`Unhandled ${STRIPE_CONFIG.mode} event type:`, event.type)
      }
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (err) {
    // add debug log
    console.error('Webhook signature verification failed:', {
      error: err.message,
      signatureHeader: signature,
      mode: STRIPE_CONFIG.mode,
    })
    console.error(`${STRIPE_CONFIG.mode} webhook error:`, err)
    return new NextResponse(
      `${STRIPE_CONFIG.mode} webhook error: ` +
        (err instanceof Error ? err.message : 'Unknown error'),
      { status: 400 }
    )
  }
}
