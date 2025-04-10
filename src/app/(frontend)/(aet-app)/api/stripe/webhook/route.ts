import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { createClient } from '../../../utils/supabase/server'
import { getStripeConfig } from '../../../utils/stripe/config'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  const stripeConfig = await getStripeConfig()
  const stripe = new Stripe(stripeConfig.secretKey)

  if (!signature) {
    return new NextResponse('No signature', { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, stripeConfig.webhookSecret)

    console.log(`Processing ${stripeConfig.mode} webhook event:`, event.type)

    const client = await createClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Session data:', {
          client_reference_id: session.client_reference_id || session.metadata?.applicationId,
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
        console.log(`Unhandled ${stripeConfig.mode} event type:`, event.type)
      }
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (err) {
    console.error(`${stripeConfig.mode} webhook error:`, err)
    return new NextResponse(
      `${stripeConfig.mode} webhook error: ` +
        (err instanceof Error ? err.message : 'Unknown error'),
      { status: 400 }
    )
  }
}
