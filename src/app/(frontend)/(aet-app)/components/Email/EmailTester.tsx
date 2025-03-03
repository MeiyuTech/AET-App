'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { sendTestEmail, sendEmail } from '../../utils/email/actions'
import { getApplicationConfirmationEmailHTML } from '../../utils/email/config'

export default function EmailTester() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleTestEmail = async () => {
    try {
      setLoading(true)
      const { message } = await sendTestEmail()
      setResult(message)
    } catch (error) {
      setResult('Failed to send email')
      console.error('Email sending error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleTestEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Test Email Send'}
      </Button>
      {result && <div className="text-sm">Result: {result}</div>}
    </div>
  )
}

export function ApplicationConfirmationEmailTester() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleTestEmail = async () => {
    try {
      setLoading(true)
      const { message } = await await sendEmail({
        to: 'nietsemorej@gmail.com',
        // TODO: remove (test) after it's ready
        subject: '(test)AET Services Application Confirmation',
        html: getApplicationConfirmationEmailHTML(
          'St',
          'Jobs',
          ['Service 1', 'Service 2'],
          ['Delivery Time 1', 'Delivery Time 2'],
          'USPS First Class Domestic',
          ['pdf_only'],
          '1234567890',
          '2021-01-01'
        ),
      })
      setResult(message)
    } catch (error) {
      setResult('Failed to send email')
      console.error('Email sending error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleTestEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Send Application Confirmation Email'}
      </Button>
      {result && <div className="text-sm">Result: {result}</div>}
    </div>
  )
}
