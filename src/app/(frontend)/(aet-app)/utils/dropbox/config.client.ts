export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const CHUNK_SIZE = 3 * 1024 * 1024 // 3MB chunks to stay under Vercel's 4.5MB limit (base64 encoding increases size by ~33%)
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', '.doc', '.docx']

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
