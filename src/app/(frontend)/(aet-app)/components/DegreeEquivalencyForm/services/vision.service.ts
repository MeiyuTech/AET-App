import { ImageAnnotatorClient } from '@google-cloud/vision'

const decodedKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64 || '', 'base64').toString(
  'utf8'
)

// console.log('DecodedKey:')
// console.log(decodedKey)
// console.log('========================================')

export class VisionService {
  private static client: ImageAnnotatorClient

  private static getClient() {
    if (!this.client) {
      this.client = new ImageAnnotatorClient({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: decodedKey,
        },
        projectId: process.env.GOOGLE_PROJECT_ID,
      })
    }
    return this.client
  }

  static async detectText(base64Image: string): Promise<string> {
    try {
      const client = this.getClient()
      const [result] = await client.textDetection({
        image: {
          content: base64Image,
        },
      })

      const detections = result.textAnnotations
      if (!detections || detections.length === 0) {
        return ''
      }

      // Return the first detection result (contains all text)
      return detections[0].description || ''
    } catch (error) {
      console.error('Error detecting text from image:', error)
      return ''
    }
  }
}
