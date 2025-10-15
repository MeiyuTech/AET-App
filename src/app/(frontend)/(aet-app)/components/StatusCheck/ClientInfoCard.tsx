'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'
import { PURPOSE_OPTIONS, getCountryLabel } from '../FCEApplicationForm/constants'
import { useTranslations } from 'next-intl'

interface ClientInfoCardProps {
  application: ApplicationData
}

export default function ClientInfoCard({ application }: ClientInfoCardProps) {
  const t = useTranslations('status')
  const tCommon = useTranslations('common')
  const tFce = useTranslations('credentialEvaluationForm.clientInfo')

  const resolvedPurpose =
    application.purpose && PURPOSE_OPTIONS.find((o) => o.value === application.purpose)
      ? tFce(`purpose.options.${application.purpose}`)
      : ''

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('clientInfo.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          {/* Company/Individual Name */}
          <div>
            <dt className="font-medium">{t('clientInfo.companyName')}</dt>
            <dd className="text-muted-foreground">{application.name}</dd>
          </div>

          {/* Country */}
          <div>
            <dt className="font-medium">{t('clientInfo.country')}</dt>
            <dd className="text-muted-foreground">
              {application.country ? getCountryLabel(application.country) : ''}
            </dd>
          </div>

          {/* Street Address */}
          <div>
            <dt className="font-medium">{t('clientInfo.streetAddress')}</dt>
            <dd className="text-muted-foreground">
              {application.streetAddress}
              {application.streetAddress2 && <br />}
              {application.streetAddress2}
            </dd>
          </div>

          {/* Address */}
          <div>
            <dt className="font-medium">{t('clientInfo.address')}</dt>
            <dd className="text-muted-foreground">
              {application.city ? `${application.city}, ` : ''}
              {application.region || ''} {application.zipCode || ''}
            </dd>
          </div>

          {/* Phone */}
          <div>
            <dt className="font-medium">{t('clientInfo.phone')}</dt>
            <dd className="text-muted-foreground">{application.phone}</dd>
          </div>

          {/* Fax */}
          <div>
            <dt className="font-medium">{t('clientInfo.fax')}</dt>
            <dd className="text-muted-foreground">{application.fax || tCommon('notProvided')}</dd>
          </div>

          {/* Email */}
          <div>
            <dt className="font-medium">{t('clientInfo.email')}</dt>
            <dd className="text-muted-foreground">{application.email}</dd>
          </div>

          {/* Purpose */}
          <div>
            <dt className="font-medium">{t('clientInfo.purpose')}</dt>
            <dd className="text-muted-foreground">
              {resolvedPurpose}
              {application.purpose === 'other' && application.purposeOther && (
                <span> - {application.purposeOther}</span>
              )}
            </dd>
          </div>
        </dl>
        {/* Service Notes */}
        <div className="mt-4">
          <dt className="font-medium">{t('clientInfo.serviceNotes')}</dt>
          <dd className="text-muted-foreground">
            {application.purposeOther || tCommon('notProvided')}
          </dd>
        </div>
      </CardContent>
    </Card>
  )
}
