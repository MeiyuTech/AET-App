import Stripe from 'stripe'

const isProduction = process.env.NODE_ENV === 'production'

// Choose the correct API key based on the environment
const stripeSecretKey = isProduction
  ? process.env.STRIPE_LIVE_SECRET_KEY!
  : process.env.STRIPE_TEST_SECRET_KEY!

export const stripe = new Stripe(stripeSecretKey)

export const STRIPE_MODE = isProduction ? 'live' : 'test'
