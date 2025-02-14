'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function EmailTester() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleTestEmail = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/test-email', {
        method: 'POST',
      })
      const data = await response.json()
      setResult(data.message || 'Email sent successfully')
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
