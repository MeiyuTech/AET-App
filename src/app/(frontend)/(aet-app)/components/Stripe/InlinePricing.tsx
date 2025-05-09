'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createPayment } from '../../utils/stripe/actions'

export default function StripeInlinePricing() {
  // Use string type for amount to better handle input
  const [amount, setAmount] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Handle payment creation
  const handleCreatePayment = async () => {
    try {
      setLoading(true)

      // This is a temporary application id, we need to get the application id from the context
      // TODO: Get application id from context
      const response = await createPayment({ amount, applicationId: '123' })

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
    } finally {
      setLoading(false)
    }
  }

  // Handle amount input changes
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty input or valid decimal numbers
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
    }
  }

  console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

  return (
    <div className="max-w-md mx-auto">
      {/* Cannot use server side env variables in client side code */}
      {!(process.env.NODE_ENV === 'production') && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700">
            Warning: Stripe is in test mode. Use test card numbers only.
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={handleAmountChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={handleCreatePayment}
        disabled={!amount || parseFloat(amount) <= 0 || loading}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Create Payment'}
      </button>
    </div>
  )
}
