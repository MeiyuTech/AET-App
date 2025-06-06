import { ImageAnnotatorClient } from '@google-cloud/vision'

export class VisionService {
  private static client: ImageAnnotatorClient

  private static getClient() {
    if (!this.client) {
      this.client = new ImageAnnotatorClient()
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
