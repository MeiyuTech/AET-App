import { CheckoutForm } from '../components/CheckoutForm'

const CheckoutPage = () => {
  // 使用已存在的 applicationId
  const applicationId = '12dd0a92-e6c7-4a40-8235-aaf72a79f458'
  const priceId = 'price_1QVKKcJMcR2XIhynAkrlH1jl'

  return (
    <main>
      <div className="max-w-screen-lg mx-auto my-8">
        <CheckoutForm priceId={priceId} applicationId={applicationId} />
      </div>
    </main>
  )
}

export default CheckoutPage
