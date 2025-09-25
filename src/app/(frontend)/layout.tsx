import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

// import { AdminBar } from '@/components/AdminBar'
// import { Footer } from '@/Footer/Component'
// import { Header } from '@/Header/Component'
import Header from '@/app/(frontend)/(aet-app)/components/Header'
import Footer from '@/app/(frontend)/(aet-app)/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { cn } from '@/utilities/cn'
// import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { FloatingQRCode } from '@/components/FloatingQRCode'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        {/* Disable dark mode for the admin panel */}
        {/* TODO: Support dark mode for the admin panel */}
        {/* <InitTheme /> */}
        <script>
          {`
            (function () {
              // Set the theme to light
              document.documentElement.setAttribute('data-theme', 'light');
            })();
          `}
        </script>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        {/* Provideers Also Make Dark Theme for Fonrtend !!! */}
        {/* <Providers> */}
        {/* I don't want to show the admin bar to marketing people */}
        {/* <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          /> */}

        {/* <Header /> */}
        <Header />
        <main className="pt-[32px]">{children}</main>
        {/* <Footer /> */}
        <Footer />
        <Toaster />
        {/* </Providers> */}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    template: '%s | American Education & Translation Services (AET) | Since 2009',
    default: 'American Education & Translation Services (AET) | Since 2009',
  },
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@meiyugroup',
  },
}
