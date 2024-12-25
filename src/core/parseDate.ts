import type { EsDay } from './EsDay'
import type { DateType } from '~/types'
import type { Tuple } from '~/types/util-types'
import { C, isEmptyObject, isUndefined } from '~/common'

export function parseArrayToDate(dateArray: number[]) {
  const dateArrayTuple: Tuple<number, 7> = [0, 0, 1, 0, 0, 0, 0]
  dateArray.forEach((value, index) => {
    if (value !== undefined) {
      dateArrayTuple[index] = value
    }
  })
  return new Date(...dateArrayTuple)
}

export function parseDate(date?: Exclude<DateType, EsDay>, utc = false): Date {
  if (date instanceof Date)
    return new Date(date)
  if (date === null)
    return new Date(Number.NaN)
  if (isUndefined(date))
    return new Date()
  if (isEmptyObject(date))
    return new Date()
  if (Array.isArray(date))
    return parseArrayToDate(date)
  if (typeof date === 'string' && !/Z$/i.test(date)) {
    const d = date.match(C.REGEX_PARSE)
    if (d) {
      const Y = Number(d[1])
      const M = Number(d[2]) - 1 || 0
      const D = Number(d[3] || 1)
      const h = Number(d[4] || 0)
      const m = Number(d[5] || 0)
      const s = Number(d[6] || 0)
      const ms = Number((d[7] || '0').substring(0, 3))
      if (utc) {
        return new Date(Date.UTC(Y, M, D, h, m, s, ms))
      }
      return new Date(Y, M, D, h, m, s, ms)
    }
  }

  return new Date(date)
}
