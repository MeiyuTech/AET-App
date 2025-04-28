'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { createClient } from '@/app/(frontend)/(aet-app)/utils/supabase/client'

import { OFFICE_OPTIONS, PURPOSE_OPTIONS } from '../FCEApplicationForm/constants'
import { orderFormSchema } from './schema'
import { defaultFormValues } from './types'
import type { OrderFormData } from './types'

export function OrderImportForm() {
  const { toast } = useToast()
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: defaultFormValues,
  })

  const handleSubmit = async (data: OrderFormData) => {
    try {
      const client = createClient()

      // Insert into fce_external_orders table
      const { error: insertError } = await client.from('fce_external_orders').insert({
        first_name: data.firstName,
        middle_name: data.middleName || null,
        last_name: data.lastName,
        purpose: data.purpose,
        due_amount: parseFloat(data.dueAmount),
        office: data.office,
        paid_at: data.paidAt?.toISOString(),
        notes: data.notes || null,
      })

      if (insertError) {
        throw insertError
      }

      toast({
        title: ' 🎉 Order Imported Successfully!  🎉',
        description: `Your order has been successfully imported.`,
        className: 'bg-green-50 border border-green-200 text-green-800',
      })
      form.reset(defaultFormValues)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to import order. Please try again.',
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quick Order Import</CardTitle>
        <CardDescription>
          Fill in the form below to import order data into the system
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-4">
          {/* Office */}
          <div className="space-y-2">
            <Label>
              Office<span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.watch('office')}
              onValueChange={(value: OrderFormData['office']) => form.setValue('office', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select office" />
              </SelectTrigger>
              <SelectContent>
                {OFFICE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Time */}
          <div className="space-y-2">
            <Label>
              Payment Time<span className="text-red-500">*</span>
            </Label>
            <div className="relative flex items-center">
              <div className="grow flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                <DateTimePicker
                  date={form.watch('paidAt')}
                  setDate={(date) => form.setValue('paidAt', date)}
                  className="h-4 w-4 p-0 -ml-1"
                />
                <span className="text-sm">
                  {form.watch('paidAt')
                    ? form.watch('paidAt')!.toLocaleString()
                    : 'No date selected'}
                </span>
              </div>
            </div>
            {form.formState.errors.paidAt && (
              <p className="text-sm text-red-500">{form.formState.errors.paidAt.message}</p>
            )}
          </div>

          {/* Client Name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name<span className="text-red-500">*</span>
              </Label>
              <Input id="firstName" {...form.register('firstName')} />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">
                Middle Name<span className="text-sm text-gray-500 ml-2">(Optional)</span>
              </Label>
              <Input id="middleName" {...form.register('middleName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name<span className="text-red-500">*</span>
              </Label>
              <Input id="lastName" {...form.register('lastName')} />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label>
              Service Type<span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.watch('purpose')}
              onValueChange={(value: OrderFormData['purpose']) => form.setValue('purpose', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {PURPOSE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.purpose && (
              <p className="text-sm text-red-500">{form.formState.errors.purpose.message}</p>
            )}
          </div>

          {/* Due Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Due Amount<span className="text-red-500">*</span>
            </Label>
            <Input id="amount" type="number" min="0" step="0.01" {...form.register('dueAmount')} />
            {form.formState.errors.dueAmount && (
              <p className="text-sm text-red-500">{form.formState.errors.dueAmount.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes<span className="text-sm text-gray-500 ml-2">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes here..."
              className="resize-none"
              {...form.register('notes')}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Submit Order
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
