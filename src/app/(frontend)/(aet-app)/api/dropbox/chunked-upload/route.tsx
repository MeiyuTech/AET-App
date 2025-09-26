'use server'

import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'

import { DROPBOX_TOKENS } from '../../../utils/dropbox/config.server'
import { getOfficeTokenType } from '../../../utils/dropbox/config.client'
import { getAccessToken, createDropboxClient } from '../../../utils/dropbox/server'

// Store upload sessions in memory (in production, use Redis or database)
const uploadSessions = new Map<
  string,
  {
    sessionId: string
    office: string
    applicationId: string
    fullName: string
    submittedAt: string
    fileName: string
    totalChunks: number
    uploadedChunks: number
    totalFileSize: number
    uploadedBytes: number
    tokenType: string
    folderPath: string
  }
>()

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'start':
        return await startUploadSession(data)
      case 'append':
        return await appendChunk(data)
      case 'finish':
        return await finishUpload(data)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Chunked upload error:', error)
    return NextResponse.json({ error: 'Error processing chunked upload' }, { status: 500 })
  }
}

async function startUploadSession(data: {
  office: string
  applicationId: string
  fullName: string
  submittedAt: string
  fileName: string
  fileSize: number
}) {
  const { office, applicationId, fullName, submittedAt, fileName, fileSize } = data
  const tokenType = getOfficeTokenType(office)
  const { namespaceId, basePath } = DROPBOX_TOKENS[tokenType]

  if (!namespaceId || !basePath) {
    throw new Error('Dropbox config is incomplete')
  }

  const folderPath = `${basePath}/${office}/${fullName} - ${applicationId}`
  const filePath = `${folderPath}/${fileName}`
  const totalChunks = Math.ceil(fileSize / (4 * 1024 * 1024)) // 4MB chunks

  const accessToken = await getAccessToken(tokenType)
  const dbx = createDropboxClient(accessToken, namespaceId)

  try {
    const session = await dbx.filesUploadSessionStart({
      close: false,
      contents: Buffer.alloc(0), // Empty buffer for session start
    })

    console.log('Session response:', session) // Debug log

    // Dropbox SDK returns the session_id in the result property
    const sessionId = session.result?.session_id
    const uploadKey = `${office}-${applicationId}-${fileName}`

    if (!sessionId) {
      console.error('Session response structure:', JSON.stringify(session, null, 2))
      throw new Error('Failed to get session ID from Dropbox response')
    }

    uploadSessions.set(uploadKey, {
      sessionId,
      office,
      applicationId,
      fullName,
      submittedAt,
      fileName,
      totalChunks,
      uploadedChunks: 0,
      totalFileSize: fileSize,
      uploadedBytes: 0,
      tokenType,
      folderPath: filePath,
    })

    return NextResponse.json({
      success: true,
      sessionId,
      totalChunks,
      uploadKey,
    })
  } catch (error) {
    console.error('Failed to start upload session:', error)
    throw error
  }
}

async function appendChunk(data: {
  uploadKey: string
  chunkIndex: number
  chunkData: string // base64 encoded
}) {
  const { uploadKey, chunkIndex, chunkData } = data
  const session = uploadSessions.get(uploadKey)

  console.log('Appending chunk:', { uploadKey, chunkIndex, sessionExists: !!session })
  console.log('Session data:', session)

  if (!session) {
    return NextResponse.json({ error: 'Upload session not found' }, { status: 404 })
  }

  if (!session.sessionId) {
    console.error('Session ID is missing:', session)
    return NextResponse.json({ error: 'Session ID is missing' }, { status: 400 })
  }

  const accessToken = await getAccessToken(session.tokenType as 'AET_App' | 'AET_App_East')
  const { namespaceId } = DROPBOX_TOKENS[session.tokenType as keyof typeof DROPBOX_TOKENS]
  const dbx = createDropboxClient(accessToken, namespaceId || null)

  try {
    const buffer = Buffer.from(chunkData, 'base64')
    const chunkSize = buffer.length
    const offset = session.uploadedBytes

    console.log('Appending chunk:', {
      chunkIndex,
      chunkSize,
      offset,
      uploadedBytes: session.uploadedBytes,
      totalFileSize: session.totalFileSize,
    })

    await dbx.filesUploadSessionAppendV2({
      cursor: {
        session_id: session.sessionId,
        offset: offset,
      },
      close: false,
      contents: buffer,
    })

    session.uploadedChunks++
    session.uploadedBytes += chunkSize

    return NextResponse.json({
      success: true,
      uploadedChunks: session.uploadedChunks,
      totalChunks: session.totalChunks,
    })
  } catch (error) {
    console.error('Failed to append chunk:', error)
    throw error
  }
}

