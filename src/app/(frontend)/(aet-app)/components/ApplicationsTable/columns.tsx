import { ChevronDown, Eye, Edit, FileText, Calendar as CalendarIcon } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DatabaseEducation } from '../FCEApplicationForm/types'
import { Application } from './types'
import { formatDateTime } from '../../utils/dateFormat'
import { getStatusColor, getPaymentStatusColor } from '../../utils/statusColors'
import { getEstimatedCompletionDate } from '../FCEApplicationForm/utils'
import { CompletionProgressBar } from './CompletionProgressBar'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { format } from 'date-fns'

interface GetColumnsProps {
  handleOfficeChange: (id: string, office: string | null) => Promise<void>
  handleStatusChange: (id: string, status: string) => Promise<void>
  handlePaymentStatusChange: (id: string, status: string, paymentMethod: string) => Promise<void>
  setPendingDueAmount: (data: { id: string; amount: number | null }) => void
  setConfirmDialogOpen: (open: boolean) => void
  setSelectedEducations: (educations: DatabaseEducation[] | undefined) => void
  setDialogOpen: (open: boolean) => void
  setSelectedApplication: (application: Application | undefined) => void
  setServicesDialogOpen: (open: boolean) => void
  createPaymentLink: (id: string, amount: number) => void
  setFilesDialogOpen: (open: boolean) => void
  handlePaidAtChange: (id: string, paidAt: Date | null) => Promise<void>
}

// get the dropbox link for the office
const getOfficeDropboxLink = (office: string | null): string => {
  if (!office) return '#'

  const officeLinks: Record<string, string> = {
    Miami: 'https://www.dropbox.com/work/Team%20Files/WebsitesDev/Miami',
    'San Francisco': 'https://www.dropbox.com/work/Team%20Files/WebsitesDev/San%20Francisco',
    'Los Angeles': 'https://www.dropbox.com/work/Team%20Files/WebsitesDev/Los%20Angeles',
  }

  return officeLinks[office] || `https://www.dropbox.com/work/Team%20Files/WebsitesDev`
}

