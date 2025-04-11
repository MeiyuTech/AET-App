'use client'

import { FileText } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatFileSize, formatDate } from '../../utils/dropbox/client'
import { FileData } from './config'

interface FileListProps {
  files: FileData[]
}

export default function FileList({ files }: FileListProps) {
  if (files.length === 0) {
    return (
      <Card className="flex items-center justify-center p-6 bg-gray-50">
        <p className="text-sm text-gray-500">No uploaded files yet</p>
      </Card>
    )
  }

  return (
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
                        <Link
                          href={`https://www.dropbox.com/preview/${file.pathDisplay}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate max-w-[200px] block hover:underline text-blue-600"
                        >
                          {file.name}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs break-words">{file.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatFileSize(file.size)}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(file.uploadedAt)}</td>
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
                      <Link
                        href={`https://www.dropbox.com/preview/${file.pathDisplay}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:underline line-clamp-2 block"
                      >
                        {file.name}
                      </Link>
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
  )
}
