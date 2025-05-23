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
    <div className="max-w-7xl mx-auto p-4">
      <Card className="p-8">
        {/* <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold">Quick Order Import</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Fill in the form below to import order data into the system
          </CardDescription>
        </CardHeader> */}
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            {/* Office and Service Type */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 space-y-3">
                <Label className="text-lg">
                  Office<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch('office')}
                  onValueChange={(value: OrderFormData['office']) => form.setValue('office', value)}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select office" />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFICE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-lg">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-3">
                <Label className="text-lg">
                  Service Type<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch('purpose')}
                  onValueChange={(value: OrderFormData['purpose']) =>
                    form.setValue('purpose', value)
                  }
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PURPOSE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-lg">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.purpose && (
                  <p className="text-base text-red-500">{form.formState.errors.purpose.message}</p>
                )}
              </div>
            </div>

            {/* Due Amount and Payment Time */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 space-y-3">
                <Label htmlFor="amount" className="text-lg">
                  Due Amount<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="h-12 text-lg"
                  {...form.register('dueAmount')}
                />
                {form.formState.errors.dueAmount && (
                  <p className="text-base text-red-500">
                    {form.formState.errors.dueAmount.message}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-3">
                <Label className="text-lg">
                  Payment Time<span className="text-red-500">*</span>
                </Label>
                <div className="relative flex items-center">
                  <div className="grow flex items-center gap-2 rounded-md border border-input bg-background px-3 py-3 text-lg">
                    <span>
                      {form.watch('paidAt')
                        ? form.watch('paidAt')!.toLocaleString()
                        : 'No date selected -> Click to select date and time'}
                    </span>
                    <DateTimePicker
                      date={form.watch('paidAt')}
                      setDate={(date) => form.setValue('paidAt', date)}
                      className="h-4 w-4 p-0 -ml-1"
                    />
                  </div>
                </div>
                {form.formState.errors.paidAt && (
                  <p className="text-base text-red-500">{form.formState.errors.paidAt.message}</p>
                )}
              </div>
            </div>

            {/* Client Name */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-lg">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input id="firstName" className="h-12 text-lg" {...form.register('firstName')} />
                {form.formState.errors.firstName && (
                  <p className="text-base text-red-500">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="middleName" className="text-lg">
                  Middle Name<span className="text-base text-gray-500 ml-2">(Optional)</span>
                </Label>
                <Input id="middleName" className="h-12 text-lg" {...form.register('middleName')} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-lg">
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input id="lastName" className="h-12 text-lg" {...form.register('lastName')} />
                {form.formState.errors.lastName && (
                  <p className="text-base text-red-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-lg">
                Notes<span className="text-base text-gray-500 ml-2">(Optional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes here..."
                className="resize-none text-lg min-h-[120px]"
                {...form.register('notes')}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full h-12 text-lg">
              Submit Order
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
