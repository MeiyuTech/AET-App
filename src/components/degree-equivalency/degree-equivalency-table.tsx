import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/app/(frontend)/(aet-app)/utils/supabase/server'
import countryList from 'react-select-country-list'
import { DegreeEquivalencyAI } from './degree-equivalency-ai'

function getCountryName(code: string) {
  const countries = countryList().getData()
  return countries.find((c) => c.value === code)?.label || code
}

interface DegreeEquivalencyTableProps {
  applicationId?: string
}

export async function DegreeEquivalencyTable({ applicationId }: DegreeEquivalencyTableProps) {
  const supabase = await createClient()

  const { data: education, error } = await supabase
    .from('aet_core_educations')
    .select('*')
    .eq('application_id', applicationId)
    .single()

  if (error || !education) {
    return null
  }

  return (
    <div className="w-full max-w-3xl mb-6">
      <Card>
        <CardHeader className="bg-blue-900 text-white rounded-t-md">
          <CardTitle className="text-lg font-bold">Credential 1</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">Country of Study:</td>
                <td className="py-2 px-4">{getCountryName(education.country_of_study)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium bg-gray-50">Name of Degree:</td>
                <td className="py-2 px-4">{education.degree_obtained}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium bg-gray-50">Name of Institution:</td>
                <td className="py-2 px-4">{education.school_name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-medium bg-gray-50">Study Duration:</td>
                <td className="py-2 px-4">
                  {education.study_start_date && education.study_end_date
                    ? `${education.study_start_date.year}-${education.study_start_date.month} to ${education.study_end_date.year}-${education.study_end_date.month}`
                    : education.duration || 'Not provided'}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium bg-gray-50">Equivalency in U.S.:</td>
                <td className="py-2 px-4 font-semibold text-blue-900 bg-blue-50">
                  <DegreeEquivalencyAI education={education} />
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
