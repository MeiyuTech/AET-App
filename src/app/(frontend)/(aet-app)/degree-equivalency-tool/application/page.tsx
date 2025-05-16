import { Metadata } from 'next'
import DegreeEquivalencyForm from '../../components/DegreeEquivalencyForm'

export const metadata: Metadata = {
  title: 'Credential Evaluation Application | AET Service Application',
  description: 'AET Service Application for Credential Evaluation',
}

export default function DegreeEquivalencyFormPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-6 pt-16">
        <h1 className="text-2xl font-bold">AET Degree Equivalency Application</h1>
        <DegreeEquivalencyForm />
      </div>
    </div>
  )
}
