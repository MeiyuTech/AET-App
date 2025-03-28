'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'
import { PURPOSE_OPTIONS, getCountryLabel } from '../FCEApplicationForm/constants'

interface ClientInfoCardProps {
  application: ApplicationData
}

export default function ClientInfoCard({ application }: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          {/* Company/Individual Name */}
          <div>
            <dt className="font-medium">Company/Individual Name</dt>
            <dd className="text-muted-foreground">{application.name}</dd>
          </div>

          {/* Country */}
          <div>
            <dt className="font-medium">Country</dt>
            <dd className="text-muted-foreground">
              {application.country ? getCountryLabel(application.country) : ''}
            </dd>
          </div>

          {/* Street Address */}
          <div>
            <dt className="font-medium">Street Address</dt>
            <dd className="text-muted-foreground">
              {application.streetAddress}
              {application.streetAddress2 && <br />}
              {application.streetAddress2}
            </dd>
          </div>

          {/* Address */}
          <div>
            <dt className="font-medium">Address</dt>
            <dd className="text-muted-foreground">
              {application.city ? `${application.city}, ` : ''}
              {application.region || ''} {application.zipCode || ''}
            </dd>
          </div>

          {/* Phone */}
          <div>
            <dt className="font-medium">Phone</dt>
            <dd className="text-muted-foreground">{application.phone}</dd>
          </div>

          {/* Fax */}
          <div>
            <dt className="font-medium">Fax</dt>
            <dd className="text-muted-foreground">{application.fax || 'Not Provided'}</dd>
          </div>

          {/* Email */}
          <div>
            <dt className="font-medium">Email</dt>
            <dd className="text-muted-foreground">{application.email}</dd>
          </div>

          {/* Purpose */}
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
  )
}
