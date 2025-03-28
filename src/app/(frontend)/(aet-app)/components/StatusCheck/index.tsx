'use client'

import { useState } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import {
  EVALUATION_SERVICES,
  DELIVERY_OPTIONS,
  ADDITIONAL_SERVICES,
} from '../FCEApplicationForm/constants'
import { ApplicationData } from '../FCEApplicationForm/types'
import { calculateTotalPrice } from '../FCEApplicationForm/utils'

import Uploader from '../Dropbox/Uploader'
import { verifyApplication } from '../../utils/actions'

import PaymentOptions from '../AETPayment/PaymentOptions'

import { formatUUID, isValidUUID } from './utils'
import ApplicationStatusCard from './ApplicationStatusCard'
import InfoHoverCard from './InfoHoverCard'
import ClientInfoCard from './ClientInfoCard'
import EvalueeInfoCard from './EvalueeInfoCard'

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

          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="font-medium">Purpose:</div>
                <div className="pl-4">{application.purpose}</div>
              </div>
              {/* Customized Service */}
              {application.serviceType?.customizedService?.required && (
                <div>
                  <div className="font-medium">Customized Service</div>
                  <div className="pl-4">Price Will Be Quoted Upon Request</div>
                </div>
              )}

              {/* Foreign Credential Evaluation */}
              {application.serviceType?.foreignCredentialEvaluation?.firstDegree?.speed && (
                <div>
                  <h4 className="font-medium mb-2">Educational Foreign Credential Evaluation</h4>
                  <div className="pl-4 space-y-2">
                    {(() => {
                      const speed =
                        application.serviceType.foreignCredentialEvaluation.firstDegree.speed
                      const service =
                        speed && EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE[speed]
                      return (
                        service && (
                          <>
                            <div>
                              First Degree: {service.label} - ${service.price}
                            </div>
                            {application.serviceType.foreignCredentialEvaluation.secondDegrees >
                              0 && (
                              <div>
                                Second Degree:{' '}
                                {application.serviceType.foreignCredentialEvaluation.secondDegrees}{' '}
                                × $
                                {EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price}{' '}
                                = $
                                {EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day']
                                  .price *
                                  application.serviceType.foreignCredentialEvaluation.secondDegrees}
                              </div>
                            )}
                          </>
                        )
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Course by Course */}
              {application.serviceType?.coursebyCourse?.firstDegree?.speed && (
                <div>
                  <div className="font-medium">Course-by-course Evaluation</div>
                  <div className="pl-4 space-y-2">
                    {(() => {
                      const speed = application.serviceType.coursebyCourse.firstDegree.speed
                      const service =
                        speed && EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE[speed]
                      return (
                        service && (
                          <>
                            <div>
                              First Degree: {service.label} - ${service.price}
                            </div>
                            {application.serviceType.coursebyCourse.secondDegrees > 0 && (
                              <div>
                                Second Degree:{' '}
                                {application.serviceType.coursebyCourse.secondDegrees} × $
                                {EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price} =
                                $
                                {EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price *
                                  application.serviceType.coursebyCourse.secondDegrees}
                              </div>
                            )}
                          </>
                        )
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Professional Experience */}
              {/* Expert Opinion Letter */}
              {application.serviceType?.professionalExperience?.speed && (
                <div>
                  <div className="font-medium">Expert Opinion Letter</div>
                  <div className="pl-4">
                    {(() => {
                      const speed = application.serviceType.professionalExperience.speed
                      const service = speed && EVALUATION_SERVICES.PROFESSIONAL_EXPERIENCE[speed]
                      return service ? `${service.label} - $${service.price}` : null
                    })()}
                  </div>
                </div>
              )}

              {/* Position Evaluation */}
              {application.serviceType?.positionEvaluation?.speed && (
                <div>
                  <div className="font-medium">Position Evaluation</div>
                  <div className="pl-4">
                    {(() => {
                      const speed = application.serviceType.positionEvaluation.speed
                      const service = speed && EVALUATION_SERVICES.POSITION[speed]
                      return service ? `${service.label} - $${service.price}` : null
                    })()}
                  </div>
                </div>
              )}

              {/* Translation Service */}
              {application.serviceType?.translation?.required && (
                <div>
                  <div className="font-medium">Translation Service</div>
                  <div className="pl-4">Price Will Be Quoted Upon Request</div>
                </div>
              )}

              {/* Type of Delivery */}
              {application.deliveryMethod && (
                <div>
                  <div className="font-medium">Type of Delivery</div>
                  <div className="pl-4">
                    {(() => {
                      const method = application.deliveryMethod
                      const service =
                        method && DELIVERY_OPTIONS[method as keyof typeof DELIVERY_OPTIONS]
                      return service
                        ? `${service.label} - $${service.price.toFixed(2)}`
                        : 'No Delivery Needed - Free'
                    })()}
                  </div>
                </div>
              )}

              {/* Additional Services */}
              {application.additionalServices?.length > 0 && (
                <div>
                  <div className="font-medium">Additional Services</div>
                  <div className="pl-4 space-y-1">
                    {application.additionalServices.map((serviceId) => {
                      const service = ADDITIONAL_SERVICES[serviceId]
                      if (service) {
                        if (serviceId === 'extra_copy' && 'quantity' in service) {
                          // only handle extra_copy quantity
                          const quantity = application.additionalServicesQuantity.extra_copy
                          return (
                            <div key={serviceId}>
                              {service.label} × {quantity} = $
                              {(service.price * quantity).toFixed(2)}
                            </div>
                          )
                        } else {
                          return (
                            <div key={serviceId}>
                              {service.label} - ${service.price.toFixed(2)}
                            </div>
                          )
                        }
                      }
                      return null
                    })}
                  </div>
                </div>
              )}

              {/* Total Price */}
              <div className="pt-4 border-t">
                <div className="font-medium">
                  {application.due_amount ? (
                    <div className="font-medium">Due Amount: ${application.due_amount}</div>
                  ) : (
                    <div className="font-medium">
                      Estimated Total:{' '}
                      {application.serviceType?.translation?.required ||
                      application.serviceType?.customizedService?.required
                        ? 'Due amount is not set yet'
                        : `$${calculateTotalPrice(application)}`}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  * This fee applies to most applications but it may vary for some applicants. We
                  will reconfirm your service details during the evaluation process. If any
                  adjustments are needed, we will contact you—any overpayment will be refunded, and
                  underpayment will be collected. Thank you for your trust!
                </div>

                {/* Add payment button if not paid */}
                {/* Amount validation */}
                {application.payment_status !== 'paid' && (
                  <>
                    {!application.serviceType?.translation?.required &&
                    !application.serviceType?.customizedService?.required ? (
                      <PaymentOptions application={application} applicationId={applicationId} />
                    ) : application.due_amount ? (
                      <PaymentOptions application={application} applicationId={applicationId} />
                    ) : (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-700">
                          Payment is not available until the due amount is set by our staff.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

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
