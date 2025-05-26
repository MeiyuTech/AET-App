'use client'

import { useRef } from 'react'
import { flexRender } from '@tanstack/react-table'
import { cn } from '@/utilities/cn'

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

import { EducationDetailsDialog } from './EducationDetailsDialog'
import { ServicesDetailsDialog } from './ServicesDetailsDialog'
import {
  DueAmountConfirmDialog,
  StatusConfirmDialog,
  PaymentStatusConfirmDialog,
} from './ConfirmationDialogs'
import { getColumns } from './columns'
import { FilesDialog } from './FilesDialog'
import { PaymentLinkDialog } from './PaymentLinkDialog'
import { PaidAtConfirmDialog } from './PaidAtConfirmDialog'
import { TableScrollButtons } from './TableScrollButtons'
import { DueAmountSummary } from './DueAmountSummary'
import {
  useOfficeChange,
  useTableScroll,
  useDueAmountChange,
  useStatusChange,
  usePaymentStatusChange,
  usePaidAtChange,
  useTableConfig,
  useApplicationState,
} from './hooks'
import { exportTableToXlsx, exportTableToCsv } from './exportToXlsx'
import PaymentsTable from './PaymentsTable'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function ApplicationsTableMain(props) {
  const {
    // Data states
    applications,
    setApplications,
    loading,

    // Dialog states
    dialogOpen,
    setDialogOpen,
    servicesDialogOpen,
    setServicesDialogOpen,
    filesDialogOpen,
    setFilesDialogOpen,
    confirmDialogOpen,
    setConfirmDialogOpen,
    statusConfirmDialogOpen,
    setStatusConfirmDialogOpen,
    paymentStatusConfirmDialogOpen,
    setPaymentStatusConfirmDialogOpen,
    paymentLinkDialogOpen,
    setPaymentLinkDialogOpen,
    paidAtConfirmDialogOpen,
    setPaidAtConfirmDialogOpen,

    // Selection states
    selectedEducations,
    setSelectedEducations,
    selectedApplication,
    setSelectedApplication,
    selectedApplicationForPayment,
    setSelectedApplicationForPayment,

    // Pending change states
    pendingDueAmount,
    setPendingDueAmount,
    pendingStatusChange,
    setPendingStatusChange,
    pendingPaymentStatusChange,
    setPendingPaymentStatusChange,
    pendingPaidAtChange,
    setPendingPaidAtChange,
  } = useApplicationState(props.dataFilter)

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { handleScrollLeft, handleScrollRight } = useTableScroll(tableContainerRef)
  const { handleOfficeChange } = useOfficeChange(applications, setApplications)
  const { handleDueAmountChange } = useDueAmountChange(applications, setApplications)

  const { handleStatusChange, confirmStatusChange } = useStatusChange({
    applications,
    setApplications,
    setPendingStatusChange,
    setStatusConfirmDialogOpen,
    pendingStatusChange,
  })

  const { handlePaymentStatusChange, confirmPaymentStatusChange } = usePaymentStatusChange({
    applications,
    setApplications,
    setPendingPaymentStatusChange,
    setPaymentStatusConfirmDialogOpen,
    pendingPaymentStatusChange,
  })

  const { handlePaidAtChange, confirmPaidAtChange } = usePaidAtChange({
    applications,
    setApplications,
    setPendingPaidAtChange,
    setPaidAtConfirmDialogOpen,
    pendingPaidAtChange,
  })

  const handleCreatePaymentLink = (id: string, amount: number) => {
    setSelectedApplicationForPayment({ id, amount })
    setPaymentLinkDialogOpen(true)
  }

  const columnArgs = {
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
  }

  const { table, globalFilter, setGlobalFilter } = useTableConfig({
    applications,
    getColumns,
    columnArgs,
  })

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <Tabs defaultValue="applications" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      <TabsContent value="applications">
        <div className="space-y-4">
          {/* Due Amount Summary */}
          <DueAmountSummary applications={applications} />

          {/* Search bar */}
          <div className="flex items-center py-4 gap-2">
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm text-base"
            />
            <Button
              variant="outline"
              size="lg"
              className="text-base px-6"
              onClick={() => {
                // get all visible columns (excluding index, action column, etc.)
                const visibleColumns = table
                  .getAllLeafColumns()
                  .filter(
                    (col) =>
                      col.getIsVisible() &&
                      col.id !== 'index' &&
                      'accessorKey' in col.columnDef &&
                      col.columnDef.accessorKey
                  )
                  .map((col) => ({
                    accessorKey: (col.columnDef as any).accessorKey as string,
                    header:
                      typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id,
                  }))
                // get all rows' original data
                const rows = table.getRowModel().rows.map((row) => row.original)
                exportTableToXlsx({ data: rows, columns: visibleColumns })
              }}
            >
              Export to Excel
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-6"
              onClick={() => {
                // get all visible columns (excluding index, action column, etc.)
                const visibleColumns = table
                  .getAllLeafColumns()
                  .filter(
                    (col) =>
                      col.getIsVisible() &&
                      col.id !== 'index' &&
                      'accessorKey' in col.columnDef &&
                      col.columnDef.accessorKey
                  )
                  .map((col) => ({
                    accessorKey: (col.columnDef as any).accessorKey as string,
                    header:
                      typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id,
                  }))
                // get all rows' original data
                const rows = table.getRowModel().rows.map((row) => row.original)
                exportTableToCsv({ data: rows, columns: visibleColumns })
              }}
            >
              Export to CSV
            </Button>
          </div>

          {/* Table container */}
          <div className="relative">
            {/* Scroll buttons */}
            <TableScrollButtons onScrollLeft={handleScrollLeft} onScrollRight={handleScrollRight} />
            {/* Table */}
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
                        <TableRow
                          key={row.id}
                          className={cn(
                            'hover:bg-gray-50',
                            row.original.source === 'external' && 'bg-purple-50/50'
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="text-base py-4 px-2">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={table.getAllColumns().length}
                          className="h-24 text-center text-lg"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
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

          {/* Education details dialog */}
          <EducationDetailsDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            educations={selectedEducations}
          />
          {/* Services details dialog */}
          <ServicesDetailsDialog
            open={servicesDialogOpen}
            onOpenChange={setServicesDialogOpen}
            application={selectedApplication}
          />
          {/* Files dialog */}
          <FilesDialog
            open={filesDialogOpen}
            onOpenChange={setFilesDialogOpen}
            application={selectedApplication}
          />
          {/* Due Amount confirm dialog */}
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
          {/* Status confirm dialog */}
          <StatusConfirmDialog
            open={statusConfirmDialogOpen}
            onOpenChange={setStatusConfirmDialogOpen}
            pendingChange={pendingStatusChange}
            onConfirm={confirmStatusChange}
          />
          {/* Payment Status confirm dialog */}
          <PaymentStatusConfirmDialog
            open={paymentStatusConfirmDialogOpen}
            onOpenChange={setPaymentStatusConfirmDialogOpen}
            pendingChange={pendingPaymentStatusChange}
            onConfirm={confirmPaymentStatusChange}
          />
          {/* Paid At confirm dialog */}
          <PaidAtConfirmDialog
            open={paidAtConfirmDialogOpen}
            onOpenChange={setPaidAtConfirmDialogOpen}
            pendingChange={pendingPaidAtChange}
            onConfirm={confirmPaidAtChange}
          />
          {/* Payment Link dialog */}
          <PaymentLinkDialog
            open={paymentLinkDialogOpen}
            onOpenChange={setPaymentLinkDialogOpen}
            applicationId={selectedApplicationForPayment?.id || ''}
            defaultAmount={selectedApplicationForPayment?.amount || 0}
          />
        </div>
      </TabsContent>
      <TabsContent value="payments">
        <PaymentsTable />
      </TabsContent>
    </Tabs>
  )
}
