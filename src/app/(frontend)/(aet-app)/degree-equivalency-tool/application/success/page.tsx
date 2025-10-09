import { createClient } from '@/app/(frontend)/(aet-app)/utils/supabase/server'
import DegreeEquivalencySuccessContent from './SuccessContent'

interface PageProps {
  searchParams: Promise<{
    applicationId?: string
  }>
}

export default async function DegreeEquivalencySuccessPage({ searchParams }: PageProps) {
  const { applicationId } = await searchParams

  if (!applicationId) {
    return null
  }

  const supabase = await createClient()

  const { data: application, error: applicationError } = await supabase
    .from('aet_core_applications')
    .select('*')
    .eq('id', applicationId)
    .single()

  const { data: education, error: educationError } = await supabase
    .from('aet_core_educations')
    .select('*')
    .eq('application_id', applicationId)
    .single()

  // Check payment status
  const { data: payment } = await supabase
    .from('aet_core_payments')
    .select('payment_status')
    .eq('application_id', applicationId)
    .single()

  const isPaid = payment?.payment_status === 'paid'

  if (applicationError || educationError || !application || !education) {
    return null
  }

  return (
    <DegreeEquivalencySuccessContent
      application={application}
      education={education}
      isPaid={isPaid}
    />
  )
}
