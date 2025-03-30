/**
 * Swedish [sv]
 */

import type { Locale } from '~/plugins/locale'

const localeSv: Readonly<Locale> = {
  name: 'sv',
  weekdays: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
  weekdaysShort: ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'],
  weekdaysMin: ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'],
  months: [
    'januari',
    'februari',
    'mars',
    'april',
    'maj',
    'juni',
    'juli',
    'augusti',
    'september',
    'oktober',
    'november',
    'december',
  ],
  monthsShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  ordinal: (n) => {
    const b = n % 10
    const o = b === 1 || b === 2 ? 'a' : 'e'
    return `[${n}${o}]`
  },
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY [kl.] HH:mm',
    LLLL: 'dddd D MMMM YYYY [kl.] HH:mm',
    l: 'YYYY-MM-DD',
    ll: 'D MMMM YYYY',
    lll: 'D MMM YYYY HH:mm',
    llll: 'ddd D MMM YYYY HH:mm',
  },
  relativeTime: {
    future: 'om %s',
    past: 'för %s sedan',
    s: 'några sekunder',
    ss: '%d sekunder',
    m: 'en minut',
    mm: '%d minuter',
    h: 'en timme',
    hh: '%d timmar',
    d: 'en dag',
    dd: '%d dagar',
    M: 'en månad',
    MM: '%d månader',
    y: 'ett år',
    yy: '%d år',
  },
  meridiem: (hour: number, _minute: number, isLowercase: boolean) => {
    // Swedish doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeSv
