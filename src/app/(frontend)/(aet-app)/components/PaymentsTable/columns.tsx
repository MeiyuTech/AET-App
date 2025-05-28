import { ChevronDown } from 'lucide-react'
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
    id: 'index',
    header: () => <div className="text-center">#</div>,
    cell: ({ table, row }) => {
      const rows = table.getRowModel().rows
      const index = rows.findIndex((r) => r.id === row.id)
      return index + 1
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
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => row.getValue('payment_id') || 'N/A',
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
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => row.getValue('application_id') || 'N/A',
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
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue('due_amount') as number
      return amount ? `$${amount.toFixed(2)}` : 'N/A'
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
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue('payment_status') as string
      return <Badge variant={statusColor(status)}>{status}</Badge>
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
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('paid_at') as string | null
      if (!date) return '-'

      const dateObj = new Date(date)
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {dateObj
              .toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')}
          </div>
          <div className="text-gray-600">
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
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => row.getValue('notes') || '-',
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
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => row.getValue('source') || '-',
  },
]
