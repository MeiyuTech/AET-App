import { Metadata } from 'next'
import { OrderImportForm } from '../../components/OrderImportForm'

export const metadata: Metadata = {
  title: 'AET Order Import ｜ AET Admin',
  description: 'AET Service Application Order Import',
}

export default function OrderImportPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Import</h1>
        <p className="text-muted-foreground mt-2">Import order data into the system quickly</p>
      </div>
      <OrderImportForm />
    </div>
  )
}
