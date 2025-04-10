import { ChevronDown, Eye, Edit } from 'lucide-react'
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

interface GetColumnsProps {
  handleOfficeChange: (id: string, office: string | null) => Promise<void>
  handleStatusChange: (id: string, status: string) => Promise<void>
  handlePaymentStatusChange: (id: string, status: string, paymentMethod: string) => Promise<void>
  setPendingDueAmount: (data: { id: string; amount: number | null }) => void
  setConfirmDialogOpen: (open: boolean) => void
  setSelectedEducations: (educations: DatabaseEducation[] | undefined) => void
  setDialogOpen: (open: boolean) => void
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
}: GetColumnsProps): ColumnDef<Application>[] => [
  {
    id: 'index',
    header: '#',
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
        >
          Created At
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date
        .toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2')
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated At
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
      return date
        .toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2')
    },
  },
  {
    accessorKey: 'office',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Office
          <ChevronDown className="ml-2 h-4 w-4" />
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
              <Button variant="ghost" size="sm" disabled={!isEditable}>
                <Edit className={`h-4 w-4 ${!isEditable ? 'opacity-50' : ''}`} />
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
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      return (
        <Link
          href={`../status?applicationId=${id}`}
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          {id}
        </Link>
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Client Name
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Evaluee Name
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const firstName = row.getValue('first_name') as string
      const middleName = row.original.middle_name
      const lastName = row.original.last_name
      return [firstName, middleName, lastName].filter(Boolean).join(' ')
    },
  },
  {
    accessorKey: 'pronouns',
    header: 'Pronouns',
    cell: ({ row }) => {
      const pronouns = row.getValue('pronouns') as string
      const pronounsMap = {
        mr: 'Mr.',
        ms: 'Ms.',
        mx: 'Mx.',
      }
      return pronounsMap[pronouns as keyof typeof pronounsMap] || pronouns
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string
      return phone || 'N/A'
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'date_of_birth',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Birth Date
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('date_of_birth'))
      return date.toISOString().split('T')[0]
    },
  },
  {
    accessorKey: 'country',
    header: 'Address',
    cell: ({ row }) => {
      const streetAddress = row.original.street_address
      const streetAddress2 = row.original.street_address2
      const city = row.original.city
      const region = row.original.region
      const zipCode = row.original.zip_code
      const country = row.getValue('country') as string

      const addressParts = [
        streetAddress,
        streetAddress2,
        [city, region, zipCode].filter(Boolean).join(' '),
        country,
      ]

      return addressParts.filter(Boolean).join(', ')
    },
  },
  {
    accessorKey: 'purpose',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Purpose
          <ChevronDown className="ml-2 h-4 w-4" />
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
    header: 'Education Info',
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedEducations(row.original.educations)
            setDialogOpen(true)
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
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
        >
          Status
          <ChevronDown className="ml-2 h-4 w-4" />
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
          <div className={`capitalize font-medium mr-2 ${getStatusColor(status)}`}>{status}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={!isEditable}>
                <Edit className={`h-4 w-4 ${!isEditable ? 'opacity-50' : ''}`} />
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Amount
          <ChevronDown className="ml-2 h-4 w-4" />
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
              <Button variant="ghost" size="sm" disabled={!isEditable}>
                <Edit className={`h-4 w-4 ${!isEditable ? 'opacity-50' : ''}`} />
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
        >
          Payment Status
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const paymentStatus = row.getValue('payment_status') as string
      // Allow changing payment status if it's pending or expired
      const canChangeToPaid = paymentStatus === 'pending' || paymentStatus === 'expired'

      return (
        <div className="flex items-center">
          <div className={`capitalize font-medium mr-2 ${getPaymentStatusColor(paymentStatus)}`}>
            {paymentStatus}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={!canChangeToPaid}>
                <Edit className={`h-4 w-4 ${!canChangeToPaid ? 'opacity-50' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            {canChangeToPaid && (
              <DropdownMenuContent>
                <DropdownMenuLabel>Change Payment Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
              </DropdownMenuContent>
            )}
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
        >
          Paid At
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const paidAt = row.getValue('paid_at')
      return formatDateTime(paidAt as string)
    },
  },
  {
    accessorKey: 'payment_id',
    header: 'Payment ID',
    cell: ({ row }) => row.getValue('payment_id') || 'N/A',
  },
]
