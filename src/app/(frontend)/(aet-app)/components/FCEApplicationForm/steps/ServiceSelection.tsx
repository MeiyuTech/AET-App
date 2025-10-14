'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { DELIVERY_OPTIONS, ADDITIONAL_SERVICES, EVALUATION_SERVICES } from '../constants'

const formatPrice = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export function ServiceSelection() {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext()
  const t = useTranslations('credentialEvaluationForm.serviceSelection')

  useEffect(() => {
    const currentValue = watch('deliveryMethod')
    if (!currentValue) {
      setValue('deliveryMethod', 'no_delivery_needed')
    }
  }, [setValue, watch])

  const renderLabel = (label: string, value: string) => {
    const needsNote = value === '24hour' || value === 'sameday'
    return (
      <span>
        {label}
        {needsNote && '*'}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            {t('title')}
            <span className="text-red-500">*</span>
          </h3>
          {errors.serviceType && (
            <p className="text-sm text-destructive mb-4">{t('errors.serviceRequired')}</p>
          )}

          {/* Foreign Credential Evaluation Report */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('sections.foreignCredential.title')}</h4>
            <Select
              onValueChange={(value) => {
                setValue(
                  'serviceType.foreignCredentialEvaluation.firstDegree.speed',
                  value === 'none' ? undefined : value
                )
              }}
              defaultValue={
                watch('serviceType.foreignCredentialEvaluation.firstDegree.speed') || 'none'
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('placeholders.serviceSpeed')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex justify-between w-full">
                    <span>{t('options.none')}</span>
                  </div>
                </SelectItem>
                {Object.entries(EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE).map(
                  ([value, service]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex justify-between w-full">
                        <span>
                          {renderLabel(
                            t(`services.foreignCredential.firstDegree.${value}`),
                            value
                          )}
                        </span>
                        <span className="text-muted-foreground ml-4">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {watch('serviceType.foreignCredentialEvaluation.firstDegree.speed') && (
              <div className="mt-4 ml-6">
                <Label>{t('labels.additionalDegrees')}</Label>
                <Input
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="w-24"
                  {...register('serviceType.foreignCredentialEvaluation.secondDegrees', {
                    valueAsNumber: true,
                    min: 0,
                    value: 0,
                  })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {t('labels.perAdditionalDegree', {
                    price: formatPrice(
                      watch('serviceType.foreignCredentialEvaluation.firstDegree.speed') === '7day'
                        ? EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price
                        : EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT.price
                    ),
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Course-by-Course Evaluation */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('sections.courseByCourse.title')}</h4>
            <Select
              onValueChange={(value) => {
                setValue(
                  'serviceType.coursebyCourse.firstDegree.speed',
                  value === 'none' ? undefined : value
                )
              }}
              defaultValue={watch('serviceType.coursebyCourse.firstDegree.speed') || 'none'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('placeholders.serviceSpeed')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex justify-between w-full">
                    <span>{t('options.none')}</span>
                  </div>
                </SelectItem>
                {Object.entries(EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE).map(
                  ([value, service]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex justify-between w-full">
                        <span>
                          {renderLabel(
                            t(`services.courseByCourse.firstDegree.${value}`),
                            value
                          )}
                        </span>
                        <span className="text-muted-foreground ml-4">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {watch('serviceType.coursebyCourse.firstDegree.speed') && (
              <div className="mt-4 ml-6">
                <Label>{t('labels.additionalDegrees')}</Label>
                <Input
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="w-24"
                  {...register('serviceType.coursebyCourse.secondDegrees', {
                    valueAsNumber: true,
                    min: 0,
                    value: 0,
                  })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {t('labels.perAdditionalDegree', {
                    price: formatPrice(
                      watch('serviceType.coursebyCourse.firstDegree.speed') === '8day'
                        ? EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price
                        : EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price
                    ),
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Expert Opinion Letter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('sections.professionalExperience.title')}</h4>
            <Select
              onValueChange={(value) => {
                setValue(
                  'serviceType.professionalExperience.speed',
                  value === 'none' ? undefined : value
                )
              }}
              defaultValue={watch('serviceType.professionalExperience.speed') || 'none'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('placeholders.serviceSpeed')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex justify-between w-full">
                    <span>{t('options.none')}</span>
                  </div>
                </SelectItem>
                {Object.entries(EVALUATION_SERVICES.PROFESSIONAL_EXPERIENCE).map(
                  ([value, service]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex justify-between w-full">
                        <span>{renderLabel(t(`services.professionalExperience.${value}`), value)}</span>
                        <span className="text-muted-foreground ml-4">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Position Evaluation */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('sections.position.title')}</h4>
            <Select
              onValueChange={(value) => {
                setValue(
                  'serviceType.positionEvaluation.speed',
                  value === 'none' ? undefined : value
                )
              }}
              defaultValue={watch('serviceType.positionEvaluation.speed') || 'none'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('placeholders.serviceSpeed')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex justify-between w-full">
                    <span>{t('options.none')}</span>
                  </div>
                </SelectItem>
                {Object.entries(EVALUATION_SERVICES.POSITION).map(([value, service]) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex justify-between w-full">
                      <span>{renderLabel(t(`services.position.${value}`), value)}</span>
                      <span className="text-muted-foreground ml-4">{formatPrice(service.price)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translation Service */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('sections.translation.title')}</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="translation-required"
                onCheckedChange={(checked) => {
                  setValue('serviceType.translation.required', checked)
                }}
                checked={watch('serviceType.translation.required')}
              />
              <Label htmlFor="translation-required" className="flex justify-between w-full">
                <span>{t('sections.translation.required')}</span>
                <span className="text-muted-foreground">{t('sections.translation.note')}</span>
              </Label>
            </div>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">{t('notes.rush')}</div>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('reportDelivery.title')}
              <span className="text-red-500">*</span>
            </h3>
            <Select
              onValueChange={(value) => {
                setValue('additionalServices', [value])
                setValue('additionalServicesQuantity', {
                  extra_copy: 0,
                  pdf_with_hard_copy: 0,
                  pdf_only: 0,
                })
                if (value === 'pdf_only') {
                  setValue('deliveryMethod', 'no_delivery_needed')
                } else {
                  setValue('deliveryMethod', 'usps_first_class_domestic')
                }
                if (value === 'extra_copy') {
                  setValue('additionalServicesQuantity.extra_copy', 1)
                }
              }}
              value={watch('additionalServices')?.[0] || 'pdf_only'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('placeholders.reportType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf_only">
                  <div className="flex justify-between w-full">
                    <span>{t('options.additionalServices.pdf_only')}</span>
                    <span className="text-muted-foreground ml-4">
                      {formatPrice(ADDITIONAL_SERVICES.pdf_only.price)}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="pdf_with_hard_copy">
                  <div className="flex justify-between w-full">
                    <span>{t('options.additionalServices.pdf_with_hard_copy')}</span>
                    <span className="text-muted-foreground ml-4">
                      {formatPrice(ADDITIONAL_SERVICES.pdf_with_hard_copy.price)}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="extra_copy">
                  <div className="flex justify-between w-full">
                    <span>{t('options.additionalServices.extra_copy')}</span>
                    <span className="text-muted-foreground ml-4">
                      {t('labels.priceEach', {
                        price: formatPrice(ADDITIONAL_SERVICES.extra_copy.price),
                      })}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {watch('additionalServices')?.[0] === 'extra_copy' && (
            <div>
              <Label>{t('labels.extraCopiesQuantity')}</Label>
              <Input
                type="number"
                min={1}
                defaultValue={1}
                className="w-24 mt-2"
                {...register('additionalServicesQuantity.extra_copy', {
                  valueAsNumber: true,
                  min: 1,
                  value: 1,
                })}
              />
            </div>
          )}

          {watch('additionalServices')?.[0] !== 'pdf_only' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t('delivery.title')}
                <span className="text-red-500">*</span>
              </h3>
              <Select
                onValueChange={(value) => {
                  setValue('deliveryMethod', value)
                }}
                value={watch('deliveryMethod')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('placeholders.deliveryMethod')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DELIVERY_OPTIONS).map(([value, { price }]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex justify-between w-full">
                        <span>{t(`delivery.options.${value}`)}</span>
                        <span className="text-muted-foreground ml-4">{formatPrice(price)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {t.rich('notes.default', {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
