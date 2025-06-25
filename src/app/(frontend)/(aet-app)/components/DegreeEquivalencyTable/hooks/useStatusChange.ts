import { toast } from '@/hooks/use-toast'
import { createClient } from '@/app/(frontend)/(aet-app)/utils/supabase/client'
import { DatabaseCoreApplication } from '../../DegreeEquivalencyForm/types'
import { sendDEResultsConfirmationEmail } from '@/app/(frontend)/(aet-app)/utils/email/actions'

interface StatusChangeHookProps {
  applications: DatabaseCoreApplication[]
  setApplications: React.Dispatch<React.SetStateAction<DatabaseCoreApplication[]>>
  setPendingStatusChange: (
    data: { id: string; status: string; currentStatus: string } | null
  ) => void
  setStatusConfirmDialogOpen: (open: boolean) => void
  pendingStatusChange: { id: string; status: string; currentStatus: string } | null
}

/**
 * Hook for managing degree equivalency application status changes
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

      // Get payment status from aet_core_payments table
      const { data: paymentData, error: paymentError } = await supabase
        .from('aet_core_payments')
        .select('payment_status')
        .eq('application_id', id)
        .single()

      if (paymentError) {
        console.error('Error fetching payment status:', paymentError)
        throw new Error('Failed to fetch payment status')
      }

      const paymentStatus = paymentData?.payment_status || 'unpaid'

      // Validate status change based on the rules
      if (
        newStatus === 'completed' &&
        !(currentStatus === 'processing' && paymentStatus === 'paid')
      ) {
        toast({
          title: 'Operation not allowed',
          description:
            'Only applications with status "Processing" and payment status "Paid" can be marked as completed.',
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
            'Only applications with status "Submitted" or "Processing" (not paid) can be cancelled.',
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
            'Only applications with status "Submitted" and payment status "Paid" can be marked as "Processing".',
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
        title: 'Failed to prepare status change',
        description: 'Failed to prepare status change. Please try again.',
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

      // Get the application data before updating
      const { data: applicationData, error: fetchError } = await supabase
        .from('aet_core_applications')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Update application status
      const { error } = await supabase.from('aet_core_applications').update({ status }).eq('id', id)

      if (error) throw error

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

      // console.log('useStatusChange.tsx Send confirmation email')
      // console.log('Status changed to:', status)
      // console.log('Application data:', applicationData)

      // If status is changed to completed, send confirmation email
      if (status === 'completed' && applicationData) {
        try {
          // Get education data for email
          const { data: educationData, error: educationError } = await supabase
            .from('aet_core_educations')
            .select('*')
            .eq('application_id', id)
            .single()

          if (educationError) {
            console.error('Error fetching education data:', {
              error: educationError,
              applicationId: id,
            })
            throw educationError
          }

          // Send confirmation email
          // console.log('Sending degree equivalency confirmation email:', {
          //   email: applicationData.email,
          //   countryOfStudy: educationData.country_of_study,
          //   degreeObtained: educationData.degree_obtained,
          //   schoolName: educationData.school_name,
          //   studyStartDate: educationData.study_start_date,
          //   studyEndDate: educationData.study_end_date,
          //   aiOutput: educationData.ai_output,
          // })

          const { success, message } = await sendDEResultsConfirmationEmail(
            applicationData.email,
            applicationData.first_name,
            applicationData.last_name,
            applicationData.id,
            {
              countryOfStudy: educationData.country_of_study,
              degreeObtained: educationData.degree_obtained,
              schoolName: educationData.school_name,
              studyStartDate: educationData.study_start_date,
              studyEndDate: educationData.study_end_date,
              aiOutput: educationData.ai_output,
            }
          )

          if (!success) {
            console.error('Error sending degree equivalency confirmation email:', {
              message,
              applicationId: id,
              email: applicationData.email,
            })
            throw new Error(message)
          }

          // console.log('Successfully sent degree equivalency confirmation email:', {
          //   applicationId: id,
          //   email: applicationData.email,
          // })
        } catch (emailError) {
          console.error('Error in email sending process:', {
            error: emailError,
            applicationId: id,
            email: applicationData.email,
          })
          // Don't throw the error here, as the status change was successful
          // Just show a warning toast
          toast({
            title: 'Warning',
            description: 'Status was updated but failed to send confirmation email.',
            variant: 'destructive',
          })
        }
      }

      toast({
        title: 'Status updated',
        description: `Application status has been updated to ${status}.`,
      })

      // Clear the pending status change
      setPendingStatusChange(null)
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: 'Failed to update status',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return {
    handleStatusChange,
    confirmStatusChange,
  }
}
