import DropboxUploader from './components/DropboxUploader'

export default function DropboxTestPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dropbox Upload Test</h1>
        <DropboxUploader />
      </div>
    </div>
  )
}
