'use client'

import { useState, useEffect } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { fetchFCEApplication } from '../../utils/actions'

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
import { useTranslations } from 'next-intl'

interface StatusCheckProps {
  initialApplicationId?: string
}

export default function StatusCheck({ initialApplicationId }: StatusCheckProps) {
  const [applicationId, setApplicationId] = useState(initialApplicationId || '')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [application, setApplication] = useState<ApplicationData | null>(null)
  const t = useTranslations('status')
  const tCommon = useTranslations('common')

  // Helper function to update URL with the applicationId parameter
  // This keeps the URL in sync with the current application being viewed
  const updateURL = (ApplicationId: string) => {
    const url = new URL(window.location.href)
    if (ApplicationId) {
      url.searchParams.set('applicationId', ApplicationId)
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
  const checkApplicationStatus = async (ApplicationId: string) => {
    // Skip if application ID is empty
    if (!ApplicationId.trim()) {
      return
    }

    // Validate the format of the application ID
    if (!isValidUUID(ApplicationId)) {
      setError(t('errors.invalidInput'))
      return
    }

    // Reset state before fetching
    setError('')
    setIsLoading(true)
    setApplication(null)

    try {
      // Fetch application data from server
      const result = await fetchFCEApplication(ApplicationId)

      console.log('result:', result)

      if (result.success && result.applicationData) {
        setApplication(result.applicationData)
      } else {
        setError(t('errors.notFound'))
      }
    } catch (err) {
      setError(t('errors.fetchFailed'))
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
                {t('form.applicationIdLabel')}
              </label>
              <input
                id="applicationId"
                type="text"
                value={applicationId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder={t('form.applicationIdPlaceholder')}
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
              {isLoading ? t('form.button.loading') : t('form.button.idle')}
            </button>
          </form>
        </CardContent>
      </Card>

      {application && (
        <>
          <ApplicationStatusCard applicationData={application} />
          {/* File Upload Section */}
          {application.status &&
            ['submitted', 'processing'].includes(application.status.toLowerCase()) &&
            application.office && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('upload.title', { office: application.office })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{t('upload.description')}</p>
                  <div className="mb-2">
                    <InfoHoverCard
                      title={t('upload.infoTitle')}
                      content={
                        <p className="text-sm text-muted-foreground">
                          {t('upload.infoDescription')}
                        </p>
                      }
                    />
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>
                        {t.rich('upload.list.degrees', {
                          strong: (chunks) => <strong>{chunks}</strong>,
                        })}
                      </li>
                      <li>
                        {t.rich('upload.list.translations', {
                          strong: (chunks) => <strong>{chunks}</strong>,
                        })}
                      </li>
                    </ul>
                  </div>

                  {/* Add uploaded files viewer */}
                  <div className="mb-6">
                    <Viewer
                      office={application.office}
                      applicationId={applicationId}
                      fullName={
                        [application.firstName, application.middleName, application.lastName]
                          .filter(Boolean)
                          .join(' ') || tCommon('notProvided')
                      }
                    />
                  </div>

                  {/* Add file uploader */}
                  <Uploader
                    office={application.office}
                    submittedAt={application.submitted_at}
                    applicationId={applicationId}
                    fullName={
                      [application.firstName, application.middleName, application.lastName]
                        .filter(Boolean)
                        .join(' ') || tCommon('notProvided')
                    }
                  />
                </CardContent>
              </Card>
            )}

          <SelectedServicesCard application={application} />

          {/* Payment Card */}
          {application.payment_status !== 'paid' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('payment.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                {!application.serviceType?.translation?.required &&
                !application.serviceType?.customizedService?.required ? (
                  <PaymentOptions application={application} applicationId={applicationId} />
                ) : application.due_amount ? (
                  <PaymentOptions application={application} applicationId={applicationId} />
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">{t('payment.pendingNotice')}</p>
                  </div>
                )}
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
