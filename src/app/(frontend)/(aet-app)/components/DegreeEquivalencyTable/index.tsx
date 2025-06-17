'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { getDegreeEquivalencyColumns } from './columns'

import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { EducationDetailsDialog } from '../ApplicationsTable/EducationDetailsDialog'
import { fetchAETCoreApplicationsList } from '@/app/(frontend)/(aet-app)/utils/actions'
import { DataTable } from '@/components/ui/data-table'
import { useAiOutputChange } from './hooks/useAiOutputChange'
import { AiOutputConfirmDialog } from './AiOutputConfirmDialog'
import { useStatusChange } from './hooks/useStatusChange'
import { StatusConfirmDialog } from './StatusConfirmDialog'
import { DatabaseCoreApplication } from '../DegreeEquivalencyForm/types'

export default function DegreeEquivalencyTable() {
  const [data, setData] = useState<DatabaseCoreApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [educationDialogOpen, setEducationDialogOpen] = useState(false)
  const [selectedEducations, setSelectedEducations] = useState<any[]>([])
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
        handleStatusChange
      ),
    [handleOpenEducationDialog, handleAiOutputChange, handleStatusChange]
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return <div className="p-4">Loading Degree Equivalency Applications...</div>
  }
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <>
      <DataTable columns={columns} data={data} />
      <EducationDetailsDialog
        open={educationDialogOpen}
        onOpenChange={setEducationDialogOpen}
        educations={selectedEducations}
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
