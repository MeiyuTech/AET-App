'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Application } from './types'
import DropboxUploader from '../Dropbox/Uploader'
import DropboxViewer from '../Dropbox/Viewer'

interface FilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: Application
}

export function FilesDialog({ open, onOpenChange, application }: FilesDialogProps) {
  if (!application) return null

  // 组合用户全名
  const fullName = `${application.first_name} ${application.last_name}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Files Management</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="view">View Files</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <DropboxUploader
              office={application.office || ''}
              submittedAt={application.submitted_at}
              applicationId={application.id}
              fullName={fullName}
            />
          </TabsContent>

          <TabsContent value="view" className="mt-4">
            <DropboxViewer
              office={application.office || ''}
              applicationId={application.id}
              fullName={fullName}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
