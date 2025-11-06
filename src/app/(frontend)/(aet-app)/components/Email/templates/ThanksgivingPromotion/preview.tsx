import * as React from 'react'
import { ThanksgivingPromotionEmail } from './ThanksgivingPromotionEmail'

/**
 * Preview component for ThanksgivingPromotionEmail
 * This component is used for development and testing purposes
 */
export const ThanksgivingPromotionPreview = () => {
  return (
    <ThanksgivingPromotionEmail
      clientName="尊敬的客户"
      contactPerson="美美"
      contactPhone="+1-949-978-6699"
      projectWebsite="https://example.com"
    />
  )
}

export default ThanksgivingPromotionPreview
