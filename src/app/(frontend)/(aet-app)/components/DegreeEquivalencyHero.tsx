'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function DegreeEquivalencyHero() {
  const t = useTranslations('degreeEquivalencyApplication.page')

  return (
    <div className="w-full max-w-3xl">
      <div className="relative h-32 w-full rounded-lg overflow-hidden mb-6">
        <Image
          src="/Graduation-Students.jpg"
          alt={t('hero.imageAlt')}
          className="object-cover w-full h-full"
          width={1000}
          height={1000}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {t('hero.title')} <span className="text-green-300">{t('hero.highlight')}</span>
          </h1>
        </div>
      </div>
    </div>
  )
}
