'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('homepage')

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-8 px-4 md:px-6 pt-16">
        <h1 className="text-3xl font-bold text-center">{t('title')}</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Credential Evaluation Application Form Card */}
          <Link
            href="/credential-evaluation-application"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">{t('credentialEvaluation.title')}</h2>
            <p className="text-gray-600">{t('credentialEvaluation.description')}</p>
          </Link>

          {/* Degree Equivalency Application Form Card */}
          <Link
            href="/degree-equivalency-tool"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">{t('degreeEquivalency.title')}</h2>
            <p className="text-gray-600">{t('degreeEquivalency.description')}</p>
          </Link>

          {/* AI Assistant Card */}
          {/* <Link
            href="/chat"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">{t('aiAssistant.title')}</h2>
            <p className="text-gray-600">{t('aiAssistant.description')}</p>
          </Link> */}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Application Status Card */}
          <Link
            href="/status"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">{t('checkStatus.title')}</h2>
            <p className="text-gray-600">{t('checkStatus.description')}</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
