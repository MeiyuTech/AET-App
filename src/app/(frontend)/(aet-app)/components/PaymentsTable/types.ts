export interface Payment {
  id: string
  application_id: string | null
  due_amount: number
  payment_status: string
  paid_at: string | null
  payment_id: string | null
  source: string | null
}

export type PaymentStatus = 'paid' | 'pending' | 'failed'
