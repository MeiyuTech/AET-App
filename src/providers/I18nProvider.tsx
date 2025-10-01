'use client'

import { NextIntlClientProvider } from 'next-intl'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import { Locale } from '@/i18n'
import { useState, useEffect } from 'react'

interface I18nProviderProps {
  children: React.ReactNode
  initialLocale?: Locale
}

function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage()
  const [messages, setMessages] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    // 动态加载消息文件
    import(`../../messages/${locale}.json`)
      .then((module) => {
        setMessages(module.default)
      })
      .catch((error) => {
        console.error(`Failed to load messages for locale ${locale}:`, error)
        // 回退到默认语言
        import(`../../messages/en.json`)
          .then((module) => {
            setMessages(module.default)
          })
          .catch((fallbackError) => {
            console.error('Failed to load fallback messages:', fallbackError)
          })
      })
  }, [locale])

  if (!messages) {
    // 在消息加载时显示加载状态
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  return (
    <LanguageProvider initialLocale={initialLocale}>
      <MessagesProvider>{children}</MessagesProvider>
    </LanguageProvider>
  )
}
