import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StatusCheck from '../components/StatusCheck'
import NextStepsCard from '../components/NextStepsCard'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('status.metadata')

  return {
    title: t('title'),
    description: t('description'),
  }
}

interface PageProps {
  searchParams: Promise<{
    applicationId?: string
  }>
}

export default async function StatusPage({ searchParams }: PageProps) {
  const { applicationId } = await searchParams
  const t = await getTranslations('status.page')

  return (
    <div className="container mx-auto py-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6 pt-16">
        {/* Left Instruction Section */}
        <div className="space-y-6">
          <NextStepsCard initialApplicationId={applicationId} />
        </div>

        {/* Right Status Check Section */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">{t('heading')}</h1>
          <p className="text-sm text-gray-500">{t('intro')}</p>
          <StatusCheck initialApplicationId={applicationId} />
        </div>
      </div>
    </div>
  )
}
