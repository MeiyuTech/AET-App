'use client'

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
import { useEffect } from 'react'

export function ServiceSelection() {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext()

  useEffect(() => {
    const currentValue = watch('deliveryMethod')
    if (!currentValue) {
      setValue('deliveryMethod', 'no_delivery_needed')
    }
  }, [])

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
            Service Selection<span className="text-red-500">*</span>
          </h3>
          {errors.serviceType && (
            <p className="text-sm text-destructive mb-4">Please select at least one service</p>
          )}

          {/* Foreign Credential Evaluation Report */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">
              Foreign Credential Evaluation Report (Document-by-Document)
            </h4>
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
                <SelectValue placeholder="Select service speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex justify-between w-full">
                    <span>No evaluation needed</span>
                  </div>
                </SelectItem>
                {Object.entries(EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE).map(
                  ([value, service]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex justify-between w-full">
                        <span>{renderLabel(service.label, value)}</span>
                        <span className="text-muted-foreground ml-4">${service.price}</span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {watch('serviceType.foreignCredentialEvaluation.firstDegree.speed') && (
              <div className="mt-4 ml-6">
                <Label>Additional Degrees</Label>
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
                  {watch('serviceType.foreignCredentialEvaluation.firstDegree.speed') === '7day'
                    ? `$${EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price} per additional degree`
                    : `$${EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT.price} per additional degree`}
                </p>
              </div>
            )}
          </div>

          {/* Course-by-Course Evaluation */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Course-by-Course Evaluation (Including GPA)</h4>
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
                <SelectValue placeholder="Select service speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex justify-between w-full">
                    <span>No evaluation needed</span>
                  </div>
                </SelectItem>
                {Object.entries(EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE).map(
                  ([value, service]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex justify-between w-full">
                        <span>{renderLabel(service.label, value)}</span>
                        <span className="text-muted-foreground ml-4">${service.price}</span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {watch('serviceType.coursebyCourse.firstDegree.speed') && (
              <div className="mt-4 ml-6">
                <Label>Additional Degrees</Label>
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
                  {watch('serviceType.coursebyCourse.firstDegree.speed') === '8day'
                    ? `$${EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price} per additional degree`
                    : `$${EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price} per additional degree`}
                </p>
              </div>
            )}
          </div>

          {/* Expert Opinion Letter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Expert Opinion Letter</h4>
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
                <SelectValue placeholder="Select service speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex justify-between w-full">
                    <span>No evaluation needed</span>
                  </div>
                </SelectItem>
                {Object.entries(EVALUATION_SERVICES.PROFESSIONAL_EXPERIENCE).map(
                  ([value, service]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex justify-between w-full">
                        <span>{renderLabel(service.label, value)}</span>
                        <span className="text-muted-foreground ml-4">${service.price}</span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Position Evaluation */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Position Evaluation</h4>
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
                <SelectValue placeholder="Select service speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex justify-between w-full">
                    <span>No evaluation needed</span>
                  </div>
                </SelectItem>
                {Object.entries(EVALUATION_SERVICES.POSITION).map(([value, service]) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex justify-between w-full">
                      <span>{renderLabel(service.label, value)}</span>
                      <span className="text-muted-foreground ml-4">${service.price}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translation Service */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Translation Service</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="translation-required"
                onCheckedChange={(checked) => {
                  setValue('serviceType.translation.required', checked)
                }}
                checked={watch('serviceType.translation.required')}
              />
              <Label htmlFor="translation-required" className="flex justify-between w-full">
                <span>Translation Service Required</span>
                <span className="text-muted-foreground">Price varies by document</span>
              </Label>
            </div>
          </div>

          {/* Add note at bottom of card */}
          <div className="mt-6 text-xs text-muted-foreground">
            * Payment and documents must be received by 1:00pm EST.
          </div>
        </CardContent>
      </Card>

      {/* Type of Delivery */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Type of Delivery<span className="text-red-500">*</span>
          </h3>
          <Select
            onValueChange={(value) => {
              setValue('deliveryMethod', value)
            }}
            value={watch('deliveryMethod') || 'no_delivery_needed'}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_delivery_needed">
                <div className="flex justify-between w-full">
                  <span>No delivery needed</span>
                </div>
              </SelectItem>
              {Object.entries(DELIVERY_OPTIONS).map(([value, { label, price }]) => (
                <SelectItem key={value} value={value}>
                  <div className="flex justify-between w-full">
                    <span>{label}</span>
                    <span className="text-muted-foreground ml-4">${price}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Additional Services<span className="text-red-500">*</span>
          </h3>
          <Select
            onValueChange={(value) => {
              setValue('additionalServices', [value])
              // Reset all quantities
              setValue('additionalServicesQuantity', {
                extra_copy: 0,
                pdf_with_hard_copy: 0,
                pdf_only: 0,
              })
              // If extra copy is selected, enable quantity input
              if (value === 'extra_copy') {
                setValue('additionalServicesQuantity.extra_copy', 1)
              }
            }}
            value={watch('additionalServices')?.[0] || 'pdf_only'}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select additional service" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ADDITIONAL_SERVICES).map(([value, service]) => (
                <SelectItem key={value} value={value}>
                  <div className="flex justify-between w-full">
                    <span>{service.label}</span>
                    <span className="text-muted-foreground ml-4">
                      ${service.price}
                      {'quantity' in service ? ' each' : ''}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quantity input for extra copies */}
          {watch('additionalServices')?.[0] === 'extra_copy' && (
            <div className="mt-4">
              <Label>Number of Extra Copies</Label>
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

          {/* Add note at bottom of card */}
          <div className="mt-6 text-xs text-muted-foreground">
            * By default, <strong>PDF Report Only</strong> is selected.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
