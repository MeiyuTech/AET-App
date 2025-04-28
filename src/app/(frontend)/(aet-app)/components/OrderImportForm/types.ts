import type { DatabaseApplication } from '../FCEApplicationForm/types'

export interface OrderFormData {
  firstName: string
  middleName: string
  lastName: string
  purpose: DatabaseApplication['purpose']
  dueAmount: string
  office: DatabaseApplication['office']
  paidAt: Date | undefined
  notes?: string
}

export const defaultFormValues: OrderFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  purpose: 'evaluation-uscis',
  dueAmount: '',
  office: 'Los Angeles',
  paidAt: undefined,
  notes: '',
}
