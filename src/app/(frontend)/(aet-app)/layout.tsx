import Header from '@/app/(frontend)/(aet-app)/components/Header'
import Footer from '@/app/(frontend)/(aet-app)/components/Footer'
import '@/app/(frontend)/globals.css'
import { Toaster } from '@/components/ui/toaster'

export default function FCEFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
