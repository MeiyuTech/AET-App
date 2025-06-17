import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import {
  FormStep,
  FormData,
  EducationFormData,
  CoreApplicationData,
  DatabaseCoreApplication,
  DatabaseEducation,
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

export const formatUtils = {
  /* Convert frontend form data to database format
   * When fullfilling the form, the status is always 'draft' or 'submitted'
   * Other statuses are set by the backend
   */
  toDatabase(
    formData: Partial<FormData>,
    currentStep: FormStep,
    status: 'draft' | 'submitted' = 'draft'
  ): Omit<DatabaseCoreApplication, 'id' | 'created_at' | 'updated_at'> {
    return {
      status,
      payment_status: 'pending',
      // Client Information
      email: formData.email!,
      purpose: formData.purpose!,

      // Evaluee Information
      first_name: formData.firstName!,
      last_name: formData.lastName!,
      middle_name: formData.middleName || null,
    }
  },

  /* Convert database format back to frontend form data
   * When displaying the form, the status is always 'draft' or 'submitted'
   * Other statuses are set by the backend
   */
  toFormData(
    dbData: DatabaseCoreApplication,
    status: string,
    created_at: string,
    updated_at: string
  ): CoreApplicationData {
    return {
      status: status,
      created_at: created_at,
      updated_at: updated_at,

      // Client Information
      email: dbData.email,
      purpose: dbData.purpose,

      // Evaluee Information
      firstName: dbData.first_name,
      lastName: dbData.last_name,
      middleName: dbData.middle_name || undefined,
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
