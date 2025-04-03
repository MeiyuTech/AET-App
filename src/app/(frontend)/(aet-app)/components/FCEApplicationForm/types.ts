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
  name: '',
  country: '',
  streetAddress: '',
  streetAddress2: '',
  city: '',
  region: '',
  zipCode: '',
  phone: '',
  fax: '',
  email: '',
  office: undefined,
  purpose: undefined,
  purposeOther: '',
  pronouns: undefined,
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: {
    month: '',
    date: '',
    year: '',
  },
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
  serviceType: {
    // If wanna skip service selection, set customizedService to true
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
    translation: { required: false },
  },
  deliveryMethod: 'no_delivery_needed',
  additionalServices: ['pdf_only'],
  additionalServicesQuantity: {
    extra_copy: 0,
    pdf_with_hard_copy: 0,
    pdf_only: 1,
  },
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
export interface ApplicationData extends Partial<FormData> {
  status: string
  submitted_at: string
  due_amount: number
  payment_status: 'pending' | 'paid' | 'failed' | 'expired'
  payment_id: string | null
  paid_at: string | null
  additionalServices: ('extra_copy' | 'pdf_with_hard_copy' | 'pdf_only')[]
  additionalServicesQuantity: {
    extra_copy: number
    pdf_with_hard_copy: number
    pdf_only: number
  }
}

/**
 * Database application type
 * For application data that stored in database
 */
export interface DatabaseApplication {
  id: string
  status: 'draft' | 'submitted' | 'processing' | 'completed' | 'cancelled'
  current_step: FormStep

  // Client Information
  name: string
  country: string
  street_address: string
  street_address2: string | null
  city: string
  region: string
  zip_code: string
  phone: string
  fax: string | null
  email: string
  office: 'Boston' | 'New York' | 'San Francisco' | 'Los Angeles' | 'Miami'
  // purpose: 'immigration' | 'employment' | 'education' | 'other'
  purpose:
    | 'translation'
    | 'evaluation-uscis'
    | 'evaluation-immigration'
    | 'evaluation-employment'
    | 'evaluation-education'
    | 'interpretation'
    | 'visa'
    | 'other'
  purpose_other: string | null

  // Evaluee Information
  pronouns: 'mr' | 'ms' | 'mx'
  first_name: string
  last_name: string
  middle_name: string | null
  date_of_birth: string // ISO format date

  // Service Selection
  service_type: FormData['serviceType'] // use same type
  delivery_method: string
  additional_services: string[]
  additional_services_quantity: {
    extra_copy: number
    pdf_with_hard_copy: number
    pdf_only: number
  }

  // Metadata
  created_at: string
  updated_at: string
  submitted_at: string | null

  // Payment related fields
  due_amount: number | null
  payment_status: 'pending' | 'paid' | 'failed' | 'expired'
  payment_id: string | null
  paid_at: string | null
}

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
