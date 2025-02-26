import { NextRequest, NextResponse } from 'next/server'
import { Dropbox } from 'dropbox'
import fetch from 'node-fetch'

const TOKENS = {
  AET_App: {
    refreshToken: process.env.DROPBOX_AET_App_REFRESH_TOKEN,
    appKey: process.env.DROPBOX_AET_App_KEY,
    appSecret: process.env.DROPBOX_AET_App_SECRET,
    namespaceId: process.env.DROPBOX_AET_App_NAMESPACE_ID,
    basePath: '/Team Files/WebsitesDev', // Base path for AET App
  },
  AET_App_East: {
    refreshToken: process.env.DROPBOX_AET_App_East_REFRESH_TOKEN,
    appKey: process.env.DROPBOX_AET_App_East_KEY,
    appSecret: process.env.DROPBOX_AET_App_East_SECRET,
    namespaceId: process.env.DROPBOX_AET_App_East_NAMESPACE_ID,
    basePath: '/WebsitesDev', // Base path for AET App East
  },
}

async function refreshAccessToken(refreshToken: string, appKey: string, appSecret: string) {
  try {
    const response = await fetch('https://api.dropbox.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        client_id: appKey,
        client_secret: appSecret,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to refresh token: ${response.status} ${errorData}`)
    }

    const data = (await response.json()) as { access_token: string }
    console.log('data', data)
    return data.access_token
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}

function createDropboxClient(accessToken: string, namespaceId: string | null) {
  return new Dropbox({
    accessToken: accessToken,
    fetch: fetch,
    pathRoot: JSON.stringify({
      '.tag': 'namespace_id',
      namespace_id: namespaceId,
    }),
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tokenType = formData.get('tokenType') as 'AET_App' | 'AET_App_East'
    const officeName = formData.get('officeName') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const { refreshToken, appKey, appSecret, namespaceId, basePath } = TOKENS[tokenType]

    if (!refreshToken || !appKey || !appSecret) {
      throw new Error(
        'Dropbox credentials configuration is incomplete: \n' + JSON.stringify(TOKENS[tokenType])
      )
    }

    let currentAccessToken
    try {
      currentAccessToken = await refreshAccessToken(refreshToken, appKey, appSecret)
      console.log('success to get access token')
    } catch (refreshError) {
      console.error('failed to get access token:', refreshError)
      throw refreshError
    }

    const folderPath = `${basePath}/${officeName}`
    const buffer = await file.arrayBuffer()
    const path = `${folderPath}/${file.name}`

    const dbx = createDropboxClient(currentAccessToken, namespaceId!)

    try {
      await dbx.filesUpload({
        path: path,
        contents: buffer,
        mode: { '.tag': 'add' },
        autorename: true,
        client_modified: new Date().toISOString().split('.')[0] + 'Z',
      })
    } catch (uploadError) {
      console.error('Detailed upload error:', {
        error: uploadError,
        errorMessage: uploadError.message,
        errorStatus: uploadError.status,
        errorResponse: uploadError.error,
      })
      throw uploadError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Error uploading to Dropbox' }, { status: 500 })
  }
}
