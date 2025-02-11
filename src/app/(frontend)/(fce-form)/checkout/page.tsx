import { redirect } from 'next/navigation'
import { CheckoutForm } from '../components/CheckoutForm'

interface PageProps {
  searchParams: { applicationId?: string }
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const { applicationId } = searchParams
  const priceId = 'price_1QVKKcJMcR2XIhynAkrlH1jl'

  if (!applicationId) {
    // If no applicationId, redirect to form
    redirect('/fce-form')
  }

  return (
    <main>
      <div className="max-w-screen-lg mx-auto my-8">
        <CheckoutForm priceId={priceId} applicationId={applicationId} />
      </div>
    </main>
  )
}
