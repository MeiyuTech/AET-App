'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'

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
            <dd className="text-muted-foreground">{applicationData.status}</dd>
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
            <dd
              className={`capitalize ${
                applicationData.payment_status === 'paid'
                  ? 'text-green-600'
                  : applicationData.payment_status === 'failed'
                    ? 'text-red-600'
                    : applicationData.payment_status === 'expired'
                      ? 'text-orange-600'
                      : 'text-yellow-600'
              }`}
            >
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
      </CardContent>
    </Card>
  )
}
