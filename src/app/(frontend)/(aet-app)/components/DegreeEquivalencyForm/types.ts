import * as z from 'zod'
import { formSchema, educationSchema } from './schema'

export enum FormStep {
  CLIENT_INFO = 0, // Client Information
  EVALUEE_INFO = 1, // Evaluee Information
  SERVICE_SELECTION = 2, // Service Selection
  REVIEW = 3, // Review Information
}

export type DeliveryMethod =
  | 'no_delivery_needed'
  | 'usps_first_class_domestic'
  | 'usps_first_class_international'
  | 'usps_priority_domestic'
  | 'usps_express_domestic'
  | 'ups_express_domestic'
  | 'usps_express_international'
  | 'fedex_express_international'
  | undefined

export type AdditionalService = 'extra_copy' | 'pdf_with_hard_copy' | 'pdf_only'

// Default form values constant that can be reused across components
export const defaultFormValues: Partial<z.infer<typeof formSchema>> = {
  country: '',
  email: '',
  purpose: 'degree-equivalency',
  purposeOther: '',
  firstName: '',
  lastName: '',
  middleName: '',
  educations: [
    {
      countryOfStudy: '',
      degreeObtained: '',
      schoolName: '',
      studyDuration: {
        startDate: { month: '', year: '' },
        endDate: { month: '', year: '' },
      },
    },
  ],
}

/**
 * Frontend form data type
 * For form data that user input
 */
export type FormData = z.infer<typeof formSchema>

export interface FormDraft {
  id: string
  form_data: Partial<FormData>
  status: 'draft' | 'completed'
  current_step: FormStep
  created_at: string
  updated_at: string
}

/**
 * Frontend form education data type
 * For form data that user input
 */
export type EducationFormData = z.infer<typeof educationSchema>

/**
 * Application data type
 * For application data that use in frontend and backend
 */
export interface CoreApplicationData extends Partial<FormData> {
  status: string
  created_at: string
  updated_at: string
  educationInfo?: EducationFormData[]
}

/**
 * Database application type
 * For application data that stored in database
 */
export interface DatabaseCoreApplication {
  id: string
  status: 'draft' | 'submitted' | 'processing' | 'completed' | 'cancelled'

  // Client Information
  // country: string
  email: string
  purpose:
    | 'translation'
    | 'evaluation-uscis'
    | 'evaluation-immigration'
    | 'evaluation-employment'
    | 'evaluation-education'
    | 'interpretation'
    | 'visa'
    | 'degree-equivalency'
    | 'other'

  // Evaluee Information
  first_name: string
  last_name: string
  middle_name: string | null

  // Metadata
  created_at: string
  updated_at: string
}

/**
 * Database education type
 * For education data that stored in database
 */
export interface DatabaseEducation {
  id: string
  application_id: string
  country_of_study: string
  degree_obtained: string
  school_name: string
  study_start_date: {
    month: string
    year: string
  }
  study_end_date: {
    month: string
    year: string
  }
}
