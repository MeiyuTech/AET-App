import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Payment } from './types'
import Link from 'next/link'

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'text-green-600'
    case 'pending':
      return 'text-yellow-600'
    case 'failed':
      return 'text-red-600'
    case 'refunded':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'index',
    header: () => <div className="text-center text-base font-medium">#</div>,
    cell: ({ table, row }) => {
      const rows = table.getRowModel().rows
      const index = rows.findIndex((r) => r.id === row.id)
      return <div className="text-base font-medium">{index + 1}</div>
    },
  },
  {
    accessorKey: 'payment_id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Payment ID
        </Button>
      )
    },
    cell: ({ row }) => {
      const paymentId = row.getValue('payment_id') as string
      if (!paymentId) return 'N/A'

      return (
        <Link
          href={`https://dashboard.stripe.com/payments/${paymentId}`}
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          {paymentId}
        </Link>
      )
    },
  },
  {
    accessorKey: 'application_id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Application ID
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-base font-medium">{row.getValue('application_id') || 'N/A'}</div>
    ),
  },
  {
    accessorKey: 'due_amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Due Amount
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue('due_amount') as number
      return <div className="text-base font-medium">{amount ? `$${amount.toFixed(2)}` : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'payment_status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Payment Status
        </Button>
      )
    },
    cell: ({ row }) => {
      const paymentStatus = row.getValue('payment_status') as string
      return (
        <div className={`capitalize font-medium text-base ${getPaymentStatusColor(paymentStatus)}`}>
          {paymentStatus}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const paymentStatus = row.getValue(columnId) as string
      const displayStatus = paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)
      return (
        displayStatus.toLowerCase().includes(filterValue.toLowerCase()) ||
        paymentStatus.toLowerCase().includes(filterValue.toLowerCase())
      )
    },
  },
  {
    accessorKey: 'paid_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Paid At
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('paid_at') as string | null
      if (!date) return <div className="text-base font-medium">-</div>

      const dateObj = new Date(date)
      return (
        <div className="space-y-1">
          <div className="font-medium text-base">
            {dateObj
              .toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')}
          </div>
          <div className="text-gray-600 text-base">
            {dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Notes
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-base font-medium">{row.getValue('notes') || '-'}</div>,
  },
  {
    accessorKey: 'source',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Source
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-base font-medium">{row.getValue('source') || '-'}</div>,
  },
]
