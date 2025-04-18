import React from 'react'
import dayjs from 'dayjs'
import { cn } from '@/utilities/cn'

interface CompletionProgressBarProps {
  estimatedDate: string
  className?: string
}

/**
 * Progress bar component that displays progress based on current date and estimated completion date
 * Uses different colors to indicate different states:
 * - Green: On track or completed
 * - Yellow: In progress but approaching deadline
 * - Red: Past the estimated completion date
 */
export function CompletionProgressBar({ estimatedDate, className }: CompletionProgressBarProps) {
  // Parse the estimated completion date
  const estimatedCompletionDate = dayjs(estimatedDate)
  const today = dayjs()

  // Calculate the difference in days between estimated completion date and today
  const daysDifference = estimatedCompletionDate.diff(today, 'day')

  // Determine progress bar status and color
  let status: 'on-track' | 'at-risk' | 'overdue' = 'on-track'
  let progressColor = 'bg-green-500'

  if (daysDifference < 0) {
    // Past the estimated completion date
    status = 'overdue'
    progressColor = 'bg-red-500'
  } else if (daysDifference <= 2) {
    // Approaching deadline
    status = 'at-risk'
    progressColor = 'bg-yellow-500'
  } else if (daysDifference > 7) {
    // Plenty of time remaining
    status = 'on-track'
    progressColor = 'bg-green-500'
  }

  // Calculate progress percentage (based on estimated completion date)
  // Assuming total processing time is 14 days
  const totalDays = 14
  const daysElapsed = Math.max(0, totalDays - daysDifference)
  const progressPercentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100))

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium">
          {status === 'on-track' && 'In Progress'}
          {status === 'at-risk' && 'Approaching Deadline'}
          {status === 'overdue' && 'Overdue'}
        </span>
        <span>
          {daysDifference < 0
            ? `${Math.abs(daysDifference)} days overdue`
            : `${daysDifference} days remaining`}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Estimated completion: {estimatedCompletionDate.format('YYYY-MM-DD')}
      </div>
    </div>
  )
}
