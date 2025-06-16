'use client'

import { useMemo, useState } from 'react'
import { getDegreeEquivalencyColumns } from './columns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { EducationDetailsDialog } from '../ApplicationsTable/EducationDetailsDialog'

// mock data
const mockData = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: '2024-06-16T10:00:00Z',
    firstName: 'Alice',
    middleName: 'B.',
    lastName: 'Smith',
    email: 'alice@example.com',
    countryOfStudy: 'US',
    schoolName: 'MIT',
    degreeObtained: 'Bachelor',
    studyStartDate: '2018-09-01',
    studyEndDate: '2022-06-01',
    purpose: 'education',
    status: 'completed',
    dueAmount: 200,
    paymentStatus: 'paid',
    paidAt: '2024-06-17T12:00:00Z',
    paymentId: 'pi_3Nw1e2eW8',
    source: 'internal',
    educations: [
      {
        id: 'edu1',
        school_name: 'MIT',
        country_of_study: 'US',
        degree_obtained: 'Bachelor',
        study_start_date: { month: 9, year: 2018 },
        study_end_date: { month: 6, year: 2022 },
      },
    ],
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    createdAt: '2024-06-15T09:00:00Z',
    firstName: 'Bob',
    middleName: '',
    lastName: 'Lee',
    email: 'bob@example.com',
    countryOfStudy: 'CN',
    schoolName: 'Tsinghua University',
    degreeObtained: 'Master',
    studyStartDate: '2016-09-01',
    studyEndDate: '2019-06-01',
    purpose: 'employment',
    status: 'processing',
    dueAmount: 300,
    paymentStatus: 'pending',
    paidAt: null,
    paymentId: null,
    source: 'external',
    educations: [
      {
        id: 'edu2',
        school_name: 'Tsinghua University',
        country_of_study: 'CN',
        degree_obtained: 'Master',
        study_start_date: { month: 9, year: 2016 },
        study_end_date: { month: 6, year: 2019 },
      },
    ],
  },
]

export default function DegreeEquivalencyTable() {
  const [educationDialogOpen, setEducationDialogOpen] = useState(false)
  const [selectedEducations, setSelectedEducations] = useState<any[]>([])

  const handleOpenEducationDialog = (educations: any[]) => {
    setSelectedEducations(educations)
    setEducationDialogOpen(true)
  }

  const columns = useMemo(() => getDegreeEquivalencyColumns(handleOpenEducationDialog), [])

  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
