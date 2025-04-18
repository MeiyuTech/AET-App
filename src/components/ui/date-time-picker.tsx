'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, X, Check } from 'lucide-react'

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
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date ? format(date, 'HH:mm') : format(new Date(), 'HH:mm')
  )

  // 当外部 date 改变时，更新内部状态
  React.useEffect(() => {
    setSelectedDate(date)
    setSelectedTime(date ? format(date, 'HH:mm') : format(new Date(), 'HH:mm'))
  }, [date])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setSelectedTime(newTime)

    if (selectedDate) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(selectedDate)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      setSelectedDate(newDate)
    }
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
    }
    setSelectedDate(newDate)
  }

  const handleConfirm = () => {
    setDate(selectedDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedDate(date)
    setSelectedTime(date ? format(date, 'HH:mm') : format(new Date(), 'HH:mm'))
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              <Input
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {date && !disabled && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-8 top-0 h-8 w-8 p-0 opacity-70 hover:opacity-100"
          onClick={() => {
            setDate(undefined)
            setIsOpen(false)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