async function finishUpload(data: { uploadKey: string; commit: boolean }) {
  const { uploadKey, commit } = data
  const session = uploadSessions.get(uploadKey)

  if (!session) {
    return NextResponse.json({ error: 'Upload session not found' }, { status: 404 })
  }

  if (session.uploadedChunks !== session.totalChunks) {
    return NextResponse.json({ error: 'Not all chunks uploaded' }, { status: 400 })
  }

  const accessToken = await getAccessToken(session.tokenType as 'AET_App' | 'AET_App_East')
  const { namespaceId } = DROPBOX_TOKENS[session.tokenType as keyof typeof DROPBOX_TOKENS]
  const dbx = createDropboxClient(accessToken, namespaceId || null)

  try {
    if (commit) {
      // Use the actual uploaded bytes as offset
      const totalOffset = session.uploadedBytes
      console.log('Finishing upload session:', {
        sessionId: session.sessionId,
        uploadedChunks: session.uploadedChunks,
        totalChunks: session.totalChunks,
        uploadedBytes: session.uploadedBytes,
        totalFileSize: session.totalFileSize,
        totalOffset: totalOffset,
        fileName: session.fileName,
      })

      // Finish the upload session
      await dbx.filesUploadSessionFinish({
        cursor: {
          session_id: session.sessionId,
          offset: totalOffset,
        },
        commit: {
          path: session.folderPath,
          mode: { '.tag': 'add' },
          autorename: true,
          client_modified: new Date().toISOString().split('.')[0] + 'Z',
        },
      })

      // Handle LA office special case
      if (session.office === 'Los Angeles') {
        await handleLAOfficeUpload(session, accessToken, namespaceId || '')
      }
    }

    // Clean up session
    uploadSessions.delete(uploadKey)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to finish upload:', error)
    throw error
  }
}

async function handleLAOfficeUpload(
  session: {
    tokenType: string
    submittedAt: string
    fullName: string
    applicationId: string
    fileName: string
    folderPath: string
  },
  accessToken: string,
  namespaceId: string
) {
  const { tokenType, submittedAt, fullName, applicationId, fileName } = session
  const { LA_Path } = DROPBOX_TOKENS[tokenType as 'AET_App']

  if (!LA_Path) {
    console.warn('LA_Path not found in configuration')
    return
  }

  const submittedYear = submittedAt.split('-')[0]
  const submittedMonthNumber = submittedAt.split('-')[1]
  const submittedMonth = dayjs(submittedMonthNumber, 'MM').format('MMMM')

  const laFolderPath = `${LA_Path}/${submittedYear}/${submittedMonth}/${fullName} - ${applicationId}`
  const laFilePath = `${laFolderPath}/${fileName}`

  const dbx = createDropboxClient(accessToken, namespaceId)

  try {
    // For LA office, we need to copy the file to the special path
    // This is a simplified approach - in practice, you might want to upload directly to both locations
    await dbx.filesCopyV2({
      from_path: session.folderPath,
      to_path: laFilePath,
    })
  } catch (laUploadError) {
    console.error('LA additional upload error:', laUploadError)
    // Don't throw here to ensure the main upload is not affected
  }
}
