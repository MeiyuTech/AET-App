import { Metadata } from 'next'
import StatusCheck from './status-check'

export const metadata: Metadata = {
  title: 'AET Service Application Status',
  description: 'AET Service Application Status',
}

export default async function StatusPage({
  searchParams,
}: {
  searchParams: { applicationId?: string }
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-6 pt-16">
        <h1 className="text-2xl font-bold">AET Service Application Status</h1>
        <StatusCheck initialApplicationId={searchParams.applicationId} />
      </div>
    </div>
  )
}
