'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
}

export function DateTimePicker({
  date,
  setDate,
  className,
  disabled = false,
}: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date ? format(date, 'HH:mm') : format(new Date(), 'HH:mm')
  )

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setSelectedTime(newTime)

    if (date) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      setDate(newDate)
    }
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
    }
    setDate(newDate)
  }

  return (
    <div className="relative inline-block">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8 p-0', !date && 'text-muted-foreground', className)}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Input
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-[120px]"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {date && !disabled && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-8 top-0 h-8 w-8 p-0 opacity-70 hover:opacity-100"
          onClick={() => setDate(undefined)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
