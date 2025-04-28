import * as z from 'zod'

export const orderFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  purpose: z.enum(['evaluation-uscis', 'evaluation-employment', 'evaluation-education'] as const, {
    required_error: 'Please select a service type',
  }),
  serviceAmount: z.string().min(1, 'Service amount is required'),
  paymentId: z.string().min(1, 'Payment ID is required'),
  office: z.enum(['Los Angeles', 'Miami', 'San Francisco'] as const, {
    required_error: 'Please select an office',
  }),
  paidTime: z.date({
    required_error: 'Please select a payment date',
  }),
})
