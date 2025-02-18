import StripeInlinePricing from '../components/Stripe/InlinePricing'

export default function StripeTestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stripe Inline Pricing Test</h1>
      <StripeInlinePricing />
    </div>
  )
}
