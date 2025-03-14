/**
 * Estonian [et]
 */

import type { Locale } from '~/plugins/locale'

function relativeTimeFormatter(timeValue: string | number, withoutSuffix: boolean, key: string, isFuture: boolean): string {
  const timeValueAsString = `${timeValue} `
  const format: Record<string, string[]> = {
    s: ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
    ss: ['%d sekundi', '%d sekundit'],
    m: ['ühe minuti', 'üks minut'],
    mm: ['%d minuti', '%d minutit'],
    h: ['ühe tunni', 'tund aega', 'üks tund'],
    hh: ['%d tunni', '%d tundi'],
    d: ['ühe päeva', 'üks päev'],
    dd: ['%d päeva', '%d päeva'],
    M: ['kuu aja', 'kuu aega', 'üks kuu'],
    MM: ['%d kuu', '%d kuud'],
    y: ['ühe aasta', 'aasta', 'üks aasta'],
    yy: ['%d aasta', '%d aastat'],
  }
  if (key === 'dd') {
    return (format[key][0]).replace('%d', timeValueAsString)
  }
  if (withoutSuffix) {
    return (format[key][2] ? format[key][2] : format[key][1]).replace('%d', timeValueAsString)
  }
  return (isFuture ? format[key][0] : format[key][1]).replace('%d', timeValueAsString)
}

const localeEt: Readonly<Locale> = {
  name: 'et',
  weekdays: ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'],
  weekdaysShort: ['P', 'E', 'T', 'K', 'N', 'R', 'L'],
  weekdaysMin: ['P', 'E', 'T', 'K', 'N', 'R', 'L'],
  months: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
  monthsShort: ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets'],
  ordinal: n => `${n}.`,
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
    future: '%s pärast',
    past: '%s tagasi',
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
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    // Estonian doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeEt
