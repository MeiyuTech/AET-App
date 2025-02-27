export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', '.doc', '.docx']

export const STATUS_STYLES = {
  pending: 'text-gray-500',
  uploading: 'text-blue-500',
  success: 'text-green-600',
  failed: 'text-red-600',
  cancelled: 'text-orange-500',
} as const

export function getOfficeTokenType(officeName: string) {
  switch (officeName) {
    case 'Boston':
      return 'AET_App_East'
    case 'New York':
      return 'AET_App_East'
    case 'San Francisco':
      return 'AET_App'
    case 'Los Angeles':
      return 'AET_App'
    case 'Miami':
      return 'AET_App'
    default:
      throw new Error(`Invalid office name: ${officeName}`)
  }
}
