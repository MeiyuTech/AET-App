'use client'

import { useToast } from '@/hooks/use-toast'

import { createPayment } from '../../utils/stripe/actions'
import ZellePaymentOption from './ZellePaymentOption'
// import StripeInlinePricingWithID from '../Stripe/InlinePricingWithID'

interface ApplicationData {
  office?: string
  payment_status?: 'pending' | 'paid' | 'failed' | 'expired'
  due_amount?: number
}

interface PaymentOptionsProps {
  application: ApplicationData
  applicationId: string
  calculateTotalPrice: () => string
}

export default function PaymentOptions({
  application,
  applicationId,
  calculateTotalPrice,
}: PaymentOptionsProps) {
  const { toast } = useToast()

  const handleStripePayment = async () => {
    try {
      const amount = application?.due_amount
        ? (application.due_amount as number).toString()
        : calculateTotalPrice()
      const response = await createPayment({ amount, applicationId })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment creation failed')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Payment creation failed:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Payment creation failed',
      })
    }
  }

  // Handle payment based on office location
  const handleOfficePaymentAction = () => {
    if (!application || !application.office) {
      console.log('No application or office found')
      return
    }

    window.open('https://www.americantranslationservice.com/e_pay.html', '_blank')
  }

  if (application.payment_status === 'paid') {
    return null
  }

  // Boston and New York offices
  if (application.office === 'Boston' || application.office === 'New York') {
    return (
      <>
        <ZellePaymentOption office={application.office} />
        <div className="mt-4">
          <button
            onClick={handleOfficePaymentAction}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </>
    )
  }

  // San Francisco, Los Angeles, and Miami offices
  if (
    application.office === 'San Francisco' ||
    application.office === 'Los Angeles' ||
    application.office === 'Miami'
  ) {
    return (
      <>
        <ZellePaymentOption office={application.office} />
        {/* Stripe */}
        {/* <StripeInlinePricingWithID applicationId={applicationId} /> */}
        <div className="mt-4">
          <button
            onClick={handleStripePayment}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Proceed to Stripe Payment (3% fee)
          </button>
        </div>
      </>
    )
  }

  return null
}
