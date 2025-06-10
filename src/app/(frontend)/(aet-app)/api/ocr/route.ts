import { NextResponse } from 'next/server'
import { VisionService } from '@/app/(frontend)/(aet-app)/components/DegreeEquivalencyForm/services/vision.service'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json()
    if (!base64Image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }
    const text = await VisionService.detectText(base64Image)
    return NextResponse.json({ text })
  } catch (error) {
    return NextResponse.json(
      { error: 'OCR failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
