import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import FCEApplicationForm from '../components/FCEApplicationForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('credentialEvaluationApplication.metadata')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function ApplyFCEPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-6 pt-16">
        <FCEApplicationForm />
      </div>
    </div>
  )
}
