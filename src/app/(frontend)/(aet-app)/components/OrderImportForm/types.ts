import type { DatabaseApplication } from '../FCEApplicationForm/types'

export interface OrderFormData {
  firstName: string
  middleName: string
  lastName: string
  purpose: DatabaseApplication['purpose']
  serviceAmount: string
  paymentId: string
  office: DatabaseApplication['office']
  paidTime: Date | undefined
}

export const defaultFormValues: OrderFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  purpose: 'evaluation-uscis',
  serviceAmount: '',
  paymentId: '',
  office: 'Los Angeles',
  paidTime: undefined,
}
