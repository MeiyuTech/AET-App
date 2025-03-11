'use client'

import { useState } from 'react'
// import { useToast } from '@/hooks/use-toast'

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
import StripeInlinePricingWithID from '../components/Stripe/InlinePricingWithID'
import { verifyApplication } from '../utils/actions'
// import { createPayment } from '../utils/stripe/actions'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

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
  // const { toast } = useToast()

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

  // const calculateTotalPrice = () => {
  //   if (!application) return '0.00'

  //   let total = 0

  //   if (application.serviceType) {
  //     // Foreign Credential Evaluation
  //     const fceSpeed = application.serviceType.foreignCredentialEvaluation?.firstDegree?.speed
  //     const fceService = fceSpeed && EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE[fceSpeed]
  //     if (fceService) {
  //       total += fceService.price

  //       // Second Degrees
  //       if (application.serviceType.foreignCredentialEvaluation.secondDegrees > 0) {
  //         const secondDegreePrice =
  //           fceSpeed === '7day'
  //             ? EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price
  //             : EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT.price

  //         total +=
  //           secondDegreePrice * application.serviceType.foreignCredentialEvaluation.secondDegrees
  //       }
  //     }

  //     // Course by Course Evaluation
  //     const cbeSpeed = application.serviceType.coursebyCourse?.firstDegree?.speed
  //     const cbeService = cbeSpeed && EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE[cbeSpeed]
  //     if (cbeService) {
  //       total += cbeService.price

  //       // Second Degrees
  //       if (application.serviceType.coursebyCourse.secondDegrees > 0) {
  //         const secondDegreePrice =
  //           cbeSpeed === '8day'
  //             ? EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price
  //             : EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price

  //         total += secondDegreePrice * application.serviceType.coursebyCourse.secondDegrees
  //       }
  //     }

  //     // Professional Experience Evaluation
  //     const profExpSpeed = application.serviceType.professionalExperience?.speed
  //     const profExpService =
  //       profExpSpeed && EVALUATION_SERVICES.PROFESSIONAL_EXPERIENCE[profExpSpeed]
  //     if (profExpService) {
  //       total += profExpService.price
  //     }

  //     // Position Evaluation
  //     const posEvalSpeed = application.serviceType.positionEvaluation?.speed
  //     const posEvalService = posEvalSpeed && EVALUATION_SERVICES.POSITION[posEvalSpeed]
  //     if (posEvalService) {
  //       total += posEvalService.price
  //     }
  //   }

  //   // Delivery
  //   const deliveryService =
  //     application.deliveryMethod &&
  //     DELIVERY_OPTIONS[application.deliveryMethod as keyof typeof DELIVERY_OPTIONS]
  //   if (deliveryService) {
  //     total += deliveryService.price
  //   }

  //   // Additional Services
  //   application.additionalServices?.forEach((serviceId) => {
  //     const service = ADDITIONAL_SERVICES[serviceId]
  //     if (service) {
  //       if ('quantity' in service) {
  //         const quantity = application.additionalServicesQuantity?.[serviceId] || 0
  //         total += service.price * quantity
  //       } else {
  //         total += service.price
  //       }
  //     }
  //   })

  //   return total.toFixed(2)
  // }

  // const handlePayment = async () => {
  //   try {
  //     const amount = application?.due_amount
  //       ? (application.due_amount as number).toString()
  //       : calculateTotalPrice()
  //     const response = await createPayment({ amount, applicationId })

  //     const data = await response.json()

  //     if (!response.ok) {
  //       throw new Error(data.error || 'Payment creation failed')
  //     }

  //     window.location.href = data.url
  //   } catch (error) {
  //     console.error('Payment creation failed:', error)
  //     toast({
  //       variant: 'destructive',
  //       title: 'Error',
  //       description: error instanceof Error ? error.message : 'Payment creation failed',
  //     })
  //   }
  // }

  // Handle payment based on office location
  const handleOfficePaymentAction = () => {
    if (!application || !application.office) {
      console.log('No application or office found')
      return
    }

    window.open('https://www.americantranslationservice.com/e_pay.html', '_blank')
    // // Direct payment link for Boston and New York offices
    // if (['Boston', 'New York'].includes(application.office)) {
    //   // Replace with actual payment link for Boston/ New York
    //   window.open('https://www.americantranslationservice.com/e_pay.html', '_blank')
    // } else if (['Los Angeles', 'San Francisco', 'Miami'].includes(application.office)) {
    //   // Use Stripe payment flow for Los Angeles, San Francisco, and Miami offices
    //   window.open('/stripe-test', '_blank')
    // } else {
    //   // Default behavior for unknown offices
    //   console.log('Unknown office:', application.office)
    //   window.open('https://www.americantranslationservice.com/e_pay.html', '_blank')
    // }
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
                  <p className="text-sm text-muted-foreground mb-4">
                    You can upload additional documents related to your application here.
                  </p>
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
                <div>
                  <dt className="font-medium">Name</dt>
                  <dd className="text-muted-foreground">
                    {[application.firstName, application.middleName, application.lastName]
                      .filter(Boolean)
                      .join(' ') || 'Not provided'}
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

          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                            <div>First Degree: {service.label}</div>
                            {application.serviceType.foreignCredentialEvaluation.secondDegrees >
                              0 && (
                              <div>
                                Additional Degrees:{' '}
                                {application.serviceType.foreignCredentialEvaluation.secondDegrees}
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
                            <div>First Degree: {service.label}</div>
                            {application.serviceType.coursebyCourse.secondDegrees > 0 && (
                              <div>
                                Additional Degrees:{' '}
                                {application.serviceType.coursebyCourse.secondDegrees}
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
              {application.serviceType?.professionalExperience?.speed && (
                <div>
                  <div className="font-medium">Professional Experience Evaluation</div>
                  <div className="pl-4">
                    {(() => {
                      const speed = application.serviceType.professionalExperience.speed
                      const service = speed && EVALUATION_SERVICES.PROFESSIONAL_EXPERIENCE[speed]
                      return service ? service.label : null
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
                      return service ? service.label : null
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
                      return service ? service.label : 'No Delivery Needed'
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
                              {service.label} × {quantity}
                            </div>
                          )
                        } else {
                          return <div key={serviceId}>{service.label}</div>
                        }
                      }
                      return null
                    })}
                  </div>
                </div>
              )}

              {/* Total Price */}
              <div className="pt-4 border-t">
                {/* <div className="font-medium">
                  <div className="font-medium">
                    Estimated Total:{' '}
                    {application.serviceType?.translation?.required ||
                    application.serviceType?.customizedService?.required
                      ? application.due_amount
                        ? `$${application.due_amount}`
                        : 'Due amount is not set yet'
                      : `$${calculateTotalPrice()}`}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  * Actual price may vary. We will provide an official quote based on your specific
                  situation.
                </div> */}

                {/* Add payment button if not paid */}
                {(application.office === 'Boston' || application.office === 'New York') &&
                  application.payment_status !== 'paid' && (
                    <>
                      <div className="mt-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem
                            value="zelle"
                            className="border rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 flex items-center gap-2">
                              <div className="flex items-center gap-2 text-blue-700">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-credit-card"
                                >
                                  <rect width="20" height="14" x="2" y="5" rx="2" />
                                  <line x1="2" x2="22" y1="10" y2="10" />
                                </svg>
                                <span className="font-medium">
                                  We Recommend Using Zelle for Payment
                                </span>
                              </div>
                              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                No Fees & Instant Transfer
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 bg-white">
                              <div className="space-y-6">
                                {/* Payment Steps */}
                                <div className="border rounded-lg p-4 bg-gray-50">
                                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-list-checks"
                                    >
                                      <path d="m3 17 2 2 4-4" />
                                      <path d="m3 7 2 2 4-4" />
                                      <path d="M13 6h8" />
                                      <path d="M13 12h8" />
                                      <path d="M13 18h8" />
                                    </svg>
                                    Payment Steps
                                  </h4>
                                  <ol className="space-y-3 pl-0">
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        1
                                      </div>
                                      <div>
                                        Login to your bank account that participates in Zelle (via
                                        computer or mobile app).
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        2
                                      </div>
                                      <div>
                                        Select &quot;Transfer Zelle&quot; → Select &quot;Manage
                                        Recipients&quot; → &quot;Add New Recipient&quot; →
                                        &quot;Business&quot;.
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        3
                                      </div>
                                      <div>
                                        Fill in the recipient information:
                                        {/* Office Information Cards */}
                                        <div className="grid grid-cols-1 gap-4">
                                          <div className="border rounded-lg p-4 bg-gray-50">
                                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-building"
                                              >
                                                <rect
                                                  width="16"
                                                  height="20"
                                                  x="4"
                                                  y="2"
                                                  rx="2"
                                                  ry="2"
                                                />
                                                <path d="M9 22v-4h6v4" />
                                                <path d="M8 6h.01" />
                                                <path d="M16 6h.01" />
                                                <path d="M8 10h.01" />
                                                <path d="M16 10h.01" />
                                                <path d="M8 14h.01" />
                                                <path d="M16 14h.01" />
                                              </svg>
                                              Bank Information
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                              <p>
                                                <span className="font-medium">Bank Name:</span> Bank
                                                of America
                                              </p>
                                              <p>
                                                <span className="font-medium">Business Name:</span>{' '}
                                                American Education and Translation Services
                                              </p>
                                              <p>
                                                <span className="font-medium">Zelle Email:</span>{' '}
                                                <span className="font-bold text-blue-700">
                                                  boston@aet21.com
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        4
                                      </div>
                                      <div>
                                        After successfully adding the recipient, return to the main
                                        menu and select &quot;Send&quot; → select &quot;American
                                        Education and Translation Services&quot;.
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        5
                                      </div>
                                      <div>
                                        Enter the transfer amount → select &quot;Continue&quot;.
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        6
                                      </div>
                                      <div>Select &quot;Confirm&quot; to complete the payment.</div>
                                    </li>
                                  </ol>
                                </div>

                                {/* Note */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm flex gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-info text-amber-600 flex-shrink-0 mt-0.5"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4" />
                                    <path d="M12 8h.01" />
                                  </svg>
                                  <div>
                                    For a list of Zelle participating banks, visit{' '}
                                    <a
                                      href="https://www.zellepay.com/get-started?gclid=CjwKCAjw1f_pBRAEEiwApp0JKHk9NkE_GIAIZ94xfCkOru_WzsJQbjO0ddVzu0Trjk8yiRmX9uTSyxoCfa0QAvD_BwE"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      Zelle&apos;s official website
                                    </a>
                                    .
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleOfficePaymentAction}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Proceed to Payment
                        </button>
                      </div>
                    </>
                  )}

                {(application.office === 'San Francisco' ||
                  application.office === 'Los Angeles' ||
                  application.office === 'Miami') &&
                  application.payment_status !== 'paid' && (
                    <>
                      <div className="mt-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem
                            value="zelle"
                            className="border rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 flex items-center gap-2">
                              <div className="flex items-center gap-2 text-blue-700">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-credit-card"
                                >
                                  <rect width="20" height="14" x="2" y="5" rx="2" />
                                  <line x1="2" x2="22" y1="10" y2="10" />
                                </svg>
                                <span className="font-medium">
                                  We Recommend Using Zelle for Payment
                                </span>
                              </div>
                              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                No Fees & Instant Transfer
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 bg-white">
                              <div className="space-y-6">
                                {/* Payment Steps */}
                                <div className="border rounded-lg p-4 bg-gray-50">
                                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-list-checks"
                                    >
                                      <path d="m3 17 2 2 4-4" />
                                      <path d="m3 7 2 2 4-4" />
                                      <path d="M13 6h8" />
                                      <path d="M13 12h8" />
                                      <path d="M13 18h8" />
                                    </svg>
                                    Payment Steps
                                  </h4>
                                  <ol className="space-y-3 pl-0">
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        1
                                      </div>
                                      <div>
                                        Login to your bank account that participates in Zelle (via
                                        computer or mobile app).
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        2
                                      </div>
                                      <div>
                                        Select &quot;Transfer Zelle&quot; → Select &quot;Manage
                                        Recipients&quot; → &quot;Add New Recipient&quot; →
                                        &quot;Business&quot;.
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        3
                                      </div>
                                      <div>
                                        Fill in the recipient information:
                                        {/* Office Information Cards */}
                                        <div className="grid grid-cols-1 gap-4">
                                          <div className="border rounded-lg p-4 bg-gray-50">
                                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-building"
                                              >
                                                <rect
                                                  width="16"
                                                  height="20"
                                                  x="4"
                                                  y="2"
                                                  rx="2"
                                                  ry="2"
                                                />
                                                <path d="M9 22v-4h6v4" />
                                                <path d="M8 6h.01" />
                                                <path d="M16 6h.01" />
                                                <path d="M8 10h.01" />
                                                <path d="M16 10h.01" />
                                                <path d="M8 14h.01" />
                                                <path d="M16 14h.01" />
                                              </svg>
                                              Bank Information
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                              <p>
                                                <span className="font-medium">Bank Name:</span>{' '}
                                                Chase
                                              </p>
                                              <p>
                                                <span className="font-medium">Business Name:</span>{' '}
                                                American Education and Translation Services
                                              </p>
                                              <p>
                                                <span className="font-medium">Zelle Email:</span>{' '}
                                                <span className="font-bold text-blue-700">
                                                  info@aet21.com
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        4
                                      </div>
                                      <div>
                                        After successfully adding the recipient, return to the main
                                        menu and select &quot;Send&quot; → select &quot;American
                                        Education and Translation Services&quot;.
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        5
                                      </div>
                                      <div>
                                        Enter the transfer amount → select &quot;Continue&quot;.
                                      </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                                        6
                                      </div>
                                      <div>Select &quot;Confirm&quot; to complete the payment.</div>
                                    </li>
                                  </ol>
                                </div>

                                {/* Note */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm flex gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-info text-amber-600 flex-shrink-0 mt-0.5"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4" />
                                    <path d="M12 8h.01" />
                                  </svg>
                                  <div>
                                    For a list of Zelle participating banks, visit{' '}
                                    <a
                                      href="https://www.zellepay.com/get-started?gclid=CjwKCAjw1f_pBRAEEiwApp0JKHk9NkE_GIAIZ94xfCkOru_WzsJQbjO0ddVzu0Trjk8yiRmX9uTSyxoCfa0QAvD_BwE"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      Zelle&apos;s official website
                                    </a>
                                    .
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      <div className="mt-4">
                        <StripeInlinePricingWithID applicationId={applicationId} />
                      </div>
                    </>
                  )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
