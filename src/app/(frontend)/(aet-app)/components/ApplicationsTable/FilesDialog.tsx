'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Application } from './types'
import Uploader from '../Dropbox/Uploader'
import Viewer from '../Dropbox/Viewer'

interface FilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: Application
}

export function FilesDialog({ open, onOpenChange, application }: FilesDialogProps) {
  if (!application) return null

  // get full name from application
  const fullName =
    [application.first_name, application.middle_name, application.last_name]
      .filter(Boolean)
      .join(' ') || 'Not provided'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Files Management</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Files</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>
          <TabsContent value="view" className="mt-4">
            <Viewer
              office={application.office || ''}
              applicationId={application.id}
              fullName={fullName}
              showPreviewLink={true}
            />
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
            <Uploader
              office={application.office || ''}
              submittedAt={application.submitted_at}
              applicationId={application.id}
              fullName={fullName}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
