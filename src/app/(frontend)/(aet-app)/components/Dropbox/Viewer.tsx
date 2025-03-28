'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Download, Trash2, RefreshCw, FileText } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface FileData {
  id: string
  name: string
  size: number
  uploadedAt: string
  downloadUrl?: string
}

interface ViewerProps {
  office: string
  applicationId: string | null
  fullName: string | null
}

export default function Viewer({ office, applicationId, fullName }: ViewerProps) {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get uploaded files
  const fetchFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()

      // Add office information
      queryParams.append('officeName', office)
      if (fullName) {
        queryParams.append('fullName', fullName)
      }
      if (applicationId) {
        queryParams.append('applicationId', applicationId)
      }

      const response = await fetch(`/api/dropbox/viewFilesListFolder?${queryParams.toString()}`, {
        method: 'GET',
      })

      const data = await response.json()

      if (data.notice === 'User has not uploaded any files yet') {
        setError(data.notice)
        return
      }

      if (data.success && data.result) {
        const fileEntries = data.result.result.entries
        console.log(fileEntries)
        const formattedFiles: FileData[] = fileEntries
          .filter((entry) => entry['.tag'] === 'file')
          .map((file) => ({
            id: file.id || file.path_lower,
            name: file.name,
            size: file.size || 0,
            uploadedAt: file.client_modified || new Date().toISOString(),
            downloadUrl: file.path_lower,
          }))

        setFiles(formattedFiles)
      } else {
        setError(data.error || 'Failed to fetch files')
      }
    } catch (err) {
      console.error(err)
      setError('Error fetching files, please try again later')
    } finally {
      setLoading(false)
    }
  }

  // 下载文件
  const handleDownload = async (fileId: string) => {
    // 实际下载逻辑将在未来实现
    // window.open(`/api/dropbox/download/${fileId}`, '_blank');
    console.log('Download file:', fileId)
  }

  // 删除文件
  const handleDelete = async (fileId: string) => {
    try {
      // 实际删除逻辑将在未来实现
      // const response = await fetch(`/api/dropbox/files/${fileId}`, {
      //   method: 'DELETE',
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setFiles(files.filter(file => file.id !== fileId));
      // } else {
      //   setError(data.message || '删除文件失败');
      // }

      // 临时实现：直接从列表中移除
      setFiles(files.filter((file) => file.id !== fileId))
    } catch (err) {
      setError('Error deleting file, please try again later')
      console.error(err)
    }
  }

  // Load files when applicationId is available
  useEffect(() => {
    if (applicationId) {
      fetchFiles()
    } else {
      setLoading(false)
    }
  }, [applicationId, office])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!applicationId) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Uploaded Files</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchFiles}
          disabled={loading}
          className="text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : files.length === 0 ? (
        <Card className="flex items-center justify-center p-6 bg-gray-50">
          <p className="text-sm text-gray-500">No uploaded files yet</p>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                    File Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate max-w-[200px] cursor-default">{file.name}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{file.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatFileSize(file.size)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(file.uploadedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-start space-x-3">
                  <FileText className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                  <div className="min-w-0 flex-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 cursor-default">
                            {file.name}
                          </h4>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs break-words">{file.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
