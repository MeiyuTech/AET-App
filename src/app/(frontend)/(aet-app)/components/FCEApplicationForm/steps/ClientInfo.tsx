'use client'

import { useMemo } from 'react'
import { FileText, GraduationCap } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { State } from 'country-state-city'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { OFFICE_OPTIONS, COUNTRIES, getRegionLabel, PURPOSE_OPTIONS } from '../constants'
import { FormData } from '../types'

export function ClientInfo() {
  const form = useFormContext<FormData>()

  // Get selected country
  const selectedCountry = form.watch('country')

  // Get region type based on selected country
  const regionConfig = useMemo(() => {
    if (!selectedCountry) {
      return { label: 'Region', options: [] }
    }
    const states = State.getStatesOfCountry(selectedCountry)
    const regionLabels: Record<string, string> = {
      US: 'State',
      CN: 'Province',
      CA: 'Province',
      GB: 'County',
      AU: 'State',
      NZ: 'Region',
      // Add more countries here
    }

    return {
      label: regionLabels[selectedCountry] || 'Region',
      options: states.map((state) => ({
        value: state.isoCode,
        label: state.name,
      })),
    }
  }, [selectedCountry])

  const country = form.watch('country')
  const regionLabel = getRegionLabel(country)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Client Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company/Individual Name<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="country-select">
                Country<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="country-select" data-testid="country-select">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Street Address<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="1234 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="streetAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Street Address 2<span className="text-sm text-gray-500 ml-2">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Apartment, suite, unit, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                City<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="region-select">
                {regionLabel.label}
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="region-select" data-testid="region-select">
                  <SelectValue placeholder={`Select ${regionLabel.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {regionConfig.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Zip Code<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="12345" maxLength={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Fax
                <span className="text-sm text-gray-500 ml-2">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="123-456-7890"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 10) {
                      const formatted = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
                      field.onChange(formatted)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="123-456-7890"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 10) {
                      const formatted = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
                      field.onChange(formatted)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="office"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="office-select">
              Office<span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="office-select" data-testid="office-select">
                <SelectValue placeholder="Select office" />
              </SelectTrigger>
              <SelectContent>
                {OFFICE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="purpose-select">
              Service Type<span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="purpose-select" data-testid="purpose-select">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {PURPOSE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* {form.watch('purpose') === 'other' && (
        <FormField
          control={form.control}
          name="purposeOther"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Please specify other purpose" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )} */}

      <FormField
        control={form.control}
        name="purposeOther"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Service Notes
              <span className="text-sm text-gray-500 ml-2">(Optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g. I am applying for an H1B visa and need my bachelor's degree evaluated. The report will be submitted to USCIS."
                {...field}
              />
            </FormControl>
            <FormDescription>
              Please provide details about your evaluation request. Include the purpose (e.g.,
              employment, education, visa), the documents you&apos;d like us to evaluate (e.g.,
              bachelor&apos;s degree, transcripts), and the organization or individual who will
              receive the evaluation.
              <br />
              <br />
              The more details you provide, the faster and more accurately we can assist you.
            </FormDescription>

            <div className="mt-2 text-sm text-gray-700">
              <p className="mb-1">Check out our sample reports</p>
              <ul className="list-disc pl-5 space-y-1">
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <a
                    href="https://www.americantranslationservice.com/evaluation_report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    Degree Credential Evaluation Report
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <a
                    href="https://www.americantranslationservice.com/cbcevaluation_report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    Course by Course Evaluation Report
                  </a>
                </li>
              </ul>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
