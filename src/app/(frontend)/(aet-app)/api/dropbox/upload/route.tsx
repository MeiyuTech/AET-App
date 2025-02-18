import { NextRequest, NextResponse } from 'next/server'
import { Dropbox } from 'dropbox'
import fetch from 'node-fetch'

const TOKENS = {
  AET_App: {
    accessToken: process.env.DROPBOX_AET_App_ACCESS_TOKEN,
    namespaceId: process.env.DROPBOX_AET_App_NAMESPACE_ID,
    basePath: '/Team Files/WebsitesDev', // Base path for AET App
  },
  AET_App_East: {
    accessToken: process.env.DROPBOX_AET_App_East_ACCESS_TOKEN,
    namespaceId: process.env.DROPBOX_AET_App_East_NAMESPACE_ID,
    basePath: '/WebsitesDev', // Base path for AET App East
  },
}

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_AET_App_East_ACCESS_TOKEN,
  // The Dropbox SDK requires a fetch implementation for making HTTP requests.
  // In a browser environment, fetch is globally available.
  // However, in a Node.js environment (where Next.js API routes run on the server),
  // we need to explicitly provide a fetch implementation.
  // By using node-fetch and passing it to the Dropbox SDK, we can resolve this issue.
  // This will allow us to properly configure the Dropbox access token.
  fetch: fetch,
  // Add the pathRoot parameter to specify the namespace ID
  pathRoot: JSON.stringify({
    '.tag': 'namespace_id',
    namespace_id: process.env.DROPBOX_AET_App_East_NAMESPACE_ID,
  }),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tokenType = formData.get('tokenType') as 'AET_App' | 'AET_App_East'
    const officeName = formData.get('officeName') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const { accessToken, namespaceId, basePath } = TOKENS[tokenType]

    // Create folder path based on office
    const folderPath = `${basePath}/${officeName}`

    // Ensure token exists
    if (!accessToken) {
      throw new Error('Dropbox access token is not configured')
    }

    const buffer = await file.arrayBuffer()
    // Use the correct path in team space
    const path = `${folderPath}/${file.name}`

    // Create a new Dropbox instance with the correct token and namespace
    const currentDbx = new Dropbox({
      accessToken: accessToken,
      fetch: fetch,
      pathRoot: JSON.stringify({
        '.tag': 'namespace_id',
        namespace_id: namespaceId,
      }),
    })

    try {
      await currentDbx.filesUpload({
        path: path,
        contents: buffer,
        mode: { '.tag': 'add' },
        // Auto-rename the file if it already exists (but the content is different)
        autorename: true,
        client_modified: new Date().toISOString().split('.')[0] + 'Z',
      })
    } catch (uploadError) {
      // Add detailed error information
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
