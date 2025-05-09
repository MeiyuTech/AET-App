import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { PaymentLinkCreator } from '@/app/(frontend)/(aet-app)/components/Stripe/PaymentLinkCreator'

export const metadata: Metadata = {
  title: 'AET Payment Link Generator ｜ AET Admin',
  description: 'AET Service Application Payment Link Generator',
}

export default async function PaymentLinkPage() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    redirect(`/admin/login?redirect=${encodeURIComponent('/admin/CRM/create-payment-link')}`)
  }
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Payment Link Generator</h1>
      <p className="text-lg text-muted-foreground"></p>
      <PaymentLinkCreator />
    </div>
  )
}
