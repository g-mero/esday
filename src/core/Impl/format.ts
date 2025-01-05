import type { EsDay } from 'esday'
import { C, padStart, padZoneStr } from '~/common'

export function formatImpl(that: EsDay, formatStr?: string) {
  if (!that.isValid())
    return C.INVALID_DATE_STRING

  const activeFormatString = formatStr || C.FORMAT_DEFAULT
  const unknownTokenOutput = '??'
  const offset = ('utcOffset' in that) ? that.utcOffset() : 0

  const get$H = (num: number) => (
    padStart(that.hour() % 12 || 12, num, '0')
  )

  const meridiemFunc = (hour: number, _minute: number, isLowercase: boolean) => {
    const m = (hour < 12 ? 'AM' : 'PM')
    return isLowercase ? m.toLowerCase() : m
  }

  const zoneStr = padZoneStr(offset)
  const $year = that.year()
  const $month = that.month()
  const $date = that.date()
  const $day = that.day()
  const $hour = that.hour()
  const $minute = that.minute()
  const $second = that.second()
  const $millisecond = that.millisecond()

  const matches = (match: string) => {
    switch (match) {
      case 'YY':
        return String($year).slice(-2)
      case 'YYYY':
        return padStart($year, 4, '0')
      case 'M':
        return $month + 1
      case 'MM':
        return padStart($month + 1, 2, '0')
      case 'D':
        return $date
      case 'DD':
        return padStart($date, 2, '0')
      case 'd':
        return String($day)
      case 'H':
        return String($hour)
      case 'HH':
        return padStart($hour, 2, '0')
      case 'h':
        return get$H(1)
      case 'hh':
        return get$H(2)
      case 'a':
        return meridiemFunc($hour, $minute, true)
      case 'A':
        return meridiemFunc($hour, $minute, false)
      case 'm':
        return String($minute)
      case 'mm':
        return padStart($minute, 2, '0')
      case 's':
        return String($second)
      case 'ss':
        return padStart($second, 2, '0')
      case 'SSS':
        return padStart($millisecond, 3, '0')
      case 'Z':
        return zoneStr
      case 'ZZ':
        return zoneStr.replace(':', '')
      default:
        break
    }
    return null
  }

  // replace format tokens with corresponding values
  return activeFormatString.replace(
    C.REGEX_FORMAT,
    (match, $1) => $1 || matches(match) || unknownTokenOutput,
  )
}
