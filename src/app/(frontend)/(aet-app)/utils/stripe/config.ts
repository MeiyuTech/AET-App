import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'
// It works well in test mode
// const isProduction = false
const isProduction = process.env.NODE_ENV === 'production'

// Choose the correct API key based on the environment
const stripeSecretKey = isProduction
  ? process.env.STRIPE_LIVE_SECRET_KEY!
  : process.env.STRIPE_TEST_SECRET_KEY!

const stripePublishableKey = isProduction
  ? process.env.STRIPE_LIVE_PUBLISHABLE_KEY!
  : process.env.STRIPE_TEST_PUBLISHABLE_KEY!

// Get the correct webhook secret based on the environment
const webhookSecret = isProduction
  ? process.env.STRIPE_LIVE_WEBHOOK_SECRET!
  : process.env.STRIPE_TEST_WEBHOOK_SECRET!

export const STRIPE_MODE = isProduction ? 'live' : 'test'

if (!stripeSecretKey) {
  throw new Error(`Stripe ${STRIPE_MODE} secret key is not configured`)
}

export const stripe = new Stripe(stripeSecretKey)

if (!stripePublishableKey) {
  throw new Error(`Stripe ${STRIPE_MODE} publishable key is not configured`)
}

export const stripePromise = loadStripe(stripePublishableKey)

// Export webhook configuration
export const STRIPE_CONFIG = {
  mode: STRIPE_MODE,
  webhookSecret,
  publishableKey: stripePublishableKey,
} as const
