'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="px-2 py-1 text-[15px] font-medium text-white/90 transition-colors hover:text-white"
          />
        )
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-white" />
      </Link>
    </nav>
  )
}
