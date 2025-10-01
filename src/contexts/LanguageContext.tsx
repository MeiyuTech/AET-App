'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Locale, locales, defaultLocale } from '@/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  initialLocale?: Locale
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale)
  const [isLoading, setIsLoading] = useState(true)

  // 从 cookie 或 localStorage 获取语言设置
  useEffect(() => {
    const getStoredLocale = (): Locale => {
      // 首先尝试从 cookie 获取
      if (typeof document !== 'undefined') {
        const cookieValue = document.cookie
          .split('; ')
          .find((row) => row.startsWith('locale='))
          ?.split('=')[1]

        if (cookieValue && locales.includes(cookieValue as Locale)) {
          return cookieValue as Locale
        }

        // 然后尝试从 localStorage 获取
        const storedLocale = localStorage.getItem('locale')
        if (storedLocale && locales.includes(storedLocale as Locale)) {
          return storedLocale as Locale
        }

        // 最后尝试从浏览器语言获取
        const browserLang = navigator.language.split('-')[0]
        if (locales.includes(browserLang as Locale)) {
          return browserLang as Locale
        }
      }

      return defaultLocale
    }

    const storedLocale = getStoredLocale()
    setLocaleState(storedLocale)
    setIsLoading(false)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)

    // 保存到 cookie
    if (typeof document !== 'undefined') {
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000` // 1年
      localStorage.setItem('locale', newLocale)
    }
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
