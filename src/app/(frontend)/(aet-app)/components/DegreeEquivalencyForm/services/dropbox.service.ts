import { DROPBOX_TOKENS } from '@/app/(frontend)/(aet-app)/utils/dropbox/config.server'
import {
  getAccessToken,
  createDropboxClient,
} from '@/app/(frontend)/(aet-app)/utils/dropbox/server'

export class DropboxService {
  private static readonly IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']

  private static async findFirstImageFile(dbx: any, folderPath: string): Promise<string | null> {
    try {
      const response = await dbx.filesListFolder({
        path: folderPath,
      })

      const files = response.result.entries
      const imageFile = files.find((file: any) =>
        this.IMAGE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
      )

      return imageFile ? `${folderPath}/${imageFile.name}` : null
    } catch (error) {
      console.error('Error listing folder contents:', error)
      return null
    }
  }

  static async getDiplomaImage(email: string, fullName: string): Promise<string | null> {
    const { namespaceId, basePath } = DROPBOX_TOKENS['AET_App']

    if (!namespaceId || !basePath) {
      throw new Error(
        'Dropbox config is incomplete: \n' + JSON.stringify(DROPBOX_TOKENS['AET_App'])
      )
    }

    try {
      // Build folder path
      const folderPath = `${basePath}/Miami/${fullName} - ${email}`

      const accessToken = await getAccessToken('AET_App')
      const dbx = createDropboxClient(accessToken, namespaceId)

      // Find the first image file in the folder
      const filePath = await this.findFirstImageFile(dbx, folderPath)
      console.log('filePath:', filePath)

      if (!filePath) {
        console.log('No image file found in folder:', folderPath)
        return null
      }

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
