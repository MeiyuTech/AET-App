import { notFound } from 'next/navigation'
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

export default getRequestConfig(async ({ locale }) => {
  // 验证传入的 locale 是否有效
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
