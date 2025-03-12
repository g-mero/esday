/**
 * Lithuanian [lt]
 */

import type { EsDay } from 'esday'
import type { Locale, MonthNames, MonthNamesFunction } from '~/plugins/locale'

const monthFormat: MonthNames = ['sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio']
const monthStandalone: MonthNames = ['sausis', 'vasaris', 'kovas', 'balandis', 'gegužė', 'birželis', 'liepa', 'rugpjūtis', 'rugsėjis', 'spalis', 'lapkritis', 'gruodis']

const MONTHS_IN_FORMAT = /D[oD]?(?:\[[^[\]]*\]|\s)+MMMM?|MMMM?(?:\[[^[\]]*\]|\s)+D[oD]?/

const months: MonthNamesFunction = (esdayInstance: EsDay, format: string) => {
  if (MONTHS_IN_FORMAT.test(format)) {
    return monthFormat[esdayInstance.month()]
  }
  return monthStandalone[esdayInstance.month()]
}
months.format = monthFormat
months.standalone = monthStandalone

const localeLt: Locale = {
  name: 'lt',
  weekdays: ['sekmadienis', 'pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis'],
  weekdaysShort: ['sek', 'pir', 'ant', 'tre', 'ket', 'pen', 'šeš'],
  weekdaysMin: ['s', 'p', 'a', 't', 'k', 'pn', 'š'],
  months,
  monthsShort: ['sau', 'vas', 'kov', 'bal', 'geg', 'bir', 'lie', 'rgp', 'rgs', 'spa', 'lap', 'grd'],
  ordinal: n => `${n}-oji`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY [m.] MMMM D [d.]',
    LLL: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
    LLLL: 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
    l: 'YYYY-MM-DD',
    ll: 'YYYY [m.] MMMM D [d.]',
    lll: 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
    llll: 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]',
  },
  relativeTime: {
    future: 'už %s',
    past: 'prieš %s',
    s: 'kelias sekundes',
    ss: '%d sekundes',
    m: 'minutę',
    mm: '%d minutes',
    h: 'valandą',
    hh: '%d valandas',
    d: 'dieną',
    dd: '%d dienas',
    M: 'mėnesį',
    MM: '%d mėnesius',
    y: 'metus',
    yy: '%d metus',
  },
  meridiem: (hour: number, minute: number, isLowercase: boolean) => {
    // Lithuanian doesn't have AM/PM, so return default values
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  },
}

export default localeLt
