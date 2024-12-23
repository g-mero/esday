import type { EsDay } from '~/core'

export type DateType = EsDay | Date | string | number | number[] | null | undefined | object
export interface AllDateFields {
  year: number
  month: number
  /**
   * date in month
   * 1 ~ 31
   */
  date: number
  /**
   * day in week
   * 0 ~ 6
   */
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
}
