import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { EVALUATION_SERVICES, DELIVERY_OPTIONS, ADDITIONAL_SERVICES } from './constants'
import {
  FormStep,
  FormData,
  EducationFormData,
  ApplicationData,
  DatabaseApplication,
  DatabaseEducation,
  DeliveryMethod,
  AdditionalService,
} from './types'

// Initialize dayjs plugins
dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
/**
 * Initialize dayjs plugins in the correct order:
 * 1. UTC plugin must be initialized first as it provides the base functionality for timezone handling
 * 2. Timezone plugin depends on UTC plugin for timezone conversions
 * This order is crucial for proper timezone handling in the email template,
 * especially when formatting dates for different time zones (e.g., 'America/New_York')
 */
dayjs.extend(utc)
dayjs.extend(timezone)

export const dateUtils = {
  getDaysInMonth(month?: string, year?: string): number {
    if (!month || !year) return 31
    return dayjs(`${year}-${month}`).daysInMonth()
  },

  isValidDate(year?: string, month?: string, date?: string): boolean {
    if (!year || !month || !date) return true
    return dayjs(`${year}-${month}-${date}`, 'YYYY-MM-DD', true).isValid()
  },

  isFutureDate(year?: string, month?: string, date?: string): boolean {
    if (!year || !month || !date) return false
    return dayjs(`${year}-${month}-${date}`).isAfter(dayjs())
  },

  isValidDateRange(
    startMonth?: string,
    startYear?: string,
    endMonth?: string,
    endYear?: string
  ): boolean {
    if (!startMonth || !startYear || !endMonth || !endYear) return true

    const startDate = dayjs(`${startYear}-${startMonth}-01`)
    const endDate = dayjs(`${endYear}-${endMonth}-01`)

    return endDate.isAfter(startDate)
  },
}

/**
 * Get the estimated completion date for an application
 * @param application - The application data
 * @param paidAt - The date and time the application was paid (new Date().toISOString())
 * @returns The estimated completion date (YYYY-MM-DD, EST/EDT)
 */
export function getEstimatedCompletionDate(application: ApplicationData, paidAt: string): string {
  if (!application) {
    throw new Error('Application is null')
  }
  if (!application.serviceType) {
    throw new Error('Service type is null')
  }

  // Get paid date, in EST/EDT format
  const paidDate = dayjs(paidAt).tz('America/New_York')

  // Get EST cutoff time at 1:00 PM
  const estCutoffTime = paidDate.hour(13).minute(0).second(0)

  // Check if paid date is after EST cutoff time
  const isAfterCutoff = paidDate.isAfter(estCutoffTime)

  // If paid date is after EST cutoff time, start from the next day
  const startDate = isAfterCutoff ? paidDate.add(1, 'day') : paidDate

  // Calculate max business days
  let maxBusinessDays = 0
  let isSameDayService = false
  let is24HourService = false

  // Check foreign credential evaluation service
  if (application.serviceType.foreignCredentialEvaluation?.firstDegree?.speed) {
    const speed = application.serviceType.foreignCredentialEvaluation.firstDegree.speed
    let businessDays = 0

    switch (speed) {
      case '7day':
        businessDays = 7
        break
      case '3day':
        businessDays = 3
        break
      case '24hour':
        is24HourService = true
        break
      case 'sameday':
        isSameDayService = true
        break
    }

    maxBusinessDays = Math.max(maxBusinessDays, businessDays)
  }

  // Check course by course evaluation service
  if (application.serviceType.coursebyCourse?.firstDegree?.speed) {
    const speed = application.serviceType.coursebyCourse.firstDegree.speed
    let businessDays = 0

    switch (speed) {
      case '8day':
        businessDays = 8
        break
      case '5day':
        businessDays = 5
        break
      case '3day':
        businessDays = 3
        break
      case '24hour':
        is24HourService = true
        break
      case 'sameday':
        isSameDayService = true
        break
    }

    maxBusinessDays = Math.max(maxBusinessDays, businessDays)
  }

  // Check professional experience evaluation service
  if (application.serviceType.professionalExperience?.speed) {
    const speed = application.serviceType.professionalExperience.speed
    let businessDays = 0

    switch (speed) {
      case '21day':
        businessDays = 21
        break
      case '7day':
        businessDays = 7
        break
      case '3day':
        businessDays = 3
        break
    }

    maxBusinessDays = Math.max(maxBusinessDays, businessDays)
  }

  // check position evaluation service
  if (application.serviceType.positionEvaluation?.speed) {
    const speed = application.serviceType.positionEvaluation.speed
    let businessDays = 0

    switch (speed) {
      case '10day':
        businessDays = 10
        break
      case '5day':
        businessDays = 5
        break
      case '3day':
        businessDays = 3
        break
      case '2day':
        businessDays = 2
        break
    }

    maxBusinessDays = Math.max(maxBusinessDays, businessDays)
  }

  // If no service is selected, default to 10 days
  if (maxBusinessDays === 0 && !isSameDayService && !is24HourService) {
    return dayjs().add(10, 'day').format('YYYY-MM-DD')
  }

  // Handle same day service
  if (isSameDayService) {
    return startDate.format('YYYY-MM-DD')
  }

  // Handle 24 hour service
  if (is24HourService) {
    let completionDate = startDate.add(24, 'hour')
    // Skip weekends
    while (completionDate.day() === 0 || completionDate.day() === 6) {
      completionDate = completionDate.add(1, 'day')
    }
    return completionDate.format('YYYY-MM-DD')
  }

  // Calculate estimated completion date for business days
  let completionDate = startDate
  let remainingDays = maxBusinessDays

  // If today is a business day, count it as one day
  if (completionDate.day() !== 0 && completionDate.day() !== 6) {
    remainingDays--
  }

  // Add remaining business days
  while (remainingDays > 0) {
    completionDate = completionDate.add(1, 'day')
    // Skip weekends
    if (completionDate.day() !== 0 && completionDate.day() !== 6) {
      remainingDays--
    }
  }

  return completionDate.format('YYYY-MM-DD')
}

