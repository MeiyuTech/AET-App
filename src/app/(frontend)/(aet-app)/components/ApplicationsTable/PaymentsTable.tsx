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
import React from 'react'

// Mock data
const payments = [
  {
    id: 'pay_001',
    applicationId: 'app_001',
    dueAmount: 120.5,
    paymentStatus: 'paid',
    paidAt: '2024-05-20 10:00',
    paymentId: 'stripe_123',
    source: 'stripe',
  },
  {
    id: 'pay_002',
    applicationId: 'app_002',
    dueAmount: 80.0,
    paymentStatus: 'pending',
    paidAt: null,
    paymentId: null,
    source: 'paypal',
  },
]

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
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.applicationId}</TableCell>
              <TableCell>${p.dueAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={statusColor(p.paymentStatus)}>{p.paymentStatus}</Badge>
              </TableCell>
              <TableCell>{p.paidAt || '-'}</TableCell>
              <TableCell>{p.source}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
