/**
 * Catalan [ca]
 */

import type { Locale } from '~/plugins/locale'

const localeCa: Readonly<Locale> = {
  name: 'ca',
  weekdays: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
  weekdaysShort: ['Dg.', 'Dl.', 'Dt.', 'Dc.', 'Dj.', 'Dv.', 'Ds.'],
  weekdaysMin: ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'],
  months: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
  monthsShort: ['Gen.', 'Febr.', 'Març', 'Abr.', 'Maig', 'Juny', 'Jul.', 'Ag.', 'Set.', 'Oct.', 'Nov.', 'Des.'],
  ordinal: (n) => {
    let ord

    if (n === 1 || n === 3)
      ord = 'r'
    else if (n === 2)
      ord = 'n'
    else if (n === 4)
      ord = 't'
    else ord = 'è'

    return `${n}${ord}`
  },
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM [de] YYYY',
    LLL: 'D MMMM [de] YYYY [a les] H:mm',
    LLLL: 'dddd D MMMM [de] YYYY [a les] H:mm',
    l: 'DD/MM/YYYY',
    ll: 'D MMM YYYY',
    lll: 'D MMM YYYY, H:mm',
    llll: 'ddd D MMM YYYY, H:mm',
  },
  relativeTime: {
    future: 'd\'aquí %s',
    past: 'fa %s',
    s: 'uns segons',
    ss: '%d segons',
    m: 'un minut',
    mm: '%d minuts',
    h: 'una hora',
    hh: '%d hores',
    d: 'un dia',
    dd: '%d dies',
    M: 'un mes',
    MM: '%d mesos',
    y: 'un any',
    yy: '%d anys',
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    // Catalan doesn't have AM/PM, so return default values
    const m = (hour < 12 ? 'AM' : 'PM')
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeCa
