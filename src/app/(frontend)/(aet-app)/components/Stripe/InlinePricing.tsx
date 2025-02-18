'use client'

import { useState } from 'react'

export default function StripeInlinePricing() {
  const [amount, setAmount] = useState(0)

  // Handle payment creation
  const handleCreatePayment = async () => {
    try {
      const response = await fetch('/api/stripe/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
        }),
      })

      const data = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Payment creation failed:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => {
            const value = parseFloat(parseFloat(e.target.value).toFixed(2))
            setAmount(value)
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={handleCreatePayment}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Create Payment
      </button>
    </div>
  )
}
