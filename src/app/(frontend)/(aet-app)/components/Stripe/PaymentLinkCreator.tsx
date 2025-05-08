'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react'

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

import { createPaymentLink } from '../../utils/stripe/actions'

interface PaymentLinkCreatorProps {
  applicationId?: string
  defaultAmount?: number
  defaultCurrency?: string
  defaultDescription?: string
  onSuccess?: (data: { url: string; id: string }) => void
  onError?: (error: any) => void
  hideApplicationId?: boolean
}

export function PaymentLinkCreator({
  applicationId: defaultApplicationId,
  defaultAmount = 0,
  defaultDescription = 'Customized Service Payment',
  onSuccess,
  onError,
  hideApplicationId = false,
}: PaymentLinkCreatorProps) {
  const [amount, setAmount] = useState<number>(defaultAmount)
  const [description, setDescription] = useState<string>(defaultDescription)
  const [applicationId, setApplicationId] = useState<string>(defaultApplicationId || '')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<{
    url: string
    id: string
    active: boolean
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await createPaymentLink(amount, applicationId, description, 'usd')

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
    <div className="max-w-7xl mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto p-8">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold">Create Payment Link</CardTitle>
          <CardDescription className="flex items-center gap-2 text-lg text-gray-600">
            <Info className="h-5 w-5 text-muted-foreground" />
            <span>Each payment link can only be used once for security</span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-lg">
                Due Amount<span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                required
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="description" className="text-lg">
                Description<span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>
            {!hideApplicationId && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="applicationId" className="text-lg">
                    Application ID&nbsp;
                    <span className="text-base text-muted-foreground">(Optional)</span>
                  </Label>
                </div>
                <Input
                  id="applicationId"
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="Enter application ID if applicable"
                  className="h-12 text-lg"
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="text-lg">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert variant="default" className="bg-green-50 border-green-200 text-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
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
                    <p className="mt-2 text-base text-green-600">
                      Note: This link can only be used once and will become invalid after a
                      successful payment.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Payment Link'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
