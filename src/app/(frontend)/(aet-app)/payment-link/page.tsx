import { PaymentLinkCreator } from '../components/Stripe/PaymentLinkCreator'

export default function PaymentLinkPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Payment Link Generator</h1>
      <p className="text-muted-foreground mb-8">
        Create a payment link to share with your customers. They can use this link to make a
        payment.
      </p>

      <PaymentLinkCreator />
    </div>
  )
}
