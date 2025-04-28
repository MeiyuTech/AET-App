import type { OrderFormData } from './types'
import type { DatabaseApplication } from '../FCEApplicationForm/types'

export const formatFormDataForSubmission = (
  formData: OrderFormData
): Partial<DatabaseApplication> => {
  return {
    first_name: formData.firstName,
    middle_name: formData.middleName || null,
    last_name: formData.lastName,
    purpose: formData.purpose,
    due_amount: parseFloat(formData.serviceAmount),
    payment_id: formData.paymentId || null,
    office: formData.office,
    paid_at: formData.paidTime?.toISOString() || null,
    payment_status: 'paid',
  }
}

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}
