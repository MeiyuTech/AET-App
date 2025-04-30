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

export function getPaymentStatusColor(status: string): string {
  const colors = {
    pending: 'text-yellow-600',
    paid: 'text-green-600',
    failed: 'text-red-600',
    expired: 'text-gray-600',
    refunded: 'text-red-600',
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}

export function getUploadStatusColor(status: string): string {
  const colors = {
    pending: 'text-gray-500',
    uploading: 'text-blue-500',
    success: 'text-green-600',
    failed: 'text-red-600',
    cancelled: 'text-orange-500',
  }
  return colors[status as keyof typeof colors] || 'text-gray-500'
}
