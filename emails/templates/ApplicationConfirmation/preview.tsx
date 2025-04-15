import * as React from 'react'
import ApplicationConfirmationEmail from './ApplicationConfirmationEmail'
import { ApplicationData } from '@/app/(frontend)/(aet-app)/components/FCEApplicationForm/types'

// Application ID
const applicationId = 'AET-12345'

// Preview data
const previewData: ApplicationData = {
  firstName: 'John',
  lastName: 'Doe',
  status: 'submitted',
  submitted_at: new Date().toISOString(),
  due_amount: 250,
  payment_status: 'pending',
  payment_id: null,
  paid_at: null,
  deliveryMethod: 'usps_first_class_domestic',
  additionalServices: ['extra_copy', 'pdf_with_hard_copy'] as (
    | 'extra_copy'
    | 'pdf_with_hard_copy'
    | 'pdf_only'
  )[],
  additionalServicesQuantity: {
    extra_copy: 1,
    pdf_with_hard_copy: 1,
    pdf_only: 0,
  },
  purpose: 'evaluation-education',
  purposeOther: 'Bachelor degree evaluation for graduate school application',
  serviceType: {
    customizedService: { required: false },
    foreignCredentialEvaluation: {
      firstDegree: { speed: '7day' },
      secondDegrees: 1,
    },
    coursebyCourse: {
      firstDegree: { speed: undefined },
      secondDegrees: 0,
    },
    professionalExperience: { speed: undefined },
    positionEvaluation: { speed: undefined },
    translation: { required: false },
  },
}

// Export Preview Component
export default function Preview() {
  return (
    <ApplicationConfirmationEmail
      applicationId={applicationId}
      application={previewData}
      paymentLink="paymentLink placeholder"
    />
  )
}
