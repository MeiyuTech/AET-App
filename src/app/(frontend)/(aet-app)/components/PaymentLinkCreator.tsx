'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface PaymentLinkCreatorProps {
  applicationId?: string
  defaultAmount?: number
  defaultCurrency?: string
  defaultDescription?: string
  onSuccess?: (data: { url: string; id: string }) => void
  onError?: (error: any) => void
}

export function PaymentLinkCreator({
  applicationId,
  defaultAmount = 0,
  defaultCurrency = 'usd',
  defaultDescription = 'Customized Service Payment',
  onSuccess,
  onError,
}: PaymentLinkCreatorProps) {
  const [amount, setAmount] = useState<number>(defaultAmount)
  const [currency, setCurrency] = useState<string>(defaultCurrency)
  const [description, setDescription] = useState<string>(defaultDescription)
  const [expiresAt, setExpiresAt] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<{
    url: string
    id: string
    active: boolean
    expiresAt?: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Convert expiresAt string to Unix timestamp if provided
      const expiresAtUnix = expiresAt ? Math.floor(new Date(expiresAt).getTime() / 1000) : undefined

      const response = await fetch('/api/stripe/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          applicationId,
          description,
          expiresAt: expiresAtUnix,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment link')
      }

      setResult(data)
      if (onSuccess) {
        onSuccess({ url: data.url, id: data.id })
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating the payment link'
      setError(errorMessage)
      if (onError) {
        onError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Payment Link</CardTitle>
        <CardDescription>Generate a Stripe payment link for your customers</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expires At (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
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
                </div>
                {result.expiresAt && (
                  <p className="mt-1 text-sm">
                    Expires: {format(result.expiresAt * 1000, 'PPP p')}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Payment Link'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
