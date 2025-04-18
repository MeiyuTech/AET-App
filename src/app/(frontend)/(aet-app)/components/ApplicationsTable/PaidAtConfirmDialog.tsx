'use client'

import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface PaidAtDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingChange: {
    id: string
    paidAt: Date | null
  } | null
  onConfirm: () => void
}

export function PaidAtConfirmDialog({
  open,
  onOpenChange,
  pendingChange,
  onConfirm,
}: PaidAtDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">Confirm Payment Date Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {pendingChange?.paidAt ? 'set' : 'clear'} the payment date
            {pendingChange?.paidAt ? ` to ${format(pendingChange.paidAt, 'PPP')}` : ''}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
