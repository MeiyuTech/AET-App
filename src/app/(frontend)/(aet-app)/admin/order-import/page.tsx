import { OrderImportForm } from '../../components/OrderImportForm'

export default function OrderImportPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">订单导入</h1>
        <p className="text-muted-foreground mt-2">在此页面快速导入订单数据到系统中</p>
      </div>
      <OrderImportForm />
    </div>
  )
}
