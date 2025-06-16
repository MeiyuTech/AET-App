import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const getDegreeEquivalencyColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const raw = row.getValue('createdAt')
      const date = raw ? new Date(raw as string) : null
      return date ? (
        <div>
          {date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
          <br />
          <span className="text-gray-500 text-xs">
            {date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </span>
        </div>
      ) : (
        'N/A'
      )
    },
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string | undefined
      if (!id) return 'N/A'
      const parts = id.split('-')
      return (
        <div className="text-xs">
          <div>{parts.slice(0, 2).join('-')}</div>
          <div>{parts.slice(2, 4).join('-')}</div>
          <div>{parts[4]}</div>
        </div>
      )
    },
  },
  {
    id: 'evalueeName',
    header: 'Evaluee Name',
    cell: ({ row }) => {
      const firstName = row.original.firstName || ''
      const middleName = row.original.middleName || ''
      const lastName = row.original.lastName || ''
      return [firstName, middleName, lastName].filter(Boolean).join(' ')
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (row.getValue('email') as string) || 'N/A',
  },
  {
    accessorKey: 'purpose',
    header: 'Purpose',
    cell: ({ row }) => (row.getValue('purpose') as string) || 'N/A',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string | undefined
      return <span className="capitalize">{status || 'N/A'}</span>
    },
  },
  {
    accessorKey: 'dueAmount',
    header: 'Due Amount',
    cell: ({ row }) => {
      const amount = row.getValue('dueAmount')
      return amount !== null && amount !== undefined ? `$${Number(amount).toFixed(2)}` : 'N/A'
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const status = row.getValue('paymentStatus') as string | undefined
      return <span className="capitalize">{status || 'N/A'}</span>
    },
  },
  {
    accessorKey: 'paidAt',
    header: 'Paid At',
    cell: ({ row }) => {
      const raw = row.getValue('paidAt')
      if (!raw) return 'N/A'
      const date = new Date(raw as string)
      return !isNaN(date.getTime()) ? date.toLocaleString() : 'N/A'
    },
  },
  {
    accessorKey: 'paymentId',
    header: 'Payment ID',
    cell: ({ row }) => {
      const paymentId = row.getValue('paymentId') as string | undefined
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
    header: 'Source',
    cell: ({ row }) => {
      const source = row.getValue('source') as string | undefined
      return <span className="capitalize">{source || 'N/A'}</span>
    },
  },
]
