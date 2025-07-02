'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import { columns } from './columns'
import { Payment } from './types'
import { useEffect, useState } from 'react'
import { fetchPaymentsList } from '@/app/(frontend)/(aet-app)/utils/actions'
import { Button } from '@/components/ui/button'

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'created_at',
      desc: true,
    },
  ])

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 100,
      },
      sorting: [
        {
          id: 'created_at',
          desc: true,
        },
      ],
    },
  })

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
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-4 py-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-base px-6"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-base px-6"
        >
          Next
        </Button>
      </div>
    </>
  )
}
