'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import DegreeEquivalencyHero from '@/app/(frontend)/(aet-app)/components/DegreeEquivalencyHero'
import { DegreeEquivalencyTable } from '@/app/(frontend)/(aet-app)/components/DegreeEquivalencyForm/degree-equivalency-table'
import { DiplomaUploader } from '@/app/(frontend)/(aet-app)/components/Dropbox/DiplomaUploader'
import Viewer from '@/app/(frontend)/(aet-app)/components/Dropbox/Viewer'
import { Button } from '@/components/ui/button'

interface DegreeEquivalencySuccessContentProps {
  application: any
  education: any
  isPaid: boolean
}

const credentialApplicationUrl =
  'https://app.americantranslationservice.com/credential-evaluation-application'

export default function DegreeEquivalencySuccessContent({
  application,
  education,
  isPaid,
}: DegreeEquivalencySuccessContentProps) {
  const t = useTranslations('degreeEquivalencySuccess')
  const viewerFullName = [application.first_name, application.middle_name, application.last_name]
    .filter(Boolean)
    .join(' ')
  const uploaderFullName = [application.first_name, application.last_name].filter(Boolean).join(' ')

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2">
      <DegreeEquivalencyHero />

      <div className="w-full max-w-3xl space-y-6">
        {isPaid ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CheckCircle2 className="text-green-600 mr-2" size={28} />
              <h2 className="text-xl font-bold text-green-700">{t('paidCard.title')}</h2>
            </div>
            <p className="text-gray-700 mb-4">{t('paidCard.description')}</p>
            <ol className="list-decimal list-inside text-gray-700 pl-4 space-y-2">
              <li>
                <Link
                  href={credentialApplicationUrl}
                  className="text-green-700 underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('paidCard.steps.step1')}
                </Link>
              </li>
              <li>{t('paidCard.steps.step2')}</li>
              <li>{t('paidCard.steps.step3')}</li>
            </ol>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-green-700">{t('unpaidCard.title')}</h2>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold">{t('uploader.title')}</h2>
            <p className="text-gray-700 text-base mt-1">{t('uploader.description')}</p>
          </div>
          <Viewer
            office="Miami"
            applicationId={application.email}
            fullName={viewerFullName}
          />
          <DiplomaUploader
            office="Miami"
            email={application.email}
            fullName={uploaderFullName}
          />
        </div>

        <DegreeEquivalencyTable application={application} education={education} isPaid={isPaid} />

        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-700 text-sm">
          <span className="font-bold">{t('note.label')}: </span>
          {t('note.message')}
        </div>

        <div className="flex justify-end">
          <Link href="/degree-equivalency-tool" passHref>
            <Button variant="outline" className="text-base px-8 py-2">
              {t('actions.back')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
