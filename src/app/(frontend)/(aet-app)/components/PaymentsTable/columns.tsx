import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Payment } from './types'

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

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'payment_id',
    header: 'Payment ID',
    cell: ({ row }) => row.getValue('payment_id') || 'N/A',
  },
  {
    accessorKey: 'application_id',
    header: 'Application ID',
    cell: ({ row }) => row.getValue('application_id') || 'N/A',
  },
  {
    accessorKey: 'due_amount',
    header: 'Due Amount',
    cell: ({ row }) => {
      const amount = row.getValue('due_amount') as number
      return amount ? `$${amount.toFixed(2)}` : 'N/A'
    },
  },
  {
    accessorKey: 'payment_status',
    header: 'Payment Status',
    cell: ({ row }) => {
      const status = row.getValue('payment_status') as string
      return <Badge variant={statusColor(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: 'paid_at',
    header: 'Paid At',
    cell: ({ row }) => {
      const date = row.getValue('paid_at') as string | null
      return date ? new Date(date).toLocaleString() : '-'
    },
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => row.getValue('source') || '-',
  },
  {
    id: 'actions',
    cell: () => (
      <Button size="sm" variant="outline">
        Details
      </Button>
    ),
  },
]
