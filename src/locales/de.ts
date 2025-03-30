/**
 * German [de]
 */

import type { Locale } from '~/plugins/locale'

const relativeTimeFormatStrings = {
  s: 'ein paar Sekunden',
  ss: '%d Sekunden',
  m: ['eine Minute', 'einer Minute'],
  mm: '%d Minuten',
  h: ['eine Stunde', 'einer Stunde'],
  hh: '%d Stunden',
  d: ['ein Tag', 'einem Tag'],
  dd: ['%d Tage', '%d Tagen'],
  M: ['ein Monat', 'einem Monat'],
  MM: ['%d Monate', '%d Monaten'],
  y: ['ein Jahr', 'einem Jahr'],
  yy: ['%d Jahre', '%d Jahren'],
}

function relativeTimeFormatter(timeValue: string | number, withoutSuffix: boolean, range: string) {
  let result = ''
  const l = relativeTimeFormatStrings[range as keyof typeof relativeTimeFormatStrings]
  if (Array.isArray(l)) {
    result = l[withoutSuffix ? 0 : 1]
  } else {
    result = l
  }

  return result.replace('%d', timeValue.toString())
}

const localeDe: Readonly<Locale> = {
  name: 'de',
  weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  weekdaysMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  months: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
  monthsShort: [
    'Jan.',
    'Feb.',
    'März',
    'Apr.',
    'Mai',
    'Juni',
    'Juli',
    'Aug.',
    'Sept.',
    'Okt.',
    'Nov.',
    'Dez.',
  ],
  ordinal: (n) => `${n}.`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY HH:mm',
    LLLL: 'dddd, D. MMMM YYYY HH:mm',
    l: 'DD.MM.YYYY',
    ll: 'D. MMMM YYYY',
    lll: 'D. MMMM YYYY HH:mm',
    llll: 'dddd, D. MMMM YYYY HH:mm',
  },
  relativeTime: {
    future: 'in %s',
    past: 'vor %s',
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
    // German doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeDe
