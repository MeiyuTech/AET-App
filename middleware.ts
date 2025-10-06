import { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { locales, defaultLocale } from './src/i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'never',
})

export function middleware(request: NextRequest) {
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
