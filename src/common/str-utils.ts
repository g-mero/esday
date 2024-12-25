/**
 * capitalize the first letter of a string
 * @param str the string to capitalize
 * @returns the capitalized string
 * @example
 *
 * capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * pad the start of a string with a specified character
 * @param origin the string or number to pad
 * @param length the length of the final string
 * @param pad the character to pad with
 * @returns the padded string
 *
 * @example
 *
 * padStart('hello', 10, 'a') // 'aaaaahello'
 */
export function padStart(origin: string | number, length: number, pad: string) {
  const originStr = String(origin)
  if (!originStr || originStr.length >= length)
    return originStr
  return `${Array.from({ length: (length + 1) - originStr.length }).join(pad)}${originStr}`
}
