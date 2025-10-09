'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import countryList from 'react-select-country-list'
import { useTranslations } from 'next-intl'
import { DegreeEquivalencyAI } from './degree-equivalency-ai'
import { DegreeEquivalencyPaymentOverlay } from './degree-equivalency-payment-overlay'

function getCountryName(code: string) {
  const countries = countryList().getData()
  return countries.find((c) => c.value === code)?.label || code
}

interface DegreeEquivalencyTableProps {
  application: any
  education: any
  isPaid: boolean
}

export function DegreeEquivalencyTable({
  application,
  education,
  isPaid,
}: DegreeEquivalencyTableProps) {
  const t = useTranslations('degreeEquivalencySuccess.table')

  const hasStudyDates = education.study_start_date && education.study_end_date
  const studyStart = hasStudyDates
    ? `${education.study_start_date.year}-${education.study_start_date.month}`
    : ''
  const studyEnd = hasStudyDates
    ? `${education.study_end_date.year}-${education.study_end_date.month}`
    : ''
  const studyDurationValue = hasStudyDates
    ? t('durationRange', { start: studyStart, end: studyEnd })
    : education.duration || t('notProvided')

  if (!application || !education) {
    return null
  }

  return (
    <div className="w-full max-w-3xl mb-6">
      <Card>
        <CardHeader className="bg-blue-900 text-white rounded-t-md">
          <CardTitle className="text-lg font-bold">{t('credentialTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                  {t('countryOfStudy')}
                </td>
                <td className="py-2 px-4">{getCountryName(education.country_of_study)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium bg-gray-50">{t('degreeName')}</td>
                <td className="py-2 px-4">{education.degree_obtained}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium bg-gray-50">{t('institutionName')}</td>
                <td className="py-2 px-4">{education.school_name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium bg-gray-50">{t('studyDuration')}</td>
                <td className="py-2 px-4">
                  {studyDurationValue}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium bg-gray-50">{t('equivalencyInUS')}</td>
                <td className="py-2 px-4 font-semibold text-blue-900 bg-blue-50">
                  <div className="relative">
                    {!isPaid && <DegreeEquivalencyPaymentOverlay applicationId={application.id} />}
                    <DegreeEquivalencyAI education={education} ocrText="" showResult={false} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
