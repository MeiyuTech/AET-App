import * as z from 'zod'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const educationSchema = z
  .object({
    countryOfStudy: z.string().nonempty({ message: 'Please fill in the country of study' }),
    degreeObtained: z.string().nonempty({ message: 'Please fill in the degree obtained' }),
    schoolName: z.string().nonempty({ message: 'Please fill in the school name' }),
    studyDuration: z.object({
      startDate: z.object({
        month: z.string().nonempty({ message: 'Please fill in the start month' }),
        year: z.string().nonempty({ message: 'Please fill in the start year' }),
      }),
      endDate: z.object({
        month: z.string().nonempty({ message: 'Please fill in the end month' }),
        year: z.string().nonempty({ message: 'Please fill in the end year' }),
      }),
    }),
  })
  .superRefine((data, ctx) => {
    // Check if any field has been filled
    const hasStartedFilling =
      !!data.countryOfStudy ||
      !!data.degreeObtained ||
      !!data.schoolName ||
      !!data.studyDuration?.startDate?.month ||
      !!data.studyDuration?.startDate?.year ||
      !!data.studyDuration?.endDate?.month ||
      !!data.studyDuration?.endDate?.year

    // If user hasn't started filling, that's fine
    if (!hasStartedFilling) return true

    // Check each field and add appropriate error if missing
    if (!data.countryOfStudy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please fill in the country of study',
        path: ['countryOfStudy'],
      })
    }

    if (!data.degreeObtained) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please fill in the degree obtained',
        path: ['degreeObtained'],
      })
    }

    if (!data.schoolName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please fill in the school name',
        path: ['schoolName'],
      })
    }

    // Check study duration fields
    if (!data.studyDuration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please fill in the study duration',
        path: ['studyDuration'],
      })
    } else {
      if (!data.studyDuration.startDate?.month) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select start month',
          path: ['studyDuration', 'startDate', 'month'],
        })
      }

      if (!data.studyDuration.startDate?.year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select start year',
          path: ['studyDuration', 'startDate', 'year'],
        })
      }

      if (!data.studyDuration.endDate?.month) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select end month',
          path: ['studyDuration', 'endDate', 'month'],
        })
      }

      if (!data.studyDuration.endDate?.year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select end year',
          path: ['studyDuration', 'endDate', 'year'],
        })
      }
    }
  })

// Define speed options and their display values
const speedOptions = {
  foreignCredentialEvaluation: {
    '7day': '7 Business Days',
    '3day': '3 Business Days',
    '24hour': '24 Hours',
    sameday: 'Same Day',
  },
  coursebyCourse: {
    '8day': '8 Business Days',
    '5day': '5 Business Days',
    '3day': '3 Business Days',
    '24hour': '24 Hours',
    sameday: 'Same Day',
  },
  professionalExperience: {
    '21day': '21 Business Days',
    '7day': '7 Business Days',
    '3day': '3 Business Days',
  },
  positionEvaluation: {
    '10day': '10 Business Days',
    '5day': '5 Business Days',
    '3day': '3 Business Days',
    '2day': '2 Business Days',
  },
} as const

// Update the service selection part of the schema
const serviceTypeSchema = z
  .object({
    customizedService: z.object({
      required: z.boolean().default(false),
    }),
    foreignCredentialEvaluation: z.object({
      firstDegree: z.object({
        speed: z.enum(['7day', '3day', '24hour', 'sameday'] as const).optional(),
      }),
      secondDegrees: z.number().min(0).default(0),
    }),
    coursebyCourse: z.object({
      firstDegree: z.object({
        speed: z.enum(['8day', '5day', '3day', '24hour', 'sameday'] as const).optional(),
      }),
      secondDegrees: z.number().min(0).default(0),
    }),
    professionalExperience: z.object({
      speed: z.enum(['21day', '7day', '3day'] as const).optional(),
    }),
    positionEvaluation: z.object({
      speed: z.enum(['10day', '5day', '3day', '2day'] as const).optional(),
    }),
    translation: z.object({
      required: z.boolean().default(false),
    }),
  })
  .refine(
    (data) => {
      // At least one evaluation service must be selected
      return !!(
        data.customizedService.required ||
        data.foreignCredentialEvaluation.firstDegree.speed ||
        data.coursebyCourse.firstDegree.speed ||
        data.professionalExperience.speed ||
        data.positionEvaluation.speed
      )
    },
    {
      message: 'Please select at least one service',
      path: ['foreignCredentialEvaluation', 'firstDegree', 'speed'],
    }
  )

