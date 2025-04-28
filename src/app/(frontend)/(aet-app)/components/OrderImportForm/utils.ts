import type { OrderFormData } from './types'
import type { DatabaseApplication } from '../FCEApplicationForm/types'

export const formatFormDataForSubmission = (
  formData: OrderFormData
): Partial<DatabaseApplication> & { notes?: string } => {
  return {
    first_name: formData.firstName,
    middle_name: formData.middleName || null,
    last_name: formData.lastName,
    purpose: formData.purpose,
    due_amount: parseFloat(formData.dueAmount),
    office: formData.office,
    paid_at: formData.paidAt?.toISOString() || null,
    notes: formData.notes,
  }
}

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}
