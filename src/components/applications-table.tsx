'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EducationDetailsDialog } from '@/components/education-details-dialog'

interface Education {
  id: string
  country_of_study: string
  degree_obtained: string
  school_name: string
  study_start_date: { month: string; year: string }
  study_end_date: { month: string; year: string }
}

interface Application {
  id: string
  created_at: string
  submitted_at: string | null
  status: 'draft' | 'submitted' | 'processing' | 'completed' | 'cancelled'
  current_step: number

  // Client Information
  name: string
  email: string
  phone: string
  street_address?: string
  street_address2?: string
  city: string
  region: string
  country: string
  zip_code?: string
  purpose: 'immigration' | 'employment' | 'education' | 'other'
  purpose_other?: string

  // Evaluee Information
  pronouns: 'mr' | 'ms' | 'mx'
  first_name: string
  middle_name?: string
  last_name: string
  date_of_birth: string

  // Service Information
  service_type: {
    id: string
    name: string
    description?: string
    price: number
  }
  delivery_method: 'email' | 'mail' | 'both'

  // Related Records
  educations?: Education[]
}

function getStatusColor(status: string) {
  const colors = {
    draft: 'text-yellow-600',
    submitted: 'text-blue-600',
    processing: 'text-purple-600',
    completed: 'text-green-600',
    cancelled: 'text-red-600',
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}

export function ApplicationsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEducations, setSelectedEducations] = useState<Education[] | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  const columns: ColumnDef<Application>[] = [
    {
      id: 'index',
      header: '#',
      cell: ({ table, row }) => {
        const rows = table.getRowModel().rows
        const index = rows.findIndex((r) => r.id === row.id)
        return index + 1
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created At
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'))
        return date
          .toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
          .replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2')
      },
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        const id = row.getValue('id') as string
        return id
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Client Name
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'first_name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Evaluee Name
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const firstName = row.getValue('first_name') as string
        const middleName = row.original.middle_name
        const lastName = row.original.last_name
        return [firstName, middleName, lastName].filter(Boolean).join(' ')
      },
    },
    {
      accessorKey: 'pronouns',
      header: 'Pronouns',
      cell: ({ row }) => {
        const pronouns = row.getValue('pronouns') as string
        const pronounsMap = {
          mr: 'Mr.',
          ms: 'Ms.',
          mx: 'Mx.',
        }
        return pronounsMap[pronouns as keyof typeof pronounsMap] || pronouns
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string
        return phone || 'N/A'
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'date_of_birth',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Birth Date
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('date_of_birth'))
        return date.toISOString().split('T')[0]
      },
    },
    {
      accessorKey: 'country',
      header: 'Address',
      cell: ({ row }) => {
        const streetAddress = row.original.street_address
        const streetAddress2 = row.original.street_address2
        const city = row.original.city
        const region = row.original.region
        const zipCode = row.original.zip_code
        const country = row.getValue('country') as string

        const addressParts = [
          streetAddress,
          streetAddress2,
          [city, region, zipCode].filter(Boolean).join(' '),
          country,
        ]

        return addressParts.filter(Boolean).join(', ')
      },
    },
    {
      accessorKey: 'purpose',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Purpose
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const purpose = row.getValue('purpose') as string
        const purposeOther = row.original.purpose_other
        return purpose === 'other' ? purposeOther : purpose
      },
    },
    {
      accessorKey: 'educations',
      header: 'Education Count',
      cell: ({ row }) => row.original.educations?.length || 0,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className={`capitalize font-medium ${getStatusColor(row.getValue('status'))}`}>
          {row.getValue('status')}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEducations(row.original.educations)
              setDialogOpen(true)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
        )
      },
    },
  ]

  const fuzzyFilter = (row: any, columnId: string, value: string, addMeta: any) => {
    const itemValue = row.getValue(columnId)
    if (itemValue == null) return false

    const searchValue = value.toLowerCase()
    const itemString = String(itemValue).toLowerCase()

    return itemString.includes(searchValue)
  }

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
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
    },
  })

  useEffect(() => {
    async function fetchApplications() {
      try {
        const { data: applications, error: applicationsError } = await supabase
          .from('fce_applications')
          .select(
            `
            *,
            educations:fce_educations(*)
          `
          )
          .order('created_at', { ascending: false })

        if (applicationsError) throw applicationsError

        setApplications(applications || [])
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm text-lg"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-lg">
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
                    <TableCell key={cell.id} className="text-lg">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-lg">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <EducationDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        educations={selectedEducations}
      />
    </div>
  )
}
