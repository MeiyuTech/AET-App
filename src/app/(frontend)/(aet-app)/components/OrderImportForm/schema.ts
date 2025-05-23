import * as z from 'zod'

export const orderFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  purpose: z.enum(['evaluation-uscis', 'evaluation-employment', 'evaluation-education'] as const, {
    required_error: 'Please select a service type',
  }),
  dueAmount: z.string().min(1, 'Due amount is required'),
  office: z.enum(['Los Angeles', 'Miami', 'San Francisco'] as const, {
    required_error: 'Please select an office',
  }),
  paidAt: z.date({
    required_error: 'Payment time is required',
    invalid_type_error: 'Please select a valid payment time',
  }),
  notes: z.string().optional(),
})
