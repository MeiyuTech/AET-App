export function getCCAddress(office: string) {
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
