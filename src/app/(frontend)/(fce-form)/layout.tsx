import Header from '@/app/(frontend)/(fce-form)/components/Header'
import Footer from '@/app/(frontend)/(fce-form)/components/Footer'
import '@/app/(frontend)/globals.css'
import { Toaster } from '@/components/ui/toaster'

export default function FCEFormLayout({ children }: { children: React.ReactNode }) {
  return <div className="fce-form-layout">{children}</div>
}
