'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { toast } from '@/hooks/use-toast'

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
import { DatabaseEducation } from '../FCEApplicationForm/types'
import { Application } from './types'

import { EducationDetailsDialog } from './EducationDetailsDialog'
import { ServicesDetailsDialog } from './ServicesDetailsDialog'
import {
  DueAmountConfirmDialog,
  StatusConfirmDialog,
  PaymentStatusConfirmDialog,
} from './ConfirmationDialogs'
import { createClient } from '../../utils/supabase/client'
import { getColumns } from './columns'
import { FilesDialog } from './FilesDialog'
import { PaymentLinkDialog } from './PaymentLinkDialog'
import { PaidAtConfirmDialog } from './PaidAtConfirmDialog'

export function ApplicationsTable({ dataFilter }: { dataFilter: string }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEducations, setSelectedEducations] = useState<DatabaseEducation[] | undefined>(
    undefined
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [servicesDialogOpen, setServicesDialogOpen] = useState(false)
  const [filesDialogOpen, setFilesDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | undefined>(undefined)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingDueAmount, setPendingDueAmount] = useState<{
    id: string
    amount: number | null
  } | null>(null)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: string
    status: string
    currentStatus: string
  } | null>(null)
  const [statusConfirmDialogOpen, setStatusConfirmDialogOpen] = useState(false)
  const [pendingPaymentStatusChange, setPendingPaymentStatusChange] = useState<{
    id: string
    status: string
    currentStatus: string
    paymentMethod: string
  } | null>(null)
  const [paymentStatusConfirmDialogOpen, setPaymentStatusConfirmDialogOpen] = useState(false)
  const [paymentLinkDialogOpen, setPaymentLinkDialogOpen] = useState<boolean>(false)
  const [selectedApplicationForPayment, setSelectedApplicationForPayment] = useState<{
    id: string
    amount: number
  } | null>(null)
  const [pendingPaidAtChange, setPendingPaidAtChange] = useState<{
    id: string
    paidAt: Date | null
  } | null>(null)
  const [paidAtConfirmDialogOpen, setPaidAtConfirmDialogOpen] = useState(false)

  const supabase = createClient()

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const handleScrollLeft = () => {
    if (tableContainerRef.current) {
      const container = tableContainerRef.current
      const scrollDistance = container.clientWidth - 50

      const newScrollPosition = Math.max(0, container.scrollLeft - scrollDistance)
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      })
    }
  }

  const handleScrollRight = () => {
    if (tableContainerRef.current) {
      const container = tableContainerRef.current
      const scrollDistance = container.clientWidth - 50

      const maxScroll = container.scrollWidth - container.clientWidth
      const newScrollPosition = Math.min(maxScroll, container.scrollLeft + scrollDistance)
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      })
    }
  }

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
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                office: office as 'Boston' | 'New York' | 'San Francisco' | 'Los Angeles' | 'Miami',
              }
            : app
        )
      )

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const currentStatus = application.status
      const paymentStatus = application.payment_status

      // Validate status change based on the rules
      if (
        newStatus === 'completed' &&
        !(currentStatus === 'processing' && paymentStatus === 'paid')
      ) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with status "Processing" and payment status "Paid" can be completed.',
          variant: 'destructive',
        })
        return
      }

      if (
        newStatus === 'cancelled' &&
        !(
          (currentStatus === 'processing' && paymentStatus !== 'paid') ||
          currentStatus === 'submitted'
        )
      ) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with status "Submitted" or "Processing" (if not paid) can be cancelled.',
          variant: 'destructive',
        })
        return
      }

      // Allow changing from submitted to processing if payment status is paid
      if (
        newStatus === 'processing' &&
        !(currentStatus === 'submitted' && paymentStatus === 'paid')
      ) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with status "Submitted" and payment status "Paid" can be marked as processing.',
          variant: 'destructive',
        })
        return
      }

      // Open confirmation dialog
      setPendingStatusChange({
        id,
        status: newStatus,
        currentStatus,
      })
      setStatusConfirmDialogOpen(true)
    } catch (error) {
      console.error('Error preparing status change:', error)
      toast({
        title: 'Operation failed',
        description: 'Could not prepare the status change. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return

    try {
      const { id, status } = pendingStatusChange

      const { error } = await supabase.from('fce_applications').update({ status }).eq('id', id)

      if (error) throw error

      // Update local state
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                status: status as 'completed' | 'cancelled' | 'draft' | 'submitted' | 'processing',
              }
            : app
        )
      )

      toast({
        title: 'Status updated',
        description: `Application status has been changed to ${status}.`,
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the status. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setPendingStatusChange(null)
    }
  }

  const handlePaymentStatusChange = async (
    id: string,
    newStatus: string,
    paymentMethod: string
  ) => {
    try {
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const currentStatus = application.payment_status

      // Only allow changing from pending or expired to paid
      if (newStatus === 'paid' && !(currentStatus === 'pending' || currentStatus === 'expired')) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with payment status "Pending" or "Expired" can be marked as paid.',
          variant: 'destructive',
        })
        return
      }

      // Open confirmation dialog
      setPendingPaymentStatusChange({
        id,
        status: newStatus,
        currentStatus,
        paymentMethod,
      })
      setPaymentStatusConfirmDialogOpen(true)
    } catch (error) {
      console.error('Error preparing payment status change:', error)
      toast({
        title: 'Operation failed',
        description: 'Could not prepare the payment status change. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const confirmPaymentStatusChange = async () => {
    if (!pendingPaymentStatusChange) return

    try {
      const { id, status, paymentMethod } = pendingPaymentStatusChange
      const paid_at = status === 'paid' ? new Date().toISOString() : null
      const payment_id =
        paymentMethod === 'zelle' ? 'Marked as Paid via Zelle' : 'Marked as Paid via Paypal'

      // Update both payment_status and paid_at
      const { error } = await supabase
        .from('fce_applications')
        .update({ payment_status: status, paid_at, payment_id })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                payment_status: status as 'pending' | 'paid' | 'failed' | 'expired',
                paid_at,
                payment_id,
              }
            : app
        )
      )

      toast({
        title: 'Payment status updated',
        description: `Payment status has been changed to ${status} via ${paymentMethod}.`,
      })
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the payment status. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setPendingPaymentStatusChange(null)
    }
  }

  const handleCreatePaymentLink = (id: string, amount: number) => {
    setSelectedApplicationForPayment({ id, amount })
    setPaymentLinkDialogOpen(true)
  }

  const handlePaidAtChange = async (id: string, paidAt: Date | null) => {
    try {
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const paymentStatus = application.payment_status
      if (paymentStatus !== 'pending' && paymentStatus !== 'expired') {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with payment status "Pending" or "Expired" can be modified.',
          variant: 'destructive',
        })
        return
      }

      // Open confirmation dialog
      setPendingPaidAtChange({
        id,
        paidAt,
      })
      setPaidAtConfirmDialogOpen(true)
    } catch (error) {
      console.error('Error preparing paid_at change:', error)
      toast({
        title: 'Operation failed',
        description: 'Could not prepare the paid_at change. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const confirmPaidAtChange = async () => {
    if (!pendingPaidAtChange) return

    try {
      const { id, paidAt } = pendingPaidAtChange
      const paid_at = paidAt ? paidAt.toISOString() : null

      // Update paid_at
      const { error } = await supabase.from('fce_applications').update({ paid_at }).eq('id', id)

      if (error) throw error

      // Update local state
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                paid_at,
              }
            : app
        )
      )

      toast({
        title: 'Payment date updated',
        description: `Payment date has been ${paidAt ? 'set' : 'cleared'}.`,
      })
    } catch (error) {
      console.error('Error updating payment date:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the payment date. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setPendingPaidAtChange(null)
      setPaidAtConfirmDialogOpen(false)
    }
  }

  const columns = getColumns({
    handleOfficeChange,
    handleStatusChange,
    handlePaymentStatusChange,
    setPendingDueAmount,
    setConfirmDialogOpen,
    setSelectedEducations,
    setDialogOpen,
    setSelectedApplication,
    setServicesDialogOpen,
    createPaymentLink: handleCreatePaymentLink,
    setFilesDialogOpen,
    handlePaidAtChange,
  })

  const fuzzyFilter = (row: any, columnId: string, value: string, addMeta: any) => {
    const itemValue = row.getValue(columnId)

    // 对于payment_id特殊处理
    if (itemValue == null) {
      if (columnId === 'payment_id') {
        return 'n/a'.includes(value.toLowerCase())
      }
      return false
    }

    // 对于first_name特殊处理，搜索全名
    if (columnId === 'first_name') {
      const firstName = (row.getValue('first_name') as string) || ''
      const middleName = row.original.middle_name || ''
      const lastName = row.original.last_name || ''
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').toLowerCase()
      return fullName.includes(value.toLowerCase())
    }

    const searchValue = value.toLowerCase()
    const itemString = String(itemValue).toLowerCase()

    return itemString.includes(searchValue)
  }

  const globalFilterFunction = (row: any, columnId: string, value: string) => {
    // 先检查是否匹配全名
    const firstName = row.original.first_name || ''
    const middleName = row.original.middle_name || ''
    const lastName = row.original.last_name || ''
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').toLowerCase()

    if (fullName.includes(value.toLowerCase())) {
      return true
    }

    // 检查日期格式 - created_at
    const createdAt = row.original.created_at
    if (createdAt) {
      const date = new Date(createdAt)
      const formattedDate = date
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')

      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      if (
        formattedDate.toLowerCase().includes(value.toLowerCase()) ||
        formattedTime.toLowerCase().includes(value.toLowerCase())
      ) {
        return true
      }
    }

    // 检查日期格式 - updated_at
    const updatedAt = row.original.updated_at
    if (updatedAt) {
      const date = new Date(updatedAt)
      const formattedDate = date
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')

      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      if (
        formattedDate.toLowerCase().includes(value.toLowerCase()) ||
        formattedTime.toLowerCase().includes(value.toLowerCase())
      ) {
        return true
      }
    }

    // 检查金额格式 - due_amount
    const dueAmount = row.original.due_amount as number | null
    if (dueAmount !== undefined) {
      // Format the due amount to the user's view: "$123.45" or "N/A"
      const formattedAmount = dueAmount !== null ? `$${dueAmount.toFixed(2)}` : 'N/A'

      if (formattedAmount.toLowerCase().includes(value.toLowerCase())) {
        return true
      }
    }

    // 如果不匹配特殊处理的字段，使用默认的模糊过滤
    return fuzzyFilter(row, columnId, value, null)
  }

  const table = useReactTable({
    data: applications,
    columns: getColumns({
      handleOfficeChange,
      handleStatusChange,
      handlePaymentStatusChange,
      setPendingDueAmount,
      setConfirmDialogOpen,
      setSelectedEducations,
      setDialogOpen,
      setSelectedApplication,
      setServicesDialogOpen,
      createPaymentLink: handleCreatePaymentLink,
      setFilesDialogOpen,
      handlePaidAtChange,
    }),
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
    },
  })

  useEffect(() => {
    async function fetchApplications(filter: string) {
      try {
        const { data: applications, error: applicationsError } = await supabase
          .from('fce_applications')
          .select(
            `
            *,
            educations:fce_educations(*)
          `
          )
          .or(filter)
          .order('created_at', { ascending: false })

        if (applicationsError) throw applicationsError
        setApplications(applications || [])
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        setLoading(false)
      }
    }

    // Verify if dataFilter is valid
    const isValidFilter = (filter: string) => {
      // Add more complex validation logic here
      return filter && /^[a-zA-Z0-9.,= ]*$/.test(filter) // Only allow letters, numbers, commas, equals, and spaces
    }

    if (isValidFilter(dataFilter)) {
      fetchApplications(dataFilter)
    } else {
      console.error('Invalid dataFilter:', dataFilter)
      // Handle invalid filter conditions, e.g. display a message or do not execute the query
      toast({
        title: 'Unauthorized User',
        description: 'Please login with an authorized user',
        variant: 'destructive',
      })
    }
  }, [dataFilter, supabase])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm text-base"
        />
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 h-12 flex items-center z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md bg-white/80 hover:bg-white"
            onClick={handleScrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-12 flex items-center z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md bg-white/80 hover:bg-white"
            onClick={handleScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div
          ref={tableContainerRef}
          className="rounded-md border overflow-x-auto scrollbar-hide w-full"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            overflowX: 'auto',
            position: 'relative',
          }}
        >
          <div style={{ minWidth: '2200px' }}>
            <Table className="text-base">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-lg font-semibold py-6 px-2">
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
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-base py-4 px-2">
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
        </div>
      </div>

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

      <EducationDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        educations={selectedEducations}
      />
      <ServicesDetailsDialog
        open={servicesDialogOpen}
        onOpenChange={setServicesDialogOpen}
        application={selectedApplication}
      />
      <FilesDialog
        open={filesDialogOpen}
        onOpenChange={setFilesDialogOpen}
        application={selectedApplication}
      />
      <DueAmountConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        pendingDueAmount={pendingDueAmount}
        onConfirm={async () => {
          if (pendingDueAmount) {
            await handleDueAmountChange(pendingDueAmount.id, pendingDueAmount.amount)
            setPendingDueAmount(null)
          }
        }}
      />
      <StatusConfirmDialog
        open={statusConfirmDialogOpen}
        onOpenChange={setStatusConfirmDialogOpen}
        pendingChange={pendingStatusChange}
        onConfirm={confirmStatusChange}
      />
      <PaymentStatusConfirmDialog
        open={paymentStatusConfirmDialogOpen}
        onOpenChange={setPaymentStatusConfirmDialogOpen}
        pendingChange={pendingPaymentStatusChange}
        onConfirm={confirmPaymentStatusChange}
      />
      <PaidAtConfirmDialog
        open={paidAtConfirmDialogOpen}
        onOpenChange={setPaidAtConfirmDialogOpen}
        pendingChange={pendingPaidAtChange}
        onConfirm={confirmPaidAtChange}
      />
      <PaymentLinkDialog
        open={paymentLinkDialogOpen}
        onOpenChange={setPaymentLinkDialogOpen}
        applicationId={selectedApplicationForPayment?.id || ''}
        defaultAmount={selectedApplicationForPayment?.amount || 0}
      />
    </div>
  )
}
