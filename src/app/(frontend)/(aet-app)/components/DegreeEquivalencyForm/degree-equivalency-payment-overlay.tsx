'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createDegreeEquivalencyPayment } from '@/app/(frontend)/(aet-app)/utils/stripe/actions'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import { useLocale, useTranslations } from 'next-intl'

interface DegreeEquivalencyPaymentOverlayProps {
  applicationId: string
}

export function DegreeEquivalencyPaymentOverlay({
  applicationId,
}: DegreeEquivalencyPaymentOverlayProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const t = useTranslations('degreeEquivalencySuccess.paymentOverlay')
  const locale = useLocale()
  const priceAmount = 19
  const priceValue = '19.00'
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceAmount)
  const priceLabel = t('priceLabel', { amount: formattedPrice })

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await createDegreeEquivalencyPayment({
        // amount: '1.01',
        // amount: '40.00',
        amount: priceValue,
        applicationId,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('errors.creationFailed'))
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Payment creation failed:', error)
      toast({
        variant: 'destructive',
        title: t('errors.toastTitle'),
        description: error instanceof Error ? error.message : t('errors.creationFailed'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-white/90 to-blue-100/80 backdrop-blur-sm">
      <div className="relative p-8 bg-white rounded-2xl shadow-2xl ring-2 ring-blue-300/40 max-w-xs w-full animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="mb-2 text-blue-700">
            <LockClosedIcon className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold mb-1 text-center">{t('title')}</h2>
          {/* <p className="text-gray-500 text-sm mb-4 text-center">Pay to view</p> */}
          <div className="text-2xl font-extrabold text-blue-700 mb-4">{priceLabel}</div>
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold shadow-lg transition-all duration-150 flex items-center justify-center"
          >
            {isLoading && (
              <svg className="animate-spin w-5 h-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isLoading ? t('button.loading') : t('button.cta')}
          </Button>
        </div>
      </div>
    </div>
  )
}
