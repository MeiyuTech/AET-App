import { toast } from '@/hooks/use-toast'
import { createClient } from '../../../utils/supabase/client'
import { Application } from '../types'

interface PaymentStatusChangeHookProps {
  applications: Application[]
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
  setPendingPaymentStatusChange: (
    data: {
      id: string
      status: string
      currentStatus: string
      paymentMethod: string
    } | null
  ) => void
  setPaymentStatusConfirmDialogOpen: (open: boolean) => void
  pendingPaymentStatusChange: {
    id: string
    status: string
    currentStatus: string
    paymentMethod: string
  } | null
}

/**
 * Hook for managing payment status changes in applications
 * Provides functionality to validate and prepare payment status updates
 */
export const usePaymentStatusChange = ({
  applications,
  setApplications,
  setPendingPaymentStatusChange,
  setPaymentStatusConfirmDialogOpen,
  pendingPaymentStatusChange,
}: PaymentStatusChangeHookProps) => {
  const supabase = createClient()

  /**
   * Prepares a payment status change for an application
   * Validates the change and opens confirmation dialog if valid
   * @param id - The ID of the application to update
   * @param newStatus - The new payment status to set
   * @param paymentMethod - The method of payment (e.g., 'zelle', 'paypal')
   */
  const handlePaymentStatusChange = async (
    id: string,
    newStatus: string,
    paymentMethod: string
  ) => {
    try {
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const currentStatus = application.payment_status

      // Only allow changing from pending or expired to paid
      if (newStatus === 'paid' && !(currentStatus === 'pending' || currentStatus === 'expired')) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with payment status "Pending" or "Expired" can be marked as paid.',
          variant: 'destructive',
        })
        return
      }

      // Open confirmation dialog
      setPendingPaymentStatusChange({
        id,
        status: newStatus,
        currentStatus,
        paymentMethod,
      })
      setPaymentStatusConfirmDialogOpen(true)
    } catch (error) {
      console.error('Error preparing payment status change:', error)
      toast({
        title: 'Operation failed',
        description: 'Could not prepare the payment status change. Please try again.',
        variant: 'destructive',
      })
    }
  }

  /**
   * Confirms and applies a pending payment status change
   * Updates both database and local state
   */
  const confirmPaymentStatusChange = async () => {
    try {
      if (!pendingPaymentStatusChange) return

      const { id, status, paymentMethod } = pendingPaymentStatusChange

      // Find the application to get its current paid_at value
      const application = applications.find((app) => app.id === id)
      if (!application) {
        throw new Error('Application not found')
      }

      // Use existing paid_at if available, otherwise use current time
      const paid_at = application.paid_at || (status === 'paid' ? new Date().toISOString() : null)
      const payment_id =
        paymentMethod === 'zelle' ? 'Marked as Paid via Zelle' : 'Marked as Paid via Paypal'

      // Update both payment_status and paid_at
      const { error } = await supabase
        .from('fce_applications')
        .update({ payment_status: status, paid_at, payment_id })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                payment_status: status as 'pending' | 'paid' | 'failed' | 'expired',
                paid_at,
                payment_id,
              }
            : app
        )
      )

      toast({
        title: 'Payment status updated',
        description: `Payment status has been changed to ${status} via ${paymentMethod}.`,
      })

      // Clear the pending payment status change
      setPendingPaymentStatusChange(null)
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the payment status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return {
    handlePaymentStatusChange,
    confirmPaymentStatusChange,
  }
}
