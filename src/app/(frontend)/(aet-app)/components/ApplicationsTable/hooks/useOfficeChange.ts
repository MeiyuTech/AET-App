/**
 * Custom hook for handling office changes in the ApplicationsTable
 * This hook encapsulates all the logic for updating an application's office
 * including validation, database updates, and local state management
 */
import { toast } from '@/hooks/use-toast'
import { createClient } from '../../../utils/supabase/client'
import { Application } from '../types'

/**
 * Hook for managing office changes
 * @param applications - Current applications array from the parent component's state
 * @param setApplications - State setter function for updating applications
 * @returns Object containing the handleOfficeChange function
 */
export const useOfficeChange = (
  applications: Application[],
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
) => {
  // Initialize Supabase client for database operations
  const supabase = createClient()

  /**
   * Handles the change of an application's office
   * @param id - The ID of the application to update
   * @param office - The new office value (can be null to clear the office)
   */
  const handleOfficeChange = async (id: string, office: string | null) => {
    try {
      // Find the target application in the current state
      const application = applications.find((app) => app.id === id)

      if (!application) {
        throw new Error('Application not found')
      }

      // Validate if the application can be updated
      // Only applications with 'submitted' status can have their office changed
      const status = application.status
      if (status !== 'submitted') {
        toast({
          title: 'Operation not allowed',
          description: 'Only applications with status "Submitted" can be updated.',
          variant: 'destructive',
        })
        return
      }

      // Update the office in the database
      const { error } = await supabase.from('fce_applications').update({ office }).eq('id', id)

      if (error) {
        console.error('Error updating office:', error)
        throw error
      }

      // Update the local state to reflect the change immediately
      // This provides a better user experience by not waiting for a refresh
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                office: office as 'Boston' | 'New York' | 'San Francisco' | 'Los Angeles' | 'Miami',
              }
            : app
        )
      )

      // Show success message to the user
      toast({
        title: 'Office updated',
        description: `Application office has been set to ${office || 'none'}.`,
      })
    } catch (error) {
      // Handle any errors that occurred during the update
      console.error('Error updating office:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the office. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Return the handler function to be used by the component
  return { handleOfficeChange }
}
