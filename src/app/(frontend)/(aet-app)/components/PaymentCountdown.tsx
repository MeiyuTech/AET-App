'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import {} from '@/components/ui/button'
import { getPaymentDeadline } from './StatusCheck/utils'
interface PaymentCountdownProps {
  submittedAt: string
  paymentStatus: string
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

export default function PaymentCountdown({ submittedAt, paymentStatus }: PaymentCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  })

  useEffect(() => {
    // Calculate deadline (48 hours after submission)
    const deadline = getPaymentDeadline(submittedAt)

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = deadline.getTime() - now.getTime()

      if (difference <= 0 || paymentStatus !== 'pending') {
        return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 }
      }

      const totalSeconds = Math.floor(difference / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      return { hours, minutes, seconds, totalSeconds }
    }

    // Only run timer if payment is still pending
    if (paymentStatus === 'pending') {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft()
        setTimeLeft(newTimeLeft)

        if (newTimeLeft.totalSeconds <= 0) {
          clearInterval(timer)
        }
      }, 1000)

      // Initial calculation
      setTimeLeft(calculateTimeLeft())

      return () => clearInterval(timer)
    }
  }, [submittedAt, paymentStatus])

  if (paymentStatus === 'paid') {
    return null
  }

  if (timeLeft.totalSeconds <= 0) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h3 className="font-medium text-red-800">Payment Deadline Expired</h3>
        </div>
        <p className="text-sm text-red-700 mb-3">
          Your payment deadline has expired. You may{' '}
          <a href="#footer" className="text-amber-500">
            contact support
          </a>{' '}
          to reactivate your application.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <h3 className="font-medium text-amber-800">Payment Required</h3>
      </div>

      <p className="text-sm text-amber-700 mb-3">
        Please complete your payment to proceed with application processing. Your application will
        expire if payment is not received in time.
      </p>

      <div className="flex items-center justify-center gap-4 my-3">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-700">
            {timeLeft.hours.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-amber-600">Hours</span>
        </div>
        <span className="text-xl font-bold text-amber-700">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-700">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-amber-600">Minutes</span>
        </div>
        <span className="text-xl font-bold text-amber-700">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-700">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-amber-600">Seconds</span>
        </div>
      </div>
    </div>
  )
}
