/**
 * Polish [pl]
 */

import type { EsDay } from 'esday'
import type { Locale, MonthNames, MonthNamesFunction } from '~/plugins/locale'

const monthFormat: MonthNames = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia']
const monthStandalone: MonthNames = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień']

const MONTHS_IN_FORMAT = /D MMMM/

const months: MonthNamesFunction = (esdayInstance: EsDay, format: string) => {
  // function months(dayjsInstance, format) {
  if (MONTHS_IN_FORMAT.test(format)) {
    return monthFormat[esdayInstance.month()]
  }
  return monthStandalone[esdayInstance.month()]
}
months.format = monthFormat
months.standalone = monthStandalone

function usePlural(timeValue: number) {
  return (timeValue % 10 < 5) && (timeValue % 10 > 1) && ((~~(timeValue / 10) % 10) !== 1)
}
function relativeTimeWithPlural(timeValue: string | number, withoutSuffix: boolean, range: string): string {
  const result = `${timeValue} `
  switch (range) {
    case 'ss':
      return `${result} ${usePlural(+timeValue) ? 'sekundy' : 'sekund'}`
    case 'm':
      return withoutSuffix ? 'minuta' : 'minutę'
    case 'mm':
      return `${result} ${usePlural(+timeValue) ? 'minuty' : 'minut'}`
    case 'h':
      return withoutSuffix ? 'godzina' : 'godzinę'
    case 'hh':
      return `${result} ${usePlural(+timeValue) ? 'godziny' : 'godzin'}`
    case 'MM':
      return `${result} ${usePlural(+timeValue) ? 'miesiące' : 'miesięcy'}`
    case 'yy':
      return `${result} ${usePlural(+timeValue) ? 'lata' : 'lat'}`
    default:
      return ''
  }
}

const localePl: Readonly<Locale> = {
  name: 'pl',
  weekdays: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
  weekdaysShort: ['ndz', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'],
  weekdaysMin: ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
  months,
  monthsShort: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
  ordinal: n => `${n}.`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm',
    l: 'DD.MM.YYYY',
    ll: 'D MMMM YYYY',
    lll: 'D MMMM YYYY HH:mm',
    llll: 'dddd, D MMMM YYYY HH:mm',
  },
  relativeTime: {
    future: 'za %s',
    past: '%s temu',
    s: 'kilka sekund',
    ss: relativeTimeWithPlural,
    m: relativeTimeWithPlural,
    mm: relativeTimeWithPlural,
    h: relativeTimeWithPlural,
    hh: relativeTimeWithPlural,
    d: '1 dzień',
    dd: '%d dni',
    M: 'miesiąc',
    MM: relativeTimeWithPlural,
    y: 'rok',
    yy: relativeTimeWithPlural,
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    // Polish doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localePl
