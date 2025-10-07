'use client'

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
  const t = useTranslations('degreeEquivalencyForm.clientInfo')

  // Get selected country
  const selectedCountry = form.watch('country')

  // use constants.ts to get region config
  const regionConfig = getRegionLabel(selectedCountry || '')

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('title')}</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company/Individual Name<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input data-testid="client-name-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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

      {/* <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Street Address<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input data-testid="street-address-input" placeholder="1234 Main St" {...field} />
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
                <Input
                  data-testid="street-address2-input"
                  placeholder="Apartment, suite, unit, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div> */}

      {/* <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                City<span className="text-red-500">*</span>
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
                {regionConfig.label}
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="region-select" data-testid="region-select">
                  <SelectValue placeholder={`Select ${regionConfig.label}`} />
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
      </div> */}

      {/* <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Zip Code<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input data-testid="zip-code-input" placeholder="12345" maxLength={10} {...field} />
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
                  data-testid="fax-input"
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
      </div> */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('firstName.label')} <span className="text-red-500">*</span>
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
                {t('lastName.label')} <span className="text-red-500">*</span>
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
                {t('middleName.label')}
                <span className="text-sm text-gray-500 ml-2">{t('middleName.optional')}</span>
              </FormLabel>
              <FormControl>
                <Input data-testid="middle-name-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  data-testid="phone-input"
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
        /> */}

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
    </div>
  )
}
