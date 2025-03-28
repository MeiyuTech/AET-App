'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'

interface ApplicationStatusCardProps {
  application: ApplicationData
}

export default function ApplicationStatusCard({ application }: ApplicationStatusCardProps) {
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
            <dd className="text-muted-foreground">{application.status}</dd>
          </div>

          {/* Submitted At */}
          <div>
            <dt className="font-medium">Submitted At</dt>
            <dd className="text-muted-foreground">
              {new Date(application.submitted_at).toLocaleString()}
            </dd>
          </div>

          {/* Payment Status */}
          <div>
            <dt className="font-medium">Payment Status</dt>
            <dd
              className={`capitalize ${
                application.payment_status === 'paid'
                  ? 'text-green-600'
                  : application.payment_status === 'failed'
                    ? 'text-red-600'
                    : application.payment_status === 'expired'
                      ? 'text-orange-600'
                      : 'text-yellow-600'
              }`}
            >
              {application.payment_status}
            </dd>
          </div>

          {/* Paid At */}
          <div>
            <dt className="font-medium">Paid At</dt>
            <dd className="text-muted-foreground">
              {application.paid_at ? new Date(application.paid_at).toLocaleString() : 'Not Paid'}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
