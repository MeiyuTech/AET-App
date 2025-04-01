import { DeliveryMethod, FormData } from '../../components/FCEApplicationForm/types'
import { DELIVERY_OPTIONS } from '../../components/FCEApplicationForm/constants'

export function getServiceDescription(serviceType: FormData['serviceType']) {
  const services: string[] = []

  // Customized Service
  if (serviceType.customizedService.required) {
    services.push('Customized Service: Delivery Time Will Be Quoted Upon Request')
  }

  // Foreign Credential Evaluation
  if (serviceType.foreignCredentialEvaluation.firstDegree.speed) {
    let service: string = 'Foreign Credential Evaluation'
    const additionalDegrees =
      serviceType.foreignCredentialEvaluation.secondDegrees > 0
        ? ` plus ${serviceType.foreignCredentialEvaluation.secondDegrees} additional degree(s)`
        : ''
    service += `${additionalDegrees} :`

    const speedMap = {
      sameday: 'same day',
      '24hour': '24 hours',
      '3day': '3 business days',
      '7day': '7 business days',
    }
    service += ` ${speedMap[serviceType.foreignCredentialEvaluation.firstDegree.speed]}`
    services.push(service)
  }

  // Course by Course
  if (serviceType.coursebyCourse.firstDegree.speed) {
    let service: string = 'Course by Course Evaluation'
    const additionalDegrees =
      serviceType.coursebyCourse.secondDegrees > 0
        ? ` plus ${serviceType.coursebyCourse.secondDegrees} additional degree(s)`
        : ''
    service += `${additionalDegrees} :`

    const speedMap = {
      '24hour': '24 hours',
      '3day': '3 business days',
      '5day': '5 business days',
      '8day': '8 business days',
    }
    service += ` ${speedMap[serviceType.coursebyCourse.firstDegree.speed]}`
    services.push(service)
  }

  // Professional Experience
  if (serviceType.professionalExperience.speed) {
    // TODO: rename to Expert Opinion Letter
    // let service: string = 'Professional Experience Evaluation'
    let service: string = 'Expert Opinion Letter'
    const speedMap = {
      '3day': '3 business days',
      '7day': '7 business days',
      '21day': '21 business days',
    }
    service += ` ${speedMap[serviceType.professionalExperience.speed]}`
    services.push(service)
  }

  // Position Evaluation
  if (serviceType.positionEvaluation.speed) {
    let service: string = 'Position Evaluation'
    const speedMap = {
      '2day': '2 business days',
      '3day': '3 business days',
      '5day': '5 business days',
      '10day': '10 business days',
    }
    service += ` ${speedMap[serviceType.positionEvaluation.speed]}`
    services.push(service)
  }

  // Document Translation
  if (serviceType.translation.required) {
    services.push('Document Translation: Delivery Time Will Be Quoted Upon Request')
  }

  return services
}

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

export function getDeliveryMethod(deliveryMethod: DeliveryMethod): string {
  if (!deliveryMethod) return 'No Delivery Method Selected'
  if (deliveryMethod === 'no_delivery_needed') return 'No Delivery Needed'

  return DELIVERY_OPTIONS[deliveryMethod]?.label || 'No Delivery Method Selected'
}
