'use client'

import { CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/utilities/cn'

interface PaymentMethodSelectorProps {
  onSelect: (method: 'zelle' | 'stripe') => void
  selectedMethod: 'zelle' | 'stripe'
}

export default function PaymentMethodSelector({
  onSelect,
  selectedMethod,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-800">Choose Your Payment Method:</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Zelle Option */}
        <div
          className={cn(
            'border rounded-lg p-4 cursor-pointer transition-all',
            selectedMethod === 'zelle'
              ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
              : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
          )}
          onClick={() => onSelect('zelle')}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'rounded-full p-1.5',
                selectedMethod === 'zelle' ? 'text-green-600' : 'text-gray-400'
              )}
            >
              {selectedMethod === 'zelle' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  <span className="text-green-700">✅ Recommended:</span> Zelle
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-1.5">
                Safe, Fast, and No Processing Fee. Direct bank-to-bank transfers.
              </p>

              <div className="flex items-center text-xs text-green-700 mt-2 font-medium">
                <span>Most customers prefer this option</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stripe Option */}
        <div
          className={cn(
            'border rounded-lg p-4 cursor-pointer transition-all',
            selectedMethod === 'stripe'
              ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          )}
          onClick={() => onSelect('stripe')}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'rounded-full p-1.5',
                selectedMethod === 'stripe' ? 'text-blue-600' : 'text-gray-400'
              )}
            >
              {selectedMethod === 'stripe' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">Online Payment</div>
              </div>

              <p className="text-sm text-gray-600 mt-1.5">
                Qucik & Easy. Supports a variety of flexible payment options.
              </p>

              {/* <div className="flex items-center text-xs text-orange-600 mt-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Additional 3% processing fee applies</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
