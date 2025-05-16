import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-8 px-4 md:px-6 pt-16">
        <h1 className="text-3xl font-bold text-center">AET Service</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Credential Evaluation Application Form Card */}
          <Link
            href="/credential-evaluation-application"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">Submit Credential Evaluation Application</h2>
            <p className="text-gray-600">
              Fill out the application form to start your Credential Evaluation request
            </p>
          </Link>

          {/* AI Assistant Card */}
          {/* <Link
            href="/chat"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">AI Assistant</h2>
            <p className="text-gray-600">Chat with our AI assistant for help with your questions</p>
          </Link> */}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Application Status Card */}
          <Link
            href="/status"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">Check Status</h2>
            <p className="text-gray-600">Track the progress of your submitted application</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
