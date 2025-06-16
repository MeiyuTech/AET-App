import { toast } from '@/hooks/use-toast'
import { createClient } from '../../../utils/supabase/client'

interface AiOutputChangeHookProps {
  setPendingAiOutputChange: (
    data: { id: string; educationId: string; aiOutput: string } | null
  ) => void
  setConfirmDialogOpen: (open: boolean) => void
  pendingAiOutputChange: { id: string; educationId: string; aiOutput: string } | null
}

/**
 * Hook for managing AI output changes
 * Provides functionality to validate and prepare AI output updates
 */
export const useAiOutputChange = ({
  setPendingAiOutputChange,
  setConfirmDialogOpen,
  pendingAiOutputChange,
}: AiOutputChangeHookProps) => {
  const supabase = createClient()

  /**
   * Prepares an AI output change for an education
   * Opens confirmation dialog if valid
   */
  const handleAiOutputChange = async (id: string, educationId: string, newAiOutput: string) => {
    try {
      // Open confirmation dialog
      setPendingAiOutputChange({
        id,
        educationId,
        aiOutput: newAiOutput,
      })
      setConfirmDialogOpen(true)
    } catch (error) {
      console.error('Error preparing AI output change:', error)
      toast({
        title: 'Failed to prepare AI output change',
        description: 'Failed to prepare AI output change. Please try again.',
        variant: 'destructive',
      })
    }
  }

  /**
   * Confirms and applies a pending AI output change
   * Updates both database and local state
   */
  const confirmAiOutputChange = async () => {
    try {
      if (!pendingAiOutputChange) return

      const { educationId, aiOutput } = pendingAiOutputChange

      const { error } = await supabase
        .from('aet_core_educations')
        .update({ ai_output: aiOutput })
        .eq('id', educationId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'AI output has been updated.',
      })

      // Clear the pending change
      setPendingAiOutputChange(null)
    } catch (error) {
      console.error('Error updating AI output:', error)
      toast({
        title: 'Failed to update AI output',
        description: 'Failed to update AI output. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return {
    handleAiOutputChange,
    confirmAiOutputChange,
  }
}
