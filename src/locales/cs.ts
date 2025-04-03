/**
 * Czech [cs]
 */

import type { Locale } from '~/plugins/locale'

function usePlural(timeValue: number): boolean {
  return timeValue > 1 && timeValue < 5 && ~~(timeValue / 10) !== 1
}

function relativeTimeFormatter(
  timeValue: string | number,
  withoutSuffix: boolean,
  range: string,
  isFuture: boolean,
): string {
  const result = `${timeValue} `
  switch (range) {
    case 's': // a few seconds / in a few seconds / a few seconds ago
      return withoutSuffix || isFuture ? 'pár sekund' : 'pár sekundami'
    case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
      if (withoutSuffix || isFuture) {
        return result + (usePlural(+timeValue) ? 'sekundy' : 'sekund')
      }
      return `${result}sekundami`
    case 'm': // a minute / in a minute / a minute ago
      return withoutSuffix ? 'minuta' : isFuture ? 'minutu' : 'minutou'
    case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
      if (withoutSuffix || isFuture) {
        return result + (usePlural(+timeValue) ? 'minuty' : 'minut')
      }
      return `${result}minutami`
    case 'h': // an hour / in an hour / an hour ago
      return withoutSuffix ? 'hodina' : isFuture ? 'hodinu' : 'hodinou'
    case 'hh': // 9 hours / in 9 hours / 9 hours ago
      if (withoutSuffix || isFuture) {
        return result + (usePlural(+timeValue) ? 'hodiny' : 'hodin')
      }
      return `${result}hodinami`
    case 'd': // a day / in a day / a day ago
      return withoutSuffix || isFuture ? 'den' : 'dnem'
    case 'dd': // 9 days / in 9 days / 9 days ago
      if (withoutSuffix || isFuture) {
        return result + (usePlural(+timeValue) ? 'dny' : 'dní')
      }
      return `${result}dny`
    case 'M': // a month / in a month / a month ago
      return withoutSuffix || isFuture ? 'měsíc' : 'měsícem'
    case 'MM': // 9 months / in 9 months / 9 months ago
      if (withoutSuffix || isFuture) {
        return result + (usePlural(+timeValue) ? 'měsíce' : 'měsíců')
      }
      return `${result}měsíci`
    case 'y': // a year / in a year / a year ago
      return withoutSuffix || isFuture ? 'rok' : 'rokem'
    case 'yy': // 9 years / in 9 years / 9 years ago
      if (withoutSuffix || isFuture) {
        return result + (usePlural(+timeValue) ? 'roky' : 'let')
      }
      return `${result}lety`
    default:
      return ''
  }
}

const localeCs: Readonly<Locale> = {
  name: 'cs',
  weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
  weekdaysShort: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
  weekdaysMin: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
  months: [
    'leden',
    'únor',
    'březen',
    'duben',
    'květen',
    'červen',
    'červenec',
    'srpen',
    'září',
    'říjen',
    'listopad',
    'prosinec',
  ],
  monthsShort: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
  ordinal: (n) => `${n}.`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY H:mm',
    LLLL: 'dddd D. MMMM YYYY H:mm',
    l: 'D. M. YYYY',
    ll: 'D. MMMM YYYY',
    lll: 'D. MMMM YYYY H:mm',
    llll: 'dddd D. MMMM YYYY H:mm',
  },
  relativeTime: {
    future: 'za %s',
    past: 'před %s',
    s: relativeTimeFormatter,
    ss: relativeTimeFormatter,
    m: relativeTimeFormatter,
    mm: relativeTimeFormatter,
    h: relativeTimeFormatter,
    hh: relativeTimeFormatter,
    d: relativeTimeFormatter,
    dd: relativeTimeFormatter,
    M: relativeTimeFormatter,
    MM: relativeTimeFormatter,
    y: relativeTimeFormatter,
    yy: relativeTimeFormatter,
  },
  meridiem: (hour: number, _minute: number, isLowercase: boolean) => {
    // Czech doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeCs
