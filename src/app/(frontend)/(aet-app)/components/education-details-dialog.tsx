'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DatabaseEducation } from '@/app/(frontend)/(aet-app)/components/FCEApplicationForm/types'
import countryList from 'react-select-country-list'

interface EducationDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  educations?: DatabaseEducation[]
}

function getCountryName(code: string) {
  const countries = countryList().getData()
  return countries.find((c) => c.value === code)?.label || code
}

export function EducationDetailsDialog({ open, onOpenChange, educations }: EducationDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Education History</DialogTitle>
        </DialogHeader>

        {educations && educations.length > 0 ? (
          <div className="space-y-4">
            {educations.map((education) => (
              <div key={education.id} className="p-4 border rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold">School Name</div>
                    <div>{education.school_name}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Country of Study</div>
                    <div>{getCountryName(education.country_of_study)}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Degree Obtained</div>
                    <div>{education.degree_obtained}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Study Period</div>
                    <div>
                      {education.study_start_date.month}/{education.study_start_date.year} -
                      {education.study_end_date.month}/{education.study_end_date.year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">No education records found.</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
