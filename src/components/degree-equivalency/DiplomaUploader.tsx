'use client'

import { Card, CardContent } from '@/components/ui/card'
import DropboxUploader from '@/app/(frontend)/(aet-app)/components/Dropbox/Uploader'

interface DiplomaUploaderProps {
  office: string
  email: string
  fullName: string
}

export function DiplomaUploader({ office, email, fullName }: DiplomaUploaderProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <DropboxUploader
          office={office}
          submittedAt={new Date().toISOString().split('T')[0]}
          applicationId={email}
          fullName={fullName}
        />
      </CardContent>
    </Card>
  )
}
