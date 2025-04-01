// 获取申请状态对应的颜色类名
export function getStatusColor(status: string): string {
  const colors = {
    draft: 'text-yellow-600',
    submitted: 'text-blue-600',
    processing: 'text-purple-600',
    completed: 'text-green-600',
    cancelled: 'text-red-600',
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}

// 获取支付状态对应的颜色类名
export function getPaymentStatusColor(status: string): string {
  const colors = {
    pending: 'text-yellow-600',
    paid: 'text-green-600',
    failed: 'text-red-600',
    expired: 'text-gray-600',
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}
