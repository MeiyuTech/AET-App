export async function createPayment({
  amount,
  applicationId,
}: {
  amount: string
  applicationId: string
}) {
  const numericAmount = parseFloat(amount || '0')

  const response = await fetch('/api/stripe/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: numericAmount,
      currency: 'usd',
      applicationId: applicationId,
    }),
  })

  return response
}
