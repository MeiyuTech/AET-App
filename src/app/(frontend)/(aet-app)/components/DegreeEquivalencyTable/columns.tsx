import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

export const getDegreeEquivalencyColumns = (
  onEducationClick: (educations: any[]) => void
): ColumnDef<any>[] => [
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
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Created At
      </Button>
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue('created_at') as string | undefined
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      const formattedDate = date
        .toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      return (
        <div className="space-y-1">
          <div className="font-medium">{formattedDate}</div>
          <div className="text-gray-600">{formattedTime}</div>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
  //     >
  //       ID
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const id = row.getValue('id') as string | undefined
  //     if (!id) return 'N/A'
  //     // Split UUID into three parts for better readability
  //     const parts = id.split('-')
  //     const firstPart = parts.slice(0, 2).join('-') + '-'
  //     const secondPart = parts.slice(2, 4).join('-') + '-'
  //     const thirdPart = parts[4]
  //     return (
  //       <div className="text-sm block w-[140px]">
  //         <div>{firstPart}</div>
  //         <div>{secondPart}</div>
  //         <div>{thirdPart}</div>
  //       </div>
  //     )
  //   },
  // },
  {
    id: 'evalueeName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Evaluee Name
      </Button>
    ),
    cell: ({ row }) => {
      const firstName = row.original.first_name || ''
      const middleName = row.original.middle_name || ''
      const lastName = row.original.last_name || ''
      return [firstName, middleName, lastName].filter(Boolean).join(' ')
    },
  },
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
  //     >
  //       Email
  //     </Button>
  //   ),
  //   cell: ({ row }) => (row.getValue('email') as string) || 'N/A',
  // },
  {
    id: 'educations',
    header: () => (
      <div className="text-lg font-semibold hover:bg-gray-100 w-full justify-center">
        Educations
      </div>
    ),
    cell: ({ row }: any) => (
      <Button
        variant="ghost"
        size="default"
        onClick={() => onEducationClick(row.original.educations)}
        disabled={!row.original.educations || row.original.educations.length === 0}
      >
        <Eye className="h-5 w-5" />
      </Button>
    ),
  },
  {
    accessorKey: 'purpose',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Purpose
      </Button>
    ),
    cell: ({ row }) => (row.getValue('purpose') as string) || 'N/A',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Status
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string | undefined
      return <span className="capitalize">{status || 'N/A'}</span>
    },
  },
  {
    accessorKey: 'due_amount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Due Amount
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue('due_amount')
      return amount !== null && amount !== undefined ? `$${Number(amount).toFixed(2)}` : 'N/A'
    },
  },
  {
    accessorKey: 'payment_status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Payment Status
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('payment_status') as string | undefined
      return <span className="capitalize">{status || 'N/A'}</span>
    },
  },
  {
    accessorKey: 'paid_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Paid At
      </Button>
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue('paid_at') as string | undefined
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      const formattedDate = date
        .toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      return (
        <div className="space-y-1">
          <div className="font-medium">{formattedDate}</div>
          <div className="text-gray-600">{formattedTime}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'payment_id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Payment ID
      </Button>
    ),
    cell: ({ row }) => {
      const paymentId = row.getValue('payment_id') as string | undefined
      return paymentId ? (
        <Link
          href={`https://dashboard.stripe.com/payments/${paymentId}`}
          target="_blank"
          className="text-blue-500 underline"
        >
          {paymentId}
        </Link>
      ) : (
        'N/A'
      )
    },
  },
  {
    accessorKey: 'source',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Source
      </Button>
    ),
    cell: ({ row }) => {
      const source = row.getValue('source') as string | undefined
      return <span className="capitalize">{source || 'N/A'}</span>
    },
  },
]
