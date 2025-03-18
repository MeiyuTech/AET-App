import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-8 px-4 md:px-6 pt-16">
        <h1 className="text-3xl font-bold text-center">AET Service</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* H-1B Credential Evaluation Application Form Card */}
          <Link
            href="/apply-credential-evaluation-for-uscis"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">
              Submit H-1B Credential Evaluation Application
            </h2>
            <p className="text-gray-600">
              Fill out the application form to start your H-1B Credential Evaluation request
            </p>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Application Form Card */}
          <Link
            href="/apply"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">Submit General Application</h2>
            <p className="text-gray-600">
              Fill out the application form to start your AET service request
            </p>
          </Link>

          {/* Application Status Card */}
          <Link
            href="/status"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">Check Status</h2>
            <p className="text-gray-600">Track the progress of your submitted application</p>
          </Link>

          {/* Dropbox Upload Test Card */}
          {/* <Link
            href="/dropbox-test"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow bg-blue-50"
          >
            <h2 className="text-xl font-semibold mb-3">Test Dropbox Upload</h2>
            <p className="text-gray-600">Upload test files directly to company Dropbox</p>
          </Link> */}

          {/* Stripe Inline pricing Test Card */}
          {/* <Link
            href="/stripe-test"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow bg-blue-50"
          >
            <h2 className="text-xl font-semibold mb-3">Test Stripe Inline Pricing</h2>
            <p className="text-gray-600">Test Stripe Inline Pricing</p>
          </Link> */}

          {/* Email Tester Card */}
          {/* <Link
            href="/email-test"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow bg-blue-50"
          >
            <h2 className="text-xl font-semibold mb-3">Test Email</h2>
            <p className="text-gray-600">Test Email</p>
          </Link> */}
        </div>
      </div>
    </div>
  )
}
