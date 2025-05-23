'use client'

import { useFormContext } from 'react-hook-form'

import { CONFIG } from '../constants'
import { FormData, ApplicationData } from '../types'
import ClientInfoCard from '../../StatusCheck/ClientInfoCard'
import EvalueeInfoCard from '../../StatusCheck/EvalueeInfoCard'
import SelectedServicesCard from '../../StatusCheck/SelectedServicesCard'

export function Review() {
  const { watch } = useFormContext<FormData>()
  const formData = watch()
  const applicationData = formData as ApplicationData

  return (
    <div className="space-y-6">
      <ClientInfoCard application={applicationData} />
      <EvalueeInfoCard application={applicationData} />

      {/* Service Selection */}
      {CONFIG.SHOW_SERVICE_SELECTION && <SelectedServicesCard application={applicationData} />}
      <div className="text-muted-foreground mt-1">
        Please review all information carefully. We will process your application as soon as
        possible after submission.
      </div>
    </div>
  )
}
