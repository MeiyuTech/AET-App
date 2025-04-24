import { Row } from '@tanstack/react-table'

interface TableSearchHookResult {
  fuzzyFilter: (row: Row<any>, columnId: string, value: string, addMeta: any) => boolean
  globalFilterFunction: (row: Row<any>, columnId: string, value: string) => boolean
}

/**
 * Hook for managing table search functionality
 * Provides fuzzy search and global search functions
 */
export const useTableSearch = (): TableSearchHookResult => {
  /**
   * Fuzzy filter function for individual column filtering
   */
  const fuzzyFilter = (row: Row<any>, columnId: string, value: string, addMeta: any) => {
    const itemValue = row.getValue(columnId)

    // for payment_id special handling
    if (itemValue == null) {
      if (columnId === 'payment_id') {
        return 'n/a'.includes(value.toLowerCase())
      }
      return false
    }

    // for first_name special handling, search full name
    if (columnId === 'first_name') {
      const firstName = (row.getValue('first_name') as string) || ''
      const middleName = row.original.middle_name || ''
      const lastName = row.original.last_name || ''
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').toLowerCase()
      return fullName.includes(value.toLowerCase())
    }

    const searchValue = value.toLowerCase()
    const itemString = String(itemValue).toLowerCase()

    return itemString.includes(searchValue)
  }

  /**
   * Global filter function for searching across all columns
   */
  const globalFilterFunction = (row: Row<any>, columnId: string, value: string) => {
    // check if match full name
    const firstName = row.original.first_name || ''
    const middleName = row.original.middle_name || ''
    const lastName = row.original.last_name || ''
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').toLowerCase()

    if (fullName.includes(value.toLowerCase())) {
      return true
    }

    // check created_at format
    const createdAt = row.original.created_at
    if (createdAt) {
      const date = new Date(createdAt)
      const formattedDate = date
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')

      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      if (
        formattedDate.toLowerCase().includes(value.toLowerCase()) ||
        formattedTime.toLowerCase().includes(value.toLowerCase())
      ) {
        return true
      }
    }

    // check updated_at format
    const updatedAt = row.original.updated_at
    if (updatedAt) {
      const date = new Date(updatedAt)
      const formattedDate = date
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')

      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      if (
        formattedDate.toLowerCase().includes(value.toLowerCase()) ||
        formattedTime.toLowerCase().includes(value.toLowerCase())
      ) {
        return true
      }
    }

    // check due_amount format
    const dueAmount = row.original.due_amount as number | null
    if (dueAmount !== undefined) {
      // Format the due amount to the user's view: "$123.45" or "N/A"
      const formattedAmount = dueAmount !== null ? `$${dueAmount.toFixed(2)}` : 'N/A'

      if (formattedAmount.toLowerCase().includes(value.toLowerCase())) {
        return true
      }
    }

    // check payment_id format
    const paymentId = row.original.payment_id
    // Format payment_id to the user's view: actual value or "N/A"
    const formattedPaymentId = paymentId || 'N/A'

    if (formattedPaymentId.toLowerCase().includes(value.toLowerCase())) {
      return true
    }

    // if not match any special field, use default fuzzy filter
    return fuzzyFilter(row, columnId, value, null)
  }

  return {
    fuzzyFilter,
    globalFilterFunction,
  }
}
