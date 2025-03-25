//
/**
 * Serbian [sr]
 */

import type { Locale } from '~/plugins/locale'

function plural(timeValue: number, wordKey: string[]) {
  if (timeValue % 10 >= 1 && timeValue % 10 <= 4 && (timeValue % 100 < 10 || timeValue % 100 >= 20)) {
    return timeValue % 10 === 1 ? wordKey[0] : wordKey[1]
  }
  return wordKey[2]
}
function relativeTimeFormatter(timeValue: string | number, withoutSuffix: boolean, range: string, isFuture: boolean): string {
  const formats = {
    ss: ['sekunda', 'sekunde', 'sekundi'],
    m: ['jedan minut', 'jednog minuta'],
    mm: ['%d minut', '%d minuta', '%d minuta'],
    h: ['jedan sat', 'jednog sata'],
    hh: ['%d sat', '%d sata', '%d sati'],
    d: ['jedan dan', 'jednog dana'],
    dd: ['%d dan', '%d dana', '%d dana'],
    M: ['jedan mesec', 'jednog meseca'],
    MM: ['%d mesec', '%d meseca', '%d meseci'],
    y: ['jednu godinu', 'jedne godine'],
    yy: ['%d godinu', '%d godine', '%d godina'],
  }

  const wordKey = formats[range as keyof typeof formats]

  if (range.length === 1) {
    // Nominativ
    if (range === 'y' && withoutSuffix)
      return 'jedna godina'
    return isFuture || withoutSuffix ? wordKey[0] : wordKey[1]
  }

  const word = plural(+timeValue, wordKey)
  // Nominativ
  if (range === 'yy' && withoutSuffix && word === '%d godinu')
    return `${timeValue} godina`

  return word.replace('%d', timeValue.toString())
}

const localeSr: Readonly<Locale> = {
  name: 'sr',
  weekdays: ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'],
  weekdaysShort: ['Ned.', 'Pon.', 'Uto.', 'Sre.', 'Čet.', 'Pet.', 'Sub.'],
  weekdaysMin: ['ne', 'po', 'ut', 'sr', 'če', 'pe', 'su'],
  months: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
  monthsShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'Maj', 'Jun', 'Jul', 'Avg.', 'Sep.', 'Okt.', 'Nov.', 'Dec.'],
  ordinal: n => `${n}.`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 7, // The week that contains Jan 1st is the first week of the year.
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'D. M. YYYY.',
    LL: 'D. MMMM YYYY.',
    LLL: 'D. MMMM YYYY. H:mm',
    LLLL: 'dddd, D. MMMM YYYY. H:mm',
    l: 'D. M. YYYY.',
    ll: 'D. MMMM YYYY.',
    lll: 'D. MMMM YYYY. H:mm',
    llll: 'dddd, D. MMMM YYYY. H:mm',
  },
  relativeTime: {
    future: 'za %s',
    past: 'pre %s',
    s: 'nekoliko sekundi',
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
    // Serbian doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeSr
