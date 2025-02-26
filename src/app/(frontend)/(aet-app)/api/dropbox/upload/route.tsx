'use server'

import { NextRequest, NextResponse } from 'next/server'
import { Dropbox } from 'dropbox'
import fetch from 'node-fetch'
import {
  DROPBOX_TOKENS,
  TOKEN_REFRESH,
} from '@/app/(frontend)/(aet-app)/utils/dropbox/config.server'

async function getAccessToken(tokenType: 'AET_App' | 'AET_App_East') {
  const { refreshToken, appKey, appSecret } = DROPBOX_TOKENS[tokenType]

  try {
    const token = await refreshAccessToken(refreshToken, appKey, appSecret)
    console.log(`success to get access token (${tokenType})`)
    return token
  } catch (error) {
    console.error('failed to get access token:', error)
    throw error
  }
}

async function refreshAccessToken(
  refreshToken: string | undefined,
  appKey: string | undefined,
  appSecret: string | undefined
) {
  try {
    if (!refreshToken || !appKey || !appSecret) {
      throw new Error(
        'Refresh token or app key or app secret is undefined: \n' +
          JSON.stringify({ refreshToken, appKey, appSecret })
      )
    }

    const response = await fetch(TOKEN_REFRESH.DROPBOX_API_URL, {
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
      throw new Error(`failed to refresh token: ${response.status} ${errorData}`)
    }

    const data = (await response.json()) as {
      access_token: string
      expires_in: number
      token_type: string
    }

    return data.access_token
  } catch (error) {
    console.error('failed to refresh access token:', error)
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

    const { namespaceId, basePath } = DROPBOX_TOKENS[tokenType]

    if (!namespaceId || !basePath) {
      throw new Error(
        'Dropbox config is incomplete: \n' + JSON.stringify(DROPBOX_TOKENS[tokenType])
      )
    }

    const accessToken = await getAccessToken(tokenType)

    const folderPath = `${basePath}/${officeName}`
    const buffer = await file.arrayBuffer()
    const path = `${folderPath}/${file.name}`

    const dbx = createDropboxClient(accessToken, namespaceId)

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
