'use client'

const isProduction = process.env.NODE_ENV === 'production'

export const stripePublishableKey = isProduction
  ? process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY!
  : process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY!
