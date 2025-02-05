import Header from '@/app/(frontend)/(fce-form)/components/Header'
import Footer from '@/app/(frontend)/(fce-form)/components/Footer'
import '@/app/(frontend)/globals.css'
import { Toaster } from '@/components/ui/toaster'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
