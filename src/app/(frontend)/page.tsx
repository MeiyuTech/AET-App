import type { Metadata } from 'next'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'

import { AnimatedCard } from '@/components/ui/animated-elements'
import { InvestmentProjectsSection } from '@/components/sections/InvestmentProjectsSection'
import { GlobalNetworkSection } from '@/components/sections/GlobalNetworkSection'

export default function HomePage() {
  return <></>
}

export function generateMetadata(): Metadata {
  return {
    title: '首页 | 美域佳华',
  }
}
