import { notFound } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

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
  // Wait for searchParams to resolve
  const { applicationId } = await searchParams

  if (!applicationId) {
    return notFound()
  }

  const applicationData = await getApplicationData(applicationId)

  if (!applicationData) {
    return notFound()
  }

  return (
    <div className="text-center max-w-2xl mx-auto p-6">
      <br />
      <br />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <p className="text-xl mb-4">
          Thank you, <span className="font-semibold">{applicationData.name}</span>!
        </p>
        <p className="text-gray-600 mb-2">Your payment has been processed successfully.</p>
        <p className="text-gray-600">
          Application ID: <span className="font-mono">{applicationId}</span>
        </p>
      </div>
      <p className="text-sm text-gray-500">We will review your application and contact you soon.</p>
    </div>
  )
}

export default SuccessPage
