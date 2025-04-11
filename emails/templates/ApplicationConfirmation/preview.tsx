import * as React from 'react'
import ApplicationConfirmationEmail from './ApplicationConfirmationEmail'

// 预览数据
const previewData = {
  firstName: 'John',
  lastName: 'Doe',
  servicesDescription: ['Document Translation', 'Notarization', 'Academic Evaluation'],
  deliveryMethod: 'Electronic Delivery',
  additionalServices: ['extra_copy', 'pdf_with_hard_copy'] as (
    | 'extra_copy'
    | 'pdf_with_hard_copy'
    | 'pdf_only'
  )[],
  applicationId: 'AET-12345',
  submittedAt: new Date().toISOString(),
}

// 导出预览组件
export default function Preview() {
  return (
    <ApplicationConfirmationEmail
      firstName={previewData.firstName}
      lastName={previewData.lastName}
      servicesDescription={previewData.servicesDescription}
      deliveryMethod={previewData.deliveryMethod}
      additionalServices={previewData.additionalServices}
      applicationId={previewData.applicationId}
      submittedAt={previewData.submittedAt}
    />
  )
}
