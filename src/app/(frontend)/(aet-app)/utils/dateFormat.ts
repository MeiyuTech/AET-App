export function formatDateTime(dateString: string) {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
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
}
