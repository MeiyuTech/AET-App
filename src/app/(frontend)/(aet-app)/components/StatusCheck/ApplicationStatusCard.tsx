'use client'

import { useEffect, useState } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'
import { getStatusColor, getPaymentStatusColor } from '../../utils/statusColors'

interface ApplicationStatusCardProps {
  applicationData: ApplicationData
}

export default function ApplicationStatusCard({ applicationData }: ApplicationStatusCardProps) {
  const [submittedAtDisplay, setSubmittedAtDisplay] = useState(
    applicationData.submitted_at ? new Date(applicationData.submitted_at).toISOString() : 'N/A'
  )
  const [paidAtDisplay, setPaidAtDisplay] = useState(
    applicationData.paid_at ? new Date(applicationData.paid_at).toISOString() : 'Not Paid'
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
      setSubmittedAtDisplay('N/A')
    }

    if (applicationData.paid_at) {
      setPaidAtDisplay(formatter.format(new Date(applicationData.paid_at)))
    } else {
      setPaidAtDisplay('Not Paid')
    }
  }, [applicationData.paid_at, applicationData.submitted_at])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <dt className="font-medium">Status</dt>
            <dd className={`capitalize ${getStatusColor(applicationData.status)}`}>
              {applicationData.status}
            </dd>
          </div>

          {/* Submitted At */}
          <div>
            <dt className="font-medium">Submitted At</dt>
            <dd className="text-muted-foreground">{submittedAtDisplay}</dd>
          </div>

          {/* Payment Status */}
          <div>
            <dt className="font-medium">Payment Status</dt>
            <dd className={`capitalize ${getPaymentStatusColor(applicationData.payment_status)}`}>
              {applicationData.payment_status}
            </dd>
          </div>

          {/* Paid At */}
          <div>
            <dt className="font-medium">Paid At</dt>
            <dd className="text-muted-foreground">{paidAtDisplay}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
