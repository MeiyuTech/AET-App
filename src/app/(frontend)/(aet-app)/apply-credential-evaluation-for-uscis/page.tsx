import { Metadata } from 'next'
import FCEApplicationForm from '../components/FCEApplicationForm'

export const metadata: Metadata = {
  title: 'H-1B Credential Evaluation Application | AET Service Application',
  description: 'AET Service Application for H-1B Credential Evaluation',
}

export default function ApplyFCEPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-6 pt-16">
        <h1 className="text-2xl font-bold">AET H-1B Credential Evaluation Application</h1>
        <FCEApplicationForm />
      </div>
    </div>
  )
}
