import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'
// It works well in test mode
// const isProduction = false
const isProduction = process.env.NODE_ENV === 'production'

// Choose the correct API key based on the environment
const stripeSecretKey = isProduction
  ? process.env.STRIPE_LIVE_SECRET_KEY!
  : process.env.STRIPE_TEST_SECRET_KEY!

// Get the correct webhook secret based on the environment
const webhookSecret = isProduction
  ? process.env.STRIPE_LIVE_WEBHOOK_SECRET!
  : process.env.STRIPE_TEST_WEBHOOK_SECRET!

export const stripe = new Stripe(stripeSecretKey)
export const stripePromise = loadStripe(stripeSecretKey)

export const STRIPE_MODE = isProduction ? 'live' : 'test'

// Export webhook configuration
export const STRIPE_CONFIG = {
  mode: STRIPE_MODE,
  webhookSecret,
} as const
