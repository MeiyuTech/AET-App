'use client'

import { useTranslations } from 'next-intl'

export default function StatusIntro() {
  const t = useTranslations('status.page')

  return (
    <>
      <h1 className="text-2xl font-bold">{t('heading')}</h1>
      <p className="text-sm text-gray-500">{t('intro')}</p>
    </>
  )
}