export function calculateTotalPrice(application: ApplicationData | null): string {
  if (!application) return '0.00'

  let total = 0

  if (application.serviceType) {
    // Foreign Credential Evaluation
    const fceSpeed = application.serviceType.foreignCredentialEvaluation?.firstDegree?.speed
    const fceService = fceSpeed && EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE[fceSpeed]
    if (fceService) {
      total += fceService.price

      // Second Degrees
      if (application.serviceType.foreignCredentialEvaluation.secondDegrees > 0) {
        const secondDegreePrice =
          fceSpeed === '7day'
            ? EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price
            : EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT.price

        total +=
          secondDegreePrice * application.serviceType.foreignCredentialEvaluation.secondDegrees
      }
    }

    // Course by Course Evaluation
    const cbeSpeed = application.serviceType.coursebyCourse?.firstDegree?.speed
    const cbeService = cbeSpeed && EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE[cbeSpeed]
    if (cbeService) {
      total += cbeService.price

      // Second Degrees
      if (application.serviceType.coursebyCourse.secondDegrees > 0) {
        const secondDegreePrice =
          cbeSpeed === '8day'
            ? EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price
            : EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price

        total += secondDegreePrice * application.serviceType.coursebyCourse.secondDegrees
      }
    }

    // Professional Experience Evaluation
    const profExpSpeed = application.serviceType.professionalExperience?.speed
    const profExpService = profExpSpeed && EVALUATION_SERVICES.PROFESSIONAL_EXPERIENCE[profExpSpeed]
    if (profExpService) {
      total += profExpService.price
    }

    // Position Evaluation
    const posEvalSpeed = application.serviceType.positionEvaluation?.speed
    const posEvalService = posEvalSpeed && EVALUATION_SERVICES.POSITION[posEvalSpeed]
    if (posEvalService) {
      total += posEvalService.price
    }
  }

  // Delivery
  const deliveryService =
    application.deliveryMethod &&
    DELIVERY_OPTIONS[application.deliveryMethod as keyof typeof DELIVERY_OPTIONS]
  if (deliveryService) {
    total += deliveryService.price
  }

  // Additional Services
  application.additionalServices?.forEach((serviceId) => {
    const service = ADDITIONAL_SERVICES[serviceId]
    if (service) {
      if ('quantity' in service) {
        const quantity = application.additionalServicesQuantity?.[serviceId] || 0
        total += service.price * quantity
      } else {
        total += service.price
      }
    }
  })

  return total.toFixed(2)
}

