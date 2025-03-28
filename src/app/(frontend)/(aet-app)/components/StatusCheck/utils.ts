// add UUID validation function
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid)
}

export const formatUUID = (input: string): string => {
  // remove all non-hexadecimal characters
  const cleaned = input.replace(/[^0-9a-f]/gi, '')

  // if the length is less than 32, return the cleaned string
  if (cleaned.length < 32) return cleaned

  // add hyphens to the UUID format
  return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20, 32)}`
}
