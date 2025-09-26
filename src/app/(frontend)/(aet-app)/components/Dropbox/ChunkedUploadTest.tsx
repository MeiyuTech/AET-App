'use client'

import { useState } from 'react'
import { CHUNK_SIZE } from '../../utils/dropbox/config.client'

export default function ChunkedUploadTest() {
  const [testFile, setTestFile] = useState<File | null>(null)
  const [chunkInfo, setChunkInfo] = useState<{
    totalChunks: number
    chunkSize: number
    fileSize: number
  } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTestFile(file)
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      setChunkInfo({
        totalChunks,
        chunkSize: CHUNK_SIZE,
        fileSize: file.size,
      })
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">分片上传测试</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">选择测试文件</label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {chunkInfo && (
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-900 mb-2">文件分片信息</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>文件大小:</span>
                <span>{(chunkInfo.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span>分片大小:</span>
                <span>{(chunkInfo.chunkSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span>总分片数:</span>
                <span>{chunkInfo.totalChunks}</span>
              </div>
              <div className="flex justify-between">
                <span>上传方式:</span>
                <span
                  className={chunkInfo.fileSize > CHUNK_SIZE ? 'text-blue-600' : 'text-green-600'}
                >
                  {chunkInfo.fileSize > CHUNK_SIZE ? '分片上传' : '普通上传'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• 文件大于 4MB 将使用分片上传</p>
          <p>• 文件小于等于 4MB 将使用普通上传</p>
          <p>• 分片大小: 4MB (符合 Vercel 4.5MB 限制)</p>
        </div>
      </div>
    </div>
  )
}
