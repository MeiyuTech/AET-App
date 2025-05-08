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
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Payment Link Generator</h1>
      <p className="text-muted-foreground mb-8">
        Create a payment link to share with your customers. They can use this link to make a
        payment.
      </p>

      <PaymentLinkCreator />
    </div>
  )
}
