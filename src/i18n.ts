import { getRequestConfig } from 'next-intl/server'

// 支持的语言列表
export const locales = ['en', 'zh', 'es'] as const
export type Locale = (typeof locales)[number]

// 默认语言
export const defaultLocale: Locale = 'en'

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
}

// 语言显示简称
export const localeDisplayNames: Record<Locale, string> = {
  en: 'EN',
  zh: '中文',
  es: 'ES',
}

const resolveLocale = (locale?: string): Locale => {
  if (!locale) return defaultLocale

  const normalized = locale.toLowerCase()

  if (locales.includes(normalized as Locale)) {
    return normalized as Locale
  }

  const base = normalized.split('-')[0]
  if (locales.includes(base as Locale)) {
    return base as Locale
  }

  return defaultLocale
}

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = resolveLocale(locale)

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  }
})
