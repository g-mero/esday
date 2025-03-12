/**
 * Tagalog (Philippines) [tl-PH]
 */

import type { Locale } from '~/plugins/locale'

const localeTlPh: Readonly<Locale> = {
  name: 'tl-PH',
  weekdays: ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'],
  weekdaysShort: ['Lin', 'Lun', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab'],
  weekdaysMin: ['Li', 'Lu', 'Ma', 'Mi', 'Hu', 'Bi', 'Sab'],
  months: ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'],
  monthsShort: ['Ene', 'Peb', 'Mar', 'Abr', 'May', 'Hun', 'Hul', 'Ago', 'Set', 'Okt', 'Nob', 'Dis'],
  ordinal: n => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'MM/D/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY HH:mm',
    LLLL: 'dddd, MMMM DD, YYYY HH:mm',
    l: 'MM/D/YYYY',
    ll: 'MMMM D, YYYY',
    lll: 'MMMM D, YYYY HH:mm',
    llll: 'dddd, MMMM DD, YYYY HH:mm',
  },
  relativeTime: {
    future: 'sa loob ng %s',
    past: '%s ang nakalipas',
    s: 'ilang segundo',
    ss: '%d segundo',
    m: 'isang minuto',
    mm: '%d minuto',
    h: 'isang oras',
    hh: '%d oras',
    d: 'isang araw',
    dd: '%d araw',
    M: 'isang buwan',
    MM: '%d buwan',
    y: 'isang taon',
    yy: '%d taon',
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    // Tagalog doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeTlPh
