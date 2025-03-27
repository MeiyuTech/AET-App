import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { FormData, ApplicationData } from './types'
import { EVALUATION_SERVICES, DELIVERY_OPTIONS, ADDITIONAL_SERVICES } from './constants'
import { DatabaseApplication, DatabaseEducation, DeliveryMethod, AdditionalService } from './types'
import { EducationSchema, FormStep } from './types'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)

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
  // Convert frontend form data to database format
  // When fullfilling the form, the status is always 'draft' or 'submitted'
  // Other statuses are set by the backend
  toDatabase(
    formData: Partial<FormData>,
    currentStep: FormStep,
    status: 'draft' | 'submitted' = 'draft'
  ): Omit<DatabaseApplication, 'id' | 'created_at' | 'updated_at' | 'submitted_at' | 'paid_at'> {
    return {
      status,
      current_step: currentStep,

      // Payment related fields (default values)
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

  // Convert database format back to frontend form data
  toFormData(dbData: DatabaseApplication): Partial<FormData> {
    return {
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
    education: EducationSchema
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
  toEducationFormData(dbEducation: DatabaseEducation): EducationSchema {
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
