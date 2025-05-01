import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import GPACalculator from '@/components/gpa/GPACalculator'

export const metadata: Metadata = {
  title: 'GPA Calculator ｜ AET CRM ｜ AET Admin',
  description: 'GPA Calculator for academic transcripts',
}

export default async function GPACalculatorPage() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    redirect(`/admin/login?redirect=${encodeURIComponent('/admin/CRM/gpa-calculator')}`)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">GPA Calculator</h1>
      <GPACalculator />
    </div>
  )
}
