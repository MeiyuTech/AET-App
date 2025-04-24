import { toast } from '@/hooks/use-toast'
import { createClient } from '../../../utils/supabase/client'
import { Application } from '../types'
import { sendDueAmountChangeEmail } from '../../../utils/email/actions'

/**
 * Hook for managing due amount changes in applications
 * Provides functionality to update the due amount with validation and state management
 */
export const useDueAmountChange = (
  applications: Application[],
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
) => {
  const supabase = createClient()

  /**
   * Updates the due amount for a specific application
   * @param id - The ID of the application to update
   * @param due_amount - The new due amount (can be null to clear the amount)
   */
  const handleDueAmountChange = async (id: string, due_amount: number | null) => {
    try {
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      const status = application.status
      if (status !== 'submitted') {
        toast({
          title: 'Operation not allowed',
          description: 'Only applications with status "Submitted" can be updated.',
          variant: 'destructive',
        })
        return
      }

      const { error } = await supabase.from('fce_applications').update({ due_amount }).eq('id', id)

      if (error) throw error

      // Update local state
      setApplications((apps) => apps.map((app) => (app.id === id ? { ...app, due_amount } : app)))

      // Send email notification
      await sendDueAmountChangeEmail(id)

      toast({
        title: 'Due amount updated',
        description: `Application due amount has been set to ${due_amount !== null ? `$${due_amount.toFixed(2)}` : 'none'}.`,
      })
    } catch (error) {
      console.error('Error updating due amount:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the due amount. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return { handleDueAmountChange }
}
