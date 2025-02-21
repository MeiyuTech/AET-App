import Stripe from 'stripe'

const isProduction = false

// Choose the correct API key based on the environment
const stripeSecretKey = isProduction
  ? process.env.STRIPE_LIVE_SECRET_KEY!
  : process.env.STRIPE_TEST_SECRET_KEY!

// Get the correct webhook secret based on the environment
const webhookSecret = isProduction
  ? process.env.STRIPE_LIVE_WEBHOOK_SECRET!
  : process.env.STRIPE_TEST_WEBHOOK_SECRET!

export const stripe = new Stripe(stripeSecretKey)

export const STRIPE_MODE = isProduction ? 'live' : 'test'

// Export webhook configuration
export const STRIPE_CONFIG = {
  mode: STRIPE_MODE,
  webhookSecret,
  publishableKey: isProduction
    ? process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY,
} as const
