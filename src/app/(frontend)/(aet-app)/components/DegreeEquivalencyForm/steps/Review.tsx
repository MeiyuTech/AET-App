'use client'

import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

// import { CONFIG } from '../constants'
import { FormData, CoreApplicationData } from '../types'
import DegreeEquivalencyInfoCard from '../../StatusCheck/DegreeEquivalencyInfoCard'
// import SelectedServicesCard from '../../StatusCheck/SelectedServicesCard'

export function Review() {
  const { watch } = useFormContext<FormData>()
  const formData = watch()
  const applicationData = formData as CoreApplicationData
  const t = useTranslations('degreeEquivalencyForm.review')

  return (
    <div className="space-y-6">
      <DegreeEquivalencyInfoCard application={applicationData} />

      {/* Service Selection */}
      {/* {CONFIG.SHOW_SERVICE_SELECTION && <SelectedServicesCard application={applicationData} />} */}
      <div className="text-muted-foreground mt-1">
        {t('note')}
      </div>
    </div>
  )
}
