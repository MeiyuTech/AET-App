'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { getDegreeEquivalencyColumns } from './columns'

import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { EducationDetailsDialog } from '../ApplicationsTable/EducationDetailsDialog'
import { fetchAETCoreApplicationsList } from '@/app/(frontend)/(aet-app)/utils/actions'
import { DataTable } from '@/components/ui/data-table'
import { useAiOutputChange } from './hooks/useAiOutputChange'
import { AiOutputConfirmDialog } from './AiOutputConfirmDialog'

export default function DegreeEquivalencyTable() {
  const [data, setData] = useState<any[]>([])
  const [educationDialogOpen, setEducationDialogOpen] = useState(false)
  const [selectedEducations, setSelectedEducations] = useState<any[]>([])
  const [pendingAiOutputChange, setPendingAiOutputChange] = useState<{
    id: string
    educationId: string
    aiOutput: string
  } | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchAETCoreApplicationsList()
      if (!result.success || !result.applications) {
        setData([])
        return
      }
      setData(result.applications)
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
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

  const handleConfirmAiOutputChange = useCallback(async () => {
    await confirmAiOutputChange()
    // Refresh data after successful update
    await fetchData()
  }, [confirmAiOutputChange, fetchData])

  const columns = useMemo(
    () => getDegreeEquivalencyColumns(handleOpenEducationDialog, handleAiOutputChange),
    [handleOpenEducationDialog, handleAiOutputChange]
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
    </>
  )
}
