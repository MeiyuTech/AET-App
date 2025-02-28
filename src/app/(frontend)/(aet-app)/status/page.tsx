import { Metadata } from 'next'
import StatusCheck from './status-check'

export const metadata: Metadata = {
  title: 'AET Service Application Status',
  description: 'AET Service Application Status',
}

interface PageProps {
  searchParams: Promise<{
    applicationId?: string
  }>
}

export default async function StatusPage({ searchParams }: PageProps) {
  const { applicationId } = await searchParams

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-6 pt-16">
        <h1 className="text-2xl font-bold">AET Service Application Status</h1>
        <p className="text-sm text-gray-500">Check the status with your Application ID.</p>
        <StatusCheck initialApplicationId={applicationId} />
      </div>
    </div>
  )
}
