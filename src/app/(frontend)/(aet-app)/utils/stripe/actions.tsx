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

export async function createPaymentLink(
  amount: number,
  applicationId: string,
  description?: string,
  currency: string = 'usd'
) {
  console.log('createPaymentLink action:', { amount, applicationId, description, currency })
  const response = await fetch('/api/stripe/create-payment-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount,
      currency: currency,
      applicationId: applicationId,
      description: description || `Payment Link for Application ${applicationId}`,
    }),
  })

  console.log('createPaymentLink response:', response)
  return response
}
