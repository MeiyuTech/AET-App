import { DatabaseApplication, DatabaseEducation } from '../FCEApplicationForm/types'

// Extend DatabaseApplication but override/add specific fields needed for the table
export interface Application extends Omit<DatabaseApplication, 'service_type' | 'educations'> {
  // Override service_type to match the structure we're getting from the database
  service_type: {
    id: string
    name: string
    description?: string
    price: number
  }

  // Use DatabaseEducation type directly
  educations?: DatabaseEducation[]

  payment_status: 'pending' | 'paid' | 'failed' | 'expired'
  payment_id: string | null
  paid_at: string | null
  due_amount: number | null
  source: 'internal' | 'external'
  notes?: string | null
}
