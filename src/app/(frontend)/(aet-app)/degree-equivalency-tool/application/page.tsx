import { Metadata } from 'next'
import DegreeEquivalencyForm from '../../components/DegreeEquivalencyForm'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Credential Evaluation Application | AET Service Application',
  description: 'AET Service Application for Credential Evaluation',
}

export default function DegreeEquivalencyFormPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-6 pt-2">
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
        {/* <h1 className="text-2xl font-bold">AET Degree Equivalency Application</h1> */}
        <DegreeEquivalencyForm />
      </div>
    </div>
  )
}
