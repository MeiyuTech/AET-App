import { toast } from '@/hooks/use-toast'
import { createClient } from '../../../utils/supabase/client'
import { Application } from '../types'

interface PaidAtChangeHookProps {
  applications: Application[]
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
  setPendingPaidAtChange: (
    data: {
      id: string
      paidAt: Date | null
    } | null
  ) => void
  setPaidAtConfirmDialogOpen: (open: boolean) => void
  pendingPaidAtChange: {
    id: string
    paidAt: Date | null
  } | null
}

/**
 * Hook for managing paid_at date changes in applications
 * Provides functionality to validate and prepare paid_at date updates
 */
export const usePaidAtChange = ({
  applications,
  setApplications,
  setPendingPaidAtChange,
  setPaidAtConfirmDialogOpen,
  pendingPaidAtChange,
}: PaidAtChangeHookProps) => {
  const supabase = createClient()

  /**
   * Prepares a paid_at date change for an application
   * Validates the change and opens confirmation dialog if valid
   * @param id - The ID of the application to update
   * @param paidAt - The new paid_at date to set
   */
  const handlePaidAtChange = async (id: string, paidAt: Date | null) => {
    try {
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const paymentStatus = application.payment_status
      if (paymentStatus !== 'pending' && paymentStatus !== 'expired') {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with payment status "Pending" or "Expired" can be modified.',
          variant: 'destructive',
        })
        return
      }

      // Open confirmation dialog
      setPendingPaidAtChange({
        id,
        paidAt,
      })
      setPaidAtConfirmDialogOpen(true)
    } catch (error) {
      console.error('Error preparing paid_at change:', error)
      toast({
        title: 'Operation failed',
        description: 'Could not prepare the paid_at change. Please try again.',
        variant: 'destructive',
      })
    }
  }

  /**
   * Confirms and applies a pending paid_at date change
   * Updates both database and local state
   */
  const confirmPaidAtChange = async () => {
    if (!pendingPaidAtChange) return

    try {
      const { id, paidAt } = pendingPaidAtChange
      const paid_at = paidAt ? paidAt.toISOString() : null

      // Update paid_at
      const { error } = await supabase.from('fce_applications').update({ paid_at }).eq('id', id)

      if (error) throw error

      // Update local state
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                paid_at,
              }
            : app
        )
      )

      toast({
        title: 'Payment date updated',
        description: `Payment date has been ${paidAt ? 'set' : 'cleared'}.`,
      })
    } catch (error) {
      console.error('Error updating payment date:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the payment date. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setPendingPaidAtChange(null)
      setPaidAtConfirmDialogOpen(false)
    }
  }

  return {
    handlePaidAtChange,
    confirmPaidAtChange,
  }
}
