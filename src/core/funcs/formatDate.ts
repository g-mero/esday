import type { AllDateFields } from '~/types'

export function formatDate(d: AllDateFields, formatStr: string) {
  const {
    year,
    month,
    date,
    hour,
    minute,
    second,
    millisecond,
  } = d

  return formatStr
    .replace(/YYYY/g, year.toString())
    .replace(/MM/g, (month + 1).toString().padStart(2, '0'))
    .replace(/DD/g, date.toString().padStart(2, '0'))
    .replace(/HH/g, hour.toString().padStart(2, '0'))
    .replace(/mm/g, minute.toString().padStart(2, '0'))
    .replace(/ss/g, second.toString().padStart(2, '0'))
    .replace(/SSS/g, millisecond.toString().padStart(3, '0'))
}
