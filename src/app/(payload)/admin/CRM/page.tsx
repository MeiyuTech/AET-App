'use client'

import { ApplicationsTable } from '@/components/applications-table'

export default function CRMPage() {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">FCE Applications</h1>
      <ApplicationsTable />
    </div>
  )
}
