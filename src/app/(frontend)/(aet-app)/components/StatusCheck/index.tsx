'use client'

import { useState } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { ApplicationData } from '../FCEApplicationForm/types'

import Uploader from '../Dropbox/Uploader'
import { verifyApplication } from '../../utils/actions'

import PaymentOptions from '../AETPayment/PaymentOptions'

import { formatUUID, isValidUUID } from './utils'
import ApplicationStatusCard from './ApplicationStatusCard'
import InfoHoverCard from './InfoHoverCard'
import ClientInfoCard from './ClientInfoCard'
import EvalueeInfoCard from './EvalueeInfoCard'
import SelectedServicesCard from './SelectedServicesCard'

interface StatusCheckProps {
  initialApplicationId?: string
}

export default function StatusCheck({ initialApplicationId }: StatusCheckProps) {
  const [applicationId, setApplicationId] = useState(initialApplicationId || '')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [application, setApplication] = useState<ApplicationData | null>(null)

  const updateURL = (id: string) => {
    const url = new URL(window.location.href)
    if (id) {
      url.searchParams.set('applicationId', id)
    } else {
      url.searchParams.delete('applicationId')
    }
    window.history.pushState({}, '', url)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUUID(e.target.value)
    setApplicationId(formatted)
  }

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

    if (!isValidUUID(applicationId)) {
      setError('Please enter a valid application ID')
      setIsLoading(false)
      return
    }

    try {
      const result = await verifyApplication(applicationId)

      if (result.exists && result.application) {
        setApplication(result.application as unknown as ApplicationData)
        console.log(result.application)
      } else {
        setError('Application not found. Please check your application ID.')
      }
    } catch (err) {
      setError('Failed to check application status. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }

    updateURL(applicationId)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="applicationId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Application ID
              </label>
              <input
                id="applicationId"
                type="text"
                value={applicationId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx"
                pattern="^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
                maxLength={36}
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
        </CardContent>
      </Card>

      {application && (
        <>
          <ApplicationStatusCard application={application} />
          <SelectedServicesCard application={application} />

          {/* Payment Card */}
          {application.payment_status !== 'paid' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                {!application.serviceType?.translation?.required &&
                !application.serviceType?.customizedService?.required ? (
                  <PaymentOptions application={application} applicationId={applicationId} />
                ) : application.due_amount ? (
                  <PaymentOptions application={application} applicationId={applicationId} />
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      Payment is not available until the due amount is set by our staff.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* File Upload Section */}
          {application.status &&
            ['submitted', 'processing'].includes(application.status.toLowerCase()) &&
            application.office && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents to {application.office} Office</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can upload additional documents related to your application:
                    <br />
                    <br />
                  </p>
                  <div className="mb-2">
                    For example,
                    <br />
                    <InfoHoverCard
                      title="Credential Evaluation"
                      content={
                        <p className="text-sm text-muted-foreground">
                          - Scanned copies of your <strong>degree(s)</strong> and
                          <strong>transcript(s)</strong>
                          <br />- Official or <strong>certified English translations</strong>
                        </p>
                      }
                    />
                  </div>
                  <Uploader
                    office={application.office}
                    applicationId={applicationId}
                    fullName={
                      [application.firstName, application.middleName, application.lastName]
                        .filter(Boolean)
                        .join(' ') || 'Not provided'
                    }
                  />
                </CardContent>
              </Card>
            )}

          <ClientInfoCard application={application} />
          <EvalueeInfoCard application={application} />
        </>
      )}
    </div>
  )
}
