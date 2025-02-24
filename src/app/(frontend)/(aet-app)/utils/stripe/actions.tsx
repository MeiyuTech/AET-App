export async function createPayment({ amount }: { amount: string }) {
  const numericAmount = parseFloat(amount || '0')

  const response = await fetch('/api/stripe/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: numericAmount,
      currency: 'usd',
    }),
  })

  return response
}
