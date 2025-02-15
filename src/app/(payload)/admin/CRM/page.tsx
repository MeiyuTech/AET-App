import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayload } from 'payload'
import config from '@payload-config'

import { ApplicationsTable } from '@/app/(frontend)/(aet-app)/components/applications-table'

export default async function CRMPage() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    redirect(`/admin/login?redirect=${encodeURIComponent('/admin/CRM')}`)
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">AET Services Applications</h1>
      <ApplicationsTable />
    </div>
  )
}
