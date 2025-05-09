import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { OrderImportForm } from '@/app/(frontend)/(aet-app)/components/OrderImportForm'

export const metadata: Metadata = {
  title: 'AET Order Import ｜ AET Admin',
  description: 'AET Service Application Order Import',
}

export default async function OrderImportPage() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    redirect(`/admin/login?redirect=${encodeURIComponent('/admin/CRM/import-order')}`)
  }
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Order Import</h1>
      <p className="text-lg text-muted-foreground"></p>
      <OrderImportForm />
    </div>
  )
}
