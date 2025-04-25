'use client'

import { useState } from 'react'
import { format } from 'date-fns'

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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'

export function OrderImportForm() {
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    serviceType: '',
    serviceAmount: '',
    paymentId: '',
    office: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log({
      paidTime: date,
      ...formData,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quick Order Import</CardTitle>
        <CardDescription>
          Fill in the form below to import order data into the system
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Payment Time */}
          <div className="space-y-2">
            <Label>Payment Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Client Name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="translation">Translation Service</SelectItem>
                <SelectItem value="evaluation">Evaluation Service</SelectItem>
                <SelectItem value="authentication">Authentication Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Service Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.serviceAmount}
              onChange={(e) => setFormData({ ...formData, serviceAmount: e.target.value })}
              required
            />
          </div>

          {/* Payment ID */}
          <div className="space-y-2">
            <Label htmlFor="paymentId">Payment ID</Label>
            <Input
              id="paymentId"
              value={formData.paymentId}
              onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
              required
            />
          </div>

          {/* Office */}
          <div className="space-y-2">
            <Label>Office</Label>
            <Select
              value={formData.office}
              onValueChange={(value) => setFormData({ ...formData, office: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select office" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ny">New York Office</SelectItem>
                <SelectItem value="ca">California Office</SelectItem>
              </SelectContent>
            </Select>
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
