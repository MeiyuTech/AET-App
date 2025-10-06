'use client'

import countryList from 'react-select-country-list'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'
import { PRONOUN_OPTIONS } from '../FCEApplicationForm/constants'
import { useTranslations } from 'next-intl'

function getCountryName(code: string) {
  const countries = countryList().getData()
  return countries.find((c) => c.value === code)?.label || code
}

interface EvalueeInfoCardProps {
  application: ApplicationData
}

export default function EvalueeInfoCard({ application }: EvalueeInfoCardProps) {
  const t = useTranslations('status')
  const tCommon = useTranslations('common')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('evalueeInfo.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          {/* Basic Information */}
          <div>
            <dt className="font-medium">{t('evalueeInfo.firstName')}</dt>
            <dd className="text-muted-foreground">
              {application.firstName || tCommon('notProvided')}
            </dd>
          </div>
          <div>
            <dt className="font-medium">{t('evalueeInfo.middleName')}</dt>
            <dd className="text-muted-foreground">
              {application.middleName || tCommon('notProvided')}
            </dd>
          </div>
          <div>
            <dt className="font-medium">{t('evalueeInfo.lastName')}</dt>
            <dd className="text-muted-foreground">
              {application.lastName || tCommon('notProvided')}
            </dd>
          </div>
          <div>
            <dt className="font-medium">{t('evalueeInfo.dateOfBirth')}</dt>
            <dd className="text-muted-foreground">
              {application.dateOfBirth
                ? `${application.dateOfBirth.month}/${application.dateOfBirth.date}/${application.dateOfBirth.year}`
                : tCommon('notProvided')}
            </dd>
          </div>

          <div>
            <dt className="font-medium">{t('evalueeInfo.pronouns')}</dt>
            <dd className="text-muted-foreground">
              {PRONOUN_OPTIONS.find((o) => o.value === application.pronouns)?.label ||
                tCommon('notProvided')}
            </dd>
          </div>

          {/* Education Information */}
          <div className="col-span-2">
            <dt className="font-medium mb-2">{t('evalueeInfo.education.title')}</dt>
            <dd className="space-y-4">
              {application.educations?.length ? (
                application.educations.map((education, index) => (
                  <div key={index} className="pl-4 border-l-2 border-muted">
                    <h4 className="font-medium text-sm mb-2">
                      {t('evalueeInfo.education.degree', { index: index + 1 })}
                    </h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">{t('evalueeInfo.education.country')}</dt>
                        <dd>{getCountryName(education.countryOfStudy) || tCommon('notProvided')}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t('evalueeInfo.education.degreeLabel')}
                        </dt>
                        <dd>{education.degreeObtained || tCommon('notProvided')}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{t('evalueeInfo.education.school')}</dt>
                        <dd>{education.schoolName || tCommon('notProvided')}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t('evalueeInfo.education.studyPeriod')}
                        </dt>
                        <dd>
                          {education.studyDuration
                            ? `${education.studyDuration.startDate.month}/${education.studyDuration.startDate.year} - 
                               ${education.studyDuration.endDate.month}/${education.studyDuration.endDate.year}`
                            : tCommon('notProvided')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">
                  {t('evalueeInfo.education.empty')}
                </div>
              )}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
