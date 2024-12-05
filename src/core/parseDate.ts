import type { DateType } from '~/types'

export function parseDate(date?: Omit<DateType, 'EsDay'>): Date {
  return new Date(date as number)
}
