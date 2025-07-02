'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { getDegreeEquivalencyColumns } from './columns'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import { EducationDetailsDialog } from '../ApplicationsTable/EducationDetailsDialog'
import { DegreeEquivalencyFilesDialog } from './DegreeEquivalencyFilesDialog'
import { fetchAETCoreApplicationsList } from '@/app/(frontend)/(aet-app)/utils/actions'
import { useAiOutputChange } from './hooks/useAiOutputChange'
import { AiOutputConfirmDialog } from './AiOutputConfirmDialog'
import { useStatusChange } from './hooks/useStatusChange'
import { StatusConfirmDialog } from './StatusConfirmDialog'
import { DatabaseCoreApplication } from '../DegreeEquivalencyForm/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { flexRender } from '@tanstack/react-table'

export default function DegreeEquivalencyTable() {
  const [data, setData] = useState<DatabaseCoreApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [educationDialogOpen, setEducationDialogOpen] = useState(false)
  const [selectedEducations, setSelectedEducations] = useState<any[]>([])
  const [filesDialogOpen, setFilesDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<
    DatabaseCoreApplication | undefined
  >(undefined)
  const [pendingAiOutputChange, setPendingAiOutputChange] = useState<{
    id: string
    educationId: string
    aiOutput: string
  } | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: string
    status: string
    currentStatus: string
  } | null>(null)
  const [statusConfirmDialogOpen, setStatusConfirmDialogOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'created_at',
      desc: true,
    },
  ])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchAETCoreApplicationsList()
      if (!result.success || !result.applications) {
        setError(result.error || 'Failed to fetch applications')
        setData([])
      } else {
        setData(result.applications)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch applications')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleOpenEducationDialog = useCallback((educations: any[]) => {
    setSelectedEducations(educations)
    setEducationDialogOpen(true)
  }, [])

  const { handleAiOutputChange, confirmAiOutputChange } = useAiOutputChange({
    setPendingAiOutputChange,
    setConfirmDialogOpen,
    pendingAiOutputChange,
  })

  const { handleStatusChange, confirmStatusChange } = useStatusChange({
    applications: data,
    setApplications: setData,
    setPendingStatusChange,
    setStatusConfirmDialogOpen,
    pendingStatusChange,
  })

  const handleConfirmAiOutputChange = useCallback(async () => {
    await confirmAiOutputChange()
    // Refresh data after successful update
    await fetchData()
  }, [confirmAiOutputChange, fetchData])

  const handleConfirmStatusChange = useCallback(async () => {
    await confirmStatusChange()
    // Refresh data after successful update
    await fetchData()
  }, [confirmStatusChange, fetchData])

  const columns = useMemo(
    () =>
      getDegreeEquivalencyColumns(
        handleOpenEducationDialog,
        handleAiOutputChange,
        handleStatusChange,
        setSelectedApplication,
        setFilesDialogOpen
      ),
    [handleOpenEducationDialog, handleAiOutputChange, handleStatusChange]
  )

  const table = useReactTable({
    data,
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

  if (loading) {
    return <div className="p-4">Loading Degree Equivalency Applications...</div>
  }
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <>
      <div className="p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-base font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
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
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
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

      <EducationDetailsDialog
        open={educationDialogOpen}
        onOpenChange={setEducationDialogOpen}
        educations={selectedEducations}
      />
      <DegreeEquivalencyFilesDialog
        open={filesDialogOpen}
        onOpenChange={setFilesDialogOpen}
        application={selectedApplication}
      />
      <AiOutputConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmAiOutputChange}
        pendingChange={pendingAiOutputChange}
      />
      <StatusConfirmDialog
        open={statusConfirmDialogOpen}
        onOpenChange={setStatusConfirmDialogOpen}
        onConfirm={handleConfirmStatusChange}
        pendingChange={pendingStatusChange}
      />
    </>
  )
}
