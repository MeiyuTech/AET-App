import { CheckoutForm } from '../components/CheckoutForm'
import { notFound } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{
    applicationId?: string
  }>
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { applicationId } = params
  const priceId = 'price_1QVKKcJMcR2XIhynAkrlH1jl'

  if (!applicationId) {
    // If no applicationId, redirect to form
    return notFound()
  }

  return (
    <main>
      <div className="max-w-screen-lg mx-auto my-8">
        <CheckoutForm priceId={priceId} applicationId={applicationId} />
      </div>
    </main>
  )
}
