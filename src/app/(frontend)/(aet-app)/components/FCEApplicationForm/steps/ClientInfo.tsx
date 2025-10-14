'use client'

import { FileText, GraduationCap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

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
  const t = useTranslations('credentialEvaluationForm.clientInfo')

  // Get selected country
  const selectedCountry = form.watch('country')

  // use constants.ts to get region config
  const regionConfig = getRegionLabel(selectedCountry || '')

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('title')}</h2>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('name.label')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input data-testid="client-name-input" {...field} />
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
                {t('country.label')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="country-select" data-testid="country-select">
                  <SelectValue placeholder={t('country.placeholder')} />
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
                {t('streetAddress.label')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  data-testid="street-address-input"
                  placeholder={t('streetAddress.placeholder')}
                  {...field}
                />
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
                {t('streetAddress2.label')}
                <span className="text-sm text-gray-500 ml-2">{t('streetAddress2.optional')}</span>
              </FormLabel>
              <FormControl>
                <Input
                  data-testid="street-address2-input"
                  placeholder={t('streetAddress2.placeholder')}
                  {...field}
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('city.label')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input data-testid="city-input" {...field} />
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
                {t('region.label', { regionLabel: regionConfig.label })}
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="region-select" data-testid="region-select">
                  <SelectValue
                    placeholder={t('region.placeholder', { regionLabel: regionConfig.label })}
                  />
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
                {t('zipCode.label')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  data-testid="zip-code-input"
                  placeholder={t('zipCode.placeholder')}
                  maxLength={10}
                  {...field}
                />
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
                {t('fax.label')}
                <span className="text-sm text-gray-500 ml-2">{t('fax.optional')}</span>
              </FormLabel>
              <FormControl>
                <Input
                  data-testid="fax-input"
                  placeholder={t('fax.placeholder')}
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
                {t('phone.label')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  data-testid="phone-input"
                  placeholder={t('phone.placeholder')}
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
                {t('email.label')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  data-testid="email-input"
                  type="email"
                  placeholder={t('email.placeholder')}
                  {...field}
                />
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
              {t('office.label')}
              <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="office-select" data-testid="office-select">
                <SelectValue placeholder={t('office.placeholder')} />
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
              {t('purpose.label')}
              <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="purpose-select" data-testid="purpose-select">
                <SelectValue placeholder={t('purpose.placeholder')} />
              </SelectTrigger>
                <SelectContent>
                  {PURPOSE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(`purpose.options.${option.labelKey}`)}
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
              {t('serviceNotes.label')}
              <span className="text-sm text-gray-500 ml-2">{t('serviceNotes.optional')}</span>
            </FormLabel>
            <FormControl>
              <Textarea
                data-testid="service-notes-input"
                placeholder={t('serviceNotes.placeholder')}
                {...field}
              />
            </FormControl>
            <FormDescription>{t('serviceNotes.description')}</FormDescription>
            <FormDescription>{t('serviceNotes.hint')}</FormDescription>

            <div className="mt-2 text-sm text-gray-700">
              <p className="mb-1">{t('serviceNotes.samplesHeading')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <a
                    href="https://www.americantranslationservice.com/evaluation_report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {t('serviceNotes.samples.degree')}
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
                    {t('serviceNotes.samples.course')}
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
