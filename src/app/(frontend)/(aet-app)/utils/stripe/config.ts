'use server'

// It works well in test mode
// const isProduction = false
const isProduction = process.env.NODE_ENV === 'production'

// Choose the correct API key based on the environment
const stripeSecretKey = isProduction
  ? process.env.STRIPE_LIVE_SECRET_KEY!
  : process.env.STRIPE_TEST_SECRET_KEY!

// Get the correct webhook secret based on the environment
const stripeWebhookSecret = isProduction
  ? process.env.STRIPE_LIVE_WEBHOOK_SECRET!
  : process.env.STRIPE_TEST_WEBHOOK_SECRET!

export async function getStripeConfig() {
  const STRIPE_MODE = isProduction ? 'live' : 'test'

  if (!stripeSecretKey) {
    throw new Error(
      `${process.env.NODE_ENV}:\n  Stripe ${STRIPE_MODE} Mode: secret key is not configured`
    )
  }

  if (!stripeWebhookSecret) {
    throw new Error(
      `${process.env.NODE_ENV}:\n  Stripe ${STRIPE_MODE} Mode: webhook secret is not configured`
    )
  }

  const stripeConfig = {
    mode: STRIPE_MODE,
    secretKey: stripeSecretKey,
    webhookSecret: stripeWebhookSecret,
  } as const

  return stripeConfig
}
