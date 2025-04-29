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
    redirect(`/admin/login?redirect=${encodeURIComponent('/admin/CRM/order')}`)
  }
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Import</h1>
        <p className="text-muted-foreground mt-2">Import order data into the system quickly</p>
      </div>
      <OrderImportForm />
    </div>
  )
}
