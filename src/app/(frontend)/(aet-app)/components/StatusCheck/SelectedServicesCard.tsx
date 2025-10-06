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
import { useTranslations } from 'next-intl'

interface SelectedServicesCardProps {
  application: ApplicationData
}

export default function SelectedServicesCard({ application }: SelectedServicesCardProps) {
  const t = useTranslations('status')
  const tCommon = useTranslations('common')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('selectedServices.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purpose */}
        <div>
          <div className="font-medium">{t('selectedServices.purpose')}</div>
          <div className="pl-4">
            {' '}
            {PURPOSE_OPTIONS.find((o) => o.value === application.purpose)?.label}
          </div>
        </div>
        {/* Service Notes */}
        <div>
          <div className="font-medium">{t('selectedServices.serviceNotes')}</div>
          <div className="pl-4">{application.purposeOther || tCommon('notProvided')}</div>
        </div>
        {/* Customized Service */}
        {application.serviceType?.customizedService?.required && (
          <div>
            <div className="font-medium">{t('selectedServices.customizedService')}</div>
            <div className="pl-4">{t('selectedServices.priceOnRequest')}</div>
          </div>
        )}

        {/* Foreign Credential Evaluation */}
        {application.serviceType?.foreignCredentialEvaluation?.firstDegree?.speed && (
          <div>
            <h4 className="font-medium mb-2">{t('selectedServices.foreignCredential')}</h4>
            <div className="pl-4 space-y-2">
              {(() => {
                const speed = application.serviceType.foreignCredentialEvaluation.firstDegree.speed
                const service = speed && EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE[speed]
                return (
                  service && (
                    <>
                      <div>
                        {t('selectedServices.firstDegree')}: {service.label} - ${service.price}
                      </div>
                      {application.serviceType.foreignCredentialEvaluation.secondDegrees > 0 && (
                        <div>
                          {t('selectedServices.secondDegree')}:{' '}
                          {application.serviceType.foreignCredentialEvaluation.secondDegrees} × $
                          {speed === '7day'
                            ? EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price
                            : EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT
                                .price}{' '}
                          = $
                          {(speed === '7day'
                            ? EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price
                            : EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT.price) *
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
            <div className="font-medium">{t('selectedServices.courseByCourse')}</div>
            <div className="pl-4 space-y-2">
              {(() => {
                const speed = application.serviceType.coursebyCourse.firstDegree.speed
                const service = speed && EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE[speed]
                return (
                  service && (
                    <>
                      <div>
                        {t('selectedServices.firstDegree')}: {service.label} - ${service.price}
                      </div>
                      {application.serviceType.coursebyCourse.secondDegrees > 0 && (
                        <div>
                          {t('selectedServices.secondDegree')}:{' '}
                          {application.serviceType.coursebyCourse.secondDegrees} × $
                          {speed === '8day'
                            ? EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price
                            : EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price}{' '}
                          = $
                          {(speed === '8day'
                            ? EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price
                            : EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price) *
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
            <div className="font-medium">{t('selectedServices.expertOpinion')}</div>
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
            <div className="font-medium">{t('selectedServices.positionEvaluation')}</div>
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
            <div className="font-medium">{t('selectedServices.translationService')}</div>
            <div className="pl-4">{t('selectedServices.priceOnRequest')}</div>
          </div>
        )}

        {/* Type of Delivery */}
        {application.deliveryMethod && (
          <div>
            <div className="font-medium">{t('selectedServices.deliveryType')}</div>
            <div className="pl-4">
              {(() => {
                const method = application.deliveryMethod
                const service = method && DELIVERY_OPTIONS[method as keyof typeof DELIVERY_OPTIONS]
                return service
                  ? `${service.label} - $${service.price.toFixed(2)}`
                  : t('selectedServices.noDelivery')
              })()}
            </div>
          </div>
        )}

        {/* Additional Services */}
        {application.additionalServices?.length > 0 && (
          <div>
            <div className="font-medium">{t('selectedServices.additionalServices')}</div>
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
              <div className="font-medium">
                {t('selectedServices.dueAmount', { amount: application.due_amount })}
              </div>
            ) : (
              <div className="font-medium">
                {t('selectedServices.estimatedTotal', {
                  amount:
                    application.serviceType?.translation?.required ||
                    application.serviceType?.customizedService?.required
                      ? t('selectedServices.dueNotSet')
                      : `$${calculateTotalPrice(application)}`,
                })}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{t('selectedServices.footnote')}</div>
        </div>
      </CardContent>
    </Card>
  )
}
