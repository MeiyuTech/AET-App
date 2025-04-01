import { describe, it, expect } from 'vitest'
import { getServiceDescription, getCCAddress, getDeliveryMethod } from './utils'
import { DeliveryMethod, FormData } from '../../components/FCEApplicationForm/types'
import { DELIVERY_OPTIONS } from '../../components/FCEApplicationForm/constants'

describe('Email utils functions', () => {
  describe('getServiceDescription', () => {
    it('should return customized service description', () => {
      const serviceType: FormData['serviceType'] = {
        customizedService: { required: true },
        foreignCredentialEvaluation: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        coursebyCourse: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        professionalExperience: { speed: undefined },
        positionEvaluation: { speed: undefined },
        translation: { required: false },
      }

      const result = getServiceDescription(serviceType)
      expect(result).toContain('Customized Service: Delivery Time Will Be Quoted Upon Request')
    })

    it('should return foreign credential evaluation description', () => {
      const serviceType: FormData['serviceType'] = {
        customizedService: { required: false },
        foreignCredentialEvaluation: {
          firstDegree: { speed: '3day' },
          secondDegrees: 2,
        },
        coursebyCourse: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        professionalExperience: { speed: undefined },
        positionEvaluation: { speed: undefined },
        translation: { required: false },
      }

      const result = getServiceDescription(serviceType)
      expect(result).toContain(
        'Foreign Credential Evaluation plus 2 additional degree(s) : 3 business days'
      )
    })

    it('should return course by course evaluation description', () => {
      const serviceType: FormData['serviceType'] = {
        customizedService: { required: false },
        foreignCredentialEvaluation: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        coursebyCourse: {
          firstDegree: { speed: '5day' },
          secondDegrees: 1,
        },
        professionalExperience: { speed: undefined },
        positionEvaluation: { speed: undefined },
        translation: { required: false },
      }

      const result = getServiceDescription(serviceType)
      expect(result).toContain(
        'Course by Course Evaluation plus 1 additional degree(s) : 5 business days'
      )
    })

    it('should return professional experience description', () => {
      const serviceType: FormData['serviceType'] = {
        customizedService: { required: false },
        foreignCredentialEvaluation: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        coursebyCourse: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        professionalExperience: { speed: '7day' },
        positionEvaluation: { speed: undefined },
        translation: { required: false },
      }

      const result = getServiceDescription(serviceType)
      expect(result).toContain('Expert Opinion Letter 7 business days')
    })

    it('should return position evaluation description', () => {
      const serviceType: FormData['serviceType'] = {
        customizedService: { required: false },
        foreignCredentialEvaluation: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        coursebyCourse: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        professionalExperience: { speed: undefined },
        positionEvaluation: { speed: '10day' },
        translation: { required: false },
      }

      const result = getServiceDescription(serviceType)
      expect(result).toContain('Position Evaluation 10 business days')
    })

    it('should return translation description', () => {
      const serviceType: FormData['serviceType'] = {
        customizedService: { required: false },
        foreignCredentialEvaluation: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        coursebyCourse: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        professionalExperience: { speed: undefined },
        positionEvaluation: { speed: undefined },
        translation: { required: true },
      }

      const result = getServiceDescription(serviceType)
      expect(result).toContain('Document Translation: Delivery Time Will Be Quoted Upon Request')
    })

    it('should return multiple service descriptions', () => {
      const serviceType: FormData['serviceType'] = {
        customizedService: { required: false },
        foreignCredentialEvaluation: {
          firstDegree: { speed: '24hour' },
          secondDegrees: 0,
        },
        coursebyCourse: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        professionalExperience: { speed: '3day' },
        positionEvaluation: { speed: undefined },
        translation: { required: true },
      }

      const result = getServiceDescription(serviceType)
      expect(result).toHaveLength(3)
      expect(result).toContain('Foreign Credential Evaluation : 24 hours')
      expect(result).toContain('Expert Opinion Letter 3 business days')
      expect(result).toContain('Document Translation: Delivery Time Will Be Quoted Upon Request')
    })
  })

  describe('getCCAddress', () => {
    it('should return Boston office email addresses', () => {
      const result = getCCAddress('Boston')
      expect(result).toEqual(['boston@aet21.com', 'boston@americantranslationservice.com'])
    })

    it('should return New York office email addresses', () => {
      const result = getCCAddress('New York')
      expect(result).toEqual(['nyc@aet21.com', 'nyc@americantranslationservice.com'])
    })

    it('should return San Francisco office email addresses', () => {
      const result = getCCAddress('San Francisco')
      expect(result).toEqual(['ca@aet21.com'])
    })

    it('should return Los Angeles office email addresses', () => {
      const result = getCCAddress('Los Angeles')
      expect(result).toEqual(['ca2@aet21.com'])
    })

    it('should return Miami office email addresses', () => {
      const result = getCCAddress('Miami')
      expect(result).toEqual(['info@americantranslationservice.com'])
    })

    it('should return default email address for unknown office', () => {
      const result = getCCAddress('Unknown Office')
      expect(result).toEqual(['ca2@aet21.com'])
    })
  })

  describe('getDeliveryMethod', () => {
    it('should return delivery method label from DELIVERY_OPTIONS for all possible values', () => {
      const deliveryMethods: DeliveryMethod[] = [
        'usps_first_class_domestic',
        'usps_first_class_international',
        'usps_priority_domestic',
        'usps_express_domestic',
        'ups_express_domestic',
        'usps_express_international',
        'fedex_express_international',
      ]

      deliveryMethods.forEach((method) => {
        if (method) {
          expect(getDeliveryMethod(method)).toBe(DELIVERY_OPTIONS[method].label)
        } else {
          expect(getDeliveryMethod(method)).toBe('No Delivery Method Selected')
        }
      })
    })

    it('should handle special cases', () => {
      const specialCases: DeliveryMethod[] = ['no_delivery_needed', undefined]

      specialCases.forEach((method) => {
        if (method === undefined) {
          expect(getDeliveryMethod(method)).toBe('No Delivery Method Selected')
        } else if (method === 'no_delivery_needed') {
          expect(getDeliveryMethod(method)).toBe('No Delivery Needed')
        }
      })
    })
  })
})
