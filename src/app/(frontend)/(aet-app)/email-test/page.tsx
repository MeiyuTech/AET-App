import EmailTester, { ApplicationConfirmationEmailTester } from '../components/Email/EmailTester'

export default function EmailTestPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Email Test</h1>
        <EmailTester />
      </div>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Send Application Confirmation Email</h1>
        <ApplicationConfirmationEmailTester />
      </div>
    </div>
  )
}
