'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DatabaseCoreApplication } from '../DegreeEquivalencyForm/types'
import Uploader from '../Dropbox/Uploader'
import Viewer from '../Dropbox/Viewer'

interface DegreeEquivalencyFilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: DatabaseCoreApplication
}

export function DegreeEquivalencyFilesDialog({
  open,
  onOpenChange,
  application,
}: DegreeEquivalencyFilesDialogProps) {
  if (!application) return null

  // get full name from application
  const fullName =
    [application.first_name, application.middle_name, application.last_name]
      .filter(Boolean)
      .join(' ') || 'Not provided'

  // For degree equivalency applications, we'll use Miami as the default office
  const office = 'Miami'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Files Management - Degree Equivalency</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Files</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>
          <TabsContent value="view" className="mt-4">
            <Viewer
              office={office}
              applicationId={application.email}
              fullName={fullName}
              showPreviewLink={true}
            />
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
            <Uploader
              office={office}
              submittedAt={application.created_at} // Use created_at as submitted_at
              applicationId={application.id}
              fullName={fullName}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
