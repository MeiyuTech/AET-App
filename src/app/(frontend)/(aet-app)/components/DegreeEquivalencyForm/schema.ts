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

// Validation rules migrated from FCE-Form.tsx ??
export const formSchema = z.object({
  // 1. CLIENT INFORMATION
  country: z
    .string({
      required_error: 'Please select country',
    })
    .nonempty({ message: 'Please select country' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  purpose: z.enum(
    [
      'translation',
      'evaluation-uscis',
      'evaluation-immigration',
      'evaluation-employment',
      'evaluation-education',
      'interpretation',
      'visa',
      'degree-equivalency',
      'other',
    ],
    {
      required_error: 'Please select evaluation purpose',
    }
  ),
  purposeOther: z.string().optional(),

  // 2. EVALUEE INFORMATION
  firstName: z
    .string()
    .min(1, { message: 'First name cannot be empty' })
    .refine((val) => val.trim().length > 0, { message: 'First name cannot contain only spaces' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name cannot be empty' })
    .refine((val) => val.trim().length > 0, { message: 'Last name cannot contain only spaces' }),
  middleName: z.string().optional(),

  // New education array field
  educations: z.array(educationSchema).optional(),
})

// You might want to export the education schema for reuse
export type EducationSchema = z.infer<typeof educationSchema>
