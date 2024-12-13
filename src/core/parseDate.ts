import type { EsDay } from './EsDay'
import type { DateType } from '~/types'
import * as C from './constant'
import { isUndefined } from './utils'

export function parseDate(date?: Exclude<DateType, EsDay>, utc = false): Date {
  if (isUndefined(date))
    return new Date()
  if (date instanceof Date)
    return new Date(date)
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

  return new Date(date as number)
}
