'use client'

import { useState } from 'react'
import DropboxUploader from './Uploader'
import OfficeSelector, { Office } from '../OfficeSelector'

export default function DropboxUploadForm() {
  const [selectedOffice, setSelectedOffice] = useState<Office | undefined>()

  return (
    <div className="space-y-6">
      <OfficeSelector selectedOffice={selectedOffice} onOfficeSelect={setSelectedOffice} />
      {selectedOffice && (
        <DropboxUploader
          office={selectedOffice.name}
          submittedAt={'test_submittedAt'}
          applicationId={'test_applicationId'}
          fullName={'test_fullName'}
        />
      )}
    </div>
  )
}