// Validation rules migrated from FCE-Form.tsx ??
export const formSchema = z.object({
  // 1. CLIENT INFORMATION
  name: z.string().min(2, { message: 'Please enter company/individual name' }),
  country: z
    .string({
      required_error: 'Please select country',
    })
    .nonempty({ message: 'Please select country' }),
  streetAddress: z.string().min(5, { message: 'Please enter street address' }),
  streetAddress2: z.string().optional(),
  city: z.string().min(2, { message: 'Please enter city name' }),
  region: z
    .string({
      required_error: 'Please select region',
    })
    .nonempty({ message: 'Please select region' }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: 'Please enter a valid ZIP code' }),
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, {
    message: 'Please enter a valid phone number in format: 123-456-7890',
  }),
  fax: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .superRefine((val, ctx) => {
      if (val && !val.match(/^\d{3}-\d{3}-\d{4}$/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid fax number in format: 123-456-7890',
          path: ['fax'],
        })
      }
    }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  office: z.enum(['Boston', 'New York', 'San Francisco', 'Los Angeles', 'Miami'], {
    required_error: 'Please select office',
  }),
  purpose: z.enum(
    [
      'translation',
      'evaluation-uscis',
      'evaluation-immigration',
      'evaluation-employment',
      'evaluation-education',
      'interpretation',
      'visa',
      'other',
    ],
    {
      required_error: 'Please select evaluation purpose',
    }
  ),
  purposeOther: z.string().optional(),

  // 2. EVALUEE INFORMATION
  pronouns: z
    .union([z.enum(['mr', 'ms', 'mx']), z.undefined()], {
      required_error: 'Please select your pronouns',
    })
    .refine((val) => val !== undefined, { message: 'Please select your pronouns' }),
  firstName: z
    .string()
    .min(1, { message: 'First name cannot be empty' })
    .refine((val) => val.trim().length > 0, { message: 'First name cannot contain only spaces' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name cannot be empty' })
    .refine((val) => val.trim().length > 0, { message: 'Last name cannot contain only spaces' }),
  middleName: z.string().optional(),
  dateOfBirth: z
    .object({
      month: z
        .string({ required_error: 'Please select month' })
        .nonempty({ message: 'Please select month' }),
      date: z
        .string({ required_error: 'Please select date' })
        .nonempty({ message: 'Please select date' }),
      year: z
        .string({ required_error: 'Please select year' })
        .nonempty({ message: 'Please select year' }),
    })
    .superRefine((data, ctx) => {
      const { year, month, date } = data
      if (!year || !month || !date) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: 'Please enter a valid Date of Birth',
          path: ['date'],
        })
      }

      // Check if date is valid
      const isValid = dayjs(`${year}-${month}-${date}`, 'YYYY-MM-DD', true).isValid()
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: 'Please enter a valid date',
          path: ['date'],
        })
      }

      // Check if date is in future
      const selectedDate = dayjs(`${year}-${month}-${date}`)
      if (selectedDate.isAfter(dayjs())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Birth date cannot be in the future',
          path: ['date'],
        })
      }
    }),

  // New education array field
  educations: z.array(educationSchema).optional(),

  // 3. SERVICE SELECTION
  serviceType: serviceTypeSchema,
  deliveryMethod: z
    .enum([
      'no_delivery_needed',
      'usps_first_class_domestic',
      'usps_first_class_international',
      'usps_priority_domestic',
      'usps_express_domestic',
      'ups_express_domestic',
      'usps_express_international',
      'fedex_express_international',
    ])
    .nullish()
    .transform((val) => val || undefined),
  additionalServices: z.array(z.enum(['extra_copy', 'pdf_with_hard_copy', 'pdf_only'])),
  additionalServicesQuantity: z
    .object({
      extra_copy: z.number().min(0).default(0),
      pdf_with_hard_copy: z.number().min(0).default(0),
      pdf_only: z.number().min(0).default(0),
    })
    .default({
      extra_copy: 0,
      pdf_with_hard_copy: 0,
      pdf_only: 0,
    }),
})

// You might want to export the education schema for reuse
export type EducationSchema = z.infer<typeof educationSchema>

// Export the speed options and types for use in the UI
export const SERVICE_SPEED_OPTIONS = speedOptions
export type ServiceTypeSchema = z.infer<typeof serviceTypeSchema>
