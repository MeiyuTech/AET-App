'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { formatDateTime } from '../../utils/dateFormat'

interface SuccessMessageProps {
  applicationData: any
  applicationId: string
}

export function SuccessMessage({ applicationData, applicationId }: SuccessMessageProps) {
  const formattedPaidAt = formatDateTime(applicationData.paid_at as string)
  return (
    <div className="text-center max-w-2xl mx-auto p-6">
      <br />
      <br />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <Card className="bg-green-50 border border-green-200 p-6 mb-6">
        <p className="text-xl mb-4">
          Thank you, <span className="font-semibold">{applicationData.name}</span>!
        </p>
        <p className="text-gray-600 mb-2">Your payment has been processed successfully.</p>
        <p className="text-gray-600 mb-2">
          Application ID: <span className="font-mono">{applicationId}</span>
        </p>
        <p className="text-gray-600 mb-2">
          Payment Status:{' '}
          <span className={`font-3xl ${getPaymentStatusColor(applicationData.payment_status)}`}>
            {applicationData.payment_status}
          </span>
        </p>

        <p className="text-gray-600">
          Paid At: <span className="font-semibold">{formattedPaidAt || 'Processing...'}</span>
        </p>
      </Card>
      <p className="text-sm text-gray-500 mb-4">
        We will review your application and contact you soon.
      </p>

      <Link
        href={`/status?applicationId=${applicationId}`}
        className="text-blue-600 hover:text-blue-800 underline text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Application Status
      </Link>
    </div>
  )
}

function getPaymentStatusColor(status: string) {
  const colors = {
    pending: 'text-yellow-600',
    paid: 'text-green-600',
    failed: 'text-red-600',
    expired: 'text-gray-600',
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}
