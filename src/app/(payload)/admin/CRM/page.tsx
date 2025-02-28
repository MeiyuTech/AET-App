import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayload } from 'payload'
import config from '@payload-config'

import { ApplicationsTable } from '@/app/(frontend)/(aet-app)/components/applications-table'

export const metadata: Metadata = {
  title: 'AET Service Application ｜ AET CRM',
  description: 'AET Service Application CRM',
}

export default async function CRMPage() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    redirect(`/admin/login?redirect=${encodeURIComponent('/admin/CRM')}`)
  }
  console.log('user:', user)

  let dataFilter = 'office.eq.utopia'
  switch (user.email) {
    case 'tech@meiyugroup.org':
      // Only show applications from Boston, New York, Miami, San Francisco, Los Angeles, and null
      dataFilter =
        'office.eq.Boston,office.eq.New York,office.eq.Miami,office.eq.San Francisco,office.eq.Los Angeles,office.is.null'
      break
    case 'edzhaotalk@hotmail.com':
      // Only show applications from Boston, New York, and null
      dataFilter = 'office.eq.Boston,office.eq.New York,office.is.null'
      break
    case 'ca@aet21.com':
      // Only show applications from Miami, San Francisco, Los Angeles, and null
      dataFilter = 'office.eq.Miami,office.eq.San Francisco,office.eq.Los Angeles,office.is.null'
      break
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">AET Services Applications</h1>
      <h2 className="text-2xl mb-4">
        Welcome <span className="font-bold">{user.email}</span>
      </h2>
      <ApplicationsTable dataFilter={dataFilter} />
    </div>
  )
}
