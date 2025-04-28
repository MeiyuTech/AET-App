'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

import { OFFICE_OPTIONS, PURPOSE_OPTIONS } from '../FCEApplicationForm/constants'
import { orderFormSchema } from './schema'
import { formatFormDataForSubmission } from './utils'
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
      const formattedData = formatFormDataForSubmission(data)
      // TODO: Implement API call
      console.log(formattedData)

      toast({
        title: 'Success',
        description: 'Order has been imported successfully.',
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
            <Label>Office</Label>
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
            <Label>Payment Time</Label>
            <div className="relative flex items-center">
              <div className="grow flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                <DateTimePicker
                  date={form.watch('paidTime')}
                  setDate={(date) => form.setValue('paidTime', date)}
                  className="h-4 w-4 p-0 -ml-1"
                />
                <span className="text-sm">
                  {form.watch('paidTime')
                    ? form.watch('paidTime')!.toLocaleString()
                    : 'No date selected'}
                </span>
              </div>
            </div>
          </div>

          {/* Client Name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...form.register('firstName')} />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" {...form.register('middleName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...form.register('lastName')} />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label>Service Type</Label>
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

          {/* Service Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Service Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              {...form.register('serviceAmount')}
            />
            {form.formState.errors.serviceAmount && (
              <p className="text-sm text-red-500">{form.formState.errors.serviceAmount.message}</p>
            )}
          </div>

          {/* Payment ID */}
          <div className="space-y-2">
            <Label htmlFor="paymentId">Payment ID</Label>
            <Input id="paymentId" {...form.register('paymentId')} />
            {form.formState.errors.paymentId && (
              <p className="text-sm text-red-500">{form.formState.errors.paymentId.message}</p>
            )}
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
