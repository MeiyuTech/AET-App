import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Application } from '../types'
import { useTableSearch } from './useTableSearch'

interface TableConfigProps {
  applications: Application[]
  getColumns: (...args: any[]) => any
  columnArgs: {
    handleOfficeChange: (id: string, office: string) => void
    handleStatusChange: (id: string, status: string) => void
    handlePaymentStatusChange: (id: string, status: string, paymentMethod: string) => void
    setPendingDueAmount: (data: { id: string; amount: number | null } | null) => void
    setConfirmDialogOpen: (open: boolean) => void
    setSelectedEducations: (educations: any[] | undefined) => void
    setDialogOpen: (open: boolean) => void
    setSelectedApplication: (application: Application | undefined) => void
    setServicesDialogOpen: (open: boolean) => void
    createPaymentLink: (id: string, amount: number) => void
    setFilesDialogOpen: (open: boolean) => void
    handlePaidAtChange: (id: string, paidAt: Date | null) => void
  }
}

/**
 * Hook for managing table configuration and state
 * Provides table instance and related state management
 */
export const useTableConfig = ({ applications, getColumns, columnArgs }: TableConfigProps) => {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'created_at',
      desc: true,
    },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Get search functions
  const { fuzzyFilter, globalFilterFunction } = useTableSearch()

  // Create table instance
  const table = useReactTable({
    data: applications,
    columns: getColumns(columnArgs),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: globalFilterFunction,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
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

  return {
    table,
    globalFilter,
    setGlobalFilter,
  }
}
