'use server'

import { NextRequest, NextResponse } from 'next/server'

import { DROPBOX_TOKENS } from '../../../utils/dropbox/config.server'
import { getOfficeTokenType } from '../../../utils/dropbox/config.client'
import { getAccessToken, createDropboxClient } from '../../../utils/dropbox/server'

export async function GET(request: NextRequest) {
  try {
    const queryParams = request.nextUrl.searchParams
    const officeName = queryParams.get('officeName')
    const applicationId = queryParams.get('applicationId')
    const fullName = queryParams.get('fullName')

    if (!officeName) {
      return NextResponse.json(
        { success: false, error: 'Office name is required' },
        { status: 400 }
      )
    }

    if (!applicationId || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Application ID and full name are required' },
        { status: 400 }
      )
    }

    const tokenType = getOfficeTokenType(officeName)
    const { namespaceId, basePath } = DROPBOX_TOKENS[tokenType]

    if (!namespaceId || !basePath) {
      return NextResponse.json(
        { success: false, error: 'Invalid office configuration' },
        { status: 500 }
      )
    }

    let folderPath = `${basePath}/${officeName}`
    if (applicationId && fullName) {
      folderPath = `${basePath}/${officeName}/${fullName} - ${applicationId}`
    } else {
      throw new Error('Application ID or full name is undefined')
    }

    const path = `${folderPath}`

    const accessToken = await getAccessToken(tokenType)
    const dbx = createDropboxClient(accessToken, namespaceId)

    try {
      const result = await dbx.filesListFolder({
        path: path,
      })

      return NextResponse.json({
        success: true,
        result,
        path: folderPath,
      })
    } catch (viewError) {
      if (
        viewError?.status === 409 &&
        viewError?.error?.error_summary?.includes('path/not_found')
      ) {
        return NextResponse.json({
          success: true,
          result: { entries: [] },
          notice: 'User has not uploaded any files yet',
        })
      }

      console.error('Detailed view error:', {
        error: viewError,
        errorMessage: viewError.message,
        errorStatus: viewError.status,
        errorResponse: viewError.error,
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Error accessing Dropbox folder',
          errorDetails: viewError.error?.error_summary || viewError.message,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('View error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error viewing Dropbox',
        errorMessage: error.message,
      },
      { status: 500 }
    )
  }
}
