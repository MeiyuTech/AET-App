import { NextResponse } from 'next/server'
import { Dropbox } from 'dropbox'
import fetch from 'node-fetch'

// 添加更详细的调试日志
console.log('DROPBOX_ACCESS_TOKEN exists:', !!process.env.DROPBOX_ACCESS_TOKEN)
console.log('DROPBOX_ACCESS_TOKEN prefix:', process.env.DROPBOX_ACCESS_TOKEN?.substring(0, 5))

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  // The Dropbox SDK requires a fetch implementation for making HTTP requests.
  // In a browser environment, fetch is globally available.
  // However, in a Node.js environment (where Next.js API routes run on the server),
  // we need to explicitly provide a fetch implementation.
  // By using node-fetch and passing it to the Dropbox SDK, we can resolve this issue.
  // This will allow us to properly configure the Dropbox access token.
  fetch: fetch as any,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 确保 token 存在
    if (!process.env.DROPBOX_ACCESS_TOKEN) {
      throw new Error('Dropbox access token is not configured')
    }

    const buffer = await file.arrayBuffer()
    // 更新上传路径到 Team Files/WebsitesDev 目录
    const path = `/Team Files/WebsitesDev/${file.name}`

    try {
      await dbx.filesUpload({
        path: path,
        contents: buffer,
      })
    } catch (uploadError: any) {
      // 添加更详细的错误信息
      console.error('Detailed upload error:', {
        error: uploadError,
        errorMessage: uploadError.message,
        errorStatus: uploadError.status,
        errorResponse: uploadError.error,
      })
      throw uploadError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Dropbox upload error:', {
      message: error.message,
      status: error.status,
      details: error.error,
    })

    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error.message,
        status: error.status,
        apiError: error.error,
      },
      { status: 500 }
    )
  }
}
