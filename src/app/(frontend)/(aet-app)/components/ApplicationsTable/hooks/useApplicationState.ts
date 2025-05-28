import { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { Application } from '../types'
import { DatabaseEducation } from '../../FCEApplicationForm/types'
import { fetchApplicationsList } from '../../../utils/actions'

interface ApplicationStateResult {
  // Data states
  applications: Application[]
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
  loading: boolean

  // Dialog states
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  servicesDialogOpen: boolean
  setServicesDialogOpen: (open: boolean) => void
  filesDialogOpen: boolean
  setFilesDialogOpen: (open: boolean) => void
  confirmDialogOpen: boolean
  setConfirmDialogOpen: (open: boolean) => void
  statusConfirmDialogOpen: boolean
  setStatusConfirmDialogOpen: (open: boolean) => void
  paymentStatusConfirmDialogOpen: boolean
  setPaymentStatusConfirmDialogOpen: (open: boolean) => void
  paymentLinkDialogOpen: boolean
  setPaymentLinkDialogOpen: (open: boolean) => void
  paidAtConfirmDialogOpen: boolean
  setPaidAtConfirmDialogOpen: (open: boolean) => void

  // Selection states
  selectedEducations: DatabaseEducation[] | undefined
  setSelectedEducations: (educations: DatabaseEducation[] | undefined) => void
  selectedApplication: Application | undefined
  setSelectedApplication: (application: Application | undefined) => void
  selectedApplicationForPayment: { id: string; amount: number } | null
  setSelectedApplicationForPayment: (data: { id: string; amount: number } | null) => void

  // Pending change states
  pendingDueAmount: { id: string; amount: number | null } | null
  setPendingDueAmount: (data: { id: string; amount: number | null } | null) => void
  pendingStatusChange: { id: string; status: string; currentStatus: string } | null
  setPendingStatusChange: (
    data: { id: string; status: string; currentStatus: string } | null
  ) => void
  pendingPaymentStatusChange: {
    id: string
    status: string
    currentStatus: string
    paymentMethod: string
  } | null
  setPendingPaymentStatusChange: (
    data: {
      id: string
      status: string
      currentStatus: string
      paymentMethod: string
    } | null
  ) => void
  pendingPaidAtChange: { id: string; paidAt: Date | null } | null
  setPendingPaidAtChange: (data: { id: string; paidAt: Date | null } | null) => void
}

/**
 * Hook for managing application state and data fetching
 */
export const useApplicationState = (dataFilter: string): ApplicationStateResult => {
  // Data states
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [servicesDialogOpen, setServicesDialogOpen] = useState(false)
  const [filesDialogOpen, setFilesDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [statusConfirmDialogOpen, setStatusConfirmDialogOpen] = useState(false)
  const [paymentStatusConfirmDialogOpen, setPaymentStatusConfirmDialogOpen] = useState(false)
  const [paymentLinkDialogOpen, setPaymentLinkDialogOpen] = useState(false)
  const [paidAtConfirmDialogOpen, setPaidAtConfirmDialogOpen] = useState(false)

  // Selection states
  const [selectedEducations, setSelectedEducations] = useState<DatabaseEducation[] | undefined>(
    undefined
  )
  const [selectedApplication, setSelectedApplication] = useState<Application | undefined>(undefined)
  const [selectedApplicationForPayment, setSelectedApplicationForPayment] = useState<{
    id: string
    amount: number
  } | null>(null)

  // Pending change states
  const [pendingDueAmount, setPendingDueAmount] = useState<{
    id: string
    amount: number | null
  } | null>(null)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: string
    status: string
    currentStatus: string
  } | null>(null)
  const [pendingPaymentStatusChange, setPendingPaymentStatusChange] = useState<{
    id: string
    status: string
    currentStatus: string
    paymentMethod: string
  } | null>(null)
  const [pendingPaidAtChange, setPendingPaidAtChange] = useState<{
    id: string
    paidAt: Date | null
  } | null>(null)

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true)
        // Get applications data from database (Supabase)
        const result = await fetchApplicationsList(dataFilter)

        if (!result.success || !result.applications) {
          toast({
            title: 'Error',
            description: result.error || 'Failed to fetch applications',
            variant: 'destructive',
          })
          return
        }

        setApplications(result.applications)
      } catch (error) {
        console.error('Error loading applications:', error)
        toast({
          title: 'Error',
          description: 'Failed to load applications. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [dataFilter])

  return {
    // Data states
    applications,
    setApplications,
    loading,

    // Dialog states
    dialogOpen,
    setDialogOpen,
    servicesDialogOpen,
    setServicesDialogOpen,
    filesDialogOpen,
    setFilesDialogOpen,
    confirmDialogOpen,
    setConfirmDialogOpen,
    statusConfirmDialogOpen,
    setStatusConfirmDialogOpen,
    paymentStatusConfirmDialogOpen,
    setPaymentStatusConfirmDialogOpen,
    paymentLinkDialogOpen,
    setPaymentLinkDialogOpen,
    paidAtConfirmDialogOpen,
    setPaidAtConfirmDialogOpen,

    // Selection states
    selectedEducations,
    setSelectedEducations,
    selectedApplication,
    setSelectedApplication,
    selectedApplicationForPayment,
    setSelectedApplicationForPayment,

    // Pending change states
    pendingDueAmount,
    setPendingDueAmount,
    pendingStatusChange,
    setPendingStatusChange,
    pendingPaymentStatusChange,
    setPendingPaymentStatusChange,
    pendingPaidAtChange,
    setPendingPaidAtChange,
  }
}