export const formatUtils = {
  /* Convert frontend form data to database format
   * When fullfilling the form, the status is always 'draft' or 'submitted'
   * Other statuses are set by the backend
   */
  toDatabase(
    formData: Partial<FormData>,
    currentStep: FormStep,
    status: 'draft' | 'submitted' = 'draft',
    submittedAt?: string
  ): Omit<DatabaseApplication, 'id' | 'created_at' | 'updated_at' | 'paid_at'> {
    return {
      status,
      current_step: currentStep,
      submitted_at: submittedAt || null,
      // Payment related fields (default values)
      due_amount: null,
      payment_status: 'pending',
      payment_id: null,

      // Client Information
      name: formData.name!,
      street_address: formData.streetAddress!,
      street_address2: formData.streetAddress2 || null,
      city: formData.city!,
      region: formData.region!,
      zip_code: formData.zipCode!,
      phone: formData.phone!,
      fax: formData.fax || null,
      email: formData.email!,
      office: formData.office!,
      purpose: formData.purpose!,
      purpose_other: formData.purposeOther || null,
      country: formData.country!,

      // Evaluee Information
      pronouns: formData.pronouns!,
      first_name: formData.firstName!,
      last_name: formData.lastName!,
      middle_name: formData.middleName || null,
      date_of_birth: `${formData.dateOfBirth?.year}-${formData.dateOfBirth?.month}-${formData.dateOfBirth?.date}`,

      // Service Selection
      service_type: formData.serviceType!,
      delivery_method: formData.deliveryMethod || 'no_delivery_needed',
      additional_services: formData.additionalServices || [],
      additional_services_quantity: formData.additionalServicesQuantity || {
        extra_copy: 0,
        pdf_with_hard_copy: 0,
        pdf_only: 0,
      },
    }
  },

  /* Convert database format back to frontend form data
   * When displaying the form, the status is always 'draft' or 'submitted'
   * Other statuses are set by the backend
   */
  toFormData(
    dbData: DatabaseApplication,
    status: string,
    submitted_at: string,
    due_amount: number,
    payment_status: 'pending' | 'paid' | 'failed' | 'expired',
    payment_id: string,
    paid_at: string
  ): ApplicationData {
    return {
      status: status,
      submitted_at: submitted_at,
      due_amount: due_amount,
      payment_status: payment_status,
      payment_id: payment_id,
      paid_at: paid_at,

      // Client Information
      name: dbData.name,
      country: dbData.country,
      streetAddress: dbData.street_address,
      streetAddress2: dbData.street_address2 || undefined,
      city: dbData.city,
      region: dbData.region,
      zipCode: dbData.zip_code,
      fax: dbData.fax || undefined,
      phone: dbData.phone,
      email: dbData.email,
      office: dbData.office,
      purpose: dbData.purpose,
      purposeOther: dbData.purpose_other || undefined,

      // Evaluee Information
      pronouns: dbData.pronouns,
      firstName: dbData.first_name,
      lastName: dbData.last_name,
      middleName: dbData.middle_name || undefined,
      dateOfBirth: {
        year: dbData.date_of_birth.split('-')[0],
        month: dbData.date_of_birth.split('-')[1],
        date: dbData.date_of_birth.split('-')[2],
      },

      // Service Selection
      serviceType: dbData.service_type,
      deliveryMethod: dbData.delivery_method as DeliveryMethod,
      additionalServices: dbData.additional_services as AdditionalService[],
      additionalServicesQuantity: dbData.additional_services_quantity,
    }
  },

  // Convert education data to database format
  toEducationDatabase(
    education: EducationFormData
  ): Omit<DatabaseEducation, 'id' | 'application_id'> {
    return {
      country_of_study: education.countryOfStudy || '',
      degree_obtained: education.degreeObtained || '',
      school_name: education?.schoolName || '',
      study_start_date: education.studyDuration
        ? {
            month: education.studyDuration.startDate.month || '',
            year: education.studyDuration.startDate.year || '',
          }
        : { month: '', year: '' },
      study_end_date: education.studyDuration
        ? {
            month: education.studyDuration.endDate.month || '',
            year: education.studyDuration.endDate.year || '',
          }
        : { month: '', year: '' },
    }
  },

  // Convert database education data to frontend format
  toEducationFormData(dbEducation: DatabaseEducation): EducationFormData {
    return {
      countryOfStudy: dbEducation.country_of_study,
      degreeObtained: dbEducation.degree_obtained,
      schoolName: dbEducation.school_name,
      studyDuration: {
        startDate: dbEducation.study_start_date,
        endDate: dbEducation.study_end_date,
      },
    }
  },
}
