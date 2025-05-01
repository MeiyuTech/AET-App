'use client'

import { Toaster } from 'sonner'

export default function GPACalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
