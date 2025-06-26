import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { DegreeEquivalencyTable } from '@/app/(frontend)/(aet-app)/components/DegreeEquivalencyForm/degree-equivalency-table'
import { createClient } from '@/app/(frontend)/(aet-app)/utils/supabase/server'

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
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2">
      {/* Top Image and Title */}
      <div className="w-full max-w-3xl">
        <div className="relative h-32 w-full rounded-lg overflow-hidden mb-6">
          <Image
            src="/Graduation-Students.jpg"
            alt="Graduation Cap"
            className="object-cover w-full h-full"
            width={1000}
            height={1000}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Degree Equivalency <span className="text-green-300">Tool</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Success Message and Step Instructions */}
      {isPaid ? (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="text-green-600 mr-2" size={28} />
            <h2 className="text-xl font-bold text-green-700">
              Here is Your AET Degree Equivalency
            </h2>
          </div>
          <p className="text-gray-700 mb-2">
            Now that you know what your education is worth in the U.S., get a AET credential
            evaluation to verify your credentials so they&apos;ll be recognized by U.S.
            universities, employers and licensing boards. Follow these simple steps:
          </p>
          <ol className="list-decimal list-inside text-gray-700 mb-2 pl-4">
            <li>
              <a
                href="https://app.americantranslationservice.com/credential-evaluation-application"
                className="text-green-700 underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Begin Your Credential Evaluation Application Now.
              </a>
            </li>
            <li>Submit related documents (Diploma, Transcripts, etc.)</li>
            <li>
              AET prepares a credential evaluation, electronically stores your documents. Your
              report never expires.{' '}
            </li>
          </ol>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-green-700">
            Your AET Degree Equivalency is being processed.
          </h2>
        </div>
      )}

      {/* Degree Equivalency Information Table */}
      <DegreeEquivalencyTable application={application} education={education} isPaid={isPaid} />

      {/* Note */}
      <div className="w-full max-w-3xl mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-700 text-sm">
          <span className="font-bold">Note:</span> Any degree equivalency provided is based on the
          information you have inputted. It is not based on verified information or documents and
          may not be used as proof that you attended an institution or earned a degree. AET may
          change this provisional degree equivalency upon document verification and analysis.
        </div>
      </div>

      {/* Finish Button */}
      <div className="w-full max-w-3xl flex justify-end">
        <Link href="/degree-equivalency-tool" passHref>
          <Button variant="outline" className="text-base px-8 py-2">
            Go Back
          </Button>
        </Link>
      </div>
    </div>
  )
}
