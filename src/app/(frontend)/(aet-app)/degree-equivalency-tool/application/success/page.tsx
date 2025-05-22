import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { DegreeEquivalencyTable } from '@/components/degree-equivalency/degree-equivalency-table'

interface PageProps {
  searchParams: Promise<{
    applicationId?: string
  }>
}

export default async function DegreeEquivalencySuccessPage({ searchParams }: PageProps) {
  const { applicationId } = await searchParams

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
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <CheckCircle2 className="text-green-600 mr-2" size={28} />
          <h2 className="text-xl font-bold text-green-700">
            Here is Your Free AET Degree Equivalency
          </h2>
        </div>
        <p className="text-gray-700 mb-2">
          Now that you know what your education is worth in the U.S., get a AET credential
          evaluation to verify your credentials so they&apos;ll be recognized by U.S. universities,
          employers and licensing boards. Follow these simple steps:
        </p>
        <ol className="list-decimal list-inside text-gray-700 mb-2 pl-4">
          <li>Apply for a AET credential evaluation.</li>
          <li>
            Submit your documents according to the{' '}
            <a
              href="https://www.wes.org/document-requirements/"
              className="text-green-700 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              document requirements
            </a>{' '}
            for your country of education.
          </li>
          <li>
            AET prepares a credential evaluation, electronically stores your documents. Your report
            never expires.{' '}
            <a
              href="https://applications.wes.org/createaccount/login/login"
              className="text-green-700 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Begin your application now.
            </a>
          </li>
        </ol>
      </div>

      {/* Degree Equivalency Information Table */}
      <DegreeEquivalencyTable applicationId={applicationId} />

      {/* Note */}
      <div className="w-full max-w-3xl mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-700 text-sm">
          <span className="font-bold">Note:</span> Any degree equivalency provided is based on the
          information you have entered. It is not based on verified information or documents and may
          not be used as proof that you attended an institution or earned a degree. AET may change
          this provisional degree equivalency upon document verification and analysis.
        </div>
      </div>

      {/* Finish Button */}
      <div className="w-full max-w-3xl flex justify-end">
        <Link href="/degree-equivalency-tool" passHref>
          <Button variant="outline" className="text-base px-8 py-2">
            Finish
          </Button>
        </Link>
      </div>
    </div>
  )
}
