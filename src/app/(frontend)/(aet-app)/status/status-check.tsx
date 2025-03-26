'use client'

import { useState } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import {
  PURPOSE_OPTIONS,
  PRONOUN_OPTIONS,
  EVALUATION_SERVICES,
  DELIVERY_OPTIONS,
  getCountryLabel,
  ADDITIONAL_SERVICES,
} from '../components/ApplicationForm/constants'
import { FormData } from '../components/ApplicationForm/types'
import Uploader from '../components/Dropbox/Uploader'
import { verifyApplication } from '../utils/actions'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import PaymentOptions from '../components/AETPayment/PaymentOptions'

interface ApplicationData extends Partial<FormData> {
  status: string
  submitted_at: string
  due_amount: number
  payment_status: 'pending' | 'paid' | 'failed' | 'expired'
  payment_id: string | null
  paid_at: string | null
  additionalServices: ('extra_copy' | 'pdf_with_hard_copy' | 'pdf_only')[]
  additionalServicesQuantity: {
    extra_copy: number
    pdf_with_hard_copy: number
    pdf_only: number
  }
}

interface StatusCheckProps {
  initialApplicationId?: string
}

// add UUID validation function
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid)
}

const formatUUID = (input: string): string => {
  // remove all non-hexadecimal characters
  const cleaned = input.replace(/[^0-9a-f]/gi, '')

  // if the length is less than 32, return the cleaned string
  if (cleaned.length < 32) return cleaned

  // add hyphens to the UUID format
  return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20, 32)}`
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

  const calculateTotalPrice = () => {
    if (!application) return '0.00'

    let total = 0

    if (application.serviceType) {
      // Foreign Credential Evaluation
      const fceSpeed = application.serviceType.foreignCredentialEvaluation?.firstDegree?.speed
      const fceService = fceSpeed && EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE[fceSpeed]
      if (fceService) {
        total += fceService.price

        // Second Degrees
        if (application.serviceType.foreignCredentialEvaluation.secondDegrees > 0) {
          const secondDegreePrice =
            fceSpeed === '7day'
              ? EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price
              : EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT.price

          total +=
            secondDegreePrice * application.serviceType.foreignCredentialEvaluation.secondDegrees
        }
      }

      // Course by Course Evaluation
      const cbeSpeed = application.serviceType.coursebyCourse?.firstDegree?.speed
      const cbeService = cbeSpeed && EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE[cbeSpeed]
      if (cbeService) {
        total += cbeService.price

        // Second Degrees
        if (application.serviceType.coursebyCourse.secondDegrees > 0) {
          const secondDegreePrice =
            cbeSpeed === '8day'
              ? EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price
              : EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price

          total += secondDegreePrice * application.serviceType.coursebyCourse.secondDegrees
        }
      }

      // Professional Experience Evaluation
      const profExpSpeed = application.serviceType.professionalExperience?.speed
      const profExpService =
        profExpSpeed && EVALUATION_SERVICES.PROFESSIONAL_EXPERIENCE[profExpSpeed]
      if (profExpService) {
        total += profExpService.price
      }

      // Position Evaluation
      const posEvalSpeed = application.serviceType.positionEvaluation?.speed
      const posEvalService = posEvalSpeed && EVALUATION_SERVICES.POSITION[posEvalSpeed]
      if (posEvalService) {
        total += posEvalService.price
      }
    }

    // Delivery
    const deliveryService =
      application.deliveryMethod &&
      DELIVERY_OPTIONS[application.deliveryMethod as keyof typeof DELIVERY_OPTIONS]
    if (deliveryService) {
      total += deliveryService.price
    }

    // Additional Services
    application.additionalServices?.forEach((serviceId) => {
      const service = ADDITIONAL_SERVICES[serviceId]
      if (service) {
        if ('quantity' in service) {
          const quantity = application.additionalServicesQuantity?.[serviceId] || 0
          total += service.price * quantity
        } else {
          total += service.price
        }
      }
    })

    return total.toFixed(2)
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
          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium">Status</dt>
                  <dd className="text-muted-foreground">{application.status}</dd>
                </div>
                <div>
                  <dt className="font-medium">Submitted At</dt>
                  <dd className="text-muted-foreground">
                    {new Date(application.submitted_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Payment Status</dt>
                  <dd
                    className={`capitalize ${
                      application.payment_status === 'paid'
                        ? 'text-green-600'
                        : application.payment_status === 'failed'
                          ? 'text-red-600'
                          : application.payment_status === 'expired'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                    }`}
                  >
                    {application.payment_status}
                  </dd>
                </div>
                {application.paid_at ? (
                  <div>
                    <dt className="font-medium">Paid At</dt>
                    <dd className="text-muted-foreground">
                      {new Date(application.paid_at).toLocaleString()}
                    </dd>
                  </div>
                ) : (
                  <div>
                    <dt className="font-medium">Paid At</dt>
                    <dd className="text-muted-foreground">Not Paid</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

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
                        ? application.due_amount
                          ? `$${application.due_amount}`
                          : 'Due amount is not set yet'
                        : `$${calculateTotalPrice()}`}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  * Due amount may vary. We will provide an official quote based on your specific
                  situation.
                </div>

                {/* Add payment button if not paid */}
                {application.payment_status !== 'paid' &&
                  application.due_amount &&
                  application.due_amount !== 0 && (
                    <PaymentOptions
                      office={application.office}
                      payment_status={application.payment_status}
                      due_amount={application.due_amount}
                      applicationId={applicationId}
                      calculateTotalPrice={calculateTotalPrice}
                    />
                  )}
              </div>
            </CardContent>
          </Card>
          {/* File Upload Section 
          - only show when status is submitted or processing and office is not null
          */}
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
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div>
                          <span className="inline-flex items-center gap-1 cursor-pointer text-gray-500 hover:text-blue-900 transition-colors">
                            <strong>Evaluation</strong>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4" />
                              <path d="M12 8h.01" />
                            </svg>
                          </span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-120">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            - Scanned copies of your <strong>degree(s)</strong> and
                            <strong>transcript(s)</strong>
                            <br />- Official or <strong>certified English translations</strong>
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
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

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium">Company/Individual Name</dt>
                  <dd className="text-muted-foreground">{application.name}</dd>
                </div>

                <div>
                  <dt className="font-medium">Country</dt>
                  <dd className="text-muted-foreground">
                    {application.country ? getCountryLabel(application.country) : ''}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium">Street Address</dt>
                  <dd className="text-muted-foreground">
                    {application.streetAddress}
                    {application.streetAddress2 && <br />}
                    {application.streetAddress2}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium">Address</dt>
                  <dd className="text-muted-foreground">
                    {application.city ? `${application.city}, ` : ''}
                    {application.region || ''} {application.zipCode || ''}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium">Phone</dt>
                  <dd className="text-muted-foreground">{application.phone}</dd>
                </div>

                <div>
                  <dt className="font-medium">Fax</dt>
                  <dd className="text-muted-foreground">{application.fax || 'Not Provided'}</dd>
                </div>

                <div>
                  <dt className="font-medium">Email</dt>
                  <dd className="text-muted-foreground">{application.email}</dd>
                </div>

                <div>
                  <dt className="font-medium">Purpose</dt>
                  <dd className="text-muted-foreground">
                    {PURPOSE_OPTIONS.find((o) => o.value === application.purpose)?.label}
                    {application.purpose === 'other' && application.purposeOther && (
                      <span> - {application.purposeOther}</span>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Evaluee Information */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                {/* <div>
                  <dt className="font-medium">Name</dt>
                  <dd className="text-muted-foreground">
                    {[application.firstName, application.middleName, application.lastName]
                      .filter(Boolean)
                      .join(' ') || 'Not provided'}
                  </dd>
                </div> */}

                <div>
                  <dt className="font-medium">First Name</dt>
                  <dd className="text-muted-foreground">
                    {application.firstName || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Middle Name</dt>
                  <dd className="text-muted-foreground">
                    {application.middleName || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Last Name</dt>
                  <dd className="text-muted-foreground">
                    {application.lastName || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Date of Birth</dt>
                  <dd className="text-muted-foreground">
                    {application.dateOfBirth ? `${application.dateOfBirth}` : 'Not provided'}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium">Pronouns</dt>
                  <dd className="text-muted-foreground">
                    {PRONOUN_OPTIONS.find((o) => o.value === application.pronouns)?.label ||
                      'Not provided'}
                  </dd>
                </div>

                <div className="col-span-2">
                  <dt className="font-medium mb-2">Education Information</dt>
                  <dd className="space-y-4">
                    {application.educations?.length ? (
                      application.educations.map((education, index) => (
                        <div key={index} className="pl-4 border-l-2 border-muted">
                          <h4 className="font-medium text-sm mb-2">Degree {index + 1}</h4>
                          <dl className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <dt className="text-muted-foreground">Country</dt>
                              <dd>{education.countryOfStudy || 'Not provided'}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Degree</dt>
                              <dd>{education.degreeObtained || 'Not provided'}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">School</dt>
                              <dd>{education.schoolName || 'Not provided'}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Study Period</dt>
                              <dd>
                                {education.studyDuration
                                  ? `${education.studyDuration.startDate.month}/${education.studyDuration.startDate.year} - 
                                     ${education.studyDuration.endDate.month}/${education.studyDuration.endDate.year}`
                                  : 'Not provided'}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground">No education information provided</div>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
