'use client'

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

interface DueAmountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingDueAmount: { id: string; amount: number | null } | null
  onConfirm: () => void
}

export function DueAmountConfirmDialog({
  open,
  onOpenChange,
  pendingDueAmount,
  onConfirm,
}: DueAmountDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">Confirm Due Amount Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change the due amount to
            {pendingDueAmount?.amount !== null
              ? ` $${pendingDueAmount?.amount.toFixed(2)}`
              : ' none'}
            ?
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

interface StatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingChange: {
    id: string
    status: string
    currentStatus: string
    paymentMethod?: string
  } | null
  onConfirm: () => void
}

export function StatusConfirmDialog({
  open,
  onOpenChange,
  pendingChange,
  onConfirm,
}: StatusDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">Confirm Status Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change the status from &quot;{pendingChange?.currentStatus}
            &quot; to &quot;{pendingChange?.status}&quot;? This action cannot be undone.
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

export function PaymentStatusConfirmDialog({
  open,
  onOpenChange,
  pendingChange,
  onConfirm,
}: StatusDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Confirm Payment Status Change
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change the payment status from &quot;
            {pendingChange?.currentStatus}
            &quot; to &quot;{pendingChange?.status}&quot;? This action cannot be undone.
            <br />
            <br />
            Payment date will be set to current time.
            {pendingChange?.paymentMethod && (
              <>
                <br />
                <br />
                Payment method: {pendingChange.paymentMethod === 'zelle' ? 'Zelle' : 'PayPal'}
              </>
            )}
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
