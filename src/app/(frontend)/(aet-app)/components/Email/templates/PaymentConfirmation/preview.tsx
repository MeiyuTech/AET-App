import * as React from 'react'
import PaymentConfirmationEmail from './PaymentConfirmationEmail'
import { ApplicationData } from '@/app/(frontend)/(aet-app)/components/FCEApplicationForm/types'

// Define the extended type that includes zipCode
interface ExtendedApplicationData extends ApplicationData {
  zipCode?: string
}

// Application ID
const applicationId = 'AET-12345'

// Payment details
const paymentAmount = '268.07'
const paymentDate = new Date().toISOString()
const transactionId = 'TXN-987654321'
const estimatedCompletionDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now

// Preview data
const previewData: ExtendedApplicationData = {
  firstName: 'VIPUL',
  lastName: 'KEESARA',
  status: 'in_progress',
  submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  due_amount: 268.07,
  payment_status: 'paid',
  payment_id: transactionId,
  paid_at: paymentDate,
  deliveryMethod: 'usps_first_class_domestic',
  zipCode: '75078',
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
    customizedService: { required: true },
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
    <PaymentConfirmationEmail
      applicationId={applicationId}
      application={previewData}
      paidAt={paymentDate}
      paymentAmount={paymentAmount}
      paymentId={transactionId}
      estimatedCompletionDate={estimatedCompletionDate}
    />
  )
}
