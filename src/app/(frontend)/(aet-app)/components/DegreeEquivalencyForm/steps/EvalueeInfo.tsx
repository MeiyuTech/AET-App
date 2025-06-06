'use client'

import dayjs from 'dayjs'
import { Plus, Trash2, X } from 'lucide-react'
import { useMemo } from 'react'
import countryList from 'react-select-country-list'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DiplomaUploader } from '@/app/(frontend)/(aet-app)/components/Dropbox/DiplomaUploader'

import { PRONOUN_OPTIONS, MONTH_OPTIONS, YEAR_OPTIONS } from '../constants'
import { FormData } from '../types'

function EducationFields({ index, onRemove }: { index: number; onRemove?: () => void }) {
  const form = useFormContext<FormData>()
  const countries = useMemo(() => countryList().getData(), [])

  return (
    <div className="space-y-4 p-4 border rounded-lg relative">
      {index > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          data-testid={`remove-education-button-${index}`}
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {/* School and Country in one row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`educations.${index}.schoolName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name</FormLabel>
              <FormControl>
                <Input
                  data-testid={`school-name-input-${index}`}
                  placeholder="Enter full school name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`educations.${index}.countryOfStudy`}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={`study-country-select-${index}`}>Study Country</FormLabel>
              <div className="relative">
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id={`study-country-select-${index}`}
                    data-testid={`study-country-select-${index}`}
                  >
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.value && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => {
                      field.onChange(undefined)
                    }}
                    data-testid={`clear-study-country-button-${index}`}
                  >
                    <X className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Clear selection</span>
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Degree in its own row */}
      <FormField
        control={form.control}
        name={`educations.${index}.degreeObtained`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree Obtained</FormLabel>
            <FormControl>
              <Input
                data-testid={`degree-obtained-input-${index}`}
                placeholder="e.g.: Bachelor of Science"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Study Period */}
      <div className="space-y-2">
        <FormLabel>Study Period</FormLabel>
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-2">
            <FormLabel className="text-sm text-gray-500"></FormLabel>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name={`educations.${index}.studyDuration.startDate.month`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`start-date-month-select-${index}`}>Start Month</FormLabel>
                    <div className="relative">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          id={`start-date-month-select-${index}`}
                          data-testid={`start-date-month-select-${index}`}
                        >
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTH_OPTIONS.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => {
                            field.onChange(undefined)
                          }}
                          data-testid={`clear-start-date-month-button-${index}`}
                        >
                          <X className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Clear selection</span>
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`educations.${index}.studyDuration.startDate.year`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`start-date-year-select-${index}`}>Start Year</FormLabel>
                    <div className="relative">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          id={`start-date-year-select-${index}`}
                          data-testid={`start-date-year-select-${index}`}
                        >
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEAR_OPTIONS.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => {
                            field.onChange(undefined)
                          }}
                          data-testid={`clear-start-date-year-button-${index}`}
                        >
                          <X className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Clear selection</span>
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <FormLabel className="text-sm text-gray-500"></FormLabel>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name={`educations.${index}.studyDuration.endDate.month`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`end-date-month-select-${index}`}>End Month</FormLabel>
                    <div className="relative">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          id={`end-date-month-select-${index}`}
                          data-testid={`end-date-month-select-${index}`}
                        >
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTH_OPTIONS.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => {
                            field.onChange(undefined)
                          }}
                          data-testid={`clear-end-date-month-button-${index}`}
                        >
                          <X className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Clear selection</span>
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`educations.${index}.studyDuration.endDate.year`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`end-date-year-select-${index}`}>End Year</FormLabel>
                    <div className="relative">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          id={`end-date-year-select-${index}`}
                          data-testid={`end-date-year-select-${index}`}
                        >
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEAR_OPTIONS.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => {
                            field.onChange(undefined)
                          }}
                          data-testid={`clear-end-date-year-button-${index}`}
                        >
                          <X className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Clear selection</span>
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Diploma Upload */}
      <FormItem>
        <FormLabel>Diploma</FormLabel>
        <FormControl>
          <DiplomaUploader
            office={'Miami'}
            email={form.watch('email')}
            fullName={
              [form.watch('firstName'), form.watch('middleName'), form.watch('lastName')]
                .filter(Boolean)
                .join(' ') || 'Not provided'
            }
          />
        </FormControl>
      </FormItem>
    </div>
  )
}

export function EvalueeInfo() {
  const form = useFormContext<FormData>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'educations',
  })

  // const birthMonth = form.watch('dateOfBirth.month')
  // const birthYear = form.watch('dateOfBirth.year')

  // Calculate days in month
  // const daysInMonth =
  //   birthMonth && birthYear ? dayjs(`${birthYear}-${birthMonth}`).daysInMonth() : 31

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Education Information</h2>

      {/* Basic Information */}
      <div className="space-y-4">
        {/* <FormField
          control={form.control}
          name="pronouns"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="pronouns-select">
                Pronouns<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="pronouns-select" data-testid="pronouns-select">
                  <SelectValue placeholder="Select your pronouns" />
                </SelectTrigger>
                <SelectContent>
                  {PRONOUN_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input data-testid="first-name-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input data-testid="last-name-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Middle Name
                  <span className="text-sm text-gray-500 ml-2">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input data-testid="middle-name-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}

        {/* Date of Birth */}
        {/* <div className="space-y-2">
          <FormLabel></FormLabel>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dateOfBirth.month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="date-of-birth-month-select">Birth Month</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="date-of-birth-month-select"
                      data-testid="date-of-birth-month-select"
                    >
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth.date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="date-of-birth-day-select">Birth Day</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!birthMonth}>
                    <SelectTrigger
                      id="date-of-birth-day-select"
                      data-testid="date-of-birth-day-select"
                    >
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = String(i + 1).padStart(2, '0')
                        return (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth.year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="date-of-birth-year-select">Birth Year</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="date-of-birth-year-select"
                      data-testid="date-of-birth-year-select"
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEAR_OPTIONS.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div> */}
      </div>

      {/* Education Information */}
      <div className="space-y-4 pt-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">
            Education History<span className="text-red-500">*</span>
          </h3>

          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="add-education-button"
            onClick={() =>
              append({
                countryOfStudy: '',
                degreeObtained: '',
                schoolName: '',
                studyDuration: {
                  startDate: { month: '', year: '' },
                  endDate: { month: '', year: '' },
                },
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <EducationFields
              key={field.id}
              index={index}
              onRemove={index > 0 ? () => remove(index) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