export const getColumns = ({
  handleOfficeChange,
  handleStatusChange,
  handlePaymentStatusChange,
  setPendingDueAmount,
  setConfirmDialogOpen,
  setSelectedEducations,
  setDialogOpen,
  setSelectedApplication,
  setServicesDialogOpen,
  createPaymentLink,
  setFilesDialogOpen,
  handlePaidAtChange,
}: GetColumnsProps): ColumnDef<Application>[] => [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Created At
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {date
              .toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')}
          </div>
          <div className="text-gray-600">
            {date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </div>
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const dateStr = row.getValue(columnId) as string
      if (!dateStr) return false

      const date = new Date(dateStr)

      // Format the date to the user's view: YYYY-MM-DD
      const formattedDate = date
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')

      // Format the time to the user's view: HH:MM:SS
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      // Check if the search value matches any part of the date or time
      return (
        formattedDate.toLowerCase().includes(filterValue.toLowerCase()) ||
        formattedTime.toLowerCase().includes(filterValue.toLowerCase())
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Updated At
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {date
              .toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')}
          </div>
          <div className="text-gray-600">
            {date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </div>
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const dateStr = row.getValue(columnId) as string
      if (!dateStr) return false

      const date = new Date(dateStr)

      // Format the date to the user's view: YYYY-MM-DD
      const formattedDate = date
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')

      // Format the time to the user's view: HH:MM:SS
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      // Check if the search value matches any part of the date or time
      return (
        formattedDate.toLowerCase().includes(filterValue.toLowerCase()) ||
        formattedTime.toLowerCase().includes(filterValue.toLowerCase())
      )
    },
  },
  {
    accessorKey: 'office',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Office
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const office = row.getValue('office') as string | null
      const status = row.getValue('status') as string
      const isEditable = status === 'submitted' || status === 'processing'

      return (
        <div className="flex items-center">
          {office ? (
            <Link
              href={getOfficeDropboxLink(office)}
              className="text-blue-500 hover:underline mr-2"
              target="_blank"
            >
              {office}
            </Link>
          ) : (
            <span className="mr-2">N/A</span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="default"
                disabled={!isEditable}
                className="hover:bg-gray-100"
              >
                <Edit className={`h-5 w-5 ${!isEditable ? 'opacity-50' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            {isEditable && (
              <DropdownMenuContent>
                <DropdownMenuLabel>Set Office</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['Boston', 'New York', 'Miami', 'San Francisco', 'Los Angeles'].map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => handleOfficeChange(row.original.id, city)}
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleOfficeChange(row.original.id, null)}>
                  Clear
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      )
    },
  },
  {
    accessorKey: 'id',
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      // Split UUID into three parts for better readability
      const parts = id.split('-')
      const firstPart = parts.slice(0, 2).join('-') + '-'
      const secondPart = parts.slice(2, 4).join('-') + '-'
      const thirdPart = parts[4]

      return (
        <Link
          href={`../status?applicationId=${id}`}
          target="_blank"
          className="text-blue-500 hover:underline text-sm block w-[140px]"
        >
          <div>{firstPart}</div>
          <div>{secondPart}</div>
          <div>{thirdPart}</div>
        </Link>
      )
    },
  },
  // {
  //   accessorKey: 'name',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         className="text-lg font-semibold hover:bg-gray-100"
  //       >
  //         Client Name
  //         <ChevronDown className="ml-2 h-5 w-5" />
  //       </Button>
  //     )
  //   },
  // },
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Evaluee Name
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const firstName = row.getValue('first_name') as string
      const middleName = row.original.middle_name
      const lastName = row.original.last_name
      return (
        <div className="w-[160px] break-words">
          {[firstName, middleName, lastName].filter(Boolean).join(' ')}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const firstName = (row.getValue(columnId) as string) || ''
      const middleName = row.original.middle_name || ''
      const lastName = row.original.last_name || ''
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').toLowerCase()
      return fullName.includes(filterValue.toLowerCase())
    },
  },
  // {
  //   accessorKey: 'pronouns',
  //   header: () => <div className="text-center">Pronouns</div>,
  //   cell: ({ row }) => {
  //     const pronouns = row.getValue('pronouns') as string
  //     const pronounsMap = {
  //       mr: 'Mr.',
  //       ms: 'Ms.',
  //       mx: 'Mx.',
  //     }
  //     return pronounsMap[pronouns as keyof typeof pronounsMap] || pronouns
  //   },
  // },
  // {
  //   accessorKey: 'phone',
  //   header: () => <div className="text-center">Phone</div>,
  //   cell: ({ row }) => {
  //     const phone = row.getValue('phone') as string
  //     return phone || 'N/A'
  //   },
  // },
  // {
  //   accessorKey: 'email',
  //   header: () => <div className="text-center">Email</div>,
  // },
  // {
  //   accessorKey: 'date_of_birth',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         className="text-lg font-semibold hover:bg-gray-100"
  //       >
  //         Birth Date
  //         <ChevronDown className="ml-2 h-5 w-5" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue('date_of_birth'))
  //     return date.toISOString().split('T')[0]
  //   },
  // },
  // {
  //   accessorKey: 'country',
  //   header: () => <div className="text-center">Address</div>,
  //   cell: ({ row }) => {
  //     const streetAddress = row.original.street_address
  //     const streetAddress2 = row.original.street_address2
  //     const city = row.original.city
  //     const region = row.original.region
  //     const zipCode = row.original.zip_code
  //     const country = row.getValue('country') as string

  //     const addressParts = [
  //       streetAddress,
  //       streetAddress2,
  //       [city, region, zipCode].filter(Boolean).join(' '),
  //       country,
  //     ]

  //     return addressParts.filter(Boolean).join(', ')
  //   },
  // },
  {
    accessorKey: 'purpose',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Purpose
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const purpose = row.getValue('purpose') as string
      const purposeOther = row.original.purpose_other
      return purpose === 'other' ? purposeOther : purpose
    },
  },
  {
    accessorKey: 'educations',
    header: () => <div className="text-center">Educations</div>,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="default"
          className="hover:bg-gray-100 px-1"
          onClick={() => {
            setSelectedEducations(row.original.educations)
            setDialogOpen(true)
          }}
        >
          <Eye className="h-5 w-5" />
        </Button>
      )
    },
  },
  {
    id: 'services',
    header: () => <div className="text-center">Services</div>,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="default"
          className="hover:bg-gray-100 px-1"
          onClick={() => {
            setSelectedApplication(row.original)
            setServicesDialogOpen(true)
          }}
        >
          <Eye className="h-5 w-5" />
        </Button>
      )
    },
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
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Status
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
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
    id: 'estimated_completion_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Estimated Completion Date
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const application = row.original
      const paidAt = application.paid_at
      const status = application.status

      // if status is cancelled or completed, don't show the progress bar
      if (status === 'cancelled' || status === 'completed') {
        return 'N/A'
      }

      // If there is no payment time, display N/A
      if (!paidAt) {
        return 'N/A'
      }

      try {
        // Use the applicant's existing service_type data
        const applicationData = {
          serviceType: application.service_type as any,
          status: application.status,
          submitted_at: application.submitted_at || '',
          due_amount: application.due_amount || 0,
          payment_status: application.payment_status,
          payment_id: application.payment_id,
          paid_at: application.paid_at,
          additionalServices: application.additional_services as any[],
          additionalServicesQuantity: application.additional_services_quantity,
          educationInfo: application.educations?.map((edu) => ({
            countryOfStudy: edu.country_of_study,
            degreeObtained: edu.degree_obtained,
            schoolName: edu.school_name,
            studyDuration: {
              startDate: edu.study_start_date,
              endDate: edu.study_end_date,
            },
          })),
        }

        const estimatedDate = getEstimatedCompletionDate(applicationData, paidAt)
        return <CompletionProgressBar estimatedDate={estimatedDate} />
      } catch (error) {
        console.error('Error calculating estimated completion date:', error)
        return 'N/A'
      }
    },
  },
  {
    accessorKey: 'due_amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Due Amount
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueAmount = row.getValue('due_amount') as number | null
      const status = row.getValue('status') as string
      const isEditable = status === 'submitted' || status === 'processing'

      return (
        <div className="flex items-center">
          <span className="mr-2">{dueAmount !== null ? `$${dueAmount.toFixed(2)}` : 'N/A'}</span>
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
                <DropdownMenuLabel>Set Due Amount</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const form = e.target as HTMLFormElement
                      const input = form.elements.namedItem('amount') as HTMLInputElement
                      const amount = parseFloat(input.value)

                      if (!isNaN(amount) && amount >= 0) {
                        // 4 digits for the integer part and 2 digits for the decimal part
                        const limitedAmount = Math.min(9999.99, Math.round(amount * 100) / 100)

                        setPendingDueAmount({
                          id: row.original.id,
                          amount: limitedAmount,
                        })
                        setConfirmDialogOpen(true)
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <Input
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        max="9999.99"
                        defaultValue={dueAmount !== null ? dueAmount.toString() : ''}
                        placeholder="0.00"
                        className="w-28"
                      />
                      <Button type="submit" size="sm" className="ml-2">
                        Save
                      </Button>
                    </div>
                  </form>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setPendingDueAmount({
                      id: row.original.id,
                      amount: null,
                    })
                    setConfirmDialogOpen(true)
                  }}
                >
                  Clear
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      )
    },
  },
  {
    accessorKey: 'payment_status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Payment Status
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const paymentStatus = row.getValue('payment_status') as string
      const dueAmount = row.getValue('due_amount') as number | null
      // Allow changing payment status if it's pending or expired
      const canChangeToPaid = paymentStatus === 'pending' || paymentStatus === 'expired'

      return (
        <div className="flex items-center">
          <div
            className={`capitalize font-medium mr-2 text-base ${getPaymentStatusColor(paymentStatus)}`}
          >
            {paymentStatus}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="default" className="hover:bg-gray-100 px-1">
                <Edit className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Payment Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {canChangeToPaid && (
                <>
                  <DropdownMenuItem
                    onClick={() => handlePaymentStatusChange(row.original.id, 'paid', 'zelle')}
                  >
                    Mark as Paid via Zelle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePaymentStatusChange(row.original.id, 'paid', 'paypal')}
                  >
                    Mark as Paid via Paypal
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => createPaymentLink(row.original.id, dueAmount || 0)}>
                Create Payment Link With ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
  {
    accessorKey: 'paid_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-lg font-semibold hover:bg-gray-100 w-full justify-center"
        >
          Paid At
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const paidAt = row.getValue('paid_at')
      const paymentStatus = row.getValue('payment_status') as string
      const isEditable = paymentStatus === 'pending' || paymentStatus === 'expired'

      if (!paidAt) {
        return (
          <div className="flex items-center gap-4 min-w-[200px]">
            <span>N/A</span>
            {isEditable && (
              <DateTimePicker
                date={undefined}
                setDate={(newDate) => handlePaidAtChange(row.original.id, newDate || null)}
                className="h-8 w-8 p-0"
              />
            )}
          </div>
        )
      }

      const date = new Date(paidAt as string)
      return (
        <div className="flex items-center gap-4 min-w-[200px]">
          <div className="space-y-1">
            <div className="font-medium">
              {date
                .toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')}
            </div>
            <div className="text-gray-600">
              {date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </div>
          </div>
          {isEditable && (
            <DateTimePicker
              date={date}
              setDate={(newDate) => handlePaidAtChange(row.original.id, newDate || null)}
              className="h-8 w-8 p-0"
            />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'payment_id',
    header: () => <div className="text-center">Payment ID (notes）</div>,
    cell: ({ row }) => row.getValue('payment_id') || 'N/A',
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) || 'N/A'
      return String(value).toLowerCase().includes(filterValue.toLowerCase())
    },
  },
]
