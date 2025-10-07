'use client'

import countryList from 'react-select-country-list'
import { useTranslations } from 'next-intl'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CoreApplicationData } from '../DegreeEquivalencyForm/types'
import { getCountryLabel } from '../DegreeEquivalencyForm/constants'

function getCountryName(code: string) {
  const countries = countryList().getData()
  return countries.find((c) => c.value === code)?.label || code
}

interface DegreeEquivalencyInfoCardProps {
  application: CoreApplicationData
}

export default function DegreeEquivalencyInfoCard({ application }: DegreeEquivalencyInfoCardProps) {
  const t = useTranslations('degreeEquivalencyForm.infoCard')
  const tCommon = useTranslations('common')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('clientSectionTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-medium">{t('fields.firstName')}</dt>
            <dd className="text-muted-foreground">
              {application.firstName || tCommon('notProvided')}
            </dd>
          </div>
          <div>
            <dt className="font-medium">{t('fields.middleName')}</dt>
            <dd className="text-muted-foreground">
              {application.middleName || tCommon('notProvided')}
            </dd>
          </div>
          <div>
            <dt className="font-medium">{t('fields.lastName')}</dt>
            <dd className="text-muted-foreground">
              {application.lastName || tCommon('notProvided')}
            </dd>
          </div>

          {/* Current Country */}
          <div>
            <dt className="font-medium">{t('fields.country')}</dt>
            <dd className="text-muted-foreground">
              {application.country ? getCountryLabel(application.country) : ''}
            </dd>
          </div>

          {/* Street Address */}
          {/* <div>
            <dt className="font-medium">Street Address</dt>
            <dd className="text-muted-foreground">
              {application.streetAddress}
              {application.streetAddress2 && <br />}
              {application.streetAddress2}
            </dd>
          </div> */}

          {/* Address */}
          {/* <div>
            <dt className="font-medium">Address</dt>
            <dd className="text-muted-foreground">
              {application.city ? `${application.city}, ` : ''}
              {application.region || ''} {application.zipCode || ''}
            </dd>
          </div> */}

          {/* Phone */}
          {/* <div>
            <dt className="font-medium">Phone</dt>
            <dd className="text-muted-foreground">{application.phone}</dd>
          </div> */}

          {/* Fax */}
          {/* <div>
            <dt className="font-medium">Fax</dt>
            <dd className="text-muted-foreground">{application.fax || 'Not Provided'}</dd>
          </div> */}

          {/* Email */}
          <div>
            <dt className="font-medium">{t('fields.email')}</dt>
            <dd className="text-muted-foreground">{application.email}</dd>
          </div>

          {/* Purpose */}
          {/* <div>
            <dt className="font-medium">Purpose</dt>
            <dd className="text-muted-foreground">
              {PURPOSE_OPTIONS.find((o) => o.value === application.purpose)?.label}
              {application.purpose === 'other' && application.purposeOther && (
                <span> - {application.purposeOther}</span>
              )}
            </dd>
          </div> */}
          {/* Education Information */}
          <div className="col-span-2">
            <dt className="font-medium mb-2">{t('educationSectionTitle')}</dt>
            <dd className="space-y-4">
              {application.educations?.length ? (
                application.educations.map((education, index) => (
                  <div key={index} className="pl-4 border-l-2 border-muted">
                    <h4 className="font-medium text-sm mb-2">
                      {t('education.degreeTitle', { index: index + 1 })}
                    </h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">{t('education.fields.country')}</dt>
                        <dd>
                          {getCountryName(education.countryOfStudy) || tCommon('notProvided')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{t('education.fields.degree')}</dt>
                        <dd>{education.degreeObtained || tCommon('notProvided')}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{t('education.fields.school')}</dt>
                        <dd>{education.schoolName || tCommon('notProvided')}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t('education.fields.studyPeriod')}
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
                <div className="text-muted-foreground">{t('education.empty')}</div>
              )}
            </dd>
          </div>
        </dl>
        {/* Service Notes */}
        {/* <div className="mt-4">
          <dt className="font-medium">Service Notes</dt>
          <dd className="text-muted-foreground">{application.purposeOther}</dd>
        </div> */}
      </CardContent>
    </Card>
  )
}
