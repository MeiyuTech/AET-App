'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { getDegreeEquivalencyColumns } from './columns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { EducationDetailsDialog } from '../ApplicationsTable/EducationDetailsDialog'
import { fetchAETCoreApplicationsList } from '@/app/(frontend)/(aet-app)/utils/actions'

export default function DegreeEquivalencyTable() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [educationDialogOpen, setEducationDialogOpen] = useState(false)
  const [selectedEducations, setSelectedEducations] = useState<any[]>([])

  const handleOpenEducationDialog = useCallback((educations: any[]) => {
    setSelectedEducations(educations)
    setEducationDialogOpen(true)
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const result = await fetchAETCoreApplicationsList()
      // console.log('DegreeEquivalencyTable fetchData')
      // console.log('DegreeEquivalencyTable result', result)
      if (!result.success || !result.applications) {
        setData([])
      } else {
        setData(result.applications)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const columns = useMemo(
    () => getDegreeEquivalencyColumns(handleOpenEducationDialog),
    [handleOpenEducationDialog]
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) return <div className="p-4">Loading...</div>

  return (
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
      <EducationDetailsDialog
        open={educationDialogOpen}
        onOpenChange={setEducationDialogOpen}
        educations={selectedEducations}
      />
    </div>
  )
}
