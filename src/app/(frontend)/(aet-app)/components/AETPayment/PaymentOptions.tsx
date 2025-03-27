'use client'

import { useState } from 'react'
import { CreditCard, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'

import { createPayment } from '../../utils/stripe/actions'
import ZellePaymentOption from './ZellePaymentOption'
import PaymentMethodSelector from './PaymentMethodSelector'

import { ApplicationData } from '../FCEApplicationForm/types'
import { calculateTotalPrice } from '../FCEApplicationForm/utils'

interface PaymentOptionsProps {
  application: ApplicationData
  applicationId: string
}

export default function PaymentOptions({ application, applicationId }: PaymentOptionsProps) {
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState<'zelle' | 'stripe'>('zelle')
  const [showZelleDetails, setShowZelleDetails] = useState(false)

  const createStripePayment = async () => {
    try {
      let amountNumber = 0

      if (application.due_amount) {
        amountNumber = application.due_amount
      } else {
        const calculatedAmount = parseFloat(calculateTotalPrice(application))
        if (isNaN(calculatedAmount) || calculatedAmount === 0) {
          throw new Error('Cannot process payment: Invalid amount')
        }
        amountNumber = calculatedAmount
      }

      if (amountNumber <= 0) {
        throw new Error('Cannot process payment: Amount must be greater than 0')
      }

      const amount = amountNumber.toString()
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
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Payment creation failed',
      })
    }
  }

  const handlePaymentProceed = () => {
    if (paymentMethod === 'zelle') {
      setShowZelleDetails(true)
    } else {
      if (application.office === 'New York' || application.office === 'Boston') {
        window.open('https://www.americantranslationservice.com/e_pay.html', '_blank')
      } else if (
        application.office === 'San Francisco' ||
        application.office === 'Los Angeles' ||
        application.office === 'Miami'
      ) {
        createStripePayment()
      } else {
        window.open('https://www.americantranslationservice.com/e_pay.html', '_blank')
      }
    }
  }

  const isPaymentDisabled = () => {
    if (application.due_amount) {
      return application.due_amount <= 0
    }
    const calculatedAmount = parseFloat(calculateTotalPrice(application))
    return isNaN(calculatedAmount) || calculatedAmount <= 0
  }

  if (application.payment_status === 'paid') {
    return null
  }

  return (
    <div className="mt-6 space-y-6">
      {!showZelleDetails ? (
        <>
          <PaymentMethodSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />

          <Button
            onClick={handlePaymentProceed}
            className={`w-full flex items-center justify-center gap-2 ${
              paymentMethod === 'zelle'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            size="lg"
            disabled={isPaymentDisabled()}
          >
            {paymentMethod === 'zelle' ? (
              <>
                Continue with Zelle Payment
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Proceed to Online Payment (3% fee)
                <CreditCard className="h-4 w-4" />
              </>
            )}
          </Button>

          {isPaymentDisabled() && (
            <p className="text-sm text-red-600">Payment cannot be processed: Invalid amount</p>
          )}

          <p className="text-center text-xs text-gray-500">
            By proceeding with payment, you agree to our terms of service.
          </p>
        </>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-green-800 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Zelle Payment Selected
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Follow the instructions below to complete your payment via Zelle.
            </p>
          </div>

          <ZellePaymentOption office={application.office} />

          <Button variant="outline" onClick={() => setShowZelleDetails(false)} className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Payment Options
          </Button>
        </>
      )}
    </div>
  )
}
