import Header from '@/app/(frontend)/(fce-form)/components/Header'
import Footer from '@/app/(frontend)/(fce-form)/components/Footer'
import '@/app/(frontend)/globals.css'
import { Toaster } from '@/components/ui/toaster'

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-[128px]">
      <Header />
      {children}
      <Footer />
      <Toaster />
    </main>
  )
}
