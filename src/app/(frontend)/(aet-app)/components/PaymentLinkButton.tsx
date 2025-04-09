'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PaymentLinkCreator } from './PaymentLinkCreator'
import { Loader2, Link } from 'lucide-react'

interface PaymentLinkButtonProps {
  applicationId?: string
  amount: number
  currency?: string
  description?: string
  buttonText?: string
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  onSuccess?: (data: { url: string; id: string }) => void
  onError?: (error: any) => void
}

export function PaymentLinkButton({
  applicationId,
  amount,
  currency = 'usd',
  description = 'Customized Service Payment',
  buttonText = 'Create Payment Link',
  buttonVariant = 'default',
  buttonSize = 'default',
  className = '',
  onSuccess,
  onError,
}: PaymentLinkButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState<{ url: string; id: string } | null>(null)

  const handleSuccess = (data: { url: string; id: string }) => {
    setPaymentLink(data)
    if (onSuccess) {
      onSuccess(data)
    }
  }

  const handleError = (error: any) => {
    if (onError) {
      onError(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={className}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Link className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payment Link</DialogTitle>
          <DialogDescription>
            Generate a payment link for your customer to complete their payment.
          </DialogDescription>
        </DialogHeader>
        <PaymentLinkCreator
          applicationId={applicationId}
          defaultAmount={amount}
          defaultCurrency={currency}
          defaultDescription={description}
          onSuccess={handleSuccess}
          onError={handleError}
        />
        {paymentLink && (
          <DialogFooter className="flex flex-col items-start gap-2">
            <div className="w-full p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Payment Link:</p>
              <a
                href={paymentLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all text-sm"
              >
                {paymentLink.url}
              </a>
            </div>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
