import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import React, { useEffect, useState } from 'react'
import { fetchPaymentsList } from '@/app/(frontend)/(aet-app)/utils/actions'

interface Payment {
  id: string
  application_id: string | null
  due_amount: number
  payment_status: string
  paid_at: string | null
  payment_id: string | null
  source: string | null
}

const statusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'failed':
      return 'destructive'
    default:
      return 'outline'
  }
}

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      setError(null)
      const result = await fetchPaymentsList()
      if (!result.success || !result.payments) {
        setError(result.error || 'Failed to fetch payments')
        setPayments([])
      } else {
        setPayments(result.payments)
      }
      setLoading(false)
    }
    fetchPayments()
  }, [])

  if (loading) {
    return <div className="p-4">Loading payments...</div>
  }
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Due Amount</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Paid At</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.payment_id || 'N/A'}</TableCell>
                <TableCell>{p.application_id || 'N/A'}</TableCell>
                <TableCell>${p.due_amount?.toFixed(2) ?? 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(p.payment_status)}>{p.payment_status}</Badge>
                </TableCell>
                <TableCell>{p.paid_at ? new Date(p.paid_at).toLocaleString() : '-'}</TableCell>
                <TableCell>{p.source || '-'}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
