'use client'

import { useState, useRef, DragEvent } from 'react'
import { useTranslations } from 'next-intl'
import { MAX_FILE_SIZE, ALLOWED_TYPES, CHUNK_SIZE } from '../../utils/dropbox/config.client'
import { getUploadStatusColor } from '../../utils/statusColors'

type UploadStatus = 'pending' | 'uploading' | 'success' | 'failed' | 'cancelled'

interface DropboxUploaderProps {
  office: string
  submittedAt: string | null
  applicationId: string | null
  fullName: string | null
}

export default function DropboxUploader({
  office,
  submittedAt,
  applicationId,
  fullName,
}: DropboxUploaderProps) {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [isErrorMessage, setIsErrorMessage] = useState(false)
  const [progress, setProgress] = useState<{
    [key: string]: {
      status: UploadStatus
      percent: number
      chunks?: { uploaded: number; total: number }
    }
  }>({})
  const [isDragging, setIsDragging] = useState(false)
  const abortControllersRef = useRef<{ [key: string]: AbortController }>({})
  const uploadSessionsRef = useRef<{ [key: string]: string }>({})

  const t = useTranslations('dropboxUploader')
  const tCommon = useTranslations('common')
  const maxFileSizeMb = (MAX_FILE_SIZE / 1024 / 1024).toFixed(0)
  const chunkSizeMb = (CHUNK_SIZE / 1024 / 1024).toFixed(1)

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return t('validation.tooLarge', {
        name: file.name,
        maxSize: maxFileSizeMb,
      })
    }
    if (!ALLOWED_TYPES.some((type) => file.type.includes(type))) {
      return t('validation.unsupportedFormat', { name: file.name })
    }
    return null
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const validationErrors = Array.from(fileList).map(validateFile).filter(Boolean)

    if (validationErrors.length > 0) {
      setMessage(validationErrors.join(' '))
      setIsErrorMessage(true)
      return
    }

    setFiles(fileList)
    setMessage('')
    setIsErrorMessage(false)
    setProgress({})
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const cancelUpload = (fileName: string) => {
    abortControllersRef.current[fileName]?.abort()
    setProgress((prev) => ({
      ...prev,
      [fileName]: { ...prev[fileName], status: 'cancelled' },
    }))
  }

  const getStatusText = (fileName: string) => {
    const fileProgress = progress[fileName]
    const status = fileProgress?.status ?? 'pending'

    if (status === 'uploading') {
      if (fileProgress?.chunks) {
        return t('status.uploadingWithProgress', {
          uploaded: fileProgress.chunks.uploaded,
          total: fileProgress.chunks.total,
        })
      }
      return t('status.uploading')
    }

    return t(`status.${status}`)
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  // Chunked upload function
  const uploadFileInChunks = async (file: File, uploadKey: string) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

    setProgress((prev) => ({
      ...prev,
      [file.name]: {
        status: 'uploading',
        percent: 0,
        chunks: { uploaded: 0, total: totalChunks },
      },
    }))

    try {
      // Start upload session
      const startResponse = await fetch('/api/dropbox/chunked-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          office,
          applicationId,
          fullName,
          submittedAt,
          fileName: file.name,
          fileSize: file.size,
        }),
      })

      if (!startResponse.ok) {
        throw new Error('Failed to start upload session')
      }

      const { sessionId } = await startResponse.json()
      uploadSessionsRef.current[file.name] = sessionId

      // Upload chunks
      for (let i = 0; i < totalChunks; i++) {
        if (abortControllersRef.current[file.name]?.signal.aborted) {
          throw new Error('Upload cancelled')
        }

        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end) as File
        const chunkData = await fileToBase64(chunk)

        const appendResponse = await fetch('/api/dropbox/chunked-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'append',
            uploadKey,
            chunkIndex: i,
            chunkData,
          }),
        })

        if (!appendResponse.ok) {
          throw new Error(`Failed to upload chunk ${i + 1}`)
        }

        const percent = Math.round(((i + 1) / totalChunks) * 100)
        setProgress((prev) => ({
          ...prev,
          [file.name]: {
            status: 'uploading',
            percent,
            chunks: { uploaded: i + 1, total: totalChunks },
          },
        }))
      }

      // Finish upload
      const finishResponse = await fetch('/api/dropbox/chunked-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finish',
          uploadKey,
          commit: true,
        }),
      })

      if (!finishResponse.ok) {
        throw new Error('Failed to finish upload')
      }

      setProgress((prev) => ({
        ...prev,
        [file.name]: {
          status: 'success',
          percent: 100,
          chunks: { uploaded: totalChunks, total: totalChunks },
        },
      }))

      return { fileName: file.name, success: true }
    } catch (error) {
      if (error.message === 'Upload cancelled') {
        setProgress((prev) => ({
          ...prev,
          [file.name]: {
            status: 'cancelled',
            percent: prev[file.name]?.percent || 0,
            chunks: prev[file.name]?.chunks,
          },
        }))
        return { fileName: file.name, success: false, aborted: true }
      }

      setProgress((prev) => ({
        ...prev,
        [file.name]: {
          status: 'failed',
          percent: prev[file.name]?.percent || 0,
          chunks: prev[file.name]?.chunks,
        },
      }))
      throw error
    }
  }

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage(t('selectFilesFirst'))
      setIsErrorMessage(true)
      return
    }

    setUploading(true)
    setMessage(tCommon('loading'))
    setIsErrorMessage(false)
    abortControllersRef.current = {}
    uploadSessionsRef.current = {}

    try {
      const results = await Promise.all(
        Array.from(files).map(async (file) => {
          // Create new AbortController for this upload
          const controller = new AbortController()
          abortControllersRef.current[file.name] = controller

          // Generate unique upload key
          const uploadKey = `${office}-${applicationId}-${file.name}`

          try {
            // Use chunked upload for files larger than CHUNK_SIZE, regular upload for smaller files
            if (file.size > CHUNK_SIZE) {
              return await uploadFileInChunks(file, uploadKey)
            } else {
              // Use regular upload for small files
              const formData = new FormData()
              formData.append('file', file)
              formData.append('officeName', office)
              if (submittedAt) {
                formData.append('submittedAt', submittedAt)
              }
              if (fullName) {
                formData.append('fullName', fullName)
              }
              if (applicationId) {
                formData.append('applicationId', applicationId)
              }

              setProgress((prev) => ({
                ...prev,
                [file.name]: { status: 'uploading', percent: 0 },
              }))

              const response = await fetch('/api/dropbox/upload', {
                method: 'POST',
                body: formData,
                signal: controller.signal,
              })

              setProgress((prev) => ({
                ...prev,
                [file.name]: {
                  status: response.ok ? 'success' : 'failed',
                  percent: 100,
                },
              }))

              return { fileName: file.name, success: response.ok }
            }
          } catch (error) {
            if (error.name === 'AbortError' || error.message === 'Upload cancelled') {
              return { fileName: file.name, success: false, aborted: true }
            }
            throw error
          }
        })
      )

      const successful = results.filter((r) => r.success).length
      const aborted = results.filter((r) => r.aborted).length
      if (aborted) {
        setMessage(t('summaryWithCancelled', { successful, total: files.length, cancelled: aborted }))
      } else {
        setMessage(t('summary', { successful, total: files.length }))
      }
      setIsErrorMessage(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setMessage(t('errorUploading', { error: errorMessage }))
      setIsErrorMessage(true)
    } finally {
      setUploading(false)
      abortControllersRef.current = {}
      uploadSessionsRef.current = {}
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          transition-colors duration-200
        `}
      >
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <p className="mt-2 text-sm text-gray-500">{t('dragOrDrop')}</p>
        <p className="mt-1 text-xs text-gray-400">
          {t('supportedFormats', {
            formats: 'JPG, PNG, PDF, DOC(X)',
            maxSize: `${maxFileSizeMb}MB`,
            chunkSize: `${chunkSizeMb}MB`,
          })}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {t.rich('retryHelp', {
            contact: (chunks) => <span className="font-semibold text-blue-700">{chunks}</span>,
          })}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          <span className="font-semibold text-blue-700">{t('contact.laSf')}</span>{' '}
          <span className="font-mono bg-blue-50 px-1 rounded text-blue-700">ca2@aet21.com</span>
          <br />
          <span className="font-semibold text-blue-700">{t('contact.other')}</span>{' '}
          <span className="font-mono bg-blue-50 px-1 rounded text-blue-700">
            info@americantranslationservice.com
          </span>
        </p>
      </div>

      {files && files.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>{t('selectedFilesLabel', { count: files.length })}</p>
          <ul className="mt-2 space-y-2">
            {Array.from(files).map((file) => (
              <li key={file.name} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="truncate">{file.name}</span>
                  {uploading && progress[file.name]?.status === 'uploading' && (
                    <button
                      onClick={() => cancelUpload(file.name)}
                      className="text-red-500 text-xs hover:text-red-700"
                    >
                      {tCommon('cancel')}
                    </button>
                  )}
                  <span className={getUploadStatusColor(progress[file.name]?.status || 'pending')}>
                    {getStatusText(file.name)}
                  </span>
                </div>
                {progress[file.name] && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress[file.name].percent}%` }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !files || files.length === 0}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
          hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploading ? t('status.uploading') : t('cta')}
      </button>

      {message && (
        <p className={`text-sm ${isErrorMessage ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
