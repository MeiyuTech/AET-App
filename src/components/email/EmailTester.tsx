'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { sendTestEmail } from '@/app/(frontend)/(fce-form)/components/FCE-Form/actions'

export function EmailTester() {
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
