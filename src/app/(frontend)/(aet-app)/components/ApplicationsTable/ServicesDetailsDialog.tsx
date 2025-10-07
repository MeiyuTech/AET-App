'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { NextIntlClientProvider } from 'next-intl'
import enMessages from 'messages/en.json'
import { Application } from './types'
import SelectedServicesCard from '../StatusCheck/SelectedServicesCard'
import { ApplicationData } from '../FCEApplicationForm/types'

interface ServicesDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: Application
}

export function ServicesDetailsDialog({ open, onOpenChange, application }: ServicesDetailsProps) {
  if (!application) return null

  // Convert Application type to ApplicationData type for SelectedServicesCard
  const applicationData: ApplicationData = {
    purpose: application.purpose,
    purposeOther: application.purpose_other || '',
    serviceType: application.service_type as any,
    deliveryMethod: application.delivery_method as any,
    additionalServices: application.additional_services as any,
    additionalServicesQuantity: application.additional_services_quantity,
    due_amount: application.due_amount || 0,
    status: application.status,
    submitted_at: application.submitted_at || new Date().toISOString(),
    payment_status: application.payment_status,
    payment_id: application.payment_id,
    paid_at: application.paid_at,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>
        </DialogHeader>
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <SelectedServicesCard application={applicationData} />
        </NextIntlClientProvider>
      </DialogContent>
    </Dialog>
  )
}
