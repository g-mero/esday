/* eslint-disable dot-notation */
import type { EsDay } from 'esday'
import * as C from '../constant'
import { getAllFieldsInDate, padStart } from '../utils'

export function formatImpl(that: EsDay, formatStr: string) {
  if (!that.isValid())
    return C.INVALID_DATE_STRING

  const $d = that['$d']
  const dates = getAllFieldsInDate($d, that['$u'])

  const str = formatStr || C.FORMAT_DEFAULT

  const get$H = (num: number) => (
    padStart(dates.hour % 12 || 12, num, '0')
  )

  const meridiemFunc = (hour: number, _minute: number, isLowercase: boolean) => {
    const m = (hour < 12 ? 'AM' : 'PM')
    return isLowercase ? m.toLowerCase() : m
  }

  const matches = (match: string) => {
    switch (match) {
      case 'YY':
        return String(dates.year).slice(-2)
      case 'YYYY':
        return padStart(dates.year, 4, '0')
      case 'M':
        return dates.month + 1
      case 'MM':
        return padStart(dates.month + 1, 2, '0')
      case 'D':
        return dates.date
      case 'DD':
        return padStart(dates.date, 2, '0')
      case 'd':
        return String(dates.day)
      case 'H':
        return String(dates.hour)
      case 'HH':
        return padStart(dates.hour, 2, '0')
      case 'h':
        return get$H(1)
      case 'hh':
        return get$H(2)
      case 'a':
        return meridiemFunc(dates.hour, dates.minute, true)
      case 'A':
        return meridiemFunc(dates.hour, dates.minute, false)
      case 'm':
        return String(dates.minute)
      case 'mm':
        return padStart(dates.minute, 2, '0')
      case 's':
        return String(dates.second)
      case 'ss':
        return padStart(dates.second, 2, '0')
      case 'SSS':
        return padStart(dates.millisecond, 3, '0')
      default:
        break
    }
    return null
  }

  return str.replace(C.REGEX_FORMAT, (match, $1) => $1 || matches(match))
}
