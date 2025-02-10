import type { EsDay } from 'esday'
import { C, padNumberWithLeadingZeros, padZoneStr } from '~/common'

export function formatImpl(that: EsDay, formatStr?: string) {
  if (!that.isValid())
    return C.INVALID_DATE_STRING

  const activeFormatString = formatStr || C.FORMAT_DEFAULT
  const unknownTokenOutput = '??'
  // eslint-disable-next-line dot-notation
  const defaultOffset = -Math.round(that['$d'].getTimezoneOffset()) || 0
  const offset = ('utcOffset' in that) ? that.utcOffset() : defaultOffset

  const get$H = (num: number) => (
    // HACK padStart(that.hour() % 12 || 12, num, '0')
    padNumberWithLeadingZeros(that.hour() % 12 || 12, num)
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
        return padNumberWithLeadingZeros($year, 4)
      case 'M':
        return $month + 1
      case 'MM':
        return padNumberWithLeadingZeros($month + 1, 2)
      case 'D':
        return $date
      case 'DD':
        return padNumberWithLeadingZeros($date, 2)
      case 'd':
        return String($day)
      case 'H':
        return String($hour)
      case 'HH':
        return padNumberWithLeadingZeros($hour, 2)
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
        return padNumberWithLeadingZeros($minute, 2)
      case 's':
        return String($second)
      case 'ss':
        return padNumberWithLeadingZeros($second, 2)
      case 'SSS':
        return padNumberWithLeadingZeros($millisecond, 3)
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
