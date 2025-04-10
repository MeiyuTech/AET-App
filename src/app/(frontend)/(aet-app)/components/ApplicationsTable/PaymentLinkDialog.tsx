'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface PaymentLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicationId: string
  defaultAmount: number
}

export function PaymentLinkDialog({
  open,
  onOpenChange,
  applicationId,
  defaultAmount,
}: PaymentLinkDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    url: string
    id: string
  } | null>(null)

  useEffect(() => {
    if (open) {
      setResult(null)
      setError(null)
      setIsLoading(true)
      createPaymentLink()
    }
  }, [open])

  const createPaymentLink = async () => {
    if (!applicationId || defaultAmount <= 0) {
      setError('Invalid payment amount or application ID. Please check your Due Amount Setting. ')
      setIsLoading(false)
      return
    }

    try {
      console.log('try...')
      const response = await fetch('/api/stripe/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: defaultAmount,
          currency: 'usd',
          applicationId: applicationId,
          description: `Payment for Application ${applicationId}`,
        }),
      })

      const data = await response.json()
      console.log('data', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment link')
      }

      setResult(data)
    } catch (err: any) {
      console.log('err', err)
      const errorMessage = err.message || 'Failed to create payment link'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payment Link</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && !isLoading && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Payment Link Created</AlertTitle>
              <AlertDescription className="text-green-700">
                <div className="mt-2">
                  <p className="font-medium">Payment Link URL:</p>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {result.url}
                  </a>
                  <p className="mt-2 text-sm text-green-600">
                    Note: This link can only be used once and will become invalid after a successful
                    payment.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
