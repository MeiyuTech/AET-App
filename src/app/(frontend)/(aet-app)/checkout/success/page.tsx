import { notFound } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'
import { SuccessMessage } from '../../components/Checkout/SuccessMessage'

// Define the props type for the page component
interface SuccessPageProps {
  searchParams: Promise<{
    applicationId?: string
  }>
}

async function getApplicationData(applicationId: string) {
  const supabase = await createClient()

  try {
    const { data: application, error } = await supabase
      .from('fce_applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (error) {
      console.error('Error fetching application:', error)
      return null
    }

    return application
  } catch (error) {
    console.error('Error fetching application:', error)
    return null
  }
}

const SuccessPage = async ({ searchParams }: SuccessPageProps) => {
  const { applicationId } = await searchParams

  if (!applicationId) {
    return notFound()
  }

  const applicationData = await getApplicationData(applicationId)

  if (!applicationData) {
    return notFound()
  }
  return (
    <div className="p-4">
      <SuccessMessage applicationData={applicationData} applicationId={applicationId} />
    </div>
  )
}

export default SuccessPage
