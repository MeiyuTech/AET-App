import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Stripe } from 'stripe'

import { getEstimatedCompletionDate } from '../../../components/FCEApplicationForm/utils'

import { fetchApplication } from '../../../utils/actions'
import { sendPaymentConfirmationEmail } from '../../../utils/email/actions'
import { createClient } from '../../../utils/supabase/server'
import { getStripeConfig } from '../../../utils/stripe/config'
/**
 * This route handles the Stripe webhook events for the FCE application.
 * (Only 2 events: checkout.session.completed and checkout.session.expired)
 * It updates the application status and payment status based on the Stripe event type.
 * @param req - The request object.
 * @returns A response object.
 */
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
    const session = event.data.object as Stripe.Checkout.Session

    // If payment link is valid, handle different event types
    if (session.payment_link) {
      console.log('Processing payment link webhook:', event.type)
      console.log('Payment link:', session.payment_link)

      switch (event.type) {
        case 'checkout.session.completed': {
          console.log('Payment link checkout completed:', {
            payment_link: session.payment_link,
            payment_intent: session.payment_intent,
            amount_total: session.amount_total,
          })
          return new NextResponse('Payment link checkout completed', { status: 200 })
        }
        case 'checkout.session.expired': {
          console.log('Payment link checkout expired:', {
            payment_link: session.payment_link,
          })
          return new NextResponse('Payment link checkout expired', { status: 200 })
        }
        case 'charge.refunded': {
          console.log('Payment link charge refunded:', {
            payment_link: session.payment_link,
            payment_intent: session.payment_intent,
            amount_refunded: (event.data.object as Stripe.Charge).amount_refunded,
          })
          return new NextResponse('Payment link charge refunded', { status: 200 })
        }
        default: {
          console.log('Unhandled payment link event:', event.type)
          return new NextResponse('Unhandled payment link event', { status: 200 })
        }
      }
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.expired': {
        const applicationId = session.client_reference_id || session.metadata?.applicationId
        if (!applicationId) {
          console.error('No client_reference_id in session')
          return new NextResponse('Missing client_reference_id', { status: 400 })
        }

        const { success, applicationData } = await fetchApplication(applicationId)

        if (!success) {
          console.error('Error fetching application:', applicationData)
          return new NextResponse('Error fetching application', { status: 500 })
        }

        if (!applicationData) {
          console.error('No application data found')
          return new NextResponse('No application data found', { status: 400 })
        }

        if (event.type === 'checkout.session.completed') {
          if (!session.amount_total) {
            console.error('No amount total in session')
            return new NextResponse('Missing amount total', { status: 400 })
          }

          console.log('checkout.session.completed data:', {
            client_reference_id: applicationId,
            payment_intent: session.payment_intent,
            current_application_data: applicationData,
          })

          // Update the application status and payment status
          const paidAt = new Date().toISOString()
          const amountTotal = session.amount_total / 100
          const stripeFee = Number((amountTotal * 0.029 + 0.3).toFixed(2))
          const price = Number((amountTotal - stripeFee).toFixed(2))

          const currentAmount = applicationData.due_amount
          console.log('currentAmount', currentAmount)
          console.log('amountTotal', amountTotal)
          console.log('stripeFee', stripeFee)
          console.log('price', price)

          const { error } = await client
            .from('fce_applications')
            .update({
              status: 'processing',
              payment_status: 'paid',
              payment_id: session.payment_intent as string,
              paid_at: paidAt,
              due_amount: price,
            })
            .eq('id', applicationId)

          if (error) {
            console.error('Error updating application:', {
              error,
              currentState: applicationData,
              attemptedUpdate: {
                status: 'processing',
                payment_status: 'paid',
              },
            })
            return new NextResponse(`Error updating application: ${error.message}`, { status: 500 })
          }

          // Send payment confirmation email to the applicant
          if (!session.amount_total) {
            throw new Error('No amount total in session')
          }

          // This applicationData is not updated yet, so we need to use the old one and `paidAt`
          console.log('Debug - Same Day Service Calculation:', {
            paidAt,
            applicationData: {
              serviceType: applicationData.serviceType,
              isSameDay:
                applicationData.serviceType?.foreignCredentialEvaluation?.firstDegree?.speed ===
                'sameday',
            },
          })
          const estimatedCompletionDate = getEstimatedCompletionDate(applicationData, paidAt)
          console.log('Debug - Calculated Completion Date:', {
            estimatedCompletionDate,
            paidAt,
          })
          const paymentAmount = (session.amount_total / 100).toFixed(2)
          const { success: emailSuccess, message: sendEmailMessage } =
            await sendPaymentConfirmationEmail(
              applicationId,
              applicationData,
              paidAt,
              paymentAmount,
              session.payment_intent as string,
              estimatedCompletionDate
            )

          if (!emailSuccess) {
            console.error('Failed to send payment confirmation email:', sendEmailMessage)
            throw new Error('Failed to send payment confirmation email')
          }

          return new NextResponse('Webhook processed', { status: 200 })
        } else {
          // checkout.session.expired
          console.log('checkout.session.expired data:', {
            client_reference_id: applicationId,
            current_application_data: applicationData,
          })

          if (applicationData.payment_status === 'paid') {
            console.log('Application is paid, skipping update')
            return new NextResponse('Webhook processed - Skipped paid application', { status: 200 })
          }

          const { error } = await client
            .from('fce_applications')
            .update({
              payment_status: 'expired',
            })
            .eq('id', applicationId)
            .select()
            .single()

          if (error) {
            console.error('Error updating expired application:', error)
            return new NextResponse(`Error updating expired application: ${error.message}`, {
              status: 500,
            })
          }

          return new NextResponse('Webhook processed - Application marked as expired', {
            status: 200,
          })
        }
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('charge.refunded data:', {
          payment_intent: charge.payment_intent,
          amount_refunded: charge.amount_refunded,
        })

        // Find application by payment_id
        const { data: application, error: findError } = await client
          .from('fce_applications')
          .select('*')
          .eq('payment_id', charge.payment_intent)
          .single()

        if (findError) {
          console.error('Error finding application:', findError)
          return new NextResponse(`Error finding application: ${findError.message}`, {
            status: 500,
          })
        }

        if (!application) {
          console.error('No application found for payment_intent:', charge.payment_intent)
          return new NextResponse('No application found for this payment', { status: 404 })
        }

        // Calculate the refunded amount in dollars (Stripe amounts are in cents)
        const refundedAmount = charge.amount_refunded / 100
        const originalAmount = application.due_amount || 0

        // Calculate the new due_amount and determine if it's a full refund
        let newDueAmount: number | null = null
        let newPaymentId = application.payment_id
        let newPaymentStatus = 'paid'

        if (refundedAmount < originalAmount) {
          // For partial refunds, calculate the new due_amount
          // We need to account for Stripe's fee (2.9% + $0.30)
          const stripeFee = Number((refundedAmount * 0.029 + 0.3).toFixed(2))
          const actualRefundedAmount = Number((refundedAmount - stripeFee).toFixed(2))
          newDueAmount = Number((originalAmount - actualRefundedAmount).toFixed(2))

          // Add refund information to payment_id
          newPaymentId = `${application.payment_id} (refunded $${refundedAmount.toFixed(2)})`
        } else {
          // Full refund
          newPaymentStatus = 'refunded'
        }

        const { error } = await client
          .from('fce_applications')
          .update({
            payment_status: newPaymentStatus,
            due_amount: newDueAmount,
            payment_id: newPaymentId,
          })
          .eq('id', application.id)

        if (error) {
          console.error('Error updating refunded application:', error)
          return new NextResponse(`Error updating refunded application: ${error.message}`, {
            status: 500,
          })
        }

        return new NextResponse('Webhook processed - Application updated with refund information', {
          status: 200,
        })
      }

      default: {
        console.log(`Unhandled ${stripeConfig.mode} event type:`, event.type)
        return new NextResponse(`Unhandled event type: ${event.type}`, { status: 200 })
      }
    }
  } catch (err) {
    console.error(`${stripeConfig.mode} webhook error:`, err)
    return new NextResponse(
      `${stripeConfig.mode} webhook error: ` +
        (err instanceof Error ? err.message : 'Unknown error'),
      { status: 400 }
    )
  }
}
