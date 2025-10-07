import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import DegreeEquivalencyForm from '../../components/DegreeEquivalencyForm'
import DegreeEquivalencyHero from '../../components/DegreeEquivalencyHero'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('degreeEquivalencyApplication.metadata')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function DegreeEquivalencyFormPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-6 pt-2">
        <DegreeEquivalencyHero />
        {/* <h1 className="text-2xl font-bold">AET Degree Equivalency Application</h1> */}
        <DegreeEquivalencyForm />
      </div>
    </div>
  )
}
