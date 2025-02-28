import { Metadata } from 'next'
import ApplicationForm from '../components/ApplicationForm'

export const metadata: Metadata = {
  title: 'AET Service Application',
  description: 'AET Service Application',
}

export default function ApplyPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6 px-4 md:px-6 pt-16">
        <h1 className="text-2xl font-bold">AET Service Application</h1>
        <ApplicationForm />
      </div>
    </div>
  )
}
