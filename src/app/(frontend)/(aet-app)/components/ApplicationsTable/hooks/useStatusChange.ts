import { toast } from '@/hooks/use-toast'
import { createClient } from '../../../utils/supabase/client'
import { Application } from '../types'

interface StatusChangeHookProps {
  applications: Application[]
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
  setPendingStatusChange: (
    data: { id: string; status: string; currentStatus: string } | null
  ) => void
  setStatusConfirmDialogOpen: (open: boolean) => void
  pendingStatusChange: { id: string; status: string; currentStatus: string } | null
}

/**
 * Hook for managing application status changes
 * Provides functionality to validate and prepare status updates
 */
export const useStatusChange = ({
  applications,
  setApplications,
  setPendingStatusChange,
  setStatusConfirmDialogOpen,
  pendingStatusChange,
}: StatusChangeHookProps) => {
  const supabase = createClient()

  /**
   * Prepares a status change for an application
   * Validates the change and opens confirmation dialog if valid
   * @param id - The ID of the application to update
   * @param newStatus - The new status to set
   */
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const currentStatus = application.status
      const paymentStatus = application.payment_status

      // Validate status change based on the rules
      if (
        newStatus === 'completed' &&
        !(currentStatus === 'processing' && paymentStatus === 'paid')
      ) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with status "Processing" and payment status "Paid" can be completed.',
          variant: 'destructive',
        })
        return
      }

      if (
        newStatus === 'cancelled' &&
        !(
          (currentStatus === 'processing' && paymentStatus !== 'paid') ||
          currentStatus === 'submitted'
        )
      ) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with status "Submitted" or "Processing" (if not paid) can be cancelled.',
          variant: 'destructive',
        })
        return
      }

      // Allow changing from submitted to processing if payment status is paid
      if (
        newStatus === 'processing' &&
        !(currentStatus === 'submitted' && paymentStatus === 'paid')
      ) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with status "Submitted" and payment status "Paid" can be marked as processing.',
          variant: 'destructive',
        })
        return
      }

      // Open confirmation dialog
      setPendingStatusChange({
        id,
        status: newStatus,
        currentStatus,
      })
      setStatusConfirmDialogOpen(true)
    } catch (error) {
      console.error('Error preparing status change:', error)
      toast({
        title: 'Operation failed',
        description: 'Could not prepare the status change. Please try again.',
        variant: 'destructive',
      })
    }
  }

  /**
   * Confirms and applies a pending status change
   * Updates both database and local state
   */
  const confirmStatusChange = async () => {
    try {
      if (!pendingStatusChange) return

      const { id, status } = pendingStatusChange

      const { error } = await supabase.from('fce_applications').update({ status }).eq('id', id)
      const { error: externalError } = await supabase
        .from('fce_external_orders')
        .update({ status })
        .eq('id', id)

      if (error || externalError) throw error || externalError

      // Update local state
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                status: status as 'completed' | 'cancelled' | 'draft' | 'submitted' | 'processing',
              }
            : app
        )
      )

      toast({
        title: 'Status updated',
        description: `Application status has been changed to ${status}.`,
      })

      // Clear the pending status change
      setPendingStatusChange(null)
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return {
    handleStatusChange,
    confirmStatusChange,
  }
}
