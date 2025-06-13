'use client'

import { useState, useRef, DragEvent } from 'react'
import { MAX_FILE_SIZE, ALLOWED_TYPES } from '../../utils/dropbox/config.client'
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
  const [progress, setProgress] = useState<{
    [key: string]: { status: UploadStatus; percent: number }
  }>({})
  const [isDragging, setIsDragging] = useState(false)
  const abortControllersRef = useRef<{ [key: string]: AbortController }>({})

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} is too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`
    }
    if (!ALLOWED_TYPES.some((type) => file.type.includes(type))) {
      return `${file.name} has unsupported format`
    }
    return null
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const validationErrors = Array.from(fileList).map(validateFile).filter(Boolean)

    if (validationErrors.length > 0) {
      setMessage(validationErrors.join(', '))
      return
    }

    setFiles(fileList)
    setMessage('')
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

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage('Please select files first')
      return
    }

    setUploading(true)
    setMessage('Uploading...')
    abortControllersRef.current = {}

    try {
      const results = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)

          // Add office information
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
          // Create new AbortController for this upload
          const controller = new AbortController()
          abortControllersRef.current[file.name] = controller

          setProgress((prev) => ({
            ...prev,
            [file.name]: { status: 'uploading', percent: 0 },
          }))

          try {
            const response = await fetch('/api/dropbox/upload', {
              method: 'POST',
              body: formData,
              signal: controller.signal,
            })

            // const result = await response.json()

            setProgress((prev) => ({
              ...prev,
              [file.name]: {
                status: response.ok ? 'success' : 'failed',
                percent: 100,
              },
            }))

            return { fileName: file.name, success: response.ok }
          } catch (error) {
            if (error.name === 'AbortError') {
              return { fileName: file.name, success: false, aborted: true }
            }
            throw error
          }
        })
      )

      const successful = results.filter((r) => r.success).length
      const aborted = results.filter((r) => r.aborted).length
      setMessage(
        `Uploaded ${successful} of ${files.length} files` +
          (aborted ? ` (${aborted} cancelled)` : '')
      )
    } catch (error) {
      setMessage('Error uploading files: ' + error)
    } finally {
      setUploading(false)
      abortControllersRef.current = {}
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
        <p className="mt-2 text-sm text-gray-500">or drag and drop files here</p>
        <p className="mt-1 text-xs text-gray-400">
          Supported formats: JPG, PNG, PDF, DOC(X) • Max size: 50MB
        </p>
      </div>

      {files && files.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>Selected {files.length} files:</p>
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
                      Cancel
                    </button>
                  )}
                  <span className={getUploadStatusColor(progress[file.name]?.status || 'pending')}>
                    {progress[file.name]?.status === 'uploading'
                      ? 'Uploading...'
                      : progress[file.name]?.status === 'success'
                        ? 'Completed'
                        : progress[file.name]?.status === 'failed'
                          ? 'Failed'
                          : progress[file.name]?.status === 'cancelled'
                            ? 'Cancelled'
                            : 'Pending'}
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
        {uploading ? 'Uploading...' : 'Upload Picture of Your Diploma'}
      </button>

      {message && (
        <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
