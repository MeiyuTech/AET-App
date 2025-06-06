import { DROPBOX_TOKENS } from '@/app/(frontend)/(aet-app)/utils/dropbox/config.server'
import {
  getAccessToken,
  createDropboxClient,
} from '@/app/(frontend)/(aet-app)/utils/dropbox/server'

export class DropboxService {
  static async getDiplomaImage(email: string, fullName: string): Promise<string | null> {
    const { namespaceId, basePath } = DROPBOX_TOKENS['AET_App']

    if (!namespaceId || !basePath) {
      throw new Error(
        'Dropbox config is incomplete: \n' + JSON.stringify(DROPBOX_TOKENS['AET_App'])
      )
    }

    try {
      // Build file path
      const folderPath = `${basePath}/Miami/${fullName} - ${email}`
      const filePath = `${folderPath}/Diploma.png`

      //   console.log('filePath:', filePath)

      const accessToken = await getAccessToken('AET_App')
      const dbx = createDropboxClient(accessToken, namespaceId)

      // Download file
      const response = await dbx.filesDownload({
        path: filePath,
      })

      // Convert file content to base64
      const fileContent = (response.result as any).fileBinary
      if (!fileContent) {
        throw new Error('No file content received')
      }

      const base64 = Buffer.from(fileContent).toString('base64')
      return base64
    } catch (error) {
      console.error('Error downloading diploma image:', error)
      return null
    }
  }
}
