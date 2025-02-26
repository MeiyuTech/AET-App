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
import { ChevronDown, Eye, Edit } from 'lucide-react'

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
import {
  DatabaseApplication,
  DatabaseEducation,
} from '@/app/(frontend)/(aet-app)/components/ApplicationForm/types'
import { EducationDetailsDialog } from './education-details-dialog'
import { formatDateTime } from '../utils/dateFormat'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Extend DatabaseApplication but override/add specific fields needed for the table
interface Application extends Omit<DatabaseApplication, 'service_type' | 'educations'> {
  // Override service_type to match the structure we're getting from the database
  service_type: {
    id: string
    name: string
    description?: string
    price: number
  }

  // Override educations to use DatabaseEducation type
  educations?: DatabaseEducation[]
  payment_status: 'pending' | 'paid' | 'failed' | 'expired'
  payment_id: string | null
  paid_at: string | null
  due_amount: number | null
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

function getPaymentStatusColor(status: string) {
  const colors = {
    pending: 'text-yellow-600',
    paid: 'text-green-600',
    failed: 'text-red-600',
    expired: 'text-gray-600',
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}

export function ApplicationsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEducations, setSelectedEducations] = useState<DatabaseEducation[] | undefined>(
    undefined
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingDueAmount, setPendingDueAmount] = useState<{
    id: string
    amount: number | null
  } | null>(null)
  const supabase = createClientComponentClient()

  const handleOfficeChange = async (id: string, office: string | null) => {
    try {
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const status = application.status
      if (status !== 'submitted') {
        toast({
          title: 'Operation not allowed',
          description: 'Only applications with status "Submitted" can be updated.',
          variant: 'destructive',
        })
        return
      }

      const { error } = await supabase.from('fce_applications').update({ office }).eq('id', id)

      if (error) throw error

      // Update local state
      setApplications((apps) => apps.map((app) => (app.id === id ? { ...app, office } : app)))

      toast({
        title: 'Office updated',
        description: `Application office has been set to ${office || 'none'}.`,
      })
    } catch (error) {
      console.error('Error updating office:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the office. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDueAmountChange = async (id: string, due_amount: number | null) => {
    try {
      // 查找当前应用并检查状态
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const status = application.status
      if (status !== 'submitted') {
        toast({
          title: 'Operation not allowed',
          description: 'Only applications with status "Submitted" can be updated.',
          variant: 'destructive',
        })
        return
      }

      const { error } = await supabase.from('fce_applications').update({ due_amount }).eq('id', id)

      if (error) throw error

      // Update local state
      setApplications((apps) => apps.map((app) => (app.id === id ? { ...app, due_amount } : app)))

      toast({
        title: 'Due amount updated',
        description: `Application due amount has been set to ${due_amount !== null ? `$${due_amount.toFixed(2)}` : 'none'}.`,
      })
    } catch (error) {
      console.error('Error updating due amount:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the due amount. Please try again.',
        variant: 'destructive',
      })
    }
  }

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
      accessorKey: 'updated_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Updated At
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('updated_at'))
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
      accessorKey: 'office',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Office
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const office = row.getValue('office') as string | null
        const status = row.getValue('status') as string
        const isEditable = status === 'submitted' || status === 'processing'

        return (
          <div className="flex items-center">
            <span className="mr-2">{office || 'N/A'}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={!isEditable}>
                  <Edit className={`h-4 w-4 ${!isEditable ? 'opacity-50' : ''}`} />
                </Button>
              </DropdownMenuTrigger>
              {isEditable && (
                <DropdownMenuContent>
                  <DropdownMenuLabel>Set Office</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {['Boston', 'New York', 'Miami', 'San Francisco', 'Los Angeles'].map((city) => (
                    <DropdownMenuItem
                      key={city}
                      onClick={() => handleOfficeChange(row.original.id, city)}
                    >
                      {city}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleOfficeChange(row.original.id, null)}>
                    Clear
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        )
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
      header: 'Education Info',
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
          </Button>
        )
      },
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
      accessorKey: 'due_amount',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Due Amount
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const dueAmount = row.getValue('due_amount') as number | null
        const status = row.getValue('status') as string
        const isEditable = status === 'submitted' || status === 'processing'

        return (
          <div className="flex items-center">
            <span className="mr-2">{dueAmount !== null ? `$${dueAmount.toFixed(2)}` : 'N/A'}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={!isEditable}>
                  <Edit className={`h-4 w-4 ${!isEditable ? 'opacity-50' : ''}`} />
                </Button>
              </DropdownMenuTrigger>
              {isEditable && (
                <DropdownMenuContent>
                  <DropdownMenuLabel>Set Due Amount</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const form = e.target as HTMLFormElement
                        const input = form.elements.namedItem('amount') as HTMLInputElement
                        const amount = parseFloat(input.value)

                        if (!isNaN(amount) && amount >= 0) {
                          // 4 digits for the integer part and 2 digits for the decimal part
                          const limitedAmount = Math.min(9999.99, Math.round(amount * 100) / 100)

                          setPendingDueAmount({
                            id: row.original.id,
                            amount: limitedAmount,
                          })
                          setConfirmDialogOpen(true)
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <Input
                          name="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          max="9999.99"
                          defaultValue={dueAmount !== null ? dueAmount.toString() : ''}
                          placeholder="0.00"
                          className="w-28"
                        />
                        <Button type="submit" size="sm" className="ml-2">
                          Save
                        </Button>
                      </div>
                    </form>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setPendingDueAmount({
                        id: row.original.id,
                        amount: null,
                      })
                      setConfirmDialogOpen(true)
                    }}
                  >
                    Clear
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        )
      },
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Payment Status
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div
          className={`capitalize font-medium ${getPaymentStatusColor(row.getValue('payment_status'))}`}
        >
          {row.getValue('payment_status')}
        </div>
      ),
    },
    {
      accessorKey: 'paid_at',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Paid At
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const paidAt = row.getValue('paid_at')
        return formatDateTime(paidAt as string)
      },
    },
    {
      accessorKey: 'payment_id',
      header: 'Payment ID',
      cell: ({ row }) => row.getValue('payment_id') || 'N/A',
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
          className="max-w-sm text-base"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-base">
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
                    <TableCell key={cell.id} className="text-base">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-base">
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

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">Confirm Due Amount Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the due amount to
              {pendingDueAmount?.amount !== null
                ? ` $${pendingDueAmount?.amount.toFixed(2)}`
                : ' none'}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDueAmount) {
                  handleDueAmountChange(pendingDueAmount.id, pendingDueAmount.amount)
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
