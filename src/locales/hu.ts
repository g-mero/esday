/**
 * Hungarian [hu]
 */

import type { Locale } from '~/plugins/locale'

function relativeTimeFormatter(timeValue: string | number, withoutSuffix: boolean, range: string, isFuture: boolean): string {
  const num = timeValue.toString()
  switch (range) {
    case 's': return isFuture || withoutSuffix ? 'néhány másodperc' : 'néhány másodperce'
    case 'ss': return num + (isFuture || withoutSuffix) ? ' másodperc' : ' másodperce'
    case 'm': return `egy${isFuture || withoutSuffix ? ' perc' : ' perce'}`
    case 'mm': return num + (isFuture || withoutSuffix ? ' perc' : ' perce')
    case 'h': return `egy${isFuture || withoutSuffix ? ' óra' : ' órája'}`
    case 'hh': return num + (isFuture || withoutSuffix ? ' óra' : ' órája')
    case 'd': return `egy${isFuture || withoutSuffix ? ' nap' : ' napja'}`
    case 'dd': return num + (isFuture || withoutSuffix ? ' nap' : ' napja')
    case 'M': return `egy${isFuture || withoutSuffix ? ' hónap' : ' hónapja'}`
    case 'MM': return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja')
    case 'y': return `egy${isFuture || withoutSuffix ? ' év' : ' éve'}`
    case 'yy': return num + (isFuture || withoutSuffix ? ' év' : ' éve')
  }
  return ''
}

const localeHu: Readonly<Locale> = {
  name: 'hu',
  weekdays: ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'],
  weekdaysShort: ['vas', 'hét', 'kedd', 'sze', 'csüt', 'pén', 'szo'],
  weekdaysMin: ['v', 'h', 'k', 'sze', 'cs', 'p', 'szo'],
  months: ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'],
  monthsShort: ['jan', 'feb', 'márc', 'ápr', 'máj', 'jún', 'júl', 'aug', 'szept', 'okt', 'nov', 'dec'],
  ordinal: n => `${n}.`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'YYYY.MM.DD.',
    LL: 'YYYY. MMMM D.',
    LLL: 'YYYY. MMMM D. H:mm',
    LLLL: 'YYYY. MMMM D., dddd H:mm',
    l: 'YYYY.MM.DD.',
    ll: 'YYYY. MMMM D.',
    lll: 'YYYY. MMMM D. H:mm',
    llll: 'YYYY. MMMM D., dddd H:mm',
  },
  relativeTime: {
    future: '%s múlva',
    past: '%s',
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
    // Hungarian doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeHu
