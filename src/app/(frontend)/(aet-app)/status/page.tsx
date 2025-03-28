import { Metadata } from 'next'
import StatusCheck from '../components/StatusCheck'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'AET Service Application Status',
  description: 'AET Service Application Status',
}

interface PageProps {
  searchParams: Promise<{
    applicationId?: string
  }>
}

export default async function StatusPage({ searchParams }: PageProps) {
  const { applicationId } = await searchParams

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6 pt-16">
        {/* Left Instruction Section */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">What&apos;s next?</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                        1
                      </div>
                      <span>Confirm Your Application</span>
                    </h4>
                    <p className="text-sm text-gray-600 pl-8">
                      Click the &quot;Check Status&quot; button to confirm your application.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                        2
                      </div>
                      <span>Submit All Required Documents</span>
                    </h4>
                    <p className="text-sm text-gray-600 pl-8">
                      Please submit all required documents as specified in your application.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
                        3
                      </div>
                      <span>Processing Begins After Payment Confirmation</span>
                    </h4>
                    <p className="text-sm text-gray-600 pl-8">
                      We will begin processing your evaluation once payment is confirmed.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                  <p>
                    If you have any questions, please reply to your{' '}
                    <strong>Application Confirmation Email thread</strong>. We look forward to
                    cooperating with you!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Status Check Section */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">AET Service Application Status</h1>
          <p className="text-sm text-gray-500">Check the status with your Application ID.</p>
          <StatusCheck initialApplicationId={applicationId} />
        </div>
      </div>
    </div>
  )
}
