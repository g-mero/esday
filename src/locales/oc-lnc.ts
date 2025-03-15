/**
 * Occitan, lengadocian dialecte [oc-LNC]
 */

import type { Locale } from '~/plugins/locale'

const localeOcLnc: Readonly<Locale> = {
  name: 'oc-LNC',
  weekdays: ['dimenge', 'diluns', 'dimars', 'dimècres', 'dijòus', 'divendres', 'dissabte'],
  weekdaysShort: ['Dg', 'Dl', 'Dm', 'Dc', 'Dj', 'Dv', 'Ds'],
  weekdaysMin: ['dg', 'dl', 'dm', 'dc', 'dj', 'dv', 'ds'],
  months: ['genièr', 'febrièr', 'març', 'abrial', 'mai', 'junh', 'julhet', 'agost', 'setembre', 'octòbre', 'novembre', 'decembre'],
  monthsShort: ['gen', 'feb', 'març', 'abr', 'mai', 'junh', 'julh', 'ago', 'set', 'oct', 'nov', 'dec'],
  ordinal: n => `${n}º`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM [de] YYYY',
    LLL: 'D MMMM [de] YYYY [a] H:mm',
    LLLL: 'dddd D MMMM [de] YYYY [a] H:mm',
    l: 'DD/MM/YYYY',
    ll: 'D MMMM [de] YYYY',
    lll: 'D MMMM [de] YYYY [a] H:mm',
    llll: 'dddd D MMMM [de] YYYY [a] H:mm',
  },
  relativeTime: {
    future: 'd\'aquí %s',
    past: 'fa %s',
    s: 'unas segondas',
    ss: '%d segondas',
    m: 'una minuta',
    mm: '%d minutas',
    h: 'una ora',
    hh: '%d oras',
    d: 'un jorn',
    dd: '%d jorns',
    M: 'un mes',
    MM: '%d meses',
    y: 'un an',
    yy: '%d ans',
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    // Occitan doesn't have AM/PM, so return default values
    const m = (hour < 12 ? 'AM' : 'PM')
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeOcLnc
