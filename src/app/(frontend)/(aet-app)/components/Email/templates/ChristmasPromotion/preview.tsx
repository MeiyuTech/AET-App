import * as React from 'react'

import { ChristmasPromotionEmail } from './ChristmasPromotionEmailEN'

export const ChristmasPromotionPreview = () => {
  return (
    <ChristmasPromotionEmail
      clientName="尊敬的客户"
      unsubscribeUrl="{{{RESEND_UNSUBSCRIBE_URL}}}"
    />
  )
}

export default ChristmasPromotionPreview
