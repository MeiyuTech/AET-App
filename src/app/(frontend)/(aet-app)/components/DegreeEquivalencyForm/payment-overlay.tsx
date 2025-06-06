'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createPayment } from '@/app/(frontend)/(aet-app)/utils/stripe/actions'

interface PaymentOverlayProps {
  applicationId: string
}

export function PaymentOverlay({ applicationId }: PaymentOverlayProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await createPayment({
        amount: '1.01',
        applicationId,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment creation failed')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Payment creation failed:', error)
      toast({
        variant: 'destructive',
        title: 'Payment error',
        description: error instanceof Error ? error.message : 'Payment creation failed',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Unlock full results</p>
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? 'Processing...' : 'Pay $40 now'}
        </Button>
      </div>
    </div>
  )
}
