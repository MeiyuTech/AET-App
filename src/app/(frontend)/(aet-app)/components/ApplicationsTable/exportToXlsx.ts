import * as XLSX from 'xlsx'

// export table data to xlsx file
type ExportOptions = {
  data: any[]
  columns: { accessorKey: string; header: string }[]
  fileName?: string
}

export function exportTableToXlsx({
  data,
  columns,
  fileName = 'applications.xlsx',
}: ExportOptions) {
  // export only visible columns' data
  const exportData = data.map((row) => {
    const obj: Record<string, any> = {}
    columns.forEach((col) => {
      obj[col.header] = row[col.accessorKey]
    })
    return obj
  })

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications')
  XLSX.writeFile(workbook, fileName)
}

export function exportTableToCsv({ data, columns, fileName = 'applications.csv' }: ExportOptions) {
  // export only visible columns' data
  const exportData = data.map((row) => {
    const obj: Record<string, any> = {}
    columns.forEach((col) => {
      obj[col.header] = row[col.accessorKey]
    })
    return obj
  })

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications')
  XLSX.writeFile(workbook, fileName, { bookType: 'csv' })
}
