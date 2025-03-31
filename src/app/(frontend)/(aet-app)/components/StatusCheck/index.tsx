'use client'

import { useState, useEffect } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { fetchApplication } from '../../utils/actions'

import PaymentOptions from '../AETPayment/PaymentOptions'
import Uploader from '../Dropbox/Uploader'
import Viewer from '../Dropbox/Viewer'
import { ApplicationData } from '../FCEApplicationForm/types'

import ApplicationStatusCard from './ApplicationStatusCard'
import ClientInfoCard from './ClientInfoCard'
import EvalueeInfoCard from './EvalueeInfoCard'
import InfoHoverCard from './InfoHoverCard'
import SelectedServicesCard from './SelectedServicesCard'
import { formatUUID, isValidUUID } from './utils'

interface StatusCheckProps {
  initialApplicationId?: string
}

export default function StatusCheck({ initialApplicationId }: StatusCheckProps) {
  const [applicationId, setApplicationId] = useState(initialApplicationId || '')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [application, setApplication] = useState<ApplicationData | null>(null)

  // Helper function to update URL with the applicationId parameter
  // This keeps the URL in sync with the current application being viewed
  const updateURL = (id: string) => {
    const url = new URL(window.location.href)
    if (id) {
      url.searchParams.set('applicationId', id)
    } else {
      url.searchParams.delete('applicationId')
    }
    window.history.pushState({}, '', url)
  }

  // Handle changes to the input field, formatting the UUID as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUUID(e.target.value)
    setApplicationId(formatted)
  }

  // Core function to fetch and validate application status
  // Extracted as a separate function to be reused in multiple places
  const checkApplicationStatus = async (id: string) => {
    // Skip if application ID is empty
    if (!id.trim()) {
      return
    }

    // Validate the format of the application ID
    if (!isValidUUID(id)) {
      setError('Please enter a valid application ID')
      return
    }

    // Reset state before fetching
    setError('')
    setIsLoading(true)
    setApplication(null)

    try {
      // Fetch application data from server
      const result = await fetchApplication(id)

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
  }

  // Handle form submission when user clicks the "Check Status" button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    checkApplicationStatus(applicationId)
    updateURL(applicationId)
  }

  // Auto-load application data when component mounts or when initialApplicationId changes
  // This enables automatic data loading when the page is loaded with a applicationId in the URL
  useEffect(() => {
    if (initialApplicationId && isValidUUID(initialApplicationId)) {
      checkApplicationStatus(initialApplicationId)
    }
  }, [initialApplicationId]) // Only re-run effect if initialApplicationId changes

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
                    <InfoHoverCard
                      title="For Credential Evaluation:"
                      content={
                        <p className="text-sm text-muted-foreground">
                          Foreign Credential Evaluation is a service that assesses educational
                          backgrounds and qualifications obtained outside the United States. It is
                          crucial for foreign nationals seeking work authorization (H1B),
                          immigration status, employment, education, or military recruitment in the
                          U.S.
                          <br />
                          <br />
                        </p>
                      }
                    />
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>
                        Scanned copies of your <strong>degree(s)</strong> and{' '}
                        <strong>transcript(s)</strong>
                      </li>
                      <li>
                        <strong>Official or certified English translations</strong>
                      </li>
                    </ul>
                  </div>

                  {/* 添加已上传文件查看器 */}
                  <div className="mb-6">
                    <Viewer
                      office={application.office}
                      applicationId={applicationId}
                      fullName={
                        [application.firstName, application.middleName, application.lastName]
                          .filter(Boolean)
                          .join(' ') || 'Not provided'
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
