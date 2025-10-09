import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye, Edit, FileText } from 'lucide-react'
import {
  getStatusColor,
  getPaymentStatusColor,
} from '@/app/(frontend)/(aet-app)/utils/statusColors'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { DatabaseCoreApplication } from '../DegreeEquivalencyForm/types'

const getStatusPageLink = (applicationId: string): string => {
  const root = 'https://app.americantranslationservice.com'

  return `${root}/degree-equivalency-tool/application/success?applicationId=${applicationId}`
}

// get the dropbox link for the office
const getDropboxLink = (fullName: string, email: string): string => {
  const root = 'https://www.dropbox.com/work/Team%20Files/WebsitesDev/Miami'

  return `${root}/${fullName} - ${email}`
}

export const getDegreeEquivalencyColumns = (
  onEducationClick: (educations: any[]) => void,
  handleAiOutputChange: (id: string, educationId: string, newAiOutput: string) => Promise<void>,
  handleStatusChange: (id: string, status: string) => Promise<void>,
  setSelectedApplication: (application: DatabaseCoreApplication | undefined) => void,
  setFilesDialogOpen: (open: boolean) => void
): ColumnDef<any>[] => [
  {
    id: 'index',
    header: () => <div className="text-center">#</div>,
    cell: ({ table, row }) => {
      const rows = table.getRowModel().rows
      const index = rows.findIndex((r) => r.id === row.id)
      return index + 1
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Created At
      </Button>
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue('created_at') as string | undefined
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      const formattedDate = date
        .toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      return (
        <div className="space-y-1">
          <div className="font-medium">{formattedDate}</div>
          <div className="text-gray-600">{formattedTime}</div>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
  //     >
  //       ID
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const id = row.getValue('id') as string | undefined
  //     if (!id) return 'N/A'
  //     // Split UUID into three parts for better readability
  //     const parts = id.split('-')
  //     const firstPart = parts.slice(0, 2).join('-') + '-'
  //     const secondPart = parts.slice(2, 4).join('-') + '-'
  //     const thirdPart = parts[4]
  //     return (
  //       <div className="text-sm block w-[140px]">
  //         <div>{firstPart}</div>
  //         <div>{secondPart}</div>
  //         <div>{thirdPart}</div>
  //       </div>
  //     )
  //   },
  // },
  {
    id: 'evalueeName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Evaluee Name
      </Button>
    ),
    cell: ({ row }) => {
      const firstName = row.original.first_name || ''
      const middleName = row.original.middle_name || ''
      const lastName = row.original.last_name || ''
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')
      // const email = row.original.email || ''
      // const dropboxLink = getDropboxLink(fullName, email)
      const statusPageLink = getStatusPageLink(row.original.id)
      return (
        <Link href={statusPageLink} target="_blank" className="text-blue-500 underline">
          {fullName}
        </Link>
      )
    },
  },
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
  //     >
  //       Email
  //     </Button>
  //   ),
  //   cell: ({ row }) => (row.getValue('email') as string) || 'N/A',
  // },
  {
    id: 'educations',
    header: () => (
      <div className="text-lg font-semibold hover:bg-gray-100 w-full justify-center">
        Educations
      </div>
    ),
    cell: ({ row }: any) => (
      <Button
        variant="ghost"
        size="default"
        onClick={() => onEducationClick(row.original.educations)}
        disabled={!row.original.educations || row.original.educations.length === 0}
      >
        <Eye className="h-5 w-5" />
      </Button>
    ),
  },
  {
    id: 'files',
    header: () => <div className="text-center">Files</div>,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="default"
          className="hover:bg-gray-100 px-1"
          onClick={() => {
            setSelectedApplication(row.original)
            setFilesDialogOpen(true)
          }}
        >
          <FileText className="h-5 w-5" />
        </Button>
      )
    },
  },
  {
    id: 'ai_output',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        AI Output
      </Button>
    ),
    cell: ({ row }) => {
      // TODO: Handle multiple educations
      const education = row.original.educations[0]
      if (!education) return 'N/A'

      const status = row.getValue('status') as string
      const isEditable = status !== 'completed'

      return (
        <div className="flex items-center">
          <div className="max-w-[300px] truncate mr-2" title={education.ai_output}>
            {education.ai_output || 'N/A'}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="default"
                className="hover:bg-gray-100 px-1"
                disabled={!isEditable}
              >
                <Edit className={`h-5 w-5 ${!isEditable ? 'opacity-50' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            {isEditable && (
              <DropdownMenuContent className="w-[400px]">
                <DropdownMenuLabel>Change AI Output</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const form = e.target as HTMLFormElement
                      const textarea = form.elements.namedItem('aiOutput') as HTMLTextAreaElement
                      const newAiOutput = textarea.value.trim()

                      if (newAiOutput) {
                        handleAiOutputChange(row.original.id, education.id, newAiOutput)
                      }
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <Textarea
                        name="aiOutput"
                        defaultValue={education.ai_output || ''}
                        placeholder="Enter new AI output"
                        className="min-h-[100px] resize-none"
                      />
                      <Button type="submit" size="sm" className="self-end">
                        Save
                      </Button>
                    </div>
                  </form>
                </div>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      )
    },
  },
  {
    accessorKey: 'purpose',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Purpose
      </Button>
    ),
    cell: ({ row }) => (row.getValue('purpose') as string) || 'N/A',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Status
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const paymentStatus = row.getValue('payment_status') as string

      // Determine which status changes are allowed
      const canComplete = status === 'processing' && paymentStatus === 'paid'
      const canCancel =
        (status === 'processing' && paymentStatus !== 'paid') || status === 'submitted'
      const canProcess = status === 'submitted' && paymentStatus === 'paid'
      const isEditable = canComplete || canCancel || canProcess

      return (
        <div className="flex items-center">
          <div className={`capitalize font-medium mr-2 text-base ${getStatusColor(status)}`}>
            {status}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="default"
                className="hover:bg-gray-100 px-1"
                disabled={!isEditable}
              >
                <Edit className={`h-5 w-5 ${!isEditable ? 'opacity-50' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            {isEditable && (
              <DropdownMenuContent>
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canComplete && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(row.original.id, 'completed')}
                  >
                    Mark as Completed
                  </DropdownMenuItem>
                )}
                {canProcess && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(row.original.id, 'processing')}
                  >
                    Mark as Processing
                  </DropdownMenuItem>
                )}
                {canCancel && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(row.original.id, 'cancelled')}
                  >
                    Cancel Application
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      )
    },
  },
  {
    accessorKey: 'due_amount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Due Amount
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue('due_amount')
      return amount !== null && amount !== undefined ? `$${Number(amount).toFixed(2)}` : 'N/A'
    },
  },
  {
    accessorKey: 'payment_status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Payment Status
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('payment_status') as string
      return (
        <div className="flex items-center">
          <div className={`capitalize font-medium mr-2 text-base ${getPaymentStatusColor(status)}`}>
            {status}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'paid_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Paid At
      </Button>
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue('paid_at') as string | undefined
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      const formattedDate = date
        .toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      return (
        <div className="space-y-1">
          <div className="font-medium">{formattedDate}</div>
          <div className="text-gray-600">{formattedTime}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'payment_id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
      >
        Payment ID
      </Button>
    ),
    cell: ({ row }) => {
      const paymentId = row.getValue('payment_id') as string | undefined
      return paymentId ? (
        <Link
          href={`https://dashboard.stripe.com/payments/${paymentId}`}
          target="_blank"
          className="text-blue-500 underline"
        >
          {paymentId}
        </Link>
      ) : (
        'N/A'
      )
    },
  },

  // {
  //   accessorKey: 'source',
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
  //     >
  //       Source
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const source = row.getValue('source') as string | undefined
  //     return <span className="capitalize">{source || 'N/A'}</span>
  //   },
  // },
]
