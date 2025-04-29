'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Application } from './types'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utilities/cn'
import { format } from 'date-fns'

interface DueAmountSummaryProps {
  applications: Application[]
}

export function DueAmountSummary({ applications }: DueAmountSummaryProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // Calculate the total due amount for the specified time range
  const calculateTotalDueAmount = () => {
    if (!startDate || !endDate) return 0

    // Filter applications by payment_at date range and only include paid applications
    return applications
      .filter((app) => {
        // Only include applications that are paid and have a valid paid_at date
        if (!app.paid_at || app.payment_status !== 'paid') return false

        try {
          const paymentAt = new Date(app.paid_at)
          // Check if the date is valid
          if (isNaN(paymentAt.getTime())) return false

          // Set time to start of day for startDate and end of day for endDate
          const start = new Date(startDate)
          start.setHours(0, 0, 0, 0)
          const end = new Date(endDate)
          end.setHours(23, 59, 59, 999)

          return paymentAt >= start && paymentAt <= end
        } catch (error) {
          console.error('Invalid date:', app.paid_at)
          console.error('Error:', error)
          return false
        }
      })
      .reduce((total, app) => total + (app.due_amount || 0), 0)
  }

  // Get the number of applications in the specified time range
  const getApplicationCount = () => {
    if (!startDate || !endDate) return 0

    // Filter applications by payment_at date range and only include paid applications
    return applications.filter((app) => {
      // Only include applications that are paid and have a valid paid_at date
      if (!app.paid_at || app.payment_status !== 'paid') return false

      try {
        const paymentAt = new Date(app.paid_at)
        // Check if the date is valid
        if (isNaN(paymentAt.getTime())) return false

        // Set time to start of day for startDate and end of day for endDate
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        return paymentAt >= start && paymentAt <= end
      } catch (error) {
        console.error('Invalid date:', app.paid_at)
        console.error('Error:', error)
        return false
      }
    }).length
  }

  const totalDueAmount = calculateTotalDueAmount()
  const applicationCount = getApplicationCount()

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold">
          Total Due Amount Summary (Paid Applications)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <div className="flex flex-col space-y-2">
              <label className="text-base font-semibold">Start Date</label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'yyyy-MM-dd') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  className="h-10 w-10 p-0"
                  onClick={() => setStartDate(undefined)}
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col space-y-2">
              <label className="text-base font-semibold">End Date</label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'yyyy-MM-dd') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  className="h-10 w-10 p-0"
                  onClick={() => setEndDate(undefined)}
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-700 mb-2">Total Paid Applications</p>
            <p className="text-4xl font-bold">{applicationCount}</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-700 mb-2">Total Due Amount (Paid)</p>
            <p className="text-4xl font-bold">${totalDueAmount.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
