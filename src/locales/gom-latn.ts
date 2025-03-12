/**
 * Konkani Latin script [gom-LATN]
 */

import type { Locale } from '~/plugins/locale'

function processRelativeTime(timeValue: string | number, withoutSuffix: boolean, range: string, isFuture: boolean) {
  const relativeTimeFormatStrings = {
    s: ['thoddea sekondamni', 'thodde sekond'],
    ss: [`${timeValue} sekondamni`, `${timeValue} sekond`],
    m: ['eka mintan', 'ek minut'],
    mm: [`${timeValue} mintamni`, `${timeValue} mintam`],
    h: ['eka voran', 'ek vor'],
    hh: [`${timeValue} voramni`, `${timeValue} voram`],
    d: ['eka disan', 'ek dis'],
    dd: [`${timeValue} disamni`, `${timeValue} dis`],
    M: ['eka mhoinean', 'ek mhoino'],
    MM: [`${timeValue} mhoineamni`, `${timeValue} mhoine`],
    y: ['eka vorsan', 'ek voros'],
    yy: [`${timeValue} vorsamni`, `${timeValue} vorsam`],
  }
  return isFuture ? relativeTimeFormatStrings[range as keyof typeof relativeTimeFormatStrings][0] : relativeTimeFormatStrings[range as keyof typeof relativeTimeFormatStrings][1]
}

const localeGomLatn: Readonly<Locale> = {
  name: 'gom-LATN',
  weekdays: ['Aitar', 'Somar', 'Mongllar', 'Budvar', 'Brestar', 'Sukrar', 'Son\'var'],
  weekdaysShort: ['Ait.', 'Som.', 'Mon.', 'Bud.', 'Bre.', 'Suk.', 'Son.'],
  weekdaysMin: ['Ai', 'Sm', 'Mo', 'Bu', 'Br', 'Su', 'Sn'],
  months: ['Janer', 'Febrer', 'Mars', 'Abril', 'Mai', 'Jun', 'Julai', 'Agost', 'Setembr', 'Otubr', 'Novembr', 'Dezembr'],
  monthsShort: ['Jan.', 'Feb.', 'Mars', 'Abr.', 'Mai', 'Jun', 'Jul.', 'Ago.', 'Set.', 'Otu.', 'Nov.', 'Dez.'],
  ordinal: n => `${n}`,
  weekStart: 0, // Sunday is the first day of the week.
  yearStart: 3, // The week that contains Jan 3rd is the first week of the year.
  formats: {
    LT: 'A h:mm [vazta]',
    LTS: 'A h:mm:ss [vazta]',
    L: 'DD-MM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY A h:mm [vazta]',
    LLLL: 'dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]',
    l: 'DD-MM-YYYY',
    ll: 'D MMMM YYYY',
    lll: 'D MMMM YYYY A h:mm [vazta]',
    llll: 'ddd, D MMM YYYY, A h:mm [vazta]',
  },
  relativeTime: {
    future: '%s',
    past: '%s adim',
    s: processRelativeTime,
    ss: processRelativeTime,
    m: processRelativeTime,
    mm: processRelativeTime,
    h: processRelativeTime,
    hh: processRelativeTime,
    d: processRelativeTime,
    dd: processRelativeTime,
    M: processRelativeTime,
    MM: processRelativeTime,
    y: processRelativeTime,
    yy: processRelativeTime,
  },
  // eslint-disable-next-line  unused-imports/no-unused-vars
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    if (hour < 4) {
      return 'rati'
    }
    else if (hour < 12) {
      return 'sokallim'
    }
    else if (hour < 16) {
      return 'donparam'
    }
    else if (hour < 20) {
      return 'sanje'
    }
    else {
      return 'rati'
    }
  },
}

export default localeGomLatn
