import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { createClient } from '../../../utils/supabase/client'
import { Application } from '../types'

export const useOfficeChange = (
  applications: Application[],
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
) => {
  const supabase = createClient()

  const handleOfficeChange = async (id: string, office: string | null) => {
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

      const { error } = await supabase.from('fce_applications').update({ office }).eq('id', id)

      if (error) {
        console.error('Error updating office:', error)
        throw error
      }

      // Update local state
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

      toast({
        title: 'Office updated',
        description: `Application office has been set to ${office || 'none'}.`,
      })
    } catch (error) {
      console.error('Error updating office:', error)
      toast({
        title: 'Update failed',
        description: 'Could not update the office. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return { handleOfficeChange }
}
