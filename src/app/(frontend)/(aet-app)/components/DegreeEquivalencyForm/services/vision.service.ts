import { ImageAnnotatorClient } from '@google-cloud/vision'

const decodedKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64 || '', 'base64').toString(
  'utf8'
)

console.log('DecodedKey:')
console.log(decodedKey)
console.log('========================================')

export class VisionService {
  private static client: ImageAnnotatorClient

  private static getClient() {
    if (!this.client) {
      this.client = new ImageAnnotatorClient({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          // private_key:
          //   '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmt8CCd3msoMGU\nXz8u8BF/vYHXLptKtBjy/by1jD9PYW5SSKSDIJh4QUjJd3Zv0Y+ejWHQTtBxbsw5\n/PPXzELG5P+le7eeaSKwLYyWciQaIKS7FIPZU7E5G4ofUEkKpeEt6zM4Y9a6RCRg\nXQOLbyJfLaXPOMdoeFQ4i0PgzeLKJDX6PVI3v5M4t2sm357aVgCjebrqY2RiUPNR\n1WQvl1XS5q3QVd7qYE5bgcrcOdndIjpeg709JEdJ/Hp6osOY7B+nVIIsv6lU32TX\nGhvsl330FRhFFBPxFYYZP4Giy0iDdoBN7Zp3YqdGR+fy9d2+pMuzU9lsMzMB+vDl\ns0/AZNCjAgMBAAECggEAS00ZvZP7OBaP+NUgc7HpJXpSCAA8EfzQfAhRUOrcuZz3\nOGEpNTTmyQIrvxufOhg8N1ACixTeHy39Pn/bH3BaBP3v3i3IHNu92DdqlZVOayKt\nZPZ6KxIbLQEcXNJle1K7J4NhainmFdGrYH8Cl9sFelni13r8zlnzKGr2qLY1pjkD\njsnapG3njU7X8TYrNy4cEA7C6tdEuSPAncI7G7dUcKRcst7s1RLxQZpU8mU1yMQi\nzljzq445r7Wz1VTe/qqNbcxYucgGu8PEOwbhBb/7OA52//KmEo3KZpGGoSTBN9HP\nSlcOXGgq90Vu0DHHv4gXZ88NPb8zezVbo4RZiDeQsQKBgQDgFFAQV+JwgHHH9Yxt\ndwOaOzDDUvCOoIcQpuD60aFrD0M9td8piBfO64vvqBQzeIC4ZhijU1xU/5vhoWPT\ncyc8WGaSudqVbGKJMOGSKflkiMm5ZxksDHRfrgP8/JB/gN9JKxQEhspBinJ0Wt+N\nhOOwwR6vyJkd5K7+HmGnco/pOQKBgQC+d5Zl7VDgchQbLfN+wwWTF4ulbU/qrIA6\nvzOs63hKJ+RS1dedrcSbhcH+944p707XfWORf5AVqbI3LrPr7ChcSYJEdgcWWUrl\ngGaQcthYo2Ynb6xg6ptQFWO5AC2IZK4bS7gVpWbkF1AKkCJaNjW6mHxUXRr1VAQm\nqUHkHHUUuwKBgGDPJdAJyCDGvWGgam0YkAvgKq8YdCmKnQ/KqURzsQNp8qkEnEd7\nLp4NEcYWnbOnCiWgpmBZsXhffl86tMAz7e2aW6ZkeVU5IFEZNztIuyB+IHjjW/K1\n5sk3iy2PiHYtnUolPF7ART2PrOcsI40mrqA8rx9O0SgjFp9fTN1lF1uxAoGBALXO\ndvxSO/oSSojrItskEwUl24GLx1XtVPU+n3f2yDqYu4QqZQc44EvHsLbM3KHAsVRW\ndx1iU0mqUtgDt3CCWsBE1pi8xOUbVLefCcfmKAbr6c3I9hUIvDoEQM1Nkyj3WY3q\niAv5dy5P5nI+xNuxlTXI6hypRttYWCIDPEcets+TAoGBALNDvUXeoyJj4VEPWlrX\nNIJvDi3RgWkbXXJb8L+q7MmAi3EpVvOCdgbQgao0sCdxraP8wjflUfMW92EBmWCF\nPpykt8pSTS+HsptuJ1N3SOKxJjVcrzRpcZFaAaXndP2mDYRFdQcjpREI4W5xd+my\nJNtqA5evG8L7vO0h5iLEelVB\n-----END PRIVATE KEY-----\n',
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
