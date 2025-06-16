'use client'

import { useMemo } from 'react'
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

// mock data
const mockData = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: '2024-06-16T10:00:00Z',
    firstName: 'Alice',
    middleName: 'B.',
    lastName: 'Smith',
    email: 'alice@example.com',
    countryOfStudy: 'USA',
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
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    createdAt: '2024-06-15T09:00:00Z',
    firstName: 'Bob',
    middleName: '',
    lastName: 'Lee',
    email: 'bob@example.com',
    countryOfStudy: 'China',
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
  },
]

export default function DegreeEquivalencyTable() {
  const columns = useMemo(() => getDegreeEquivalencyColumns(), [])
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
    </div>
  )
}
