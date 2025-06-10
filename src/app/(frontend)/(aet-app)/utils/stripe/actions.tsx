import { getClientSideURL } from '@/utilities/getURL'
// import { getFCEApplicationEmail } from '../actions'

export async function createPayment({
  amount,
  applicationId,
}: {
  amount: string
  applicationId: string
}) {
  console.log('🟠 [createPayment] Creating payment link with params:', {
    amount,
    applicationId,
  })
  const numericAmount = parseFloat(amount || '0')
  const baseUrl = getClientSideURL()
  const apiUrl = `${baseUrl}/api/stripe/create-payment`

  // const applicationEmail = await getFCEApplicationEmail(applicationId)

  try {
    const response = await fetch(apiUrl, {
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
  } catch (error) {
    console.error('🔴 [createPayment] Error:', error)
    throw error
  }
}

export async function createDegreeEquivalencyPayment({
  amount,
  applicationId,
}: {
  amount: string
  applicationId: string
}) {
  console.log('🟠 [createDegreeEquivalencyPayment] Creating payment link with params:', {
    amount,
    applicationId,
  })
  const numericAmount = parseFloat(amount || '0')
  const baseUrl = getClientSideURL()
  const apiUrl = `${baseUrl}/api/stripe/create-degree-equivalency-payment`

  try {
    const response = await fetch(apiUrl, {
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
  } catch (error) {
    console.error('🔴 [createDegreeEquivalencyPayment] Error:', error)
    throw error
  }
}

export async function createPaymentLink(
  amount: number,
  applicationId: string,
  description?: string,
  currency: string = 'usd'
) {
  console.log('🔵 [createPaymentLink] Creating payment link with params:', {
    amount,
    applicationId,
    description,
    currency,
  })

  const baseUrl = getClientSideURL()
  const apiUrl = `${baseUrl}/api/stripe/create-payment-link`
  console.log('🔵 [createPaymentLink] Using API URL:', apiUrl)

  try {
    const response = await fetch(apiUrl, {
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

    console.log('🔵 [createPaymentLink] Response status:', response.status)
    return response
  } catch (error) {
    console.error('🔴 [createPaymentLink] Error:', error)
    throw error
  }
}
