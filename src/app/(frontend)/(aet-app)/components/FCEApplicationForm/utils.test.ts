import { describe, it, expect } from 'vitest'
import { getEstimatedCompletionDate } from './utils'
import { ApplicationData } from './types'

describe('getEstimatedCompletionDate', () => {
  // Helper function to create a mock application with specific service type and speed
  const createMockApplication = (
    serviceType: Partial<ApplicationData['serviceType']>
  ): ApplicationData =>
    ({
      serviceType: {
        customizedService: { required: false },
        foreignCredentialEvaluation: { firstDegree: { speed: undefined }, secondDegrees: 0 },
        coursebyCourse: { firstDegree: { speed: undefined }, secondDegrees: 0 },
        professionalExperience: { speed: undefined },
        positionEvaluation: { speed: undefined },
        translation: { required: false },
        ...serviceType,
      },
    }) as ApplicationData

  describe('Foreign Credential Evaluation', () => {
    it('should handle 7-day service', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: '7day' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-27') // 7 business days later
    })

    it('should handle 3-day service', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: '3day' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-21') // 3 business days later
    })

    it('should handle 24-hour service', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: '24hour' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-19') // Next business day
    })

    it('should handle same-day service before cutoff', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: 'sameday' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST, before 1 PM EST cutoff)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-18') // Same day
    })

    it('should handle same-day service after cutoff', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: 'sameday' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T18:00:00.000Z' // 18:00 UTC (1:00 PM EST, after cutoff)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-19') // Next business day
    })

    it('should handle same-day service on weekend', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: 'sameday' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-16T10:00:00.000Z' // 10:00 UTC (5:00 AM EST, Saturday)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-18') // Next business day (Monday)
    })

    it('should handle same-day service in 2025', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: 'sameday' }, secondDegrees: 0 },
      })
      const paidAt = '2025-04-17T22:00:00.000Z' // 22:00 UTC (6:00 PM EST, Thursday)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2025-04-18') // Next business day (Friday)
    })
  })

  describe('Course by Course Evaluation', () => {
    it('should handle 8-day service', () => {
      const application = createMockApplication({
        coursebyCourse: { firstDegree: { speed: '8day' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-28') // 8 business days later
    })

    it('should handle 5-day service', () => {
      const application = createMockApplication({
        coursebyCourse: { firstDegree: { speed: '5day' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-25') // 5 business days later
    })

    it('should handle 3-day service', () => {
      const application = createMockApplication({
        coursebyCourse: { firstDegree: { speed: '3day' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-21') // 3 business days later
    })

    it('should handle 24-hour service', () => {
      const application = createMockApplication({
        coursebyCourse: { firstDegree: { speed: '24hour' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-19') // Next business day
    })
  })

  describe('Professional Experience Evaluation', () => {
    it('should handle 21-day service', () => {
      const application = createMockApplication({
        professionalExperience: { speed: '21day' },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-04-16') // 21 business days later
    })

    it('should handle 7-day service', () => {
      const application = createMockApplication({
        professionalExperience: { speed: '7day' },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-27') // 7 business days later
    })

    it('should handle 3-day service', () => {
      const application = createMockApplication({
        professionalExperience: { speed: '3day' },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-21') // 3 business days later
    })
  })

  describe('Position Evaluation', () => {
    it('should handle 10-day service', () => {
      const application = createMockApplication({
        positionEvaluation: { speed: '10day' },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-04-01') // 10 business days later
    })

    it('should handle 5-day service', () => {
      const application = createMockApplication({
        positionEvaluation: { speed: '5day' },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-25') // 5 business days later
    })

    it('should handle 3-day service', () => {
      const application = createMockApplication({
        positionEvaluation: { speed: '3day' },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-21') // 3 business days later
    })

    it('should handle 2-day service', () => {
      const application = createMockApplication({
        positionEvaluation: { speed: '2day' },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-20') // 2 business days later
    })
  })

  describe('Edge cases', () => {
    it('should throw error for application with no service type', () => {
      const application = { serviceType: null } as unknown as ApplicationData
      expect(() => {
        getEstimatedCompletionDate(application, '2024-03-18T10:00:00.000Z')
      }).toThrow('Service type is null')
    })

    it('should handle weekend transitions', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: '3day' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-15T10:00:00.000Z' // 10:00 UTC (5:00 AM EST, Friday)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-20') // 3 business days later (skipping weekend)
    })

    it('should handle multiple services with different speeds', () => {
      const application = createMockApplication({
        foreignCredentialEvaluation: { firstDegree: { speed: '7day' }, secondDegrees: 0 },
        coursebyCourse: { firstDegree: { speed: '3day' }, secondDegrees: 0 },
      })
      const paidAt = '2024-03-18T10:00:00.000Z' // 10:00 UTC (5:00 AM EST)
      const result = getEstimatedCompletionDate(application, paidAt)
      expect(result).toBe('2024-03-27') // Should use the longest duration (7 days)
    })
  })
})
