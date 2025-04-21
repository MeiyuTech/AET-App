'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'
import { getStatusColor, getPaymentStatusColor } from '../../utils/statusColors'
import PaymentCountdown from './PaymentCountdown'

interface ApplicationStatusCardProps {
  applicationData: ApplicationData
}

export default function ApplicationStatusCard({ applicationData }: ApplicationStatusCardProps) {
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
            <dd className="text-muted-foreground">
              {new Date(applicationData.submitted_at).toLocaleString()}
            </dd>
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
            <dd className="text-muted-foreground">
              {applicationData.paid_at
                ? new Date(applicationData.paid_at).toLocaleString()
                : 'Not Paid'}
            </dd>
          </div>
        </dl>

        <PaymentCountdown
          submittedAt={applicationData.submitted_at}
          paymentStatus={applicationData.payment_status}
        />
      </CardContent>
    </Card>
  )
}
