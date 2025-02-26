export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', '.doc', '.docx']

export const STATUS_STYLES = {
  pending: 'text-gray-500',
  uploading: 'text-blue-500',
  success: 'text-green-600',
  failed: 'text-red-600',
  cancelled: 'text-orange-500',
} as const

export const AET_APP_EAST_OFFICES = ['boston', 'newyork']
