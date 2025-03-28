'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ApplicationData } from '../FCEApplicationForm/types'
import { PRONOUN_OPTIONS } from '../FCEApplicationForm/constants'

interface EvalueeInfoCardProps {
  application: ApplicationData
}

export default function EvalueeInfoCard({ application }: EvalueeInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluee Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          {/* Basic Information */}
          <div>
            <dt className="font-medium">First Name</dt>
            <dd className="text-muted-foreground">{application.firstName || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="font-medium">Middle Name</dt>
            <dd className="text-muted-foreground">{application.middleName || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="font-medium">Last Name</dt>
            <dd className="text-muted-foreground">{application.lastName || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="font-medium">Date of Birth</dt>
            <dd className="text-muted-foreground">
              {application.dateOfBirth
                ? `${application.dateOfBirth.month}/${application.dateOfBirth.date}/${application.dateOfBirth.year}`
                : 'Not provided'}
            </dd>
          </div>

          <div>
            <dt className="font-medium">Pronouns</dt>
            <dd className="text-muted-foreground">
              {PRONOUN_OPTIONS.find((o) => o.value === application.pronouns)?.label ||
                'Not provided'}
            </dd>
          </div>

          {/* Education Information */}
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
  )
}
