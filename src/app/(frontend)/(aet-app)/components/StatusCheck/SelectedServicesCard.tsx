'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'
import {
  EVALUATION_SERVICES,
  DELIVERY_OPTIONS,
  ADDITIONAL_SERVICES,
  PURPOSE_OPTIONS,
} from '../FCEApplicationForm/constants'
import { calculateTotalPrice } from '../FCEApplicationForm/utils'

interface SelectedServicesCardProps {
  application: ApplicationData
}

export default function SelectedServicesCard({ application }: SelectedServicesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purpose */}
        <div>
          <div className="font-medium">Purpose:</div>
          <div className="pl-4">
            {' '}
            {PURPOSE_OPTIONS.find((o) => o.value === application.purpose)?.label}
          </div>
        </div>
        {/* Service Notes */}
        <div>
          <div className="font-medium">Service Notes:</div>
          <div className="pl-4">{application.purposeOther}</div>
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
                const speed = application.serviceType.foreignCredentialEvaluation.firstDegree.speed
                const service = speed && EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE[speed]
                return (
                  service && (
                    <>
                      <div>
                        First Degree: {service.label} - ${service.price}
                      </div>
                      {application.serviceType.foreignCredentialEvaluation.secondDegrees > 0 && (
                        <div>
                          Second Degree:{' '}
                          {application.serviceType.foreignCredentialEvaluation.secondDegrees} × $
                          {EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price} = $
                          {EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price *
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
                const service = speed && EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE[speed]
                return (
                  service && (
                    <>
                      <div>
                        First Degree: {service.label} - ${service.price}
                      </div>
                      {application.serviceType.coursebyCourse.secondDegrees > 0 && (
                        <div>
                          Second Degree: {application.serviceType.coursebyCourse.secondDegrees} × $
                          {EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price} = $
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
                const service = method && DELIVERY_OPTIONS[method as keyof typeof DELIVERY_OPTIONS]
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
                    const quantity = application.additionalServicesQuantity.extra_copy
                    return (
                      <div key={serviceId}>
                        {service.label} × {quantity} = ${(service.price * quantity).toFixed(2)}
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
          <div className="text-xs text-muted-foreground">
            * This fee applies to most applications but it may vary for some applicants. We will
            reconfirm your service details during the evaluation process. If any adjustments are
            needed, we will contact you—any overpayment will be refunded, and underpayment will be
            collected. Thank you for your trust!
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
