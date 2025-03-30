/**
 * Croatian [hr]
 */

import type { EsDay } from 'esday'
import type { Locale, MonthNames, MonthNamesFunction } from '~/plugins/locale'

const monthFormat: MonthNames = [
  'siječnja',
  'veljače',
  'ožujka',
  'travnja',
  'svibnja',
  'lipnja',
  'srpnja',
  'kolovoza',
  'rujna',
  'listopada',
  'studenoga',
  'prosinca',
]
const monthStandalone: MonthNames = [
  'siječanj',
  'veljača',
  'ožujak',
  'travanj',
  'svibanj',
  'lipanj',
  'srpanj',
  'kolovoz',
  'rujan',
  'listopad',
  'studeni',
  'prosinac',
]

const MONTHS_IN_FORMAT = /D[oD]?(?:\[[^[\]]*\]|\s)+MMMM?/

const months: MonthNamesFunction = (esdayInstance: EsDay, format: string): string => {
  if (MONTHS_IN_FORMAT.test(format)) {
    return monthFormat[esdayInstance.month()]
  }
  return monthStandalone[esdayInstance.month()]
}
months.format = monthFormat
months.standalone = monthStandalone

function relativeTimeFormatter(
  timeValue: string | number,
  withoutSuffix: boolean,
  range: string,
): string {
  // function translate(timeValue: string | number, withoutSuffix: boolean, range: string): string {
  let result = `${timeValue} `
  const timeValueAsNumber = +timeValue
  switch (range) {
    case 'ss':
      if (timeValueAsNumber === 1) {
        result += 'sekunda'
      } else if (timeValueAsNumber === 2 || timeValueAsNumber === 3 || timeValueAsNumber === 4) {
        result += 'sekunde'
      } else {
        result += 'sekundi'
      }
      return result
    case 'm':
      return withoutSuffix ? 'jedna minuta' : 'jedne minute'
    case 'mm':
      if (timeValueAsNumber === 1) {
        result += 'minuta'
      } else if (timeValueAsNumber === 2 || timeValueAsNumber === 3 || timeValueAsNumber === 4) {
        result += 'minute'
      } else {
        result += 'minuta'
      }
      return result
    case 'h':
      return withoutSuffix ? 'jedan sat' : 'jednog sata'
    case 'hh':
      if (timeValueAsNumber === 1) {
        result += 'sat'
      } else if (timeValueAsNumber === 2 || timeValueAsNumber === 3 || timeValueAsNumber === 4) {
        result += 'sata'
      } else {
        result += 'sati'
      }
      return result
    case 'dd':
      if (timeValueAsNumber === 1) {
        result += 'dan'
      } else {
        result += 'dana'
      }
      return result
    case 'MM':
      if (timeValueAsNumber === 1) {
        result += 'mjesec'
      } else if (timeValueAsNumber === 2 || timeValueAsNumber === 3 || timeValueAsNumber === 4) {
        result += 'mjeseca'
      } else {
        result += 'mjeseci'
      }
      return result
    case 'yy':
      if (timeValueAsNumber === 1) {
        result += 'godina'
      } else if (timeValueAsNumber === 2 || timeValueAsNumber === 3 || timeValueAsNumber === 4) {
        result += 'godine'
      } else {
        result += 'godina'
      }
      return result
    default:
      return ''
  }
}

const localeHr: Readonly<Locale> = {
  name: 'hr',
  weekdays: ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
  weekdaysShort: ['ned.', 'pon.', 'uto.', 'sri.', 'čet.', 'pet.', 'sub.'],
  weekdaysMin: ['ne', 'po', 'ut', 'sr', 'če', 'pe', 'su'],
  months,
  monthsShort: [
    'sij.',
    'velj.',
    'ožu.',
    'tra.',
    'svi.',
    'lip.',
    'srp.',
    'kol.',
    'ruj.',
    'lis.',
    'stu.',
    'pro.',
  ],
  ordinal: (n) => `${n}.`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd, D. MMMM YYYY H:mm',
    l: 'DD.MM.YYYY',
    ll: 'D. MMMM YYYY',
    lll: 'D. MMMM YYYY H:mm',
    llll: 'dddd, D. MMMM YYYY H:mm',
  },
  relativeTime: {
    future: 'za %s',
    past: 'prije %s',
    s: 'sekunda',
    ss: relativeTimeFormatter,
    m: relativeTimeFormatter,
    mm: relativeTimeFormatter,
    h: relativeTimeFormatter,
    hh: relativeTimeFormatter,
    d: 'dan',
    dd: relativeTimeFormatter,
    M: 'mjesec',
    MM: relativeTimeFormatter,
    y: 'godina',
    yy: relativeTimeFormatter,
  },
  meridiem: (hour: number, _minute: number, isLowercase: boolean) => {
    // Croatian doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeHr
