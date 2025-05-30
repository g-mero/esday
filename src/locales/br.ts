/**
 * Breton [br]
 */

import type { EsDay } from 'esday'
import type { Locale } from '~/plugins/locale'

function lastNumber(number: number): number {
  if (number > 9) {
    return lastNumber(number % 10)
  }
  return number
}

function softMutation(text: string): string {
  const mutationTable: Record<string, string> = {
    m: 'v',
    b: 'v',
    d: 'z',
  }
  return mutationTable[text.charAt(0)] + text.substring(1)
}

function mutation(text: string, number: number): string {
  if (number === 2) {
    return softMutation(text)
  }
  return text
}

function relativeTimeWithMutation(number: number, _withoutSuffix: boolean, key: string): string {
  const format: Record<string, string> = {
    mm: 'munutenn',
    MM: 'miz',
    dd: 'devezh',
  }
  return `${number} ${mutation(format[key], number)}`
}

function specialMutationForYears(number: number): string {
  /* istanbul ignore next line */
  switch (lastNumber(number)) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 9:
      return `${number} bloaz`
    default:
      return `${number} vloaz`
  }
}

const relativeTimeFormatStrings = {
  s: 'un nebeud segondennoù',
  ss: '%d eilenn',
  m: 'ur vunutenn',
  mm: relativeTimeWithMutation,
  h: 'un eur',
  hh: '%d eur',
  d: 'un devezh',
  dd: relativeTimeWithMutation,
  M: 'ur miz',
  MM: relativeTimeWithMutation,
  y: 'ur bloaz',
  yy: specialMutationForYears,
}
function relativeTimeFormatter(
  timeValue: string | number,
  withoutSuffix: boolean,
  range: string,
): string {
  const l = relativeTimeFormatStrings[range as keyof typeof relativeTimeFormatStrings]
  if (typeof l === 'function') {
    return (l as (number: number, withoutSuffix: boolean, key: string) => string)(
      Number(timeValue),
      withoutSuffix,
      range,
    )
  }
  return l.replace('%d', timeValue.toString())
}

const localeBr: Readonly<Locale> = {
  name: 'br',
  weekdays: ['Sul', 'Lun', 'Meurzh', 'Mercʼher', 'Yaou', 'Gwener', 'Sadorn'],
  weekdaysShort: ['Sul', 'Lun', 'Meu', 'Mer', 'Yao', 'Gwe', 'Sad'],
  weekdaysMin: ['Su', 'Lu', 'Me', 'Mer', 'Ya', 'Gw', 'Sa'],
  months: [
    'Genver',
    'Cʼhwevrer',
    'Meurzh',
    'Ebrel',
    'Mae',
    'Mezheven',
    'Gouere',
    'Eost',
    'Gwengolo',
    'Here',
    'Du',
    'Kerzu',
  ],
  monthsShort: [
    'Gen',
    'Cʼhwe',
    'Meu',
    'Ebr',
    'Mae',
    'Eve',
    'Gou',
    'Eos',
    'Gwe',
    'Her',
    'Du',
    'Ker',
  ],
  ordinal: (n) => `${n}`,
  weekStart: 1, // Monday is the first day of the week.
  yearStart: 4, // The week that contains Jan 4th is the first week of the year.
  formats: {
    LT: 'h[e]mm A',
    LTS: 'h[e]mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D [a viz] MMMM YYYY',
    LLL: 'D [a viz] MMMM YYYY h[e]mm A',
    LLLL: 'dddd, D [a viz] MMMM YYYY h[e]mm A',
    l: 'DD/MM/YYYY',
    ll: 'D [a viz] MMMM YYYY',
    lll: 'D [a viz] MMMM YYYY h[e]mm A',
    llll: 'dddd, D [a viz] MMMM YYYY h[e]mm A',
  },
  calendar: {
    sameDay: '[danas u] LT',
    nextDay: '[sutra u] LT',
    nextWeek: function () {
      switch (this.day()) {
        case 0:
          return '[u] [nedjelju] [u] LT'
        case 3:
          return '[u] [srijedu] [u] LT'
        case 6:
          return '[u] [subotu] [u] LT'
        case 1:
        case 2:
        case 4:
        case 5:
          return '[u] dddd [u] LT'
        default:
          return ''
      }
    },
    lastDay: '[jučer u] LT',
    lastWeek: function (this: EsDay) {
      switch (this.day()) {
        case 0:
        case 3:
          return '[prošlu] dddd [u] LT'
        case 6:
          return '[prošle] [subote] [u] LT'
        case 1:
        case 2:
        case 4:
        case 5:
          return '[prošli] dddd [u] LT'
        default:
          return ''
      }
    },
    sameElse: 'L',
  },
  relativeTime: {
    future: 'a-benn %s',
    past: '%s ʼzo',
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
  // eslint-disable-next-line  unused-imports/no-unused-vars
  meridiem: (hour: number, _minute: number, _isLowercase: boolean) => (hour < 12 ? 'a.m.' : 'g.m.'), // a-raok merenn | goude merenn
}

export default localeBr
