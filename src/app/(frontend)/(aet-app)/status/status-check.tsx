'use client'

import { useState } from 'react'
import { verifyApplication } from '../utils/actions'

interface ApplicationData {
  id: string
  status: string
  submitted_at: string
  first_name: string
  last_name: string
  email: string
  service_type: any // TODO: type this properly
  delivery_method: string
}

export default function StatusCheck() {
  const [applicationId, setApplicationId] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [application, setApplication] = useState<ApplicationData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setApplication(null)

    if (!applicationId.trim()) {
      setError('Please enter an application ID')
      setIsLoading(false)
      return
    }

    try {
      const result = await verifyApplication(applicationId)

      if (result.exists && result.application) {
        setApplication(result.application)
      } else {
        setError('Application not found. Please check your application ID.')
      }
    } catch (err) {
      setError('Failed to check application status. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-1">
              Application ID
            </label>
            <input
              id="applicationId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your application ID"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Check Status'}
          </button>
        </form>
      </div>

      {application && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Application Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium">{application.status}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Submitted At</div>
                <div className="font-medium">
                  {new Date(application.submitted_at).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">
                  {application.first_name} {application.last_name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{application.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Delivery Method</div>
                <div className="font-medium">{application.delivery_method}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Services Requested</div>
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(application.service_type, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
