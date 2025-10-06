'use client'

import { useEffect, useState } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'
import { getStatusColor, getPaymentStatusColor } from '../../utils/statusColors'
import { useTranslations } from 'next-intl'

interface ApplicationStatusCardProps {
  applicationData: ApplicationData
}

export default function ApplicationStatusCard({ applicationData }: ApplicationStatusCardProps) {
  const t = useTranslations('status')
  const [submittedAtDisplay, setSubmittedAtDisplay] = useState(
    applicationData.submitted_at
      ? new Date(applicationData.submitted_at).toISOString()
      : t('applicationStatus.notAvailable')
  )
  const [paidAtDisplay, setPaidAtDisplay] = useState(
    applicationData.paid_at
      ? new Date(applicationData.paid_at).toISOString()
      : t('applicationStatus.notPaid')
  )

  useEffect(() => {
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US'
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    if (applicationData.submitted_at) {
      setSubmittedAtDisplay(formatter.format(new Date(applicationData.submitted_at)))
    } else {
      setSubmittedAtDisplay(t('applicationStatus.notAvailable'))
    }

    if (applicationData.paid_at) {
      setPaidAtDisplay(formatter.format(new Date(applicationData.paid_at)))
    } else {
      setPaidAtDisplay(t('applicationStatus.notPaid'))
    }
  }, [applicationData.paid_at, applicationData.submitted_at, t])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('applicationStatus.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <dt className="font-medium">{t('applicationStatus.status')}</dt>
            <dd className={`capitalize ${getStatusColor(applicationData.status)}`}>
              {applicationData.status}
            </dd>
          </div>

          {/* Submitted At */}
          <div>
            <dt className="font-medium">{t('applicationStatus.submittedAt')}</dt>
            <dd className="text-muted-foreground">{submittedAtDisplay}</dd>
          </div>

          {/* Payment Status */}
          <div>
            <dt className="font-medium">{t('applicationStatus.paymentStatus')}</dt>
            <dd className={`capitalize ${getPaymentStatusColor(applicationData.payment_status)}`}>
              {applicationData.payment_status}
            </dd>
          </div>

          {/* Paid At */}
          <div>
            <dt className="font-medium">{t('applicationStatus.paidAt')}</dt>
            <dd className="text-muted-foreground">{paidAtDisplay}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
