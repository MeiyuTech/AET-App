'use server'

import { NextRequest, NextResponse } from 'next/server'

import { DROPBOX_TOKENS } from '../../../utils/dropbox/config.server'
import { getOfficeTokenType } from '../../../utils/dropbox/config.client'
import { getAccessToken, createDropboxClient } from '../../../utils/dropbox/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const officeName = formData.get('officeName') as string
    const applicationId = formData.get('applicationId') as string
    const fullName = formData.get('fullName') as string
    const tokenType = getOfficeTokenType(officeName)

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const { namespaceId, basePath } = DROPBOX_TOKENS[tokenType]

    if (!namespaceId || !basePath) {
      throw new Error(
        'Dropbox config is incomplete: \n' + JSON.stringify(DROPBOX_TOKENS[tokenType])
      )
    }

    let folderPath = `${basePath}/${officeName}`
    if (applicationId && fullName) {
      folderPath = `${basePath}/${officeName}/${fullName} - ${applicationId}`
    } else {
      throw new Error('Application ID or full name is undefined')
    }

    const buffer = await file.arrayBuffer()
    const path = `${folderPath}/${file.name}`

    const accessToken = await getAccessToken(tokenType)
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
