/**
 * Get the CC address for the email
 * @param office - The office to send the email from
 * @param toEmail - The address to send the email to
 * @returns The CC address for the email
 */
export function getCCAddress(office: string, toEmail: string) {
  if (toEmail === 'tech@meiyugroup.org') {
    return undefined
  }

  switch (office) {
    case 'Boston':
      return ['boston@aet21.com', 'boston@americantranslationservice.com']
    case 'New York':
      return ['nyc@aet21.com', 'nyc@americantranslationservice.com']
    case 'San Francisco':
      return ['ca@aet21.com']
    case 'Los Angeles':
      return ['ca2@aet21.com']
    case 'Miami':
      return ['info@americantranslationservice.com']
    default:
      return ['ca2@aet21.com']
  }
}
