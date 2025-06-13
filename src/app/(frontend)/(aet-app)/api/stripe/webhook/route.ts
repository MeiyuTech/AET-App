import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Stripe } from 'stripe'

import { getEstimatedCompletionDate } from '../../../components/FCEApplicationForm/utils'

import { fetchFCEApplication, fetchAETCoreApplication } from '../../../utils/actions'
import { sendPaymentConfirmationEmail } from '../../../utils/email/actions'
import { createClient } from '../../../utils/supabase/server'
import { getStripeConfig } from '../../../utils/stripe/config'

/**
 * This route handles the Stripe webhook events for both FCE and Degree Equivalency applications.
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

          const { error } = await client
            .from('aet_core_payments')
            .update({
              payment_status: 'paid',
              paid_at: new Date().toISOString(),
              payment_id: session.payment_intent,
            })
            .eq('id', session.payment_link)

          if (error) {
            console.error('Error updating payment status:', error)
          }
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

        // Determine which type of application we're dealing with
        const isDegreeEquivalency = session.metadata?.paymentType === 'degree-equivalency'

        // Fetch application data based on type
        const { success, applicationData } = isDegreeEquivalency
          ? await fetchAETCoreApplication(applicationId)
          : await fetchFCEApplication(applicationId)

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
            payment_type: session.metadata?.paymentType,
          })

          if (!session.payment_intent) {
            console.error('No payment intent in session')
            return new NextResponse('Missing payment intent', { status: 400 })
          }

          // Make sure the receipt email is set to the application email
          stripe.paymentIntents.update(session.payment_intent as string, {
            receipt_email: applicationData.email,
          })

          // Update the application status and payment status
          const paidAt = new Date().toISOString()
          const amountTotal = session.amount_total / 100
          const stripeFee = Number((amountTotal * 0.029 + 0.3).toFixed(2))
          const price = Number((amountTotal - stripeFee).toFixed(2))

          const currentAmount = applicationData.due_amount
          console.log('Payment details:', {
            currentAmount,
            amountTotal,
            stripeFee,
            price,
            paymentType: session.metadata?.paymentType,
          })

          // Handle different payment types
          if (isDegreeEquivalency) {
            // Update degree equivalency application
            const { error: applicationError } = await client
              .from('aet_core_applications')
              .update({
                status: 'processing',
              })
              .eq('id', applicationId)

            // First check if payment record exists
            console.log('🔍 Checking existing payment record for application:', {
              applicationId,
              paymentType: 'degree-equivalency',
            })

            const { data: existingPayment, error: findCorePaymentError } = await client
              .from('aet_core_payments')
              .select('*')
              .eq('application_id', applicationId)
              .single()

            if (findCorePaymentError && findCorePaymentError.code !== 'PGRST116') {
              // PGRST116 is "no rows returned" error
              console.error('❌ Error finding payment record:', {
                error: findCorePaymentError,
                applicationId,
                paymentType: 'degree-equivalency',
              })
              return new NextResponse(
                `Error finding payment record: ${findCorePaymentError.message}`,
                {
                  status: 500,
                }
              )
            }

            console.log('📝 Payment record check result:', {
              exists: !!existingPayment,
              applicationId,
              paymentType: 'degree-equivalency',
              existingPaymentId: existingPayment?.id,
            })

            let paymentError
            if (existingPayment) {
              // Update existing payment record
              console.log('🔄 Updating existing payment record:', {
                paymentId: existingPayment.id,
                applicationId,
                newAmount: price,
                paymentIntent: session.payment_intent,
              })

              const { error } = await client
                .from('aet_core_payments')
                .update({
                  due_amount: price,
                  payment_status: 'paid',
                  paid_at: new Date().toISOString(),
                  payment_id: session.payment_intent as string,
                  source: 'Stripe Payment',
                  notes: 'Degree Equivalency Payment',
                })
                .eq('id', existingPayment.id)
              paymentError = error

              if (paymentError) {
                console.error('❌ Error updating payment record:', {
                  error: paymentError,
                  paymentId: existingPayment.id,
                  applicationId,
                  updateData: {
                    due_amount: price,
                    payment_status: 'paid',
                    payment_id: session.payment_intent,
                  },
                })
              } else {
                console.log('✅ Successfully updated payment record:', {
                  paymentId: existingPayment.id,
                  applicationId,
                })
              }
            } else {
              // Create new payment record
              console.log('➕ Creating new payment record:', {
                sessionId: session.id,
                applicationId,
                amount: price,
                paymentIntent: session.payment_intent,
              })

              const { error } = await client.from('aet_core_payments').insert({
                id: session.id,
                application_id: applicationId,
                due_amount: price,
                payment_status: 'paid',
                paid_at: new Date().toISOString(),
                payment_id: session.payment_intent as string,
                source: 'Stripe Payment',
                notes: 'Degree Equivalency Payment',
              })
              paymentError = error

              if (paymentError) {
                console.error('❌ Error creating payment record:', {
                  error: paymentError,
                  sessionId: session.id,
                  applicationId,
                  insertData: {
                    due_amount: price,
                    payment_status: 'paid',
                    payment_id: session.payment_intent,
                  },
                })
              } else {
                console.log('✅ Successfully created payment record:', {
                  sessionId: session.id,
                  applicationId,
                })
              }
            }

            if (applicationError || paymentError) {
              console.error('❌ Error in degree equivalency payment process:', {
                applicationError,
                paymentError,
                currentState: applicationData,
                attemptedUpdate: {
                  status: 'processing',
                  payment_status: 'paid',
                },
              })
              return new NextResponse(
                `Error updating application: ${applicationError?.message || paymentError?.message}`,
                {
                  status: 500,
                }
              )
            }

            // For degree equivalency, we don't need to handle delivery time or send emails
            return new NextResponse('Webhook processed - Degree Equivalency payment completed', {
              status: 200,
            })
          } else {
            // Handle FCE application
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
              console.error('Error updating FCE application:', {
                error,
                currentState: applicationData,
                attemptedUpdate: {
                  status: 'processing',
                  payment_status: 'paid',
                },
              })
              return new NextResponse(`Error updating application: ${error.message}`, {
                status: 500,
              })
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
          }
        }

        // checkout.session.expired
        console.log('checkout.session.expired data:', {
          client_reference_id: applicationId,
          current_application_data: applicationData,
          payment_type: session.metadata?.paymentType,
        })

        if (applicationData.payment_status === 'paid') {
          console.log('Application is paid, skipping update')
          return new NextResponse('Webhook processed - Skipped paid application', { status: 200 })
        }

        // Handle different payment types for expired sessions
        if (isDegreeEquivalency) {
          const { error } = await client
            .from('aet_core_applications')
            .update({
              payment_status: 'expired',
            })
            .eq('id', applicationId)
            .select()
            .single()

          if (error) {
            console.error('Error updating expired degree equivalency application:', error)
            return new NextResponse(`Error updating expired application: ${error.message}`, {
              status: 500,
            })
          }
        } else {
          const { error } = await client
            .from('fce_applications')
            .update({
              payment_status: 'expired',
            })
            .eq('id', applicationId)
            .select()
            .single()

          if (error) {
            console.error('Error updating expired FCE application:', error)
            return new NextResponse(`Error updating expired application: ${error.message}`, {
              status: 500,
            })
          }
        }

        return new NextResponse('Webhook processed - Application marked as expired', {
          status: 200,
        })
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('charge.refunded data:', {
          payment_intent: charge.payment_intent,
          amount_refunded: charge.amount_refunded,
          amount: charge.amount,
          currency: charge.currency,
        })

        // Find application by payment_id in both tables
        const [fceResult, degreeResult] = await Promise.all([
          client
            .from('fce_applications')
            .select('*')
            .eq('payment_id', charge.payment_intent)
            .single(),
          client
            .from('aet_core_applications')
            .select('*')
            .eq('payment_id', charge.payment_intent)
            .single(),
        ])

        const application = fceResult.data || degreeResult.data
        const findError = fceResult.error || degreeResult.error

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

        console.log('Found application:', {
          id: application.id,
          current_payment_id: application.payment_id,
          current_due_amount: application.due_amount,
          current_payment_status: application.payment_status,
        })

        // Calculate the refunded amount in dollars (Stripe amounts are in cents)
        const refundedAmount = charge.amount_refunded / 100
        const originalAmount = application.due_amount || 0

        console.log('Refund calculation details:', {
          refundedAmount,
          originalAmount,
          isFullRefund: refundedAmount >= originalAmount,
        })

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

          console.log('Partial refund details:', {
            stripeFee,
            actualRefundedAmount,
            newDueAmount,
            newPaymentId,
          })
        } else {
          // Full refund
          newPaymentStatus = 'refunded'
          console.log('Full refund detected:', {
            refundedAmount,
            originalAmount,
            newPaymentStatus,
          })
        }

        console.log('Updating application with:', {
          newPaymentStatus,
          newDueAmount,
          newPaymentId,
        })

        // Update the appropriate table based on the application type
        const tableName = fceResult.data ? 'fce_applications' : 'aet_core_applications'
        const { error } = await client
          .from(tableName)
          .update({
            payment_status: newPaymentStatus,
            due_amount: newDueAmount,
            payment_id: newPaymentId,
          })
          .eq('id', application.id)

        if (error) {
          console.error('Error updating refunded application:', {
            error,
            updateData: {
              payment_status: newPaymentStatus,
              due_amount: newDueAmount,
              payment_id: newPaymentId,
            },
          })
          return new NextResponse(`Error updating refunded application: ${error.message}`, {
            status: 500,
          })
        }

        console.log('Successfully updated application with refund information:', {
          applicationId: application.id,
          newPaymentStatus,
          newDueAmount,
          newPaymentId,
        })

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
